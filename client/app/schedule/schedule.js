'use strict';
var schedule = angular.module('courageousTrapeze.schedule', []);

schedule.controller('ScheduleController', ['$scope', 'Messages', 'Contacts', function ($scope, Messages, Contacts) {
  $scope.message = {
    contactId: '',
    text: '',
    date: '',
    status: 'scheduled'
  };
  $scope.contacts = [];

  $scope.$on('$viewContentLoaded', function () {
    var promise = Contacts.fetch();
    promise.then(function (response) {
      $scope.contacts = response;
    });
    $scope.notification = '';
  });

  $scope.setContact = function (contact) {
    if (contact) {
      $scope.message.contactId = contact._id;
    } else {
      $scope.message.contactId = '';
    }
  };
  
  $scope.addMessage = function (message) {
    $scope.loading = true;
    Messages.addMessage(message)
      .success(function () {
        $scope.message.contactId = '';
        $scope.message.text = '';
        $scope.message.date = '';
        $scope.loading = false;
        $scope.contact = '';
        $scope.notification = 'Good work, your message is scheduled!';
      })
      .error(function () {
        $scope.loading = false;
      });
  };

}]);
