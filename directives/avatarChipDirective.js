app.directive("avatarChip", function(socket) {
  return {
    restrict: 'E',
    template: '<div class="chip"><img src="{{ avatar }}" alt="{{ requestedUsername }}">{{ requestedUsername }}</div>',
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
    }
  };
});