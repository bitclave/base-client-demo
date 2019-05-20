import { DataRequest, FieldData } from '@bitclave/base-client-js';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import Button from 'reactstrap/lib/Button';
import Container from 'reactstrap/lib/Container';
import PermissionsList from '../components/lists/PermissionsList';
import { Injections, lazyInject } from '../Injections';
import BaseManager from '../manager/BaseManager';

interface Props extends RouteComponentProps<{}> {
}

interface State {
    permissionsDataRequest: Array<FieldData>;
    permissionsDataResponse: Array<FieldData>;
}

export default class DataPermissions extends React.Component<Props, State> {

    @lazyInject(Injections.BASE_MANAGER)
    baseManager: BaseManager;

    constructor(props: Props) {
        super(props);
        this.state = {
            permissionsDataRequest: [],
            permissionsDataResponse: []
        };
        /* у кого я запросил данные и что мне акцептировали */
        this.baseManager.getRequests(this.baseManager.account.publicKey, '')
            .then(this.onSyncRequest.bind(this));

        /* кто и какие поля у меня запросил */
        this.onSyncResponse();
    }

    render() {
        return (
            <div className="h-100">
                <Button className="m-2" color="primary" size="sm" onClick={() => this.onBackClick()}>
                    Back
                </Button>
                <Container className="h-100 p-4">
                    <div className="h-100 justify-content-center align-items-center">
                        <div className="m-2 text-white">Response</div>
                        {/* у кого я запросил данные и что мне акцептировали */}
                        <PermissionsList
                            data={this.state.permissionsDataRequest}
                            accountPk={this.baseManager.getId()}
                            onAcceptClick={null}
                            onRevokeClick={null}
                        />
                        <div className="m-4"/>
                        <div className="m-2 text-white">Request</div>
                        {/* кто и какие поля у меня запросил */}
                        <PermissionsList
                            data={this.state.permissionsDataResponse}
                            accountPk={this.baseManager.getId()}
                            onAcceptClick={request => this.onAcceptClick(request)}
                            onRevokeClick={request => this.onRevokeClick(request)}
                        />
                    </div>
                </Container>
            </div>
        );
    }

    async onSyncRequest(requests: Array<DataRequest>) {
        const sharedData = await this.baseManager
            .getProfileManager()
            .getAuthorizedData(requests);

        if (sharedData.data.size <= 0) {
            return;
        }

        let result: Array<FieldData> = Array.from(sharedData.data.values())
            .reduce((previousValue, currentValue) => previousValue.concat(currentValue));

        this.setState({permissionsDataRequest: result});
    }

    async onSyncResponse() {
        const result = (await this.baseManager.getDataReuqestManager()
            .getRequestedPermissionsToMe())
            .sort((a: FieldData, b: FieldData) => a.from === b.from ? -1 : 0);

        console.log(result);
        this.setState({permissionsDataResponse: result});
    }

    private onBackClick() {
        const {history} = this.props;
        history.goBack();
    }

    private async onAcceptClick(fieldData: FieldData) {
        try {
            const accepted = (await this.baseManager.getDataReuqestManager().getRequestedPermissionsToMe())
                .filter(item => item.from === fieldData.from && item.value && item.value.length > 0)
                .map(item => item.key);

            accepted.push(fieldData.key);

            await this.baseManager.grandPermissions(fieldData.from, accepted);
            this.onSyncResponse();
            alert('Fields was accepted');

        } catch (e) {
            console.log(e);
            alert('Something went wrong');
        }
    }

    private async onRevokeClick(fieldData: FieldData) {
        try {
            await this.baseManager.getDataReuqestManager()
                .revokeAccessForClient(fieldData.from, [fieldData.key]);
            this.onSyncResponse();
            alert('Fields access was revoke');

        } catch (e) {
            console.log(e);
            alert('Something went wrong');
        }
    }
}
