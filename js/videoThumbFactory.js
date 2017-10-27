angular.module('videoThumb').factory('$videoThumb', ['$http', '$q', '$sce', function($http, $q, $sce) {
  return {
    getYoutube : function (url) {
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
    },
    getVimeo : function (url) {
      var videoId = url.split('/'),
          thumbnail = ''
          deferred = $q.defer();
      $http.jsonp('http://www.vimeo.com/api/v2/video/' + videoId[3] + '.json?callback=JSON_CALLBACK').success(function(data) {
        var thumbs = [];
        thumbs.push(data[0]['thumbnail_large']);
        deferred.resolve(data[0]['thumbnail_large']);
      });
      return deferred.promise;
    },
    youtubeId : function (url) {
      var videoId = url.split('v='),
          amperPosition = videoId.indexOf('&'),
          thumb = 'no thumbnail';
      if (amperPosition != -1) {
        videoId = videoId.substring(0, amperPosition);
      } else {
        videoId = videoId[1];
      }
      return videoId;
    },
    vimeoId : function (url) {
      var videoId = url.split('/');
      return videoId[3];
    },
    youtubeEmbed : function (url) {
      var videoId = url.split('v='),
          amperPosition = videoId.indexOf('&'),
          thumb = 'no thumbnail';
      if (amperPosition != -1) {
        videoId = videoId.substring(0, amperPosition);
      } else {
        videoId = videoId[1];
      }
      return $sce.trustAsResourceUrl('https://www.youtube.com/embed/' + videoId);
    },
    vimeoEmbed : function (url) {
      var videoId = url.split('/')[3];
      return $sce.trustAsResourceUrl('https://player.vimeo.com/video/' + videoId);
    }
  }
}]);
