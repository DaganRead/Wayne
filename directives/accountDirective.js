app.directive("account", function(socket, upload, ms, $timeout, $document, $location) {
  return {
    restrict: 'E',
    replace:true,
    templateUrl: '/directives/templates/accountDirective.html',
    scope: false,
    link: function(scope, elements, attrs) {  
      socket.on('restricted', 'recieve profileUpdated',function(fileName) {
          console.log("profile account updated successfully");
          //scope.profileUpdated = true;
      });
      
      scope.submit = function() {
        var data = scope.user;
        data['token'] = localStorage["token"];
        console.log('data');
          socket.emit('restricted', 'request accountUpdate',data);
          localStorage["userData"] = JSON.stringify(scope.user);
          scope.user = data;
      };
    }
  };
});