app.directive("profileOther", function(socket, upload, ms, $timeout, $document, $location, $filter) {
  return {
    restrict: 'E',
    replace:true,
    templateUrl: '/directives/templates/profileOtherDirective.html',
    scope: false,
    link: function(scope, elements, attrs) {
      /* Materialize */
      $('ul.tabs').tabs();
      /************/
      scope.displayFriendRequest = true;
      socket.on('restricted', 'recieve artistGalleryUpdate',function(data) {
        console.log("new gallery item added");
        console.log(data);
        scope.gallery = data;
        $('.materialboxed').materialbox();
      }); 
      scope.tagFilter = '';
      scope.filterUpdate = function (value) {
        scope.tagFilter = value;
        console.log(scope.tagFilter); 
      };
      scope.buskAnim = function ($event) {
        $event.target.src.includes('buskOpen')? $event.target.src='../images/buskClosed.png': $event.target.src='../images/buskOpen.png';
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
      scope.videoSelected = function(url, username) {
        var data = {
          url:url,
          username:username
        };
        console.log(data);
        scope.$root.$emit('floatVid', data);
      };
      scope.addToPlayList = function($event, playListObj) {
        console.log("add to playlist");
        if(playListObj.$$hashKey != undefined){
            delete playListObj.$$hashKey;
        };
        console.log(scope.user.playlist);
          var data = {
            typeOf:'push:playlist',
            token : localStorage["token"],
            playlistItemIdx : scope.user.playlist.indexOf(playListObj),
            playlistItem: {
              body: playListObj.body,
              artist : playListObj.username
            }
          };
          console.log(data);
        if (data.playlistItemIdx == -1) {
          socket.emit('restricted', 'request push:playlist', data);
        };          
        console.log('data');
      };
      scope.buskProfile = function($event, data) {
        var audioElem = $($event.target).next()[0];
        audioElem.play();
        scope.$root.$broadcast('buskModalWindowOpen', data);
      };

      scope.befriend = function(otherUser) {
        console.log(scope.user.levelAuthority);
        var data = {
          to: otherUser,
          from: scope.user.username,
          levelAuthority:scope.user.levelAuthority
        };
        socket.emit('restricted', 'request friendRequest', data);
      };
      
    }
  };
});