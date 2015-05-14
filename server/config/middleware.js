'use strict';
var bodyParser = require('body-parser');
var authUtil = require('./authUtil.js');
var allowCors = require('./cors.js');
var morgan = require('morgan');

module.exports = function (app, express) {

  var userRoutes = require('../users/userRoutes.js');
  var messageRoutes = require('../messages/messageRoutes.js');
  var contactRoutes = require('../contacts/contactRoutes.js');

  // instantiate express Routers for User, Message, and Contact 
  // see: http://expressjs.com/guide/routing.html
  var userRouter = express.Router();
  var messageRouter = express.Router();
  var contactRouter = express.Router();

  app.use(bodyParser.json()); // for parsing application/json
  app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
  // serve static content for the app from the “client” directory in the application directory
  app.use(express.static(__dirname + '/../../client'));
  app.use(morgan('dev'));

  // mount middleware functions at the specified paths
  // call routes with express Routers passed as parameters to assign 'get' and 'post' properties to Routers
  userRoutes(userRouter);
  messageRoutes(messageRouter);
  contactRoutes(contactRouter);

  app.use(allowCors);

  app.use('/api/messages', authUtil.decodeTokenAttachToReq);
  app.use('/api/contacts', authUtil.decodeTokenAttachToReq);

  app.use('/api/users', userRouter);
  app.use('/api/messages', messageRouter);
  app.use('/api/contacts', contactRouter);
};
