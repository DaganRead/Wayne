app.directive("timeStamp", function(socket) {
  return {
    restrict: 'E',
    template: '<time class="media-meta" datetime="{{unformattedTime}}">{{timestampedAgo}}</time>',
    replace: true,
    scope: {
      unformattedTime : '=momenttime'
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