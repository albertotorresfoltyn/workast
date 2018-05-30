import MongodbMemoryServer from 'mongodb-memory-server';
import mongoose from 'mongoose';
import getModels from '../../models';

export default async (config) => {
  const mongod = new MongodbMemoryServer({
    instance: {
      port: config.connection.mongo.port, // by default choose any free port
      dbName: config.connection.mongo.dbName, // by default generate random dbName
      dbPath: config.connection.mongo.dbPath, // by default create in temp directory
      storageEngine: 'WiredTiger', // by default `ephemeralForTest`
    }
  });
  const uri = await mongod.getConnectionString();
  mongoose.connect(uri);
  const models = getModels(mongoose);
  
  // load db models
  return models
}