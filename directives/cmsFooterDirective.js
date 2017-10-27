app.directive("cmsFooter", function(socket, levelAuthorisation, $location) {
  return {
    restrict: 'E',
    replace:true,
    templateUrl: '/directives/templates/cmsFooterDirective.html',
    scope: {},
    link: function(scope, elements, attrs) {
		scope.goTo = function(selection) {
	    	scope.$root.$broadcast('profileNav', selection);
	    };
    }
  };
});

