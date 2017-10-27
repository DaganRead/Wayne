app.directive("cmsPage", function($compile, $timeout, $location) {
  return {
  	// required to make it work as an element
    restrict: 'E',
    // replace <modalWindow> with this html
    template: '<cmsPage><cms-content></cms-content></cmsPage>',
    replace: true,
    scope: {
      rawHtml: '=bindCompiledHtml',
      use: '=use'
    },
    //DOM Manipulation
    link: function(scope, elements, attrs) {
      	scope.$watch('rawHtml', function(value) {
        	if (!value) return;
			     var newElem = $compile(value)(scope.$parent);
        	elements.find('cms-content').html(newElem);
      	}); 
      	
    }
  };
});