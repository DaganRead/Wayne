app.directive("howItWorks", function(socket) {
  return {
    restrict: 'E',
    template: '<section><cms-page bind-compiled-html="howItWorksPage.code"></cms-page><cms-footer></cms-footer></section>',
    replace: true,
    scope: {},
    //DOM Manipulation
    link: function(scope, elements, attrs) {
      scope.howItWorksPage = {
        code: ''
      };

      socket.on('public', 'recieve cms page', function(data) {
          scope.howItWorksPage.code = data.body;
      });
      socket.emit('public', 'request cms page', 'how-it-works'); 
    }
  };
});