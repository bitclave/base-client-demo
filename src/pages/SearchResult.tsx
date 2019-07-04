import {
    AccessRight,
    OfferInteraction,
    OfferResultAction,
    OfferSearchResultItem,
    Page
} from '@bitclave/base-client-js';
import { Pagination } from 'antd';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import Button from 'reactstrap/lib/Button';
import Container from 'reactstrap/lib/Container';
import ResultOfferList from '../components/lists/ResultOfferList';
import { Injections, lazyInject } from '../Injections';
import BaseManager from '../manager/BaseManager';

interface Props extends RouteComponentProps<{}> {
}

interface State {
    resultList: Array<OfferSearchResultItem>;
    searchRequestId: number;
    totalPages: number;
    page: number;
}

export default class SearchResult extends React.Component<Props, State> {

    @lazyInject(Injections.BASE_MANAGER)
    baseManager: BaseManager;

    PAGE_SIZE: number = 10;

    constructor(props: Props) {
        super(props);

        this.state = {
            resultList: [],
            searchRequestId: (this.props.match.params as any).searchRequestId,
            totalPages: 0,
            page: 0
        };
    }

    componentDidMount() {
        this.loadRequestsPage(0);
    }

    render() {
        return (
            <div className="h-100">
                <Button className="m-2" color="primary" size="sm" onClick={() => this.onBackClick()}>
                    Back
                </Button>
                <Container className="h-100 p-4">
                    <div className="h-100 justify-content-center align-items-center">
                        <ResultOfferList
                            selectable={false}
                            data={this.state.resultList}
                            onGrantAccessClick={model => this.onGrantAccessClick(model)}
                            onComplainClick={model => this.onComplainClick(model)}
                        />
                        <Pagination
                            onChange={(page) => this.loadRequestsPage(page - 1)}
                            total={this.state.totalPages}
                        />
                    </div>
                </Container>
            </div>
        );
    }

    private loadRequestsPage(page: number) {
        this.baseManager
            .getSearchManager()
            .getSearchResult(this.state.searchRequestId, page, this.PAGE_SIZE)
            .then(this.onSyncData.bind(this));
    }

    private async onSyncData(result: Page<OfferSearchResultItem>) {
        const offerIds = result.content.map(item => item.offer.id);

        const interactions = await this.baseManager.getSearchManager().getInteractions(offerIds);
        const mapped = new Map<number, OfferInteraction>();
        interactions.forEach(item => mapped.set(item.offerId, item));
        const updated = result.content.map(item => item.copy({interaction: mapped.get(item.offer.id)}));

        this.setState({resultList: updated, totalPages: result.totalPages});
    }

    private onGrantAccessClick(model: OfferSearchResultItem) {
        const grantFields: Map<string, AccessRight> = new Map();
        // Array.from(model.offer.compare.keys()).forEach(value => {
        //     grantFields.set(value, AccessRight.R)
        // });

        // get user data from offerprice #0 - 0 is hard coded
        model.offer.offerPrices[0].rules.forEach(value => {
            grantFields.set(value.rulesKey, AccessRight.R);
        });

        this.baseManager.getDataReuqestManager()
            .grantAccessForOffer(
                model.offerSearch.id,
                model.offer.owner,
                grantFields,
                model.offer.offerPrices[0].id
            )
            .then(() => {
                const offerSearch = model.offerSearch.copy({state: OfferResultAction.ACCEPT});
                model = model.copy({offerSearch: offerSearch});
                this.setState({resultList: this.state.resultList});
            })
            .catch((e) => {
                console.log(e);
                alert('something went wrong!');
            });
    }

    private onComplainClick(model: OfferSearchResultItem) {
        this.baseManager.getSearchManager()
            .complainToSearchItem(model.offerSearch.id)
            .then(() => {
                const offerSearch = model.offerSearch.copy({state: OfferResultAction.REJECT});
                model = model.copy({offerSearch: offerSearch});
                this.setState({resultList: this.state.resultList});
            })
            .catch((e) => {
                console.log(e);
                alert('something went wrong!');
            });
    }

    private onBackClick() {
        const {history} = this.props;
        history.goBack();
    }

}
