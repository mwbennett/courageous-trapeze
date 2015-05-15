'use strict';
// built-in npm module dependencies
//var Promise = require('bluebird');
//var Promise = require('mpromise');
var _ = require('underscore');
var mongoose = require('mongoose');

// local dependencies
var Contact = require('./contactModel.js');

module.exports = {
  addContact: function (request, response) {
  // logic to add or update Contact after server receives POST request
  // accept array of contact objects
    var convertPhone = function (phone) {
      if (typeof phone === 'number') {
        return phone;
      }
      return Number(phone.replace(/\D/g, ''));
    };

    // map array of contacts received in request to new objects 
    var contactsReceived = _.map(request.body.contacts, function (contact) {
      var googleId = contact.googleId || '';
      return {
        googleId: googleId,
        name: contact.name,
        phone: convertPhone(contact.phone),
        userId: mongoose.Types.ObjectId(request.user.userId)
      };
    });
    //console.log('contactsReceived:', contactsReceived);

    // identify net new contacts, i.e., contacts that do not exist in database already
    var existingNumbers = [];
    var newContacts = [];
    var query = Contact.find({userId:request.user.userId});
    query.exec(function (error, docs) {
      for (var i = 0; i < docs.length; i++) {
        existingNumbers.push(docs[i].phone);
      }
      //console.log(existingNumbers);

      for (var j = 0; j < contactsReceived.length; j++) {
        if (existingNumbers.indexOf(contactsReceived[j].phone) === -1) {
          newContacts.push(contactsReceived[j]);
        }
      }
      // create new contacts from newContacts array
      // see: http://mongoosejs.com/docs/models.html, http://mongoosejs.com/docs/api.html re: Model.create();
      Contact.create(newContacts, function (error, docs) {
        if (error) {
          console.log(error);
          response.status(500).end('Error: Could not save contacts');
        } else {
          response.status(200).send(docs);
        }
      });
    });
  },

  deleteContact: function (request, response, next) {
    var contactId = request.body._id;
    Contact.remove({'_id':contactId})
    .then(function(results){
      response.json(results);
    })
    .catch(function(error){
      next(new Error('Error occurred while deleting contacts: ' + error));
    });
  },
  
  showContacts: function (request, response) {
  // logic to return all Contacts after server receives GET request

    var query = { 'userId' : request.user.userId };
    Contact.find(query, function (error, docs) {
      if (error) {
        response.status(500).end('Error: Could not find contacts');
      } else {
        response.set('Content-Type', 'application/json');
        if (docs) {
          response.status(200).send(docs);
        } else {
          response.status(200).send([]);
        }
      }
    });
  }
};
