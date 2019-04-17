import { AddrRecord, BaseAddrPair, WalletsRecords, WalletUtils } from '@bitclave/base-client-js';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import Button from 'reactstrap/lib/Button';
import ButtonGroup from 'reactstrap/lib/ButtonGroup';
import Col from 'reactstrap/lib/Col';
import Container from 'reactstrap/lib/Container';
import Form from 'reactstrap/lib/Form';
import FormGroup from 'reactstrap/lib/FormGroup';
import Input from 'reactstrap/lib/Input';
import Row from 'reactstrap/lib/Row';
import Web3 from 'web3';
import PairItemHolder from '../components/holders/PairItemHolder';
import ClientDataList from '../components/lists/SimplePairList';
import { Injections, lazyInject } from '../Injections';
import BaseManager from '../manager/BaseManager';
import Pair from '../models/Pair';

const ethUtil = require('ethereumjs-util');
const sigUtil = require('eth-sig-util');

interface Props extends RouteComponentProps<{}> {
}

interface State {
    inputKey: string;
    inputValue: string;
    ethAddress: string;
    ethSignature: string;
    numberRequests: number;
    numberResponses: number;
    clientDataRefreshhTrigger: number;
    clientData: Array<Pair<string, string>>;
}

var web3: Web3;

window.addEventListener('load', function () {
    if (window && typeof (window as any).web3 !== 'undefined') {
        // Use Mist/MetaMask's provider.
        try {
            web3 = new Web3((window as any).web3.currentProvider);
        } catch (err) {
            console.log(err);
        }
        console.log('Injected web3 detected.');
    }
});

export default class Dashboard extends React.Component<Props, State> {

    @lazyInject(Injections.BASE_MANAGER)
    baseManager: BaseManager;

    constructor(props: Props) {
        super(props);
        this.state = {
            inputKey: '',
            inputValue: '',
            ethAddress: '',
            ethSignature: '',
            numberRequests: 0,
            numberResponses: 0,
            clientDataRefreshhTrigger: 0,
            clientData: []
        };
    }

    componentDidMount() {
        this.getDataList();
        this.setState({ethSignature: ''});
        // this.state.ethSignature = '';
    }

    render() {
        return (
            <div className="text-white h-100">
                <Button className="m-2 float-right" color="danger" size="sm" onClick={() => this.onLogoutClick()}>
                    Logout
                </Button>

                <ButtonGroup className="m-2 btn-group-toggle justify-content-center">
                    <Button color="primary" onClick={() => this.onDataPermissionsClick()}>
                        Data permissions
                    </Button>{''}
                    <Button color="primary" onClick={() => this.onCreateRequestClick()}>
                        Request permissions
                    </Button>
                    <Button color="primary" onClick={() => this.onSearchRequestsClick()}>
                        Search Requests
                    </Button>
                    <Button color="primary" onClick={() => this.onOffersClick()}>
                        Offers
                    </Button>
                    <Button color="primary" onClick={() => this.onMatchClick()}>
                        Match Search And Offer
                    </Button>
                </ButtonGroup>

                <div className="m-2 text-white">your id: {this.baseManager.getId()}</div>

                <Container className="h-100 align-items-center">
                    <div className="row h-100 justify-content-center align-items-center">
                        <Form>
                            <FormGroup>
                                <Row>
                                    <Col className="p-0" xs="1" sm="2">
                                        <Input
                                            value={'eth_address'} readOnly
                                        />
                                    </Col>
                                    <Col className="p-0" xs="1" sm="5">
                                        <Input
                                            value={this.state.ethAddress || ''}
                                            placeholder="eth address"
                                            onChange={(e) => this.onChangeEthAddress(e.target.value)}
                                        />
                                    </Col>
                                    <Col className="p-0" xs="1" sm="5">
                                        <Input
                                            value={this.state.ethSignature || ''}
                                            placeholder="signature"
                                            onChange={(e) => this.onChangeEthSignature(e.target.value)}
                                        />
                                    </Col>
                                </Row>
                                <Row><p/></Row>
                                <Row>
                                    <Col xs="3" sm="3">
                                        <Button color="primary" onClick={() => this.onSetEthSignature()}>
                                            Sign w/Web3
                                        </Button>
                                    </Col>
                                    <Col xs="3" sm="3">
                                        <Button color="primary" onClick={() => this.onSetEthAddress()}>
                                            Set Single
                                        </Button>
                                    </Col>

                                    <Col xs="3" sm="3">
                                        <Button color="primary" onClick={() => this.onVerifyWallets()}>
                                            Verify
                                        </Button>
                                    </Col>
                                    <Col xs="3" sm="3">
                                        <Button color="primary" onClick={() => this.onSignWallets()}>
                                            Sign Wallets
                                        </Button>
                                    </Col>
                                </Row>
                                <Row><p/></Row>
                                <Row><p/></Row>
                            </FormGroup>
                            <FormGroup>
                                <Row>
                                    <Col className="p-0" xs="6" sm="4">
                                        <Input
                                            value={this.state.inputKey || ''}
                                            placeholder="key"
                                            onChange={(e) => this.onChangeKey(e.target.value)}
                                        />
                                    </Col>
                                    <Col className="p-0" xs="6" sm="4">
                                        <Input
                                            value={this.state.inputValue || ''}
                                            placeholder="value"
                                            onChange={(e) => this.onChangeValue(e.target.value)}
                                        />
                                    </Col>
                                    <Col sm="4">
                                        <Button color="primary" onClick={() => this.onSetClick()}>
                                            Set
                                        </Button>
                                    </Col>
                                </Row>
                            </FormGroup>

                            <PairItemHolder name="Key:" value="Value:" onDeleteClick={null}/>
                            <ClientDataList
                                data={this.state.clientData}
                                onDeleteClick={null}
                            />
                            <Button color="primary" className="m-2 float-right" onClick={() => this.onSaveClick()}>
                                Save
                            </Button>
                        </Form>
                    </div>
                </Container>
            </div>
        );
    }

