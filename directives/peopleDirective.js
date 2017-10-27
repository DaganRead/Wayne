app.directive("people", function(socket, upload, ms, $timeout, $document, $location) {
  return {
    restrict: 'E',
    replace:true,
    templateUrl: '/directives/templates/peopleDirective.html',
    scope: false,
    link: function(scope, elements, attrs) {
      $('ul.tabs').tabs();
      if (scope.user.levelAuthority=='artist') {
        socket.emit('restricted', 'get:people', localStorage["token"]);

        socket.on('restricted', 'recieve:people',function(data) {
          scope.user.invites = data.invites;
          scope.user.people = data.people;
        });
      } else {

      }
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
      scope.inviteAccept = function(personObj) {
        if (personObj.$$hashKey != undefined) {
          delete personObj.$$hashKey;
        };
        console.log(personObj);
        scope.user.people.push(personObj);
        scope.user.invites.splice(scope.user.invites.indexOf(personObj), 1);
          var data = {
            token:localStorage["token"],
            personObj:personObj
          };
          socket.emit('restricted', 'update:invite', data);
          localStorage['userData'] = JSON.stringify(scope.user);
      };
      scope.inviteDecline = function(personObj) {
        if (personObj.$$hashKey != undefined) {
          delete personObj.$$hashKey;
        };
          scope.user.invites.splice(scope.user.invites.indexOf(personObj), 1);
          var data = {
            token:localStorage["token"],
            people:scope.user.people,
            invites:scope.user.invites
          };
          socket.emit('restricted', 'request invitesUpdate', data);
          localStorage['userData'] = JSON.stringify(scope.user);
      };
    }
  };
});