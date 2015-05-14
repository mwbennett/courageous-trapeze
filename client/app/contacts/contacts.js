angular.module('courageousTrapeze.contacts', [])

.controller('ContactsController', ['$scope', '$window', '$http', 'Auth', 'Contacts', function($scope, $window, $http, Auth, Contacts) {
  $scope.loading = false;
  $scope.contacts = [];
  $scope.signout = Auth.signout;

  $scope.getAllContacts = function() {
    $scope.loading = true;
    Contacts.fetch()
      .then(function(contacts) {
        $scope.contacts = contacts;
        $scope.loading = false;
      })
      .catch(function(err) {
        console.error(err);
        $scope.loading = false;
      });
  };
  
  $scope.importGoogleContacts = function() {
    $scope.loading = true;
    Contacts.importFromGoogle().then(function(data) {
      // Only get contacts with a name and mobile phone number
      var googleContacts = _.filter(data, function(contact) {
        if (!contact.title.$t || !contact.gd$phoneNumber) {
          // Contact has no name or phone number
          return false;
        }

        // Check if contact has a mobile number
        return !!_.findWhere(contact.gd$phoneNumber, {rel: 'http://schemas.google.com/g/2005#mobile'});
      });

      // Construct contact object with name and mobile phone number
      // There may be multiple phone numbers marked as mobile in Google Contacts,
      // but this will only retrieve the first mobile number found
      var googleContactsCleansed = _.map(googleContacts, function(contact) {
        var obj = {
          name: contact.title.$t,
          googleId: contact.id.$t
        };
        for (var i = 0; i < contact.gd$phoneNumber.length; i++) {
          if (contact.gd$phoneNumber[i].rel === 'http://schemas.google.com/g/2005#mobile') {
            obj.phone = contact.gd$phoneNumber[i].$t;
            break;
          }
        }
        return obj;
      });

      Contacts.addContact({contacts: googleContactsCleansed})
        .success(function(data) {
          $scope.newContacts = data;
          $scope.loading = false;
        })
        .error(function(data) {
          $scope.loading = false;
        });
    });
  };

  $scope.addNewContact = function() {
    $scope.loading = true;
    Contacts.addContact({contacts: [{
      name: $scope.name,
      phone: $scope.phone
    }]})
    .success(function(data) {
      $scope.name = '';
      $scope.phone = '';
      $scope.newContacts = data;
      $scope.loading = false;
    })
    .error(function(data) {
      $scope.loading = false;
    });
  };

  $scope.removeContact = function(contact, index) {
    //$scope.loading = true;
    // Contacts.removeContact(contact)
    // .then(function(){

    // });
    console.log(contact);
   $scope.contacts.splice(index,1);


  };

}]);
