import { AccessRight, FieldData } from '@bitclave/base-client-js';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import Button from 'reactstrap/lib/Button';
import Container from 'reactstrap/lib/Container';
import { ClientDataList } from '../components/lists/ClientDataList';
import { Injections, lazyInject } from '../Injections';
import BaseManager from '../manager/BaseManager';
import { ClientData, ClientDataType } from '../models/ClientData';

interface Props extends RouteComponentProps<{}> {
}

interface State {
    clientData: Array<ClientData>;
}

export default class GrantPermissions extends React.Component<Props, State> {

    @lazyInject(Injections.BASE_MANAGER)
    baseManager: BaseManager;

    constructor(props: Props) {
        super(props);

        this.state = {
            clientData: []
        };

        this.merge(this.syncOwnKeys.bind(this), this.syncSharedKeys.bind(this))
            .then(this.updateClientData.bind(this));
    }

    render() {
        return (
            <div className="h-100">
                <Button className="m-2" color="primary" size="sm" onClick={() => this.onBackClick()}>
                    Back
                </Button>
                <Container className="h-100 p-4">
                    <div className="h-100 justify-content-center align-items-center">
                        <ClientDataList
                            onShareClick={(pk: string, data: ClientData) => this.onShareDataClick(pk, data)}
                            data={this.state.clientData}
                        />
                    </div>
                </Container>
            </div>
        );
    }

    private onShareDataClick(pk: string, data: ClientData) {
        console.log(data);
        this.baseManager
            .getDataReuqestManager()
            .grantAccessForClient(
                pk,
                new Map([[data.key, AccessRight.R]]),
                data.fieldData ? data.fieldData.root : undefined
            )
            .then(() => alert('Shared success'))
            .catch((e) => {
                console.error(e);
                alert('Error! see logs');
            });
    }

    private updateClientData(clientData: Array<ClientData>) {
        console.log(clientData);
        this.setState({clientData: clientData});
    }

    private onBackClick() {
        const {history} = this.props;
        history.goBack();
    }

    private syncOwnKeys(): Promise<Array<ClientData>> {
        return this.baseManager.getProfileManager()
            .getData()
            .then(this.ownDataToClientData);
    }

    private syncSharedKeys(): Promise<Array<ClientData>> {
        return this.baseManager.getDataReuqestManager()
            .getRequestedPermissions()
            .then(this.fieldDataToClientData);
    }

    private ownDataToClientData(map: Map<string, string>): Array<ClientData> {
        return Array.from(map.keys()).map(key => new ClientData(key, ClientDataType.OWN));
    }

    private fieldDataToClientData(fieldData: Array<FieldData>): Array<ClientData> {
        return fieldData
            .map((item: FieldData) => {
                const type = !item.root || item.root === '' || item.root == item.to
                             ? ClientDataType.SHARED
                             : ClientDataType.RESHARED;

                return new ClientData(item.key, type, item);
            });
    }

    private async merge(
        first: () => Promise<Array<ClientData>>,
        second: () => Promise<Array<ClientData>>
    ): Promise<Array<ClientData>> {
        const firstList = await first();
        const secondList = await second();

        return firstList.concat(secondList);
    }
}
