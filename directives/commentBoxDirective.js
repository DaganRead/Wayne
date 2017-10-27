app.directive("commentBox", function(socket, utils, upload, ms) {
  return {
    restrict: 'E',
    templateUrl: '/directives/templates/commentBoxDirective.html',
    scope:false,
    replace:true,
    link: function(scope, elements, attrs) {

      var uploads=[],
          userData = JSON.parse(localStorage['userData']),
          senderObj = socket.user();
///////////////////////////////////////////////////////////////////////
socket.on('public', 'upload complete',function(event) {
    for(var i=0; i<uploads.length; i++){
      var uploadedFileName = event.file.name,
      uploadedFile = uploads[i][1][0]; 
      //console.log(uploads[i][1]);
      //console.log(event);
      if(ms.unsealer(uploads[i][0], uploadedFileName)){
        console.log('upload complete');
        var reader = new FileReader();

        reader.onload = function (event){
          scope.$apply(function(scope){
            var canvas, ctx, neededHeight, neededWidth;
            //console.log(uploadedFile.type);
            if (uploadedFile.type === 'image/jpeg'|| uploadedFile.type === 'image/png') {
              var tempImage = new Image();
            }else if(uploadedFile.type === 'video/mp4'){
              var tempImage = document.createElement('video');
            };
            tempImage.addEventListener("load", function() {
              // execute drawImage statements here
              if (tempImage.naturalWidth < 1200) {
                neededWidth = tempImage.naturalWidth;
                neededHeight = tempImage.naturalHeight;
              }else{
                neededHeight = 1200/tempImage.naturalWidth * tempImage.naturalHeight;
                neededWidth = 1200;
              };
              canvas = document.createElement("canvas");
              canvas.width = neededWidth;
              canvas.height = neededHeight;
              ctx = canvas.getContext("2d");
               ctx.drawImage(tempImage, 0, 0, neededWidth, neededHeight);
            console.log("tempImage.src");
            //$scope.myImage = uploadEvent.target.result;
            console.log('upload complete');
              var data = {
                  msgObj : {
                  projectId:scope.portfolioProject.id,
                  sender:senderObj,
                  body:canvas.toDataURL("image/jpeg"),
                  type:uploadedFile.type,
                  date : new Date()
                },
                token:localStorage['token']
              };
              //console.log(data);
              socket.emit('restricted', 'request commentMsg', data);
              scope.portfolioProject.comments.push(data.msgObj);
              userData.projects.every(function(element, index, array) {
                  if (element.id === scope.portfolioProject.id) {
                    //console.log(element);
                    userData.projects[index].comments = scope.portfolioProject.comments;
                    return false;
                  } else{
                    return true;
                  };
              });
            localStorage['userData'] = JSON.stringify(userData);
            //
            }, false);
            if (uploadedFile.type === 'image/jpeg'|| uploadedFile.type === 'image/png') {
              tempImage.src = reader.result; 
            }else if(uploadedFile.type === 'video/mp4'){
              tempImage.src = window.URL.createObjectURL(reader.result);
            };  
                      
          });
        };
        reader.readAsDataURL(uploadedFile);
      };
    };
    uploads = []; 
  });
/////////////////////////////////////////////////////////////////////
/*       socket.on('public', 'upload complete',function(event) {
        for(var i=0; i<uploads.length; i++){
          if(ms.unsealer(uploads[i][0], event.file.name)){
            console.log('upload complete');
            console.log(uploads[i][1][0].type);
              var data = {
                  msgObj : {
                  projectId:projectObj,
                  sender:senderObj,
                  body:uploads[i][1][0].name,
                  type:uploads[i][1][0].type,
                  date : new Date()
                },
                token:localStorage['token']
              };
              console.log(data);
              socket.emit('restricted', 'request commentMsg', data);
              scope.portfolioProject.comments.push(data.msgObj);
          userData.projects.every(function(element, index, array) {
              if (element.id === projectObj) {
                console.log(element);
                userData.projects[index].comments = scope.portfolioProject.comments;
                return false;
              } else{
                return true;
              };
            });
            //scope.$root.$broadcast('crop portfolio', uploads[i][1]);
          };
        };
        uploads = []; 
      });*/
      document.getElementById('projectDropZone').addEventListener("drop", function(event){
        event.preventDefault();
        if ('dataTransfer' in event) {
          var files = event.dataTransfer.files;
        } else if('originalTarget' in event){
          var files = event.originalTarget.files;
        } else if('target' in event){
          var files = event.target.files;
        }else{
          var files = event.files;
        };
        for(var i=0; i<files.length; i++){
          uploads.push([ms.sealer("comment" + i, files[i].name), files]);
        };
      }, false);
      //3
      document.getElementById('projectDrop').addEventListener("change", function(event){
        event.preventDefault();
        console.log('projectdrop');
        if ('dataTransfer' in event) {
          var files = event.dataTransfer.files;
        } else if('originalTarget' in event){
          var files = event.originalTarget.files;
        } else if('target' in event){
          var files = event.target.files;
        }else{
          var files = event.files;
        };
        console.log(files);
        for(var i=0; i<files.length; i++){
          console.log(files[i].name);
          uploads.push([ms.sealer("comment" + i, files[i].name), files]);
        };
      }, false);
        upload.listenOnInput(document.getElementById('projectDrop'));
        upload.listenOnDrop(document.getElementById('projectDropZone'));

     scope.sendComment = function () {
      var data = {
                  msgObj : {
                  projectId:scope.portfolioProject.id,
                  sender:senderObj,
                  body:scope.commentInput,
                  type:"text",
                  date : new Date()
                },
                token:localStorage['token']
              };
              console.log(data);
              socket.emit('restricted', 'request commentMsg', data);
          scope.commentInput = '';
          scope.portfolioProject.comments.push(data.msgObj);
          userData.projects.every(function(element, index, array) {
              if (element.id === scope.portfolioProject.id) {
                console.log(element);
                userData.projects[index].comments = scope.portfolioProject.comments;
                return false;
              } else{
                return true;
              };
            });
     }
     socket.on('restricted', 'recieve commentMsg', function(msgObj) {
      scope.project.comments.push(msgObj);
        console.log(msgObj);
      });
    }
  };
});