app.directive("modalBuskWindow", function($compile, $timeout, $location, $document) {
  return {
  	// required to make it work as an element
    restrict: 'E',
    // replace <modalWindow> with this html
    template: '<div class="modal modal-fixed-footer" id="{{use}}"><div class="modal-content"><h5></h5><div class="row"></div></div><div class="modal-footer"><a ng-show="use == \'buskModalWindow\'" ng-click="busk()" class="modal-action modal-close waves-effect waves-green btn-flat">Busk with Paypal</a></div></div>',
    replace: true,
    scope: {
      rawHtml: '=bindCompiledHtml',
      title: '=bindTitle',
      use: '=use'
    },
    //DOM Manipulation
    link: function(scope, elements, attrs) {
      scope.triggerHTML = '#'+scope.use;
      scope.$root.$on(scope.use+'Open', function(data) {
        console.log(scope.use);
        $('#'+scope.use).modal('open');
      });

      scope.$root.$on(scope.use+'Swap', function() {
        $('#'+scope.use).modal('close');
      });

      scope.$root.$on(scope.use+'Close', function() {
        console.log('Modal close Called');
        $('#'+scope.use).modal('close');
      });

      scope.modalWindowClose = function() {
        $('#'+scope.use).modal('close');
      };

      scope.modalWindowFooter = function() {
        //elements.find('modalWindow').prevObject[0].classList.remove("md-show");
        //$('.md-overlay').css('opacity', '0');
        //$timeout(function(){$('.md-overlay').css('display', 'none');$location.path('/');},'3000' );
      };
      /*
      * Specific buttons and functionality to modals
      */
      scope.busk = function(otherUser.username) {
        scope.$root.$broadcast('busk');
      };
      /*****************************************************************************************************/
        scope.$watch('title', function(value) {
          if (!value) return;
           $(elements.find('div')[0].children[0]).html(scope.title);
        }); 
        scope.$watch('rawHtml', function(value) {
          if (!value) return;
           var newElem = $compile(value)(scope.$parent);
           $(elements.find('div')[0].children[1]).html(newElem);
           $('.modal').modal();
        }); 
      	
    }
  };
});