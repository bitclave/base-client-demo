import { AccessRight, OfferResultAction, OfferSearchResultItem, Page } from '@bitclave/base-client-js';
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
}

export default class SearchResult extends React.Component<Props, State> {

    @lazyInject(Injections.BASE_MANAGER)
    baseManager: BaseManager;

    constructor(props: Props) {
        super(props);

        this.state = {
            resultList: []
        };
    }

    componentDidMount() {
        this.baseManager
            .getSearchManager()
            .getSearchResult((this.props.match.params as any).searchRequestId)
            .then(this.onSyncData.bind(this));
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
                    </div>
                </Container>
            </div>
        );
    }

    private onSyncData(result: Page<OfferSearchResultItem>) {
        this.setState({resultList: result.content});
    }

    private onGrantAccessClick(model: OfferSearchResultItem) {
        const grantFields: Map<string, AccessRight> = new Map();
        // Array.from(model.offer.compare.keys()).forEach(value => {
        //     grantFields.set(value, AccessRight.R)
        // });

        // get user data from offerprice #0 - 0 is hard coded
        model.offer.offerPrices[0].rules.forEach(value => {
            grantFields.set(value.rulesKey, AccessRight.R)
        });

        this.baseManager.getDataReuqestManager()
            .grantAccessForOffer(
                model.offerSearch.id,
                model.offer.owner,
                grantFields,
                model.offer.offerPrices[0].id
            )
            .then(() => {
                const offerSearch = model.offerSearch.copy({state : OfferResultAction.ACCEPT})
                model = model.copy({offerSearch:offerSearch});
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
                const offerSearch = model.offerSearch.copy({state : OfferResultAction.REJECT})
                model = model.copy({offerSearch:offerSearch});
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
