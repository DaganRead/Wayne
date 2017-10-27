app.factory('authService', function($http, $q, socket) {
    //    Create a class that represents our name service.
    function authService() {    
        //    login returns a promise which when fulfilled returns the name.
        this.login = function(data, config) {
            //    Create a deferred operation.
            var deferred = $q.defer();
            //    Post the credentials to the server.
            $http.post('/login', data, config)
            .success(function() {
                deferred.resolve();
            })
            .error(function() {
                deferred.reject();
            });       
            //    Now return the promise.
            return deferred.promise;
        };
    }
    
    return new authService();
});