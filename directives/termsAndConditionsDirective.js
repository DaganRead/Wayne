app.directive("termsAndConditions", function(socket) {
  return {
    restrict: 'E',
    template: '<section><cms-page bind-compiled-html="termsAndConditionsPage.code"></cms-page><cms-footer></cms-footer></section>',
    replace: true,
    scope: {},
    //DOM Manipulation
    link: function(scope, elements, attrs) {
      scope.termsAndConditionsPage = {
        code: ''
      };

      socket.on('public', 'recieve cms page', function(data) {
        console.log(data);
          scope.termsAndConditionsPage.code = data.body;
      });
      socket.emit('public', 'request cms page', 'terms-and-conditions'); 
    }
  };
});