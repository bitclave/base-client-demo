import { CryptoWallet } from '@bitclave/base-client-js';

export class RawWallet extends CryptoWallet {
    public readonly signature: string;

    constructor(baseId: string, address: string, signature: string) {
        super(baseId, address);
        this.signature = signature;
    }
}
