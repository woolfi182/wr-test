import * as mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

export class MongoConnection {
  mongod: MongoMemoryServer;

  async connect() {
    this.mongod = await MongoMemoryServer.create();
    const uri = await this.mongod.getUri();
    await mongoose.connect(uri);
  }

  async disconnect() {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
    await this.mongod.stop();
  }

  async clearDatabase() {
    await mongoose.connection.dropDatabase();
  }
}
