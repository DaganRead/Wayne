var app;
function onDeviceReady() {
    app.findMe = function() {
        alert('Run');
        //navigator.geolocation.getCurrentPosition(onSuccess, onError, { timeout: 30000, enableHighAccuracy: true });
    };
    alert('Script Attch1');
};
document.addEventListener("deviceready", onDeviceReady, false);

var el = document.getElementsByTagName('input')[0];
el.addEventListener("click", app.findMe, false);

    var onSuccess = function(position) {
        alert('Latitude: '          + position.coords.latitude          + '\n' +
              'Longitude: '         + position.coords.longitude         + '\n' +
              'Altitude: '          + position.coords.altitude          + '\n' +
              'Accuracy: '          + position.coords.accuracy          + '\n' +
              'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
              'Heading: '           + position.coords.heading           + '\n' +
              'Speed: '             + position.coords.speed             + '\n' +
              'Timestamp: '         + position.timestamp                + '\n');
    };

    // onError Callback receives a PositionError object
    //
    function onError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }