app.directive("chatModalWindow", function(socket) {
  return {
    restrict: 'E',
    templateUrl: '/directives/templates/chatModalWindowDirective.html',
    replace: true,
    scope: {
      conversation: '=conversation',
      index: '=index',
      user: '=user'
    },
    //DOM Manipulation
    link: function(scope, elements, attrs) {
      $('.modal').modal();
      scope.$root.$on('chatModalWindowOpen', function() {
        $('#chatModalWindow').modal('open');
      });
      scope.$root.$on('chatModalWindowClose', function() {
        $('#chatModalWindow').modal('close');
      });

      scope.searchContacts = '';
      scope.step = 0;
      scope.newMessage = '';
      scope.selectedConversationIdx = 0;
      scope.selectedConversation = {
        user:''
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
      scope.selectConversation = function(conversation) {
        scope.step = 2;
        scope.selectedConversationIdx = scope.user.messages.indexOf(conversation);
        scope.selectedConversation = conversation;
        for (var i = 0; i < scope.user.messages[scope.selectedConversationIdx].messages.length; i++) {
          scope.user.messages[scope.selectedConversationIdx].messages[i].seen = true;
        };
      };
      /*
      * Specific buttons and functionality to modals
      */
      scope.mes = function() {
        scope.$root.$broadcast('mes');
      };
      /***********************************************************************************************/
        scope.$watch('conversation', function(value) {
          if (!value) return;
          console.log(value);
          if (value.user != '') {
            scope.step = 2;
            scope.selectedConversation = value;
            scope.selectedConversationIdx = scope.user.messages.indexOf(value);
            for (var i = 0; i < scope.user.messages[scope.selectedConversationIdx].messages.length; i++) {
              scope.user.messages[scope.selectedConversationIdx].messages[i].seen = true;
            };
          };
        }); 
        scope.$watch('user', function(value) {
          if (!value) return;
           scope.user = value;
        }); 
      	
    }
  };
});