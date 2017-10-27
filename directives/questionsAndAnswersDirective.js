app.directive("questionsAndAnswers", function(socket) {
  return {
    restrict: 'E',
    template: '<section><cms-page bind-compiled-html="questionsAndAnswersPage.code"></cms-page><cms-footer></cms-footer></section>',
    replace: true,
    scope: {},
    //DOM Manipulation
    link: function(scope, elements, attrs) {
      scope.questionsAndAnswersPage = {
        code: ''
      };

      socket.on('public', 'recieve cms page', function(data) {
          scope.questionsAndAnswersPage.code = data.body;
      });
      socket.emit('public', 'request cms page', 'questions-and-answers'); 
    }
  };
});
