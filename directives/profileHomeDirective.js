app.directive("profileHome", function(socket) {
  return {
    restrict: 'E',
    template: '<section><cms-page bind-compiled-html="profileHomePage.code"></cms-page><cms-footer></cms-footer></section>',
    replace: true,
    scope: {},
    //DOM Manipulation
    link: function(scope, elements, attrs) {
      scope.profileHomePage = {
        code: ''
      };

      socket.on('public', 'recieve cms page', function(data) {
          scope.profileHomePage.code = data.body;
      });
      socket.emit('public', 'request cms page', 'home'); 
    }
  };
});