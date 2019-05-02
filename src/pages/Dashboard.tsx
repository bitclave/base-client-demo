import {
    AppWalletData,
    BtcWalletData,
    CryptoWallet,
    CryptoWalletsData,
    EthWalletData,
    SupportSignedMessageData,
    WalletManagerImpl,
    WalletUtils
} from '@bitclave/base-client-js';
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
import PairItemHolder from '../components/holders/PairItemHolder';
import ClientDataList from '../components/lists/SimplePairList';
import { RawWalletView } from '../components/views/raw-wallet-view/RawWalletView';
import { Injections, lazyInject } from '../Injections';
import BaseManager from '../manager/BaseManager';
import Pair from '../models/Pair';
import { RawWallet } from '../models/RawWallet';
import './Dashboard.scss';

interface Props extends RouteComponentProps<{}> {
}

interface State {
    inputKey: string;
    inputValue: string;
    numberRequests: number;
    numberResponses: number;
    clientDataRefreshhTrigger: number;
    clientData: Array<Pair<string, string>>;
    rawWallet: RawWallet;
    showRawWallet: boolean,
    rawWalletType: 'eth-metamask' | 'eth' | 'btc' | 'app'
}

export default class Dashboard extends React.Component<Props, State> {

    @lazyInject(Injections.BASE_MANAGER)
    baseManager: BaseManager;

    constructor(props: Props) {
        super(props);
        this.state = {
            inputKey: '',
            inputValue: '',
            numberRequests: 0,
            numberResponses: 0,
            clientDataRefreshhTrigger: 0,
            clientData: [],
            rawWallet: new RawWallet(this.baseManager.getId(), '', ''),
            showRawWallet: false,
            rawWalletType: 'eth-metamask'
        };
    }

    componentDidMount() {
        this.getDataList();
    }

    render() {
        return (
            <div className="Dashboard text-white">
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

                <div className="Dashboard__add__wallets">
                    <div>
                        <ButtonGroup className="m-2 btn-group-toggle justify-content-center">
                            <Button color="primary" onClick={() => this.onShowRawWalletClick('eth-metamask')}>
                                Eth wallet with Metamask
                            </Button>
                            <Button color="primary" onClick={() => this.onShowRawWalletClick('eth')}>
                                Eth wallet
                            </Button>
                            <Button color="primary" onClick={() => this.onShowRawWalletClick('btc')}>
                                Btc wallet
                            </Button>
                            <Button color="primary" onClick={() => this.onShowRawWalletClick('app')}>
                                App wallet
                            </Button>
                        </ButtonGroup>
                    </div>

                    {this.prepareRawWalletBlock()}

                    <div className="Dashboard__raw-wallet__buttons">
                        <Button color="primary" onClick={() => this.onSignWallets()}>
                            Sign Wallets
                        </Button>
                        <Button color="primary" onClick={() => this.onVerifyWallets()}>
                            Verify
                        </Button>
                    </div>
                </div>

                <Container className="align-items-center">
                    <div className="row justify-content-center align-items-center">
                        <Form>
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

                        if (key === WalletManagerImpl.DATA_KEY_ETH_WALLETS) {
                            const json = JSON.parse(value);
                            this.baseManager.setWallets(CryptoWalletsData.fromJson(json).data);
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

    private onShowRawWalletClick(type: 'eth-metamask' | 'eth' | 'btc' | 'app'): void {
        this.setState({
            showRawWallet: true,
            rawWalletType: type,
            rawWallet: new RawWallet(this.baseManager.getId(), '', '')
        })
    }

    private prepareRawWalletBlock(): React.ReactNode {
        if (!this.state.showRawWallet) {
            return null;
        }

        return (
            <div className="Dashboard__raw-wallet__container">
                {this.prepareRawWalletView()}
            </div>
        )
    }

    private prepareRawWalletView() {
        if (!this.state.showRawWallet) {
            return null;
        }

        return (
            <RawWalletView
                rawWallet={this.state.rawWallet}
                type={this.state.rawWalletType}
                onAcceptClick={(wallet => this.onAcceptRawWallet(wallet))}
                onCancelClick={() =>
                    this.setState({
                        showRawWallet: false,
                        rawWallet: new RawWallet(this.baseManager.getId(), '', '')
                    })
                }
            />
        )
    }

    private async onAcceptRawWallet(signedWallet: SupportSignedMessageData<CryptoWallet>): Promise<void> {
        const pos = this.state.clientData
            .findIndex(model => model.key === WalletManagerImpl.DATA_KEY_ETH_WALLETS);

        const existedWallets = this.baseManager.getWallets().eth
            .concat(this.baseManager.getWallets().btc)
            .concat(this.baseManager.getWallets().app);

        if (existedWallets.find(value => value.data.address === signedWallet.data.address)) {
            alert('only unique wallet can be set');
            return;
        }

        if (signedWallet instanceof EthWalletData) {
            this.baseManager.getWallets().eth.push(signedWallet);

        } else if (signedWallet instanceof BtcWalletData) {
            this.baseManager.getWallets().btc.push(signedWallet);

        } else if (signedWallet instanceof AppWalletData) {
            this.baseManager.getWallets().app.push(signedWallet);
        }

        const wallets = await this.baseManager
            .getWalletManager()
            .createCryptoWalletsData(this.baseManager.getWallets());

        const strJson = JSON.stringify(wallets);

        if (pos >= 0) {
            this.state.clientData[pos].value = strJson;

        } else {
            this.state.clientData.push(new Pair(WalletManagerImpl.DATA_KEY_ETH_WALLETS, strJson));
        }

        this.setState({
            showRawWallet: false,
            rawWallet: new RawWallet(this.baseManager.getId(), '', '')
        });
    }

    private onChangeKey(key: string) {
        this.setState({inputKey: key});
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

    private async onVerifyWallets() {
        const pos = this.state.clientData.findIndex(model => model.key === WalletManagerImpl.DATA_KEY_ETH_WALLETS);
        if (pos >= 0) {
            const json = JSON.parse(this.state.clientData[pos].value);
            const signedCryptoWallets = CryptoWalletsData.fromJson(json);

            const res = WalletUtils.validateWalletsData(
                this.baseManager.getId(),
                signedCryptoWallets,
            );

            alert(res.length === 0 ? 'verify is OK' : JSON.stringify(res));

        } else {
            alert('no eth_wallets found');
        }
    }

    private async onSignWallets() {
        const pos = this.state.clientData.findIndex(model => model.key === WalletManagerImpl.DATA_KEY_ETH_WALLETS);
        if (pos >= 0) {
            try {
                const signedCryptoWallets = CryptoWalletsData.fromJson(JSON.parse(this.state.clientData[pos].value));

                const wallets = await this.baseManager
                    .getWalletManager()
                    .createCryptoWalletsData(signedCryptoWallets.data);

                this.state.clientData[pos].value = JSON.stringify(wallets);

                this.setState({});

                alert(`${WalletManagerImpl.DATA_KEY_ETH_WALLETS} signed`);
            } catch (err) {
                console.log(err);
                alert('exception in onSignWallets: ' + err);
            }

        } else {
            alert('no eth_wallets found');
        }
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
