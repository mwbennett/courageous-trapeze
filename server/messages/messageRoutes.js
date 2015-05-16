var messageController = require('./messageController.js');

module.exports = function (router) {

  router.post('/', messageController.addMessage);
  router.put('/', messageController.updateMessage);
  router.get('/', messageController.showMessages);
  router.delete('/', messageController.deleteMessage);
  router.get('/pending', messageController.getPendingMessages);
};