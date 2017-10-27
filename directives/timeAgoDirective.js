app.directive("timeAgo", function(socket) {
  return {
    restrict: 'E',
    template: '<span>{{timestampedAgo}}</span>',
    replace: true,
    scope: {
      unformattedTime : '=time'
    },
    //DOM Manipulation
    link: function(scope, elements, attrs) {
    	scope.timestampedAgo = moment(scope.unformattedTime).fromNow();
      setInterval(function() {
      	scope.timestampedAgo = moment(scope.unformattedTime).fromNow();
      }, 1000);
    }
  };
});