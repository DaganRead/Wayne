app.directive("wallFan", function(socket, upload, ms, $timeout, $document, $location) {
  return {
    restrict: 'E',
    replace:true,
    templateUrl: '/directives/templates/wallFanDirective.html',
    scope: false,
    link: function(scope, elements, attrs) {
      scope.wallLoaded=false;
      console.log("get fan wall");
      socket.emit('restricted', 'get:fanWall', localStorage["token"]);

      socket.on('restricted', 'recieve fanWall',function(data) {
        console.log(data);
        scope.user.wall = data;
        scope.wallLoaded=true;
      });

      scope.fanWallLike = function($event, postObj) {
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

      scope.fanWallCommentPost = function($event, postObj) {
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

      scope.fanWallTrash = function(postObj) {
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
      
    }
  };
});