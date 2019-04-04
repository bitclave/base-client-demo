export default class Config {

    private static isDebug: boolean = true;

    public static getBaseEndPoint(): string {
        console.log(`process.env.REACT_APP_ENV =${process.env.REACT_APP_ENV}`);
        console.log(`process.env.REACT_APP_STAGE =${process.env.REACT_APP_STAGE}`);
        console.log(`process.env.REACT_APP_API_URL =${process.env.REACT_APP_API_URL}`);
        console.log(`process.env.BASE_NODE =${process.env.BASE_NODE}`);
        console.log(`process.env.REACT_APP_BASE_NODE =${process.env.REACT_APP_BASE_NODE}`);
        console.log(`process.env.NODE_ENV =${process.env.NODE_ENV}`);

        return process.env.REACT_APP_BASE_NODE || '';
    }

    public static getSignerEndPoint(): string {
        return this.isDebug ? 'http://localhost:3545' : '';
    }
}
