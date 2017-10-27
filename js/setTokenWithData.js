exports.setTokenWithData = function(token, data, ttl, callback) {
    if (token == null) throw new Error('Token is null');
    if (data != null && typeof data !== 'object') throw new Error('data is not an Object');
 
    var userData = data || {};
    userData._ts = new Date();
 
    var timeToLive = ttl || auth.TIME_TO_LIVE;
    if (timeToLive != null && typeof timeToLive !== 'number') {
        throw new Error('TimeToLive is not a Number');
    }else{
        client.setex(token, JSON.stringify(userData), timeToLive,  function(error, success) {
            if (error){ 
                callback(error);
            }else if (success) {
                callback(false, true);
            };
        });
    };
 
};