app.directive("friendsList", function(socket, upload, ms, $timeout, $document, $location) {
  return {
    restrict: 'E',
    replace:true,
    templateUrl: '/directives/templates/friendsListDirective.html',
    scope: false,
    link: function(scope, elements, attrs) {
      $('ul.tabs').tabs();
      scope.peopleMessage = function(personObj) {
        scope.$root.$emit('peopleMessage', personObj);
      };
      scope.peopleTrash = function(personObj) {
        if (personObj.$$hashKey != undefined) {
          delete personObj.$$hashKey;
        };
          scope.user.people.splice(scope.user.people.indexOf(personObj), 1);
          var data = {
            token:localStorage["token"],
            personObj:personObj
          };
          socket.emit('restricted', 'remove:friend', data);
          localStorage['userData'] = JSON.stringify(scope.user);
      };
      scope.exploreProfile = function(otherUser) {
        scope.$root.$broadcast('navOther', otherUser);
      };
    }
  };
});