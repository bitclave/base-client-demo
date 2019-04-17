export default class Config {

    private static isDebug: boolean = true;

    public static getBaseEndPoint(): string {
        return process.env.REACT_APP_BASE_NODE || '';
    }

    public static getSignerEndPoint(): string {
        return this.isDebug ? 'http://localhost:3545' : '';
    }
}
