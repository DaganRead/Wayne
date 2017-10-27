var TOKEN_LENGTH = 32;
 
exports.extractTokenFromHeader = function(headers) {
    if (headers == null) throw new Error('Header is null');
    if (headers.authorization == null) throw new Error('Authorization header is null');
 
    var authorization = headers.authorization;
    var authArr = authorization.split(' ');
    if (authArr.length != 2) throw new Error('Authorization header value is not of length 2');
 
    // retrieve token
    var token = authArr[1];
    if (token.length != TOKEN_LENGTH * 2) throw new Error('Token length is not the expected one');
 
    return token;
};
 
exports.getDataByToken = function(token, callback) {
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