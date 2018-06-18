## Workast Technical assesment ##

**Description:** This repo is a full-featured project implemented in nodeJS

### Start the project ###
   To start and get the project running you only have to follow this steps:

- **get the code** `git clone https://github.com/albertotorresfoltyn/workast.git`
- get in the folder `cd workast`
- run package install `npm i`
- start the project in dev mode `npm start:dev`
- do requests to `http://localhost:8081`

****
### Considerations ###

 - Once you started the project as mentioned it will create it's own mongodb instance, where the objects will be stored 
(but in the port 27019), hence you dont need to have mongodb installed before.
   The project reads automatically models and routes from the filesystem.
 - `models/index.js` will load all models that you put in the folder models, be advised that the models are not standard mongoose models but functions
 - `handlers/index.js' loads handlers, which will be called from routes (and consider the same that in the last reference, handlers are functions'
 - `routes/index.js` gets all the routes and set them up in express app. This architecture was chosen in order to decouple from the application. If I want to use another web framework (HAPI or other) I can do it with not much changes in a couple of files
   