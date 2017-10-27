app.directive("imageResize", [
  "$parse", function($parse) {
    scope:false,
    return {
      link: function(scope, elm, attrs, socket) {
        var imagePercent;
        imagePercent = $parse(attrs.imagePercent)(scope);
        elm.bind("load", function(e) {
          elm.unbind("load"); //Hack to ensure load is called only once
          var canvas, ctx, neededHeight, neededWidth;
          neededHeight = 1200/elm[0].naturalWidth * elm[0].naturalHeight;
          neededWidth = 1200;
          canvas = document.createElement("canvas");
          canvas.width = neededWidth;
          canvas.height = neededHeight;
          ctx = canvas.getContext("2d");
          ctx.drawImage(elm[0], 0, 0, neededWidth, neededHeight);
          elm.attr('src', canvas.toDataURL("image/jpeg"));
          scope.largeImage = canvas.toDataURL("image/jpeg");
        });
      }
    };
  }
]); 