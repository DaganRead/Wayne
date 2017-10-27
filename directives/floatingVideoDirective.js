app.directive("floatingVideo", function(socket, $sce) {
  return {
    restrict: 'E',
    templateUrl: '/directives/templates/floatingVideoDirective.html',
    replace: true,
    scope: false,
    //DOM Manipulation
    link: function(scope, elements, attrs) {
      scope.currentUrl = '';
      scope.artistUsername = "";
      scope.minimized = false;
      scope.showFloatingVideo = false;

      scope.$root.$on('floatVid', function(event, data) {
        scope.showFloatingVideo = true;
        scope.currentUrl = $sce.trustAsResourceUrl(data.url);
        scope.$root.$emit('floatingVidUpdate', data.username);
        elements.find('iframe').prevObject[0].classList.add("fv-show");
          scope.minimized = true;
      });
      scope.exploreProfile = function(otherUser) {
        scope.$root.$broadcast('navOther', otherUser);
      };
      scope.busk = function($event, username) {
        var audioElem = $($event.target).next()[0];
        audioElem.play();
        scope.$root.$broadcast('buskModalWindowOpen', username);
      };
      scope.buskAnim = function ($event) {
        $event.target.src.includes('buskOpen')? $event.target.src='../images/buskClosed.png': $event.target.src='../images/buskOpen.png';
      };
      scope.minimize = function() {
        console.log('minimized');
        if (scope.minimized == false) {
          elements.find('iframe').prevObject[0].classList.add("fv-show");
          scope.minimized = true;
        } else{ 
          elements.find('iframe').prevObject[0].classList.remove("fv-show");
          scope.minimized = false;
        }; 
      };
/*      var youtubePlayer;
var isYoutubePlayerReady = false;

function onYouTubeIframeAPIReady()
{
  youtubePlayer = new YT.Player('youtube1',
  {
    events:
    {
      'onReady': onPlayerReady
    }
  });
}

function onPlayerReady()
{
  isYoutubePlayerReady = true;
}

function playYoutubeVideo()
{
  if (isYoutubePlayerReady)
  {
    youtubePlayer.playVideo();
  }
}

function pauseYoutubeVideo()
{
  if (isYoutubePlayerReady)
  {
    youtubePlayer.pauseVideo();
  }
}

function stopYoutubeVideo()
{
  if (isYoutubePlayerReady)
  {
    youtubePlayer.stopVideo();
  }
}
//Dailymotion API 
function playDailymotionVideo()
{
  var win = document.getElementById("dailymotion1").contentWindow;
  win.postMessage('play', '*');
}

function pauseDailymotionVideo()
{
  var win = document.getElementById("dailymotion1").contentWindow;
  win.postMessage('pause', '*');
}
//Vimeo API 
var vimeoPlayer = null;
var isVimeoPlayerReady = false;

function playVimeoVideo()
{
  if (isVimeoPlayerReady)
  {
    vimeoPlayer.api('play');
  }
}

function pauseVimeoVideo()
{
  if (isVimeoPlayerReady)
  {
    vimeoPlayer.api('pause');
  }
}

function loadVimeoPlayer()
{
  vimeoPlayer = $f(document.getElementById("vimeo1"));
  vimeoPlayer.addEvent('ready', function()
  {
    isVimeoPlayerReady = true;
  });
};
window.onload = function()
{
  loadVimeoPlayer()
};*/
      	
    }
  };
});