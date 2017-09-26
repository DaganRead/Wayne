/*
  BARCODE SCANNER
*/
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
      };
function onDeviceReady() {
    document.getElementById('scanBarCode').addEventListener("click", function() {
        cordova.plugins.barcodeScanner.scan(onScanSuccess, onScanError, options);

    }, false);
};

document.addEventListener("deviceready", onDeviceReady, false);