app.factory('socket', ['$q', '$rootScope', function($q, $rootScope) {
	// We return this object to anything injecting our service
    var socketService = {};
    // Keep all pending requests here until they get responses
    var callbacks = {};
    // Create a unique callback ID to map requests to responses
    var currentCallbackId = 0;
    var socket = io.connect('/');

    socket.on('message',function(message){ 
		listener(JSON.parse(message.data));
	});

	function sendRequest(request) {
      var defer = $q.defer();
      var callbackId = getCallbackId();
      callbacks[callbackId] = {
        time: new Date(),Z
        cb:defer
      };
      request.callback_id = callbackId;
      console.log('Sending request', request);
      socket.send(JSON.stringify(request));
      return defer.promise;
    }

    function listener(messageObj) {
	    console.log("Received data from websocket: ", messageObj);
	    // If an object exists with callback_id in our callbacks object, resolve it
	    if(callbacks.hasOwnProperty(messageObj.callback_id)) {
	       onsole.log(callbacks[messageObj.callback_id]);
	      $rootScope.$apply(callbacks[messageObj.callback_id].cb.resolve(messageObj.data));
	      delete callbacks[messageObj.callbackID];
	    }else{
	     return socket;
	    };
	};
    // This creates a new callback ID for a request
    function getCallbackId() {
      currentCallbackId += 1;
      if(currentCallbackId > 10000) {
        currentCallbackId = 0;
      }
      return currentCallbackId;
    }

    // Define a "getter" for getting customer data
    socketService.getCustomers = function() {
      var request = {
        type: "get_customers"
      }
      // Storing in a variable for clarity on what sendRequest returns
      var promise = sendRequest(request); 
      return promise;
    }

    return socketService;
}]);