angular.module('courageousTrapeze.factories', [])
.factory('AttachTokens', ['$window', function ($window) {
  // this is an $httpInterceptor
  // its job is to stop all out going request
  // then look in localStorage and find the user's token
  // then add it to the header so the server can validate the request
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('courageousTrapeze');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      return object;
    }
  };
  return attach;
}])

.factory('Auth', ['$http', '$location', '$window', function ($http, $location, $window) {
  // this is responsible for authenticating the user
  // by exchanging the user's username and password
  // for a JWT from the server
  // that JWT is then stored in localStorage as 'courageousTrapeze'
  var signin = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signin',
      data: user
    });
  };

  var signup = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signup',
      data: user
    });
  };

  var isAuth = function () {
    return !!$window.localStorage.getItem('courageousTrapeze');
  };

  var signout = function () {
    $window.localStorage.removeItem('courageousTrapeze');
    $location.path('/signin');
  };

  return {
    signin: signin,
    signup: signup,
    isAuth: isAuth,
    signout: signout
  };
}])

.factory('Contacts', ['$window', '$http', function ($window, $http) {
  var apiKey = 'AIzaSyAV41kUUlEkX76SX5rCvqBjnYBFps5NTVU';
  var clientId = '268795846253-ki9ir03vivk01jnvgheuhpbr78bguen8.apps.googleusercontent.com';
  var scope = 'https://www.google.com/m8/feeds';
  var myContactsGroupId;
  var _contacts = [];

  var getAll = function () {
    return _contacts;
  };

  var setContacts = function (contacts) {
    _contacts = contacts;
  };
  
  var getGoogleMyContactsGroup = function (authResult) {
    return new Promise(function(resolve, reject) {
      $http.jsonp(scope + '/groups/default/full', {
        params: {
          alt: 'json-in-script',
          access_token: authResult.access_token,
          callback: 'JSON_CALLBACK',
          'max-results': 500,
          showdeleted: false,
          v: '3.0'
        }
      })
      .success(function (data) {
        angular.forEach(data.feed.entry, function(group) {
          if (group.gContact$systemGroup && group.gContact$systemGroup.id.toLowerCase() === 'contacts') {
            myContactsGroupId = group.id.$t;
          }
        });
        resolve(authResult);
      })
      .error(function (error) {
        console.error(error);
        reject(error);
      });
    });
  };

  var getGoogleMyContacts = function(authResult) {
    return new Promise(function (resolve, reject) {
      $http.jsonp(scope + '/contacts/default/full', {
        params: {
          alt: 'json-in-script',
          access_token: authResult.access_token,
          callback: 'JSON_CALLBACK',
          group: myContactsGroupId,
          'max-results': 1000,
          orderby: 'lastmodified',
          showdeleted: false,
          sortorder: 'descending',
          v: '3.0'
        }
      })
      .success(function(data) {
        resolve(data.feed.entry);
      })
      .error(function(data) {
        reject(data);
      });
    });
  };

  var getGoogleAuth = function () {
    return new Promise(function (resolve, reject) {
      $window.gapi.client.setApiKey(apiKey);
      $window.gapi.auth.authorize({client_id: clientId, scope: scope, immediate: false}, function (authResult) {
        if (authResult && !authResult.error) {
          resolve(authResult);
        } else {
          reject();
        }
      });
    });
  };

  var importFromGoogle = function() {
    return new Promise(function (resolve, reject) {
      getGoogleAuth().then(getGoogleMyContactsGroup).then(getGoogleMyContacts).then(function (contacts) {
        console.log('Results from Google', contacts);
        resolve(contacts);
      }).catch(function (error) {
        reject(error);
      });
    });
  };

  var fetch = function () {
    return $http({
      method: 'GET',
      url: '/api/contacts'
    })
    .then(function (response) {
      setContacts(response.data);
      return getAll();
    });
  };

  var addContact = function (contacts) {
    return $http({
      method: 'POST',
      url: '/api/contacts',
      headers: {'Content-Type': 'application/json'},
      data: contacts,
      responseType: 'json'
    }).success(function (data) {
      if (data) {
        data.forEach(function (contact) {
          _contacts.push(contact);
        });
      }
      return data;
    }).error(function (data) {
      console.error('addContact failed', data);
    });
  };

  var removeContact = function(contact){
    return $http({
      method: 'DELETE',
      url: '/api/contacts',
      headers: {'Content-Type': 'application/json'},
      data: contact,
      responseType: 'json'
    }).success(function(result) {
      if(result) {
        console.log('DATA TO REMOVE');
        //remove specific contact in array 
        //delete _contacts[_contacts.indexOf(data)];  //Does indexOf work for json object?
      }
    }).error(function(result) {
      console.error("couldn't remove contact", result);
    });
  };

  return {
    importFromGoogle: importFromGoogle,
    fetch: fetch,
    getAll: getAll,
    setContacts: setContacts,
    addContact: addContact,
    removeContact: removeContact
  };
}])

.factory('Messages', ['$http', function ($http) {
  var fetch = function () {
    return $http({
      method: 'GET',
      url: '/api/messages'
    })
    .then(function (response) {
      return response.data;
    });
  };

  var addMessage = function (message) {
    return $http({
      method: 'POST',
      url: '/api/messages',
      data: message
    }).success(function (response) {
      console.log(response);
    }).error(function (response) {
      console.error('addMessage failed', response);
    });
    // .then(function (response) {
    //   console.log(response.data);
    // });
  };

  return {
    fetch: fetch,
    addMessage: addMessage
  };
}]);
