/*GEOLOCATION*/
    var onLocationSuccess = function(position) {
        alert('Latitude: '          + position.coords.latitude          + '\n' +
              'Longitude: '         + position.coords.longitude         + '\n' +
              'Altitude: '          + position.coords.altitude          + '\n' +
              'Accuracy: '          + position.coords.accuracy          + '\n' +
              'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
              'Heading: '           + position.coords.heading           + '\n' +
              'Speed: '             + position.coords.speed             + '\n' +
              'Timestamp: '         + position.timestamp                + '\n');
    },
    onLocationError = function(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    };

document.addEventListener("deviceready", function() {
    document.getElementById('findMe').addEventListener("click", function() {
        /*navigator.geolocation.getCurrentPosition(onSuccess, onError, { timeout: 30000, enableHighAccuracy: true });*/
        navigator.geolocation.getCurrentPosition(onLocationSuccess, onLocationError);
    }, false);
}, false);