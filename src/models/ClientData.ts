import { FieldData } from '@bitclave/base-client-js';

export enum ClientDataType {
    OWN = 'OWN',
    SHARED = 'SHARED',
    RESHARED = 'RESHARED'
}

export class ClientData {

    public readonly key: string;
    public readonly type: ClientDataType;
    public readonly fieldData?: FieldData | undefined;

    constructor(key: string, type: ClientDataType, fieldData?: FieldData | undefined) {
        this.key = key;
        this.type = type;
        this.fieldData = fieldData;
    }
}
