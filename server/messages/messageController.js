'use strict';
// built-in npm module dependencies
//var Promise = require('bluebird');
//var Promise = require('mpromise');
var _ = require('underscore');

// local dependencies
var Message = require('./messageModel.js');
var Contact = require('../contacts/contactModel.js');


module.exports = {
  addMessage: function (request, response) {
  // logic to add or update Message after server receives POST request
    console.log(request.user.userId);
    var messageObject = {
      userId: request.user.userId,
      contactId: request.body.contactId,
      text: request.body.text,
      date: Date.parse(request.body.date) || request.body.date,
      status: 'scheduled'
    };
    // see: http://mongoosejs.com/docs/models.html
    var newMessage = new Message(messageObject);
    newMessage.save(function (error, doc) {
      if (error) {
        console.log(error);
        response.status(500).send('Error: Could not save message');
      } else {
        response.status(200).send(doc);
      }
    });
  },

  updateMessage: function (request, response) {
    //update message in database after receiving message status
    for (var status in request.body) {
      var messagesArray = request.body[status];
      _.each(messagesArray, function (messageId) {
        var query = { _id: messageId };
        console.log('query', query);
        Message.findOneAndUpdate(query, { status: status }, function (error) {
          if (error) {
            console.log(error);
          } else {
            console.log('updated');
          }
        });
      });
    }
    response.status(200).send('Messages updated');
  },

  deleteMessage: function (request, response, next) {
    console.log(request.body);
    var messageId = request.body._id;
    Message.remove({'_id':messageId})
    .then(function(results){
      response.json(results);
    })
    .catch(function(error){
      next(new Error('Error occurred while deleting contacts: ' + error));
    });
  },

  getPendingMessages: function (request, response, next){
    var currentTime = Date.now();
    Message.find({'date': {$lte:currentTime},'userId': request.user.userId})
    .then(function(results){
      response.json(results);
    })
    .catch(function(error){
      next(new Error('Error occurred while deleting contacts: ' + error));
    });
  },
  
  showMessages: function (request, response) {
  // return all Messages after server receives GET request
    var query = Message.find({ userId: request.user.userId });
    query.exec(function (error, docs) {
      if (error) {
        response.status(500).send('Error: could not send docs');
      } else {
        //console.log('docs:', docs);
        populate(docs);
      }
    });

    var populate = function (docs) {
      var opts = [{path: 'contactId', model: 'Contact'}, {path: 'userId', model: 'User'}];
      Message.populate(docs, opts, function (error, newDocs) {
        if (error) {
          //console.log(error);
          response.status(500).send('Error: could not populate docs');
        } else {
          //console.log('newDocs:', newDocs);
          response.status(200).send(newDocs);
        }
      });
    };
  }
};
