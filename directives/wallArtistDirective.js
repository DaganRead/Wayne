app.directive("wallArtist", function(socket, upload, ms, $timeout, $document, $location) {
  return {
    restrict: 'E',
    replace:true,
    templateUrl: '/directives/templates/wallArtistDirective.html',
    scope: false,
    link: function(scope, elements, attrs) {
      scope.newWallPost ='';
      scope.wallLoaded=false;

      socket.emit('restricted', 'get:artistWall', localStorage["token"]);

      socket.on('restricted', 'recieve artistWall',function(data) {
        scope.user.wall = data;
        scope.wallLoaded=true;
      });

      scope.artistWallPost = function() {
        var newWallPost = {
            username : scope.user.username,
            body : scope.newWallPost,
            comments:[],
            timestamp:moment().format("MMM Do YY"),
            likes:{
              usernames: [],
              counter : 0
            }
          };
        scope.user.wall.push(newWallPost);
        var data = {
          token : localStorage["token"],
          wallPost : newWallPost
        };
        socket.emit('restricted', 'request artistWallPush',data);
        scope.user.wall.post="";
        localStorage['userData'] = JSON.stringify(scope.user);
      };
      scope.artistWallLike = function($event, postObj) {
          var data = {
            typeOf:'like',
            token : localStorage["token"],
            wallPostIdx : scope.user.wall.indexOf(postObj)
          };
        if (scope.user.wall[data.wallPostIdx].likes.usernames.indexOf(scope.user.username) == -1) {
          scope.user.wall[data.wallPostIdx].likes.usernames.push(scope.user.username);
          scope.user.wall[data.wallPostIdx].likes.counter += 1;
          data.wallPost = scope.user.wall[data.wallPostIdx];
          if(postObj.$$hashKey != undefined){
              delete postObj.$$hashKey
          };
          socket.emit('restricted', 'request profileWallUpdateSet', data);
          localStorage['userData'] = JSON.stringify(scope.user);
        };
      };
      scope.artistWallTrash = function(postObj) {
        var data = {
            typeOf:'trash',
            token : localStorage["token"],
            wallPostIdx : scope.user.wall.indexOf(postObj),
            wallPost : scope.user.wall[scope.user.wall.indexOf(postObj)]
          };
        scope.user.wall.splice(data.wallPostIdx, 1);
        if(postObj.$$hashKey != undefined){
              delete postObj.$$hashKey
          };
        socket.emit('restricted', 'request profileWallUpdateSet', data);
        localStorage['userData'] = JSON.stringify(scope.user);
      };

      scope.artistWallCommentPost = function($event, postObj) {
        var target = $event.currentTarget.parentElement.previousElementSibling.children[0];
        target = angular.element(target)[0];  
        console.log(target.value);
        /*angular.element( $event.currentTarget )*/
        var data = {
            token : localStorage["token"],
            comment : {
              username:scope.user.username,
              timestamp:moment().format("MMM Do YY"),
              body:target.value
            }
          };
          if (scope.user.wall[scope.user.wall.indexOf(postObj)].comments.indexOf(data.comment) == -1) {
            scope.user.wall[scope.user.wall.indexOf(postObj)].comments.push(data.comment);
          };
        data.wallPost = scope.user.wall[scope.user.wall.indexOf(postObj)];
        delete postObj.$$hashKey;
        socket.emit('restricted', 'request profileWallComment', data);
        localStorage['userData'] = JSON.stringify(scope.user);
        target.value = "";
        scope.newWallPost ='';
      };
    }
  };
});