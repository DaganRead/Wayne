exports.getDataFromToken = function(token, callback) {
    if (token == null) callback(new Error('Token is null'));
 
    redisClient.get(token, function(err, userData) {
        if (err) callback(err);
 
        if (userData != null) {
            callback(null, JSON.parse(userData));
        }else {
            callback(new Error('Token Not Found'));
        };
    });
};