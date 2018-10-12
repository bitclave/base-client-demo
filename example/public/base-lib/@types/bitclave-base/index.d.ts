import { AccountManager } from './manager/AccountManager';
import { ProfileManager } from './manager/ProfileManager';
import { DataRequestManager } from './manager/DataRequestManager';
import { RepositoryStrategyType } from './repository/RepositoryStrategyType';
import { OfferManager } from './manager/OfferManager';
import { SearchManager } from './manager/SearchManager';
import SearchRequest from './repository/models/SearchRequest';
import Offer from './repository/models/Offer';
import { OfferPrice } from './repository/models/OfferPrice';
import { OfferPriceRules } from './repository/models/OfferPriceRules';
import { HttpTransportImpl } from './repository/source/http/HttpTransportImpl';
import { WalletManager } from './manager/WalletManager';
import { WalletManagerImpl } from './manager/WalletManagerImpl';
import { OfferSearchRepository } from './repository/search/OfferSearchRepository';
import { OfferSearchRepositoryImpl } from './repository/search/OfferSearchRepositoryImpl';
import OfferSearchResultItem from './repository/models/OfferSearchResultItem';
import OfferSearch, { OfferResultAction } from './repository/models/OfferSearch';
import OfferShareData from './repository/models/OfferShareData';
import { OfferShareDataRepository } from './repository/offer/OfferShareDataRepository';
import OfferShareDataRepositoryImpl from './repository/offer/OfferShareDataRepositoryImpl';
export { RepositoryStrategyType } from './repository/RepositoryStrategyType';
export { CompareAction } from './repository/models/CompareAction';
export { RpcTransport } from './repository/source/rpc/RpcTransport';
export { HttpTransport } from './repository/source/http/HttpTransport';
export { HttpInterceptor } from './repository/source/http/HttpInterceptor';
export { TransportFactory } from './repository/source/TransportFactory';
export { KeyPairFactory } from './utils/keypair/KeyPairFactory';
export { RemoteSigner } from './utils/keypair/RemoteSigner';
export { CryptoUtils } from './utils/CryptoUtils';
export { WalletUtils } from './utils/WalletUtils';
export { JsonUtils } from './utils/JsonUtils';
export { EthereumUtils } from './utils/EthereumUtils';
export { KeyPair } from './utils/keypair/KeyPair';
export { KeyPairHelper } from './utils/keypair/KeyPairHelper';
export { Permissions, AccessRight } from './utils/keypair/Permissions';
export { AcceptedField } from './utils/keypair/AcceptedField';
export { RpcToken } from './utils/keypair/rpc/RpcToken';
export { RpcAuth } from './utils/keypair/rpc/RpcAuth';
export { BaseAddrPair, AddrRecord, WalletsRecords, WealthRecord, WealthPtr, ProfileUser, ProfileWealthValidator } from './utils/types/BaseTypes';
export { AccountManager, ProfileManager, DataRequestManager, OfferManager, SearchManager, WalletManager, WalletManagerImpl, Offer, OfferPrice, OfferPriceRules, SearchRequest, OfferSearch, OfferSearchResultItem, OfferResultAction, OfferShareData, OfferShareDataRepository, OfferShareDataRepositoryImpl, OfferSearchRepository, OfferSearchRepositoryImpl, HttpTransportImpl };
export default class Base {
    private _walletManager;
    private _accountManager;
    private _profileManager;
    private _dataRequestManager;
    private _offerManager;
    private _searchManager;
    private _authAccountBehavior;
    private _repositoryStrategyInterceptor;
    constructor(nodeHost: string, siteOrigin: string, strategy?: RepositoryStrategyType, signerHost?: string);
    changeStrategy(strategy: RepositoryStrategyType): void;
    readonly walletManager: WalletManager;
    readonly accountManager: AccountManager;
    readonly profileManager: ProfileManager;
    readonly dataRequestManager: DataRequestManager;
    readonly offerManager: OfferManager;
    readonly searchManager: SearchManager;
    private createNodeAssistant;
    private createKeyPairHelper;
}