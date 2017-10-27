exports.expireToken = function(headers, callback) {
    if (headers == null) {
        callback(new Error('Headers are null'));
    };
    // Get token
    try {
        var token = tokenHelper.extractTokenFromHeader(headers);
 
        if (token == null) callback(new Error('Token is null'));
 
        redisHelper.expireToken(token, callback);
    } catch (err) {
        console.log(err);
        return callback(err);
    }
};