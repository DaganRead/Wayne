app.directive("profileFan", function(socket, upload, ms, $timeout, $document, $location) {
  return {
    restrict: 'E',
    replace:true,
    templateUrl: '/directives/templates/profileFanDirective.html',
    scope: false,
    link: function(scope, elements, attrs) {
      scope.currentMusicPref = [];
      scope.newMusicPref = [];
        socket.on('public', 'recieve categories', function(data) {
            var tempArr = data.body;
            console.log('data body raw');
            console.log(tempArr);
            console.log('catagories');
            console.log(scope.currentMusicPref);
            if(scope.currentMusicPref.length == 0){
              for (var i = 0; i < tempArr.length; i++) {
                var tempObj = {
                  name: tempArr[i],
                  ticked:false
                };
                if (scope.currentMusicPref.indexOf(tempObj) == -1) {
                  for (var ii = 0; ii < scope.user.musicPref.length; ii++) {
                    if (scope.user.musicPref[ii].name == tempObj.name ){
                      tempObj.ticked = scope.user.musicPref[ii].ticked
                    };
                  };
                  scope.currentMusicPref.push(tempObj);
                };
              };
            };
            console.log(scope.currentMusicPref);
            //catagories for originals. User musicPref for currently sellected. Input model is a combination of both output model is newMusicPref.
        });
      socket.emit('public', 'request categories'); 

      scope.uploads = [];
        socket.on('public', 'upload complete',function(event) {
        for(var i=0; i<scope.uploads.length; i++){
          var uploadedFileName = event.file.name,
          files = scope.uploads[i][1]; 
          console.log(scope.uploads[i][0].username);
          if(ms.unsealer(scope.uploads[i][0], uploadedFileName)){
            if (scope.uploads[i][0].username === 'avatar'+i) {
              //scope.$root.$broadcast('profileModalWindowSwap');
              $timeout(function() {scope.$root.$broadcast('crop avatar', files);}, 300);
            };
          };
        };
        scope.uploads = []; 
      });
      socket.on('restricted', 'recieve avatarSaved',function(fileName) {
        scope.user.avatar = fileName;
        scope.$root.$broadcast('avatarCropModalWindowClose');
        localStorage['userData'] = JSON.stringify(scope.user);
      });


      document.getElementById('avatar_drop_zone').addEventListener("drop", function(event){
        event.preventDefault();
        if ('dataTransfer' in event) {
          var files = event.dataTransfer.files;
        } else if('originalTarget' in event){
          var files = event.originalTarget.files;
        }else if('target' in event){
          var files = event.target.files;
        }else{
          var files = event.files;
        };
        for(var i=0; i<files.length; i++){
          scope.uploads.push([ms.sealer("avatar" + i, files[i].name), files]);
          console.log(scope.uploads);
        };
      }, false);
      document.getElementById('avatar_change').addEventListener("change", function(event){
        event.preventDefault();
        if ('dataTransfer' in event) {
          var files = event.dataTransfer.files;
        } else if('originalTarget' in event){
          var files = event.originalTarget.files;
        }else if('target' in event){
          var files = event.target.files;
        }else{
          var files = event.files;
        };
        for(var i=0; i<files.length; i++){
          scope.uploads.push([ms.sealer("avatar" + i, files[i].name), files]);
          console.log('scope.upload');
          console.log(files);
        };
      }, false);

      upload.listenOnInput(document.getElementById('avatar_change'));
      upload.listenOnDrop(document.getElementById('avatar_drop_zone'));
      
      scope.submit = function() {
        console.log('Save user profileFan');
        scope.user.musicPref = scope.newMusicPref;
        var data = scope.user;
        data['token'] = localStorage["token"];
        console.log(data);
          socket.emit('restricted', 'request profileUpdate',data);
          localStorage["userData"] = JSON.stringify(scope.user);
      };

    }
  };
});