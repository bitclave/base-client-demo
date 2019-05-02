import {
    AppCryptoWallet,
    BtcCryptoWallet,
    BtcWalletData,
    CryptoWallet,
    EthCryptoWallet,
    EthWalletData,
    SupportSignedMessageData,
    WalletUtils,
    AppWalletData
} from '@bitclave/base-client-js';
import * as React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { FormGroup, Input, InputGroup, InputGroupAddon, Label } from 'reactstrap';
import Button from 'reactstrap/lib/Button';
import Web3 from 'web3';
import { Injections, lazyInject } from '../../../Injections';
import BaseManager from '../../../manager/BaseManager';
import { RawWallet } from '../../../models/RawWallet';
import './RawWalletView.scss';

const ethUtil = require('ethereumjs-util');

let web3: Web3;

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


interface Props {
    rawWallet: RawWallet;

    type: 'eth-metamask' | 'eth' | 'btc' | 'app';

    onAcceptClick: (rawWallet: SupportSignedMessageData<CryptoWallet>) => void;

    onCancelClick: () => void;
}

interface State {
    address: string;
    message: string;
    signature: string;
    errors: React.ReactNode;
}

export class RawWalletView extends React.Component<Props, State> {

    @lazyInject(Injections.BASE_MANAGER)
    baseManager: BaseManager;

    constructor(props: Props, context: any) {
        super(props, context);

        this.state = {
            address: '',
            message: JSON.stringify(new CryptoWallet(props.rawWallet.baseId, props.rawWallet.address)),
            signature: '',
            errors: null
        }
    }

    public shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<State>, nextContext: any): boolean {
        return true;
    }

    public componentWillReceiveProps(nextProps: Readonly<Props>, nextContext: any): void {
        this.setState({
            address: '',
            message: JSON.stringify(new CryptoWallet(nextProps.rawWallet.baseId, nextProps.rawWallet.address)),
            signature: '',
            errors: null
        })
    }

    public render() {
        return (
            <div className="RawWalletView">
                <InputGroup>
                    <InputGroupAddon addonType="prepend">address</InputGroupAddon>
                    <Input
                        className={`RawWalletView__address${this.props.type === 'eth-metamask' ? '_disabled' : ''}`}
                        placeholder="address"
                        onChange={(e) => {
                            const address = e.target.value.toString();
                            const msg = JSON.stringify(
                                new CryptoWallet(this.props.rawWallet.baseId, address)
                            );
                            this.setState({address: e.target.value.toString(), message: msg})
                        }}
                        value={this.state.address}
                    />
                </InputGroup>
                <FormGroup
                    className={`RawWalletView__message${this.props.type === 'eth-metamask' ? '_invisible' : ''}`}
                >
                    <Label for="title">Message for sign</Label>
                    <Input
                        type="textarea"
                        name="text"
                        id="title"
                        disabled={true}
                        value={this.state.message}
                        onChange={(e) => this.setState({message: e.target.value.toString()})}
                    />

                    <CopyToClipboard
                        text={this.state.message}
                        onCopy={() => alert('copied!')}
                    >
                        <span className="RawWalletView__message__copy">
                            click to copy
                        </span>
                    </CopyToClipboard>

                </FormGroup>
                <FormGroup>
                    <Label for="title">Signature</Label>
                    <Input
                        className={`RawWalletView__signature${this.props.type === 'eth-metamask' ? '_disabled' : ''}`}
                        type="textarea"
                        name="text"
                        id="title"
                        onChange={(e) => this.setState({signature: e.target.value.toString()})}
                        value={this.state.signature}
                    />
                </FormGroup>

                <div className="RawWalletView__errors">
                    {this.state.errors}
                </div>

                <div className="RawWalletView__buttons">
                    {this.prepareMetamaskButton()}

                    <Button color="primary" onClick={() => this.props.onCancelClick()}>
                        Cancel
                    </Button>

                    <Button color="primary" onClick={() => this.onAcceptClick()}>
                        Accept
                    </Button>
                </div>
            </div>
        );
    }

    private onAcceptClick(): void {
        const baseId = this.props.rawWallet.baseId;
        const type = this.props.type;
        const {address, message, signature} = this.state;
        let wallet: SupportSignedMessageData<CryptoWallet>;

        if (address.trim().length <= 0) {
            alert('The address must not be empty');
            return;
        }

        if (signature.trim().length <= 0) {
            alert('The signature must not be empty');
            return;
        }

        if (message.trim().length <= 0) {
            alert('The message must not be empty');
            return;
        }

        if (type === 'eth-metamask' || type === 'eth') {
            wallet = new EthWalletData(new EthCryptoWallet(baseId, address), signature);

        } else if (type === 'btc') {
            wallet = new BtcWalletData(new BtcCryptoWallet(baseId, address), signature);

        } else if (type === 'app') {
            wallet = new AppWalletData(new AppCryptoWallet(baseId, address), signature);

        } else {
            throw new Error(`unsupported type: ${type}`);
        }

        const validation = WalletUtils.WALLET_VALIDATOR.validateCryptoWallet(wallet);

        if (validation.state.length > 0 && validation.message.length > 0) {
            const msg = validation.state.map(value => <div>{value}</div>)
                .concat(validation.message.map(value => <div>{value}</div>));

            this.setState({errors: msg});
            return
        }

        this.props.onAcceptClick(wallet);
    }

    private prepareMetamaskButton(): React.ReactNode {
        if (this.props.type !== 'eth-metamask') {
            return null;
        }

        return (
            <Button
                className="RawWalletView__buttons__metamask"
                color="primary"
                onClick={() => this.onSetEthSignature()}
            >
                Sign via Metamask
            </Button>
        )
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

            const message = JSON.stringify(new EthCryptoWallet(this.props.rawWallet.baseId, signingAddr));

            if (typeof web3 !== 'undefined') {

                const msg = ethUtil.bufferToHex(Buffer.from(message, 'utf8'));

                const params = [msg, signingAddr];
                const method = 'personal_sign';

                (web3.currentProvider as any).connection.sendAsync({
                    method,
                    params,
                    signingAddr
                }, (err: any, result: any) => {
                    this.setState({signature: result.result.toString(), address: signingAddr});
                });
            }
        })();
    }
}
