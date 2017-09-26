var options = {
          preferFrontCamera : false,
          showFlipCameraButton : true,
          showTorchButton : true,
          torchOn: false,
          saveHistory: false,
          prompt : "Place a barcode inside the scan area",
          resultDisplayDuration: 500,
          formats : "all",
          orientation : "landscape",
          disableAnimations : true,
          disableSuccessBeep: false
      },
      onScanSuccess = function (result) {
          alert("We got a barcode\n" +
                "Result: " + result.text + "\n" +
                "Format: " + result.format + "\n" +
                "Cancelled: " + result.cancelled);
      },
      onScanError = function (error) {
          alert("Scanning failed: " + error);
      },
      onFindSuccess = function(position) {
        alert('Latitude: '          + position.coords.latitude          + '\n' +
              'Longitude: '         + position.coords.longitude         + '\n' +
              'Altitude: '          + position.coords.altitude          + '\n' +
              'Accuracy: '          + position.coords.accuracy          + '\n' +
              'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
              'Heading: '           + position.coords.heading           + '\n' +
              'Speed: '             + position.coords.speed             + '\n' +
              'Timestamp: '         + position.timestamp                + '\n');
      },onFindError = function(error) {
          alert('code: '    + error.code    + '\n' +
                'message: ' + error.message + '\n');
      };
function onDeviceReady() {
  /*
  * Event listeners
  */
    document.getElementById('findMe').addEventListener("click", function() {
        navigator.geolocation.getCurrentPosition(onScanSuccess, onScanError, { timeout: 30000, enableHighAccuracy: true });
    }, false);

    document.getElementById('scanBarCode').addEventListener("click", function() {
        cordova.plugins.barcodeScanner.scan(onScanSuccess, onScanError, options);

    }, false);
};
document.addEventListener("deviceready", onDeviceReady, false);