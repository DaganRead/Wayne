app.directive("chatMessenger", function(socket) {
  return {
    restrict: 'E',
    templateUrl: '/directives/templates/chatMessengerDirective.html',
    replace: true,
    scope: false,
    //DOM Manipulation
    link: function(scope, elements, attrs) {
      /*scope.user = localStorage['userData'];*/
      scope.avatar = '';
      scope.otherAvatar = '';
      scope.newMessage = '';
      scope.selectedConversation = {
        user:false
      };
      scope.selectedConversationIdx = 0;

      scope.$root.$on('chatOpen', function() {
        elements.find('section').prevObject[0].classList.add("cm-show");
      });
      scope.exploreProfile = function(otherUser) {
        scope.$root.$broadcast('navOther', otherUser);
        elements.find('section').prevObject[0].classList.remove("cm-show");
      };
    	scope.sendMessage = function() {
        var data = {
          body : scope.newMessage,
          to: scope.selectedConversation.user,
          from: scope.user.username,
          timestamp : moment(),
          seen:false
        };
        console.log(data);
        scope.user.messages[scope.selectedConversationIdx].messages.push(data);
        socket.emit('restricted', 'request sendMessage', data);
        localStorage['userData'] = JSON.stringify(scope.user);
        scope.newMessage = '';
      };
      scope.chatClose = function() {
        elements.find('section').prevObject[0].classList.remove("cm-show");
      };
      scope.updateMessageBox = function(conversation) {
        scope.selectedConversationIdx = scope.user.messages.indexOf(conversation);
        scope.selectedConversation = conversation;
        for (var i = 0; i < scope.user.messages[scope.selectedConversationIdx].messages.length; i++) {
          scope.user.messages[scope.selectedConversationIdx].messages[i].seen = true;
        };
      };
      	
    }
  };
});