//var io = require('socket.io-client');
app.factory('socket', function ($rootScope) {
    var public = io(window.location.hostname + '/public'),
        restricted = io(window.location.hostname + '/restricted');

    /*var public = io('localhost:8000/public'),
        restricted = io('localhost:8000/restricted'); */

  return {
    on: function (nameSpace, eventName, callback) {
        if (nameSpace !== 'restricted') {
            public.on(eventName, function () {  
                var args = arguments;
                $rootScope.$apply(function () {
                  callback.apply(public, args);
                });
            });
        } else{
            restricted.on(eventName, function () {  
                var args = arguments;
                $rootScope.$apply(function () {
                  callback.apply(restricted, args);
                });
            });
        };
    },
    emit: function (nameSpace, eventName, data, callback) {
        if (nameSpace !== 'restricted') {
            public.emit(eventName, data, function () {
            var args = arguments;
            $rootScope.$apply(function () {
              if (callback) {
                callback.apply(public, args);
              }
            });
          })
        } else{
            restricted.emit(eventName, data, function () {
            var args = arguments;
            $rootScope.$apply(function () {
              if (callback) {
                callback.apply(restricted, args);
              }
            });
          })
        };
    },
    disconnect: function(close) {
        return socket.disconnect(close);
    },
    project: function(projectId) {
      if (projectId !== undefined) {
        public['project'] = projectId;
      }else{
        return public['project'];
      }
    },
    user: function(user) {
      if (user !== undefined) {
        console.log(user);
        public['user'] = user;
      }else{
        return public['user']; 
      }
    },
    id: public.id
  };
});
