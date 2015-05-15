angular.module('courageousTrapeze.auth', [])

.controller('AuthController', ['$scope', '$location', 'Auth', function($scope, $location, Auth) {
  $scope.user = {};
  $scope.alert = '';

  $scope.signin = function () {
    Auth.signin($scope.user)
    .success(function (data) {
      window.localStorage.setItem('courageousTrapeze', data.token);
      $location.path('/messages');
    })
    .error(function (err) {
      console.error(err);
      $scope.alert = 'Incorrect username and password combination.';
    });
  };

  $scope.signup = function () {
    Auth.signup($scope.user)
    .success(function (data) {
      window.localStorage.setItem('courageousTrapeze', data.token);
      $location.path('/messages');
    })
    .error(function (err) {
      console.error(err);
      $scope.alert = 'User already exists. Please select a different username.';
    });
  };

  $scope.signout = function () {
    Auth.signout();
  };

  $scope.isAuth = function () {
    return Auth.isAuth();
  };

}]);
