import mongoose from 'mongoose';
import initModels from '../../models';

export default async (config) => {
  /*const mongod = new MongodbMemoryServer({
      instance: {
        port: config.connection.mongo.port, // by default choose any free port
        dbName: config.connection.mongo.dbName, // by default generate random dbName
        dbPath: config.connection.mongo.dbPath, // by default create in temp directory
        storageEngine: 'mmapv1', // by default `ephemeralForTest`
      },
      debug: true
  });
  const uri = await mongod.getConnectionString();*/
  mongoose.connect(`mongodb://${config.connection.mongo.dbPath}:${config.connection.mongo.port}/${config.connection.mongo.dbName}`);
  initModels(mongoose);
  let modelNames = mongoose.modelNames();

  let models = {};
  modelNames.map(function(modelName) {
    return models[modelName]=mongoose.model(modelName);
  });
  // load db models
  models = await Promise.resolve(models).then(x=>x);
  return models
}