    private getDataList() {
        this.baseManager.loadClientData()
            .then(data => {
                try {
                    this.setState({clientData: []});
                    // this.state.clientData = [];
                    data.forEach((value, key) => {
                        this.state.clientData.push(new Pair(key, value));

                        if (key === 'eth_wallets') {
                            const json = JSON.parse(value);
                            const data = (json.data as any[]).map(raw => new AddrRecord(raw.data, raw.sig));
                            this.baseManager.setWallets(new WalletsRecords(data, json.sig));
                        }
                    });
                    this.setState({clientDataRefreshhTrigger: 1});
                    // this.state.clientDataRefreshhTrigger = 1;
                    this.setState({clientData: this.state.clientData});
                } catch (e) {
                    console.log(e);
                }
            }).catch(response => console.log('message: ' + JSON.stringify(response)));
    }

    private onChangeKey(key: string) {
        this.setState({inputKey: key});
    }

    private onChangeEthAddress(key: string) {
        this.setState({ethAddress: key});
    }

    private onChangeEthSignature(key: string) {
        this.setState({ethSignature: key});
    }

    private onChangeValue(value: string) {
        this.setState({inputValue: value});
    }

    private onLogoutClick() {
        this.baseManager.logout();
        const {history} = this.props;
        history.replace('/');
    }

    private onDataPermissionsClick() {
        const {history} = this.props;
        history.push('permissions');
    }

    private onResponsesClick() {
        const {history} = this.props;
        history.push('responses');
    }

    private onCreateRequestClick() {
        const {history} = this.props;
        history.push('create-request');
    }

    private onSearchRequestsClick() {
        const {history} = this.props;
        history.push('search-requests');
    }

    private onOffersClick() {
        const {history} = this.props;
        history.push('offers');
    }

    private onMatchClick() {
        const {history} = this.props;
        history.push('search-match');
    }

    private onSaveClick() {
        const map: Map<string, string> = new Map();

        this.state.clientData.forEach(item => {
            map.set(item.key, item.value);
        });

        this.baseManager.saveData(map)
            .then(result => alert('data has been saved'))
            .catch(e => alert('Something went wrong! data not saved! =(') + e);
    }

