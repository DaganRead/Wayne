app.directive("avatar", function(socket) {
  return {
    restrict: 'E',
    template: '<img ng-src="{{ avatar }}" alt="{{scope.requestedUsername}}" class="circle responsive-img valign profile-post-user-image">', 
    replace: true,
    scope: {
      requestedUsername : '=person'
    },
    //DOM Manipulation
    link: function(scope, elements, attrs) {
      	scope.avatar = '';
        scope.requestedUsernameMod = scope.requestedUsername + 'Avatar';
        socket.emit('public', 'request avatar', scope.requestedUsernameMod);
        socket.on('public', 'recieve avatar',function(data) {
          if (data.username == scope.requestedUsernameMod) {
            scope.avatar = data.returnedAvatar;
          };
        });
        scope.$watch('requestedUsername', function(value) {
          if (!value) return;
            scope.requestedUsernameMod = scope.requestedUsername + 'Avatar';
            socket.emit('public', 'request avatar', scope.requestedUsernameMod);
        }); 
    }
  };
});