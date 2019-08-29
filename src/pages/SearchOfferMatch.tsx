import { Offer, OfferSearch, Page, SearchRequest } from '@bitclave/base-client-js';
import { Pagination } from 'antd';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import Button from 'reactstrap/lib/Button';
import Container from 'reactstrap/lib/Container';
import OfferList from '../components/lists/OfferList';
import SearchRequestList from '../components/lists/SearchRequestList';
import { Injections, lazyInject } from '../Injections';
import BaseManager from '../manager/BaseManager';

interface Props extends RouteComponentProps<{}> {
}

interface State {
    offersList: Array<Offer>;
    searchRequestList: Array<SearchRequest>;
    selectedOffer: Offer | undefined;
    selectedSearch: SearchRequest | undefined;
    offersPageTotal: number;
    offersPageSelected: number;
    requestsPageTotal: number;
    requestsPageSelected: number;
}

export default class SearchOfferMatch extends React.Component<Props, State> {

    @lazyInject(Injections.BASE_MANAGER)
    baseManager: BaseManager;

    PAGE_SIZE: number = 10;

    constructor(props: Props) {
        super(props);
        this.state = {
            offersList: [],
            searchRequestList: [],
            selectedOffer: undefined,
            selectedSearch: undefined,
            offersPageTotal: 0,
            offersPageSelected: 0,
            requestsPageTotal: 0,
            requestsPageSelected: 0,
        };
    }

    componentDidMount() {
        this.baseManager
            .getOfferManager()
            .getOffersByPage(0, this.PAGE_SIZE)
            .then(this.onSyncOffers.bind(this));

        this.baseManager
            .getSearchManager()
            .getRequestsByPage(0, this.PAGE_SIZE)
            .then(this.onSyncSearchRequest.bind(this));
    }

    render() {
        return (
            <div className="h-100">
                <Button className="m-2" color="primary" size="sm" onClick={() => this.onBackClick()}>
                    Back
                </Button>
                <Container className="h-100 p-4">
                    <div className="justify-content-center align-items-center">

                        <div className="text-white">Offers:</div>
                        <OfferList
                            selectable={true}
                            data={this.state.offersList}
                            onItemClick={(item: Offer) => this.onOfferClick(item)}
                        />
                        <Pagination
                            onChange={(page) => this.loadOffersPage(page)}
                            total={this.state.offersPageTotal}
                        />
                    </div>

                    <div className="my-5 justify-content-center align-items-center">
                        <div className="text-white">Search Requests:</div>
                        <SearchRequestList
                            selectable={true}
                            data={this.state.searchRequestList}
                            onItemClick={(item: SearchRequest) => this.onRequestClick(item)}
                        />
                        <Pagination
                            onChange={(page) => this.loadRequestsPage(page)}
                            total={this.state.requestsPageTotal}
                        />
                    </div>

                    <div className="text-center">
                        <Button
                            color="primary"
                            onClick={() => this.onMatchClick()}
                        >
                            Match offer with search
                        </Button>
                    </div>
                </Container>
            </div>
        );
    }

    private loadOffersPage(page: number) {
        this.baseManager
            .getOfferManager()
            .getOffersByPage(page - 1, this.PAGE_SIZE)
            .then(this.onSyncOffers.bind(this));
    }

    private loadRequestsPage(page: number) {
        this.baseManager
            .getSearchManager()
            .getRequestsByPage(page - 1, this.PAGE_SIZE)
            .then(this.onSyncSearchRequest.bind(this));
    }

    private onMatchClick() {
        if (this.state.selectedOffer === undefined) {
            alert('Please select offer');
            return;
        }

        if (this.state.selectedSearch === undefined) {
            alert('Please select search request');
            return;

        }
        this.baseManager.getSearchManager().addResultItem(
            new OfferSearch(this.state.selectedSearch.id, this.state.selectedOffer.id)
        )
            .then(() => alert('offer successful added to search result!'))
            .catch(() => alert('something went wrong'));
    }

    private onSyncOffers(page: Page<Offer>) {
        this.setState({offersList: page.content, offersPageTotal: page.totalPages + 1});
    }

    private onSyncSearchRequest(page: Page<SearchRequest>) {
        this.setState({searchRequestList: page.content, requestsPageTotal: page.totalPages + 1});
    }

    private onBackClick() {
        const {history} = this.props;
        history.goBack();
    }

    private onOfferClick(offer: Offer) {
        this.setState({selectedOffer: offer});
    }

    private onRequestClick(searchRequest: SearchRequest) {
        this.setState({selectedSearch: searchRequest});
    }

}
