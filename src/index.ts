import * as mongo from 'mongodb';
 
export class MongoHelper {

  private static client: mongo.MongoClient;

  constructor() {
  }

  static async db(mongoUrl?: string): Promise<mongo.Db> { 
    if (!MongoHelper.client) { await this.connect(mongoUrl); }
    return MongoHelper.client.db();
  }
 
  static connect(mongoUrl?: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      mongo.MongoClient.connect(mongoUrl || process.env.MONGO_URL, (err, client: mongo.MongoClient) => {
        if (err) {
          reject(err);
        } else {
          MongoHelper.client = client;
          resolve(client);
        }
      });
    });
  }

  static async session<T>(operation: (session: mongo.ClientSession) => Promise<T>): Promise<T> {
    await this.db();
    const session = this.client.startSession({ defaultTransactionOptions: {
      readPreference: mongo.ReadPreference.fromString("primary"),
      readConcern: { level: 'local' },
      writeConcern: { w: 'majority' }
    }});
    let result: T;
    try {
      await session.withTransaction(async () => {
        result = await operation(session);
        //return result;
      });
      return result;
    }
    finally {
      session.endSession();
    }
  }
 
  disconnect(): void {
    MongoHelper.client.close();
  }
}
