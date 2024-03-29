import * as mongo from 'mongodb';
export declare class MongoHelper {
    private static client;
    constructor();
    static db(mongoUrl?: string): Promise<mongo.Db>;
    static connect(mongoUrl?: string): Promise<any>;
    static session<T>(operation: (session: mongo.ClientSession) => Promise<T>): Promise<T>;
    disconnect(): void;
}
