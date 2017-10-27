app.directive("topNav", function(socket, levelAuthorisation, $location, $document) {
  return {
    restrict: 'E',
    templateUrl: '/directives/templates/topNavDirective.html',
    scope: false,
    link: function(scope, elements, attrs) {
      scope.navto='profile';
      scope.selectedConversation = {
        user:''
      };
      scope.openMenu = function() {
        if (document.getElementById("messagesMenuDrop").classList.contains("messagesMenuHide")) {
          document.getElementById("messagesMenuDrop").classList.toggle("messagesMenuHide");
        };
        if (document.getElementById("notificationsMenuDrop").classList.contains("notificationsMenuHide")) {
          document.getElementById("notificationsMenuDrop").classList.toggle("notificationsMenuHide");
        };
        document.getElementById("profileMenuDrop").classList.toggle("profileMenuHide"); 
      };
      scope.openMobileMenu = function() {
        document.getElementById("slide-out").classList.toggle("mobileMenuHide"); 
      };
      scope.openMessages = function() {
        if (document.getElementById("profileMenuDrop").classList.contains("profileMenuHide")) {
          document.getElementById("profileMenuDrop").classList.toggle("profileMenuHide");
        };
        if (document.getElementById("notificationsMenuDrop").classList.contains("notificationsMenuHide")) {
          document.getElementById("notificationsMenuDrop").classList.toggle("notificationsMenuHide");
        };
        document.getElementById("messagesMenuDrop").classList.toggle("messagesMenuHide");
      };
      scope.openMessage = function(conversation) {
        scope.selectedConversation = conversation;
        scope.$root.$broadcast('chatModalWindowOpen');
      }; 
      scope.openNotifications = function() {
        if (document.getElementById("messagesMenuDrop").classList.contains("messagesMenuHide")) {
          document.getElementById("messagesMenuDrop").classList.toggle("messagesMenuHide");
        };
        if (document.getElementById("profileMenuDrop").classList.contains("profileMenuHide")) {
          document.getElementById("profileMenuDrop").classList.toggle("profileMenuHide");
        };
        document.getElementById("notificationsMenuDrop").classList.toggle("notificationsMenuHide");
      };
      scope.gotoLanding = function() {
        $location.url('/');
      };
      scope.goTo = function(selection) {
        scope.navto=selection;
      };
      scope.$root.$on('profileNav', function(event, data) {
        scope.navto=data;
      });
      scope.goToExplore = function() {
        $location.url('/explore');
      };
      scope.goToHowItWorks = function() {
        $location.url('/how-it-works');
      };
    	scope.loginModalEnterEventHandler = function() {
        console.log('loginModalWindowOpen');
        scope.$root.$broadcast('loginModalWindowOpen');
      };
      scope.buskModalEnterEventHandler = function() {
        scope.$root.$broadcast('buskModalWindowOpen');
      };
    }
  };
});

