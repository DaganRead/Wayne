var TOKEN_LENGTH = 32,
	crypto = require('crypto');
exports.createToken = function(callback) {
    crypto.randomBytes(TOKEN_LENGTH, function(ex, token) {
        if (ex) {
        	callback(ex);
        };
        if (token){
        	callback(null, token.toString('hex'));
        } else {
        	callback(new Error('Problem when generating token'));
        };
    });
};