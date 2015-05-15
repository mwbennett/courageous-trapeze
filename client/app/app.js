angular.module('courageousTrapeze', [
  'courageousTrapeze.factories',
  'courageousTrapeze.contacts',
  'courageousTrapeze.schedule',
  'courageousTrapeze.messages',
  'courageousTrapeze.auth',
  'courageousTrapeze.filters',
  'ngRoute'
])

// see: https://docs.angularjs.org/api/ngRoute/provider/$routeProvider
.config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
  $routeProvider
    .when('/signin', {
      templateUrl: 'app/auth/signin.html',
      controller: 'AuthController'
    })
    .when('/signup', {
      templateUrl: 'app/auth/signup.html',
      controller: 'AuthController'
    })
    .when('/contacts', {
      templateUrl: 'app/contacts/contacts.html',
      controller: 'ContactsController',
      authenticate: true
    })
    .when('/add-contact', {
      templateUrl: 'app/contacts/add-contact.html',
      controller: 'ContactsController',
      authenticate: true
    })
    .when('/schedule', {
      templateUrl: 'app/schedule/schedule.html',
      controller: 'ScheduleController',
      authenticate: true
    })
    .when('/messages', {
      templateUrl: 'app/messages/messages.html',
      controller: 'MessagesController',
      authenticate: true
    })
    .when('/', {
      templateUrl: 'app/index.html',
      controller: 'IndexController'
    })
    .otherwise({
      redirectTo: '/messages'
    });

  // Add $httpInterceptor into the array of interceptors.
  $httpProvider.interceptors.push('AttachTokens');
}])

.controller('IndexController', function () {
  // Intentionally left blank
})
.run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {
  // add a listener for before a route changes that will check
  // if the intended route requires authentication, 
  // check for a token in localStorage and send that token to the server
  // to verify if it is a real user and the token hasn't expired
  // if it's not valid, then redirect to /
  $rootScope.$on('$routeChangeStart', function (evt, next) {
    if (next.$$route && next.$$route.authenticate && !Auth.isAuth()) {
      $location.path('/');
    }
  });
}]);
