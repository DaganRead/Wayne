/*
*	Marketplace directive
*/
app.directive('media', function(socket, $filter, $timeout){
  return {
    restrict: 'E',
    replace: true,
    templateUrl: '/directives/templates/mediaDirective.html',
    scope : false,
  	link: function(scope, element, attrs) {
      /* Materialize */
      $('ul.tabs').tabs();
      /************/
  		scope.filterUpdate = function (value) {
  			tagFilter = value;
  			console.log(tagFilter);
  		};
      scope.gallery=[];
      scope.galleryLoaded=false;

      socket.emit('restricted', 'request artistGallery', localStorage["token"]);

      socket.on('restricted', 'recieve artistGallery',function(data) {
        console.log(data);
        scope.gallery = data;
        scope.galleryLoaded=true;
        $('.materialboxed').materialbox();
      });
      socket.on('restricted', 'recieve artistGalleryUpdate',function(data) {
        console.log("new gallery item added");
        console.log(data);
        scope.gallery = data;
        $('.materialboxed').materialbox();
      }); 

      for (var i = 0; i < scope.user.gallery.length; i++) {
        scope.gallery.push(scope.user.gallery[i]);
      };

  		scope.playMusic = function($event) {
        var audioElem = $($event.target).next()[0];
        audioElem.paused ? audioElem.play() : audioElem.pause();
      };

      scope.galleryShare = function() {

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
      scope.galleryLike = function($event, galleryObj) {
        if (scope.gallery[scope.gallery.indexOf(galleryObj)].likes.usernames.indexOf(scope.user.username) == -1) {
          scope.gallery[scope.gallery.indexOf(galleryObj)].likes.usernames.push(scope.user.username);
          scope.gallery[scope.gallery.indexOf(galleryObj)].likes.counter += 1;
          var data = {
            token : localStorage["token"],
            gallery : scope.gallery,
            like : true
          };
          socket.emit('restricted', 'request artistGalleryUpdate', data);
        };
      };
      scope.galleryComment = function($event) {
        $($event.target).parent().next()[0].style.display = "block";
      };
      scope.galleryTrash = function(galleryObj) {
        scope.gallery.splice(scope.gallery.indexOf(galleryObj), 1);
        var data = {
          token : localStorage["token"],
          gallery : scope.gallery
        };
        socket.emit('restricted', 'request artistGalleryUpdate', data);
      };
      scope.galleryCommentPost = function($event, galleryObj) {
        var comment = {
          username:"userThatCommented",
          body:$event.currentTarget.previousElementSibling.value
        };
        $($event.target).parent()[0].style.display = "none";
        scope.gallery[scope.gallery.indexOf(galleryObj)].comments.push(comment);
        var data = {
          token : localStorage["token"],
          gallery : scope.gallery
        };
        socket.emit('restricted', 'request artistGalleryUpdate', data);
        $event.currentTarget.previousElementSibling.value = "";
      };
    }
  }
})
 