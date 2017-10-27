app.directive("chat", function(socket, utils, upload, ms) {
  return {
    restrict: 'E',
    templateUrl: '/directives/templates/chatDirective.html',
    scope:false,
    link: function(scope, elements, attrs) {
      var uploads=[],
          senderObj = socket.user(),
          projectObj = socket.project();

       socket.on('public', 'upload complete',function(event) {
        for(var i=0; i<uploads.length; i++){
          if(ms.unsealer(uploads[i][0], event.file.name)){
            console.log('upload complete');
            console.log(uploads[i][1][0].type);
            var msgObj = {
                projectId:projectObj,
                sender:senderObj,
                body:uploads[i][1][0].name,
                type:uploads[i][1][0].type,
                date : new Date()
              };
              console.log(msgObj);
              socket.emit('restricted', 'request chatMsg', msgObj);
            //scope.$root.$broadcast('crop portfolio', uploads[i][1]);
          };
        };
        uploads = []; 
      });
      document.getElementById('projectDropZone').addEventListener("drop", function(event){
        event.preventDefault();
        if ('dataTransfer' in event) {
          var files = event.dataTransfer.files;
        } else if('originalTarget' in event){
          var files = event.originalTarget.files;
        }else{
          var files = event.files;
        };
        for(var i=0; i<files.length; i++){
          uploads.push([ms.sealer("chat" + i, files[i].name), files]);
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
        }else{
          var files = event.files;
        };
        console.log(files);
        for(var i=0; i<files.length; i++){
          console.log(files[i].name);
          uploads.push([ms.sealer("chat" + i, files[i].name), files]);
        };
      }, false);
        upload.listenOnInput(document.getElementById('projectDrop'));
        upload.listenOnDrop(document.getElementById('projectDropZone'));

        ////////
     scope.sendChat = function () {
      var msgObj = {
            projectId:projectObj,
            sender:senderObj,
            body:scope.chatInput,
            type:"text",
            date : new Date()
          };
          console.log(msgObj);
          socket.emit('restricted', 'request chatMsg', msgObj);
          scope.chatInput = '';
     }
     socket.on('restricted', 'recieve chatMsg', function(msgObj) {
      scope.project.chat.push(msgObj);
        console.log(msgObj);
      });
    }
  };
});