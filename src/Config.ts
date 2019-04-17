export default class Config {

    private static isDebug: boolean = true;

    public static getBaseEndPoint(): string {
        return '';
    }

    public static getSignerEndPoint(): string {
        return this.isDebug ? 'http://localhost:3545' : '';
    }
}
