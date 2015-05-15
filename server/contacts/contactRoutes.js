console.log('contactRoutes');
var contactController = require('./contactController.js');

module.exports = function (router) {

  router.post('/', contactController.addContact);
  router.get('/', contactController.showContacts);
  router.delete('/', contactController.deleteContact);
};