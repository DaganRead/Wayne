app.directive("privacyPolicy", function(socket) {
  return {
    restrict: 'E',
    template: '<section><cms-page bind-compiled-html="privacyPolicyPage.code"></cms-page><cms-footer></cms-footer></section>',
    replace: true,
    scope: {},
    //DOM Manipulation
    link: function(scope, elements, attrs) {
      scope.privacyPolicyPage = {
        code: ''
      };

      socket.on('public', 'recieve cms page', function(data) {
          scope.privacyPolicyPage.code = data.body;
      });
      socket.emit('public', 'request cms page', 'privacy-policy'); 
    }
  };
});