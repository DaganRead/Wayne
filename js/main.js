/*BARCODE SCANNER*/
var options = {
          preferFrontCamera : true, // iOS and Android 
          showFlipCameraButton : true, // iOS and Android 
          showTorchButton : true, // iOS and Android 
          torchOn: true, // Android, launch with the torch switched on (if available) 
          saveHistory: false // Android, save scan history (default false) 
          prompt : "Place a barcode inside the scan area", // Android 
          resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500 
          formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED 
          orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device 
          disableAnimations : true, // iOS 
          disableSuccessBeep: false // iOS 
      },
      onScanSuccess = function (result) {
          alert("We got a barcode\n" +
                "Result: " + result.text + "\n" +
                "Format: " + result.format + "\n" +
                "Cancelled: " + result.cancelled);
      },
      onScanError = function (error) {
          alert("Scanning failed: " + error);
      };

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
function onDeviceReady() {
    document.getElementById('findMe').addEventListener("click", function() {
        /*navigator.geolocation.getCurrentPosition(onLocationSuccess, onLocationError, { timeout: 30000, enableHighAccuracy: true });*/
        navigator.geolocation.getCurrentPosition(onLocationSuccess, onLocationError);
    }, false);
    document.getElementById('scanBarCode').addEventListener("click", function() {
        cordova.plugins.barcodeScanner.scan(onScanSuccess, onScanError);

    }, false);
};

document.addEventListener("deviceready", onDeviceReady, false);