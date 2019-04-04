import { RepositoryStrategyType } from '@bitclave/base-client-js';
import * as React from 'react';
import { FormEvent } from 'react';
import { RouteComponentProps } from 'react-router';
import Button from 'reactstrap/lib/Button';
import Form from 'reactstrap/lib/Form';
import FormGroup from 'reactstrap/lib/FormGroup';
import Input from 'reactstrap/lib/Input';
import { Injections, lazyInject } from '../Injections';
import BaseManager from '../manager/BaseManager';

interface Props extends RouteComponentProps<{}> {
}

interface State {
    mnemonicPhrase: string;
    strategy: RepositoryStrategyType;
}


export default class Auth extends React.Component<Props, State> {
    @lazyInject(Injections.BASE_MANAGER)
    private readonly baseManager: BaseManager;

    constructor(props: Props) {
        super(props);

        this.state = {
            mnemonicPhrase: '',
            strategy: RepositoryStrategyType.Postgres
        };
    }

    render() {
        return (
            <div className="text-white d-flex align-items-center flex-column justify-content-center h-100">
                <h1 className="text-white text-center mb-5">
                    Raw Dev
                    <br/>
                    No UX
                </h1>
                <p>
                    BASE-NODE URL: {process.env.REACT_APP_BASE_NODE || 'BASE-NODE URL is undefined'}
                </p>
                <Form className="m-4">
                    Change strategy for Base Node:
                    <select
                        className="form-control form-control-sm"
                        name="select"
                        id="strategy"
                        onChange={e => this.onChangeStrategy(e.target)}
                    >
                        <option data-value={RepositoryStrategyType.Postgres}>Centralized (Postgres)</option>
                        <option data-value={RepositoryStrategyType.Hybrid}>Hybrid (Ethereum)</option>
                    </select>
                </Form>
                <Form onSubmit={e => this.onSubmit(e)}>
                    <FormGroup>
                        <Input
                            value={this.state.mnemonicPhrase}
                            onChange={e => this.onChangeMnemonic(e.target.value)}
                            className="form-control form-control-lg"
                            bsSize="lg"
                            placeholder={'Mnemonic phrase'}
                        />
                        <Button size="sm" color="primary" onClick={() => this.onMnemonic()}>
                            Seed Phrase
                        </Button>
                    </FormGroup>
                    <FormGroup>
                        <Button block={true} size="lg" color="primary" onClick={() => this.onSingUp()}>
                            Sign Up
                        </Button>
                    </FormGroup>
                    <FormGroup>
                        <Button block={true} size="lg" color="primary" onClick={() => this.onSingIn()}>
                            Sign In
                        </Button>
                    </FormGroup>
                    <FormGroup>
                        <Button block={true} size="lg" color="danger" onClick={() => this.onDelete()}>
                            Delete
                        </Button>
                    </FormGroup>
                </Form>
            </div>
        );
    }

    private onChangeStrategy(collection: HTMLSelectElement) {
        const item: HTMLOptionElement = (collection[collection.selectedIndex] as HTMLOptionElement);
        const strategy: RepositoryStrategyType = item.getAttribute('data-value') as RepositoryStrategyType;
        this.setState({strategy: strategy});
        console.log(this);
        this.baseManager.changeStrategy(strategy);
    }

    private onSubmit(e: FormEvent<HTMLFormElement>) {
        this.onSingIn();
        e.preventDefault();
    }

    private onChangeMnemonic(mnemonicPhrase: string) {
        this.setState({mnemonicPhrase: mnemonicPhrase});
    }

    private onMnemonic() {
        // this.setState({mnemonicPhrase: this.baseManager.getNewMnemonic()});
        this.baseManager.getNewMnemonic()
            .then(phrase => {
                this.setState({mnemonicPhrase: phrase});
            })
            .catch(response => {
                alert('message: ' + response.json.error);
            });
    }

    private onSingUp() {
        const {history} = this.props;
        if (this.state.mnemonicPhrase.length < 5) {
            alert('Minimum 5 symbols!');
            return;
        }
        this.baseManager.signUp(this.state.mnemonicPhrase)
            .then(account => history.replace('dashboard'))
            .catch(response => {
                if (response.json.status === 409) {
                    alert('User already registered!');
                } else {
                    alert('message: ' + response.json.error);
                }
            });
    }

    private onSingIn() {
        const {history} = this.props;
        if (this.state.mnemonicPhrase.length < 5) {
            alert('Minimum 5 symbols!');
            return;
        }
        this.baseManager.signIn(this.state.mnemonicPhrase)
            .then(account => history.replace('dashboard'))
            .catch(response => {
                if (response.json.status === 404) {
                    alert('User not found');
                } else {
                    alert('message: ' + response.json.error);
                }
            });
    }

    private onDelete() {
        if (this.state.mnemonicPhrase.length < 5) {
            alert('Minimum 5 symbols!');
            return;
        }
        this.baseManager.unsubscribe(this.state.mnemonicPhrase)
            .then(account => {
                alert('User deleted');
                this.onChangeMnemonic('');
            })
            .catch(response => {
                if (response.json.status === 404) {
                    alert('User not found');
                } else {
                    alert('message: ' + response.json.error);
                }
            });
    }

}
