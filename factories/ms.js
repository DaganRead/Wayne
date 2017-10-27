app.factory('ms', function ($rootScope) {
    var makeSealer = function () {
        var users = [], passwords = [];

        return {
            sealer: function (username, password) {
                var i = users.length,
                    user = {username: username};
                users[i] = user;
                passwords[i] = password;
                return user;
            },
            unsealer: function (user, password) {
                return passwords[users.indexOf(user)] === password;
            }
        };
    };
    var ms = makeSealer();
    /*
    uploader.seal = function(fileGroup, fileName) {
        ms.sealer(fileGroup, fileName);
      };
      uploader.unseal = function(fileGroup, fileName) {
        return ms.unsealer(fileGroup, fileName);
      };
      */
    return ms;
});