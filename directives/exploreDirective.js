/*
*	Marketplace directive
*/
app.directive('explore', function(socket, $filter, $timeout){
  return {
    restrict: 'E',
    replace: true,
    templateUrl: '/directives/templates/exploreDirective.html',
    scope : false,
  	link: function(scope, element, attrs) {
      $('ul.tabs').tabs();
      /*Get random artists*/
      scope.featuredArtistSelected = {};
      scope.featuredArtistSelectedVideo = {};
      scope.featuredArtists = [];
      socket.emit('public', 'request featuredArtists');
      socket.on('public', 'recieve featuredArtists',function(data) {
        scope.featuredArtists = data;
        scope.featuredArtistSelected = data[0];
        scope.featuredArtistSelectedVideo = scope.featuredArtistSelected.gallery[0];
      });
      /*Get featured Videos*/
      scope.featuredVideos = [];
      socket.emit('public', 'request featured');
      socket.on('public', 'recieve featured',function(data) {
        scope.featuredVideos = data.body;
      });
      /*Get all videos - add pagination- */
      scope.videos = [];
      socket.emit('public', 'request videos');
      socket.on('public', 'recieve videos',function(data) {
        scope.videos = JSON.parse(data);
        console.log(scope.videos);
        scope.pagin = [];
        for (var i = 0; i < scope.numberOfPages(); i++) {
          scope.pagin.push(i);
        };
      });
      /*Get catagories menu*/
      scope.categories = [];
        socket.on('public', 'recieve categories', function(data) {
            scope.categories = data.body;
            console.log(scope.categories);
        });
      socket.emit('public', 'request categories');

      /* start pagination*/
      scope.featuredFilter = '';
      scope.currentPage = 0;
      scope.pageSize = 6;
      scope.getData = function () {
        return $filter('filter')(scope.videos, scope.featuredFilter)
      };
      scope.numberOfPages=function(){
          return Math.ceil(scope.getData().length/scope.pageSize);                
      };
      scope.filterUpdate = function (value) {
        value =='All' ? scope.featuredFilter = '' : scope.featuredFilter = value;
        scope.pagin = [];
        for (var i = 0; i < scope.numberOfPages(); i++) {
          scope.pagin.push(i);
        };
      };
      scope.pageBack = function() {
        scope.currentPage = scope.currentPage-1;
      };
      scope.pageForward = function() {
        scope.currentPage = scope.currentPage+1;
      };
      /** end pagination **/
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
        scope.$root.$emit('floatVid', data);
      };
      scope.selectFeaturedArtist = function(artist) {
        scope.featuredArtistSelected = artist;
      }
      scope.selectFeaturedArtistVideo = function(video) {
        scope.featuredArtistSelectedVideo = video;
      }
      scope.exploreProfile = function(otherUser) {
        scope.$root.$broadcast('navOther', otherUser);
      };
     
    }
  }
});