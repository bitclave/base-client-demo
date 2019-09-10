import 'antd/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HashRouter, Route } from 'react-router-dom';
import Auth from './pages/Auth';
import CreateOffer from './pages/CreateOffer';
import CreateRequest from './pages/CreateRequest';
import CreateSearchRequest from './pages/CreateSearchRequest';
import Dashboard from './pages/Dashboard';
import DataPermissions from './pages/DataPermissions';
import GrantPermissions from './pages/GrantPermissions';
import Offers from './pages/Offers';
import SearchOfferMatch from './pages/SearchOfferMatch';
import SearchRequests from './pages/SearchRequests';
import SearchResult from './pages/SearchResult';
import './res/styles/index.css';

ReactDOM.render(
    <HashRouter>
        <div className="router">
            <Route exact={true} path="/" component={Auth}/>
            <Route path="/dashboard/" component={Dashboard}/>
            <Route path="/create-request/" component={CreateRequest}/>
            <Route path="/permissions/" component={DataPermissions}/>
            <Route path="/search-requests/" component={SearchRequests}/>
            <Route path="/search-result/:searchRequestId" component={SearchResult}/>
            <Route path="/create-search-request/" component={CreateSearchRequest}/>
            <Route path="/offers/" component={Offers}/>
            <Route path="/create-offer/" component={CreateOffer}/>
            <Route path="/search-match/" component={SearchOfferMatch}/>
            <Route path="/grant-permissions/" component={GrantPermissions}/>
        </div>
    </HashRouter>,
    document.getElementById('root') as HTMLElement
);
