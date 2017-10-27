exports.verify = function(req, res, next) {
    var headers = req.headers;
    if (headers == null) {
        return res.send(401);
    };
 
    // Get token
    try {
        var token = tokenHelper.extractTokenFromHeader(headers);
    } catch (err) {
        console.log(err);
        return res.send(401);
    }
 
    //Verify it in redis, set data in req._user
    redisHelper.getDataByToken(token, function(err, data) {
        if (err) {
            return res.send(401);
        }
 
        req._user = data;
 
        next();
    });
};