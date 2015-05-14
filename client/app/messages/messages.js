angular.module('courageousTrapeze.messages', [])

.controller('MessagesController', ['$scope', 'Auth', 'Messages', function ($scope, Auth, Messages) {
  $scope.loading = false;
  $scope.messages = [];
  $scope.signout = Auth.signout;

  $scope.getAllMessages = function () {
    $scope.loading = true;
    Messages.fetch()
      .then(function (messages) {
        // convert emoji shortnames to images, and create an html element to render on the view 
        messages.forEach(function(message){
          message.htmlText = '<p>' + emojione.shortnameToImage(message.text) + '</p>';
        });
        $scope.messages = messages;
      })
      .catch(function (error) {
        console.error(error);
      })
      .finally(function () {
        $scope.loading = false;
      });
  };

  $scope.getAllMessages();

}])

// custom directive to render the html message on the view 
.directive("bindCompiledHtml", ['$compile', '$timeout', function ($compile, $timeout) {
  return {
    template: '<div></div>',
    scope: {
      rawHtml: '=bindCompiledHtml'
    },
    link: function(scope, elem, attrs) {
      scope.$watch('rawHtml', function(value) {
        if (!value) return;
        // we want to use the scope OUTSIDE of this directive
        // (which itself is an isolate scope).
        var newElem = $compile(value)(scope.$parent);
        elem.contents().remove();
        elem.append(newElem);
      });
    }
  };
}]);
