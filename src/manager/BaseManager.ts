import Base, {
    AccessRight,
    Account,
    CryptoWallets,
    DataRequest,
    DataRequestManager,
    FieldData,
    Offer,
    OfferManager,
    ProfileManager,
    RepositoryStrategyType,
    SearchManager,
    SharedData,
    WalletManager,
} from '@bitclave/base-client-js';
import { injectable } from 'inversify';
import Config from '../Config';

@injectable()
export default class BaseManager {
    public account: Account = new Account('0x');
    private wallets: CryptoWallets = new CryptoWallets([], [], []);

    private base: Base;

    constructor() {
        this.base = new Base(Config.getBaseEndPoint(), location.hostname);
        console.log('your host name:', location.hostname);
    }

    setWallets(wallets: CryptoWallets): void {
        this.wallets = wallets;
    }

    getWallets(): CryptoWallets {
        return this.wallets;
    }

    changeStrategy(strategy: RepositoryStrategyType) {
        this.base.changeStrategy(strategy);
    }

    signUp(mnemonicPhrase: string): Promise<Account> {
        return this.getUniqueMessageForSigFromServerSide()
            .then(uniqueMessage => this.base.accountManager.registration(mnemonicPhrase, uniqueMessage))
            .then(this.sendAccountToServerSide.bind(this));
    }

    signIn(mnemonicPhrase: string): Promise<Account> {
        return this.getUniqueMessageForSigFromServerSide()
            .then(uniqueMessage => this.base.accountManager.checkAccount(mnemonicPhrase, uniqueMessage))
            .then(this.sendAccountToServerSide.bind(this));
    }

    public async sendAccountToServerSide(account: Account): Promise<Account> {
        console.log('account for server side: ', account);
        this.account = account;
        this.setWallets(new CryptoWallets([], [], []));

        return account;
    }

    getNewMnemonic(): Promise<string> {
        return this.base.accountManager.getNewMnemonic()
            .then(phrase => phrase);
    }

    unsubscribe(mnemonicPhrase: string): Promise<void> {
        return this.base.accountManager
            .unsubscribe();
    }

    getOfferManager(): OfferManager {
        return this.base.offerManager;
    }

    getProfileManager(): ProfileManager {
        return this.base.profileManager;
    }

    getWalletManager(): WalletManager {
        return this.base.walletManager;
    }

    getSearchManager(): SearchManager {
        return this.base.searchManager;
    }

    getDataReuqestManager(): DataRequestManager {
        return this.base.dataRequestManager;
    }

    getId(): string {
        return this.account.publicKey !== '0x' ? this.account.publicKey : 'unknown';
    }

    loadClientData(): Promise<Map<string, string>> {
        return this.base.profileManager.getData();
    }

    saveData(data: Map<string, string>): Promise<Map<string, string>> {
        return this.base.profileManager.updateData(data);
    }

    decryptRequestFields(senderPk: string, encryptedData: string): Promise<object | string> {
        return this.base.dataRequestManager.decryptMessage(senderPk, encryptedData);
    }

    getClientRawData(clientPk: string): Promise<Map<string, string>> {
        return this.base.profileManager.getRawData(clientPk);
    }

    getAuthorizedData(acceptedRequests: Array<DataRequest>): Promise<SharedData> {
        return this.base.profileManager.getAuthorizedData(acceptedRequests);
    }

    getAlreadyRequestedPermissions(recipientPk?: string | undefined): Promise<Array<FieldData>> {
        return this.base.dataRequestManager.getRequestedPermissions(recipientPk);
    }

    requestPermissions(recipientPk: string, fields: Array<string>): Promise<void> {
        return this.base.dataRequestManager.requestPermissions(recipientPk, fields);
    }

    public shareDataForOffer(offer: Offer, priceId: number): Promise<void> {
        const fields = new Map<string, AccessRight>();
        // offer.compare.forEach((value, key) => {
        //   fields.push(key.toString().toLowerCase());
        // });
        return this.base.dataRequestManager.grantAccessForOffer(offer.id, offer.owner, fields, priceId);
    }

    async grandPermissions(from: string, fields: Array<string>): Promise<Array<string>> {
        const grantedFields = fields;
        // get old granted permissions
        // const grantedFields = await this.base.dataRequestManager.getGrantedPermissionsToMe(from);
        //
        // fields.forEach(value => {
        //     if (grantedFields.indexOf(value) === -1) {
        //         grantedFields.push(value);
        //     }
        // });
        console.log('new', grantedFields);
        const accessFields: Map<string, AccessRight> = new Map();
        grantedFields.forEach(value => {
            accessFields.set(value, AccessRight.R);
        });
        await this.base.dataRequestManager.grantAccessForClient(from, accessFields);
        return grantedFields;
    }

    async getRequests(fromPk: string | null, toPk: string | null): Promise<DataRequest[]> {
        const result = await this.base.dataRequestManager.getRequests(fromPk, toPk);
        console.log(result);
        return result;
    }

    logout() {
        this.account = new Account('0x');
    }

    private getUniqueMessageForSigFromServerSide(): Promise<string> {
        return new Promise<string>(resolve => {
            let text = '';
            const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            for (let i = 0; i < 64; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            console.log('unique message from server side:', text);
            resolve(text);
        });
    }
}
