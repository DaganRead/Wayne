app.directive("modalWindow", function($compile, $timeout, $location, $document) {
  return {
  	// required to make it work as an element
    restrict: 'E',
    // replace <modalWindow> with this html
    template: '<div class="modal" ng-class="{\'modal-fixed-footer\':use != \'loginModalWindow\', \'modal-fixed-footer\':use != \'registerModalWindow\', \'modal-fixed-footer\':use != \'forgotResetModalWindow\'}" id="{{use}}"><div class="modal-content"><h5 class="center-align" ng-show="use != \'loginModalWindow\' && use != \'registerModalWindow\' && use != \'forgotResetModalWindow\'"></h5><div class="row"></div></div><div class="modal-footer" ng-show="use != \'loginModalWindow\' && use != \'registerModalWindow\' && use != \'forgotResetModalWindow\'" ><a ng-show="use == \'buskModalWindow\'" ng-click="busk()" class="modal-action modal-close waves-effect waves-green btn-flat">Pay with Paypal</a><a ng-show="use == \'subscriptionModalWindow\'" class="modal-action modal-close waves-effect waves-green btn-flat" ng-click="subscription()">Accept</a><a ng-show="use == \'avatarCropModalWindow\'" ng-click="cropAvatar()" class="modal-action modal-close waves-effect waves-green btn-flat ">Crop</a><a ng-show="use == \'bannerCropModalWindow\'" ng-click="cropBanner()" class="modal-action modal-close waves-effect waves-green btn-flat ">Crop</a></div></div>',
    replace: true,
    scope: {
      rawHtml: '=bindCompiledHtml',
      title: '=bindTitle',
      use: '=use'
    },
    //DOM Manipulation
    link: function(scope, elements, attrs) {
      scope.otherUser = '';
      scope.triggerHTML = '#'+scope.use;
      scope.$root.$on(scope.use+'Open', function($event, data) {
        console.log(scope.use);
        $('#'+scope.use).modal('open');
        if (data != undefined) {
          console.log(data);
          scope.otherUser = data;
          scope.$root.$broadcast('buskOtherUser', data);
        };
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
      scope.cropBanner = function() {
        scope.$root.$broadcast('cropBanner');
      };
      scope.cropAvatar = function() {
        scope.$root.$broadcast('cropAvatar');
      };
      scope.busk = function() {
        scope.$root.$broadcast('busk', scope.otherUser);
      };
      scope.subscription = function() {
        scope.$root.$broadcast('subscriptionUpdate');
      };
      /***********************************************************************************************/
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