    private onSetEthAddress() {
        const {ethAddress, ethSignature} = this.state;
        if (ethAddress == null || ethAddress.trim().length === 0) {
            alert('The ethAddress must not be empty');
            return;
        }
        const pos = this.state.clientData.findIndex(model => model.key === 'eth_wallets');

        const newAddr = new BaseAddrPair(this.baseManager.getId(), ethAddress);
        const newAddrRecord = new AddrRecord(newAddr, ethSignature);

       if (this.baseManager.getWallets().data.find(value => value.sig === newAddrRecord.sig)) {
           alert('only unique wallet can be set');
           return;
       }

        this.baseManager.getWallets().data.push(newAddrRecord);
        const strJson = JSON.stringify(this.baseManager.getWallets());

        if (pos >= 0) {
            this.state.clientData[pos].value = strJson;

        } else {
            this.state.clientData.push(new Pair('eth_wallets', strJson));
        }
        this.setState({ethAddress: '', ethSignature: ''});
    }

    private onVerifyWallets() {
        const pos = this.state.clientData.findIndex(model => model.key === 'eth_wallets');
        if (pos >= 0) {
            // const res = this.baseManager
            //     .getWalletManager()
            //     .validateWallets(this.baseManager.getWallets());

            const res = WalletUtils.validateWallets(
                'eth_wallets',
                this.baseManager.getWallets(),
                this.baseManager.getId()
            )
            alert(JSON.stringify(res));

        } else {
            alert('no eth_wallets found');
        }
    }

    private async onSignWallets() {
        const pos = this.state.clientData.findIndex(model => model.key === 'eth_wallets');
        if (pos >= 0) {
            try {
                const wallets = await this.baseManager
                    .getWalletManager()
                    .createWalletsRecords(this.baseManager.getWallets().data, this.baseManager.getId());

                this.baseManager.setWallets(wallets);
                const strJson = JSON.stringify(this.baseManager.getWallets());
                this.state.clientData[pos].value = strJson;

                alert('eth_wallets signed');
            } catch (err) {
                console.log(err);
                alert('exception in onSignWallets: ' + err);
            }

        } else {
            alert('no eth_wallets found');
        }
    }

    private onSetEthSignature() {
        let signingAddr: string = '';

        if (typeof web3 === 'undefined') {
            alert('WEB3 is not detected');
            return;
        }

        (async () => {
            const accounts = await web3.eth.getAccounts();

            if (!accounts || !accounts[0]) {
                alert('Can not detect ETH address from WEB3 provider.\nPlease login');
                return;
            }
            signingAddr = accounts[0];

            signingAddr = signingAddr.toLowerCase(); // always use lower case for addresses

            const message = JSON.stringify(new BaseAddrPair(this.baseManager.getId(), signingAddr));

            if (typeof web3 !== 'undefined') {

                const msg = ethUtil.bufferToHex(Buffer.from(message, 'utf8'));

                const params = [msg, signingAddr];
                const method = 'personal_sign';

                (web3.currentProvider as any).connection.sendAsync({
                    method,
                    params,
                    signingAddr
                }, (err: any, result: any) => {
                    // if (err) return $scope.notifier.danger(err)
                    // if (result.error) return $scope.notifier.danger(result.error)
                    this.setState({ethSignature: result.result});
                    this.setState({ethAddress: signingAddr});
                });
            }
        })();
    }

    private onSetClick() {
        const {inputKey, inputValue} = this.state;
        if (inputKey == null
            || inputKey.trim().length === 0
            || inputValue == null
            || inputValue.trim().length === 0) {
            alert('The key and value must not be empty');
            return;
        }
        const pos = this.state.clientData.findIndex(model => model.key === inputKey);

        if (pos >= 0) {
            this.state.clientData[pos].value = inputValue;
        } else {
            this.state.clientData.push(new Pair(inputKey, inputValue));
        }

        this.setState({inputKey: '', inputValue: ''});
    }

    private onDeleteClick(key: string) {
        const clientData = this.state.clientData.filter(model => model.key !== key);
        this.setState({clientData});

        // this.state.clientData = this.state.clientData.filter(model => model.key !== key);
        this.setState({});
    }

}
