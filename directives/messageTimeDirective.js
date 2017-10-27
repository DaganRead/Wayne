app.directive("messageTime", function() {
  return {
    restrict: 'E',
    template: '<span class="messageTime">{{time}}</span>',
    replace: true,
    scope: {
      unformattedTime : '=timestamp'
    },
    //DOM Manipulation
    link: function(scope, elements, attrs) {
      	scope.time = moment(scope.unformattedTime).fromNow();
    }
  };
});