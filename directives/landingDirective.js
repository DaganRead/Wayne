app.directive("landing", function($compile) {
  return {
    // required to make it work as an element
    restrict: 'E',
    // replace <modalWindow> with this html
    template: '<section></section>',
    replace: true,
    scope: {
      rawHtml: '=bindCompiledHtml'
    },
    //DOM Manipulation
    link: function(scope, elements, attrs) {

        scope.$watch('rawHtml', function(value) {
            if (!value) return;
            var newElem = $compile(value)(scope.$parent);
            elements.find('section').html(newElem);
        });         
    }
  };
});

