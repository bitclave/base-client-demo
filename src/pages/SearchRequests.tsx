import { SearchRequest } from '@bitclave/base-client-js';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import Button from 'reactstrap/lib/Button';
import Container from 'reactstrap/lib/Container';
import SearchRequestList from '../components/lists/SearchRequestList';
import { Injections, lazyInject } from '../Injections';
import BaseManager from '../manager/BaseManager';

interface Props extends RouteComponentProps<{}> {
}

interface State {
    requests: Array<SearchRequest>;
}

export default class SearchRequests extends React.Component<Props, State> {

    @lazyInject(Injections.BASE_MANAGER)
    baseManager: BaseManager;

    constructor(props: Props) {
        super(props);
        this.state = {
            requests: []
        };
    }

    componentDidMount() {
        this.baseManager
            .getSearchManager()
            .getMyRequests(0)
            .then(this.onSyncData.bind(this));
    }

    render() {
        return (
            <div className="h-100">
                <Button className="m-2" color="primary" size="sm" onClick={() => this.onBackClick()}>
                    Back
                </Button>
                <Button className="m-2" color="primary" size="sm" onClick={() => this.onCreateSearchRequestClick()}>
                    Create search request
                </Button>
                <Container className="h-100 p-4">
                    <div className="h-100 justify-content-center align-items-center">
                        <SearchRequestList
                            selectable={false}
                            onItemClick={(item) => this.onRequestClick(item)}
                            data={this.state.requests}
                        />
                    </div>
                </Container>
            </div>
        );
    }

    private onRequestClick(item: SearchRequest) {
        const {history} = this.props;
        history.push(`/search-result/${item.id}`);
    }

    private onSyncData(result: Array<SearchRequest>) {
        this.setState({requests: result});
    }

    private onBackClick() {
        const {history} = this.props;
        history.goBack();
    }

    private onCreateSearchRequestClick() {
        const {history} = this.props;
        history.push('create-search-request');
    }

}
