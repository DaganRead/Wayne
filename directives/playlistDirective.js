app.directive("playlist", function(socket, upload, ms, $timeout, $document, $location) {
  return {
    restrict: 'E',
    replace:true,
    templateUrl: '/directives/templates/playlistDirective.html',
    scope: false,
    link: function(scope, elements, attrs) {
      scope.playlist=[];
      scope.playListLoaded=[];
      socket.emit('restricted', 'request get:playlist', localStorage["token"]);

      socket.on('restricted', 'recieve fanPlayList',function(data) {
        console.log('recieve fan playlist');
        console.log(data);
        scope.playlist = data;
        scope.playListLoaded=true;
      });
      scope.playlistCommentBody = "";
      scope.playlistRemove = function(playlistObj) {
        if(playlistObj.$$hashKey != undefined){
          delete playlistObj.$$hashKey;
        };
        scope.playlist.splice(scope.playlist.indexOf(playlistObj), 1);
        var data = {
          token : localStorage["token"],
          playlist : scope.playlist
        };
        socket.emit('restricted', 'request playlistUpdate', data);
      };
      scope.playlistLike = function(playlistObj) {
        if(playlistObj.$$hashKey != undefined){
          delete playlistObj.$$hashKey;
        };
        scope.playlist.splice(scope.playlist.indexOf(playlistObj), 1);
        var data = {
          token : localStorage["token"],
          playlist : scope.playlist
        };
        socket.emit('restricted', 'request playlistUpdate', data);
      };
      scope.getThumbUrl = function(url) {
        var videoId = url.split('v='),
            amperPosition = videoId.indexOf('&'),
            thumb = 'no thumbnail';
        if (amperPosition != -1) {
          videoId = videoId.substring(0, amperPosition);
        } else {
          videoId = videoId[1];
        }
        if (videoId) {
          thumb = 'http://img.youtube.com/vi/' + videoId + '/hqdefault.jpg';
        }
        return thumb;
      };
      scope.videoSelected = function(url) {
        scope.$root.$emit('floatVid', url);
      };
      scope.playlistComment = function($event) {
        $($event.target).parent().next()[0].style.display = "block";
      };
      scope.playlistCommentPost = function($event) {
        $($event.target).parent()[0].style.display = "none";
      };
      scope.busk = function(data) {
        console.log('openBusk');
        scope.$root.$broadcast('buskModalWindowOpen', data);
      };
    }
  };
});