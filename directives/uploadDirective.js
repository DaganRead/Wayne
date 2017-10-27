app.directive("upload", function(socket, upload, ms, $timeout, $document, $location) {
  return {
    restrict: 'E',
    replace:true,
    templateUrl: '/directives/templates/uploadDirective.html',
    scope: false,
    link: function(scope, elements, attrs) {  
      $('ul.tabs').tabs();
      $('.dropify').dropify();
      socket.on('restricted', 'recieve artistGalleryUpdate',function(data) {
        scope.user = data;
        localStorage['userData'] = JSON.stringify(data);
      });
      scope.showSaveBtn = false;
      scope.navChange = function () {
        scope.showSaveBtn = false;
        scope.displayError = false;
        scope.media.description = "";
        scope.media.title = "";
        scope.media.url = "";
        scope.media.file = "";
      };
      scope.media = {
        url:"",
        file:"",
        title:"",
        description:"",
        tags:[] 
      };

      scope.categories = []; 
        socket.on('public', 'recieve categories', function(data) {
            var tempArr = data.body;
            for (var i = 0; i < tempArr.length; i++) {
              var tempObj = {
                name: tempArr[i],
                ticked:false
              }
              scope.categories.push(tempObj);
            };
            console.log(scope.categories);
        });
      socket.emit('public', 'request categories'); 

      scope.uploads = [];
      socket.on('public', 'upload complete',function(event) {
          console.log("Upload Complete!");
          console.log(scope.uploads);
        for(var i=0; i<scope.uploads.length; i++){
          var uploadedFileName = event.file.name,
          files = scope.uploads[i][1]; 
          console.log(scope.uploads[i][0]);
          if(ms.unsealer(scope.uploads[i][0], uploadedFileName)){
            if (scope.uploads[i][0].username === 'image'+i) {
              //code
              scope.showSaveBtn = true;
              console.log("Upload image!");
              scope.media.url = "https://www.tunebooster.com/uploads/"+uploadedFileName;
            }else if (scope.uploads[i][0].username === 'audio'+i){
              //code
              scope.showSaveBtn = true;
              console.log("Upload audio!");
              scope.media.url = "https://www.tunebooster.com/uploads/"+uploadedFileName;
            };
          };
        };
        scope.uploads = []; 
      });

/*      document.getElementById('avatar_drop_zone3').addEventListener("drop", function(event){
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
        console.log(files);
        for(var i=0; i<files.length; i++){
          if (files[0].type !="image/png" && files[0].type !="image/jpeg") {
            scope.displayError = true;
          }else{
            scope.uploads.push([ms.sealer("image" + i, files[i].name), files]);
          };
        };
      }, false);*/

      document.getElementById('uploadImage').addEventListener("change", function(event){
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
        console.log(files);
        for(var i=0; i<files.length; i++){
          // if statements
          if (files[0].type !="image/png" && files[0].type !="image/jpeg") {
            scope.displayError = true;
          }else{
            scope.uploads.push([ms.sealer("image" + i, files[i].name), files]);
          };
        };
      }, false);

      /*document.getElementById('avatar_drop_zone4').addEventListener("drop", function(event){
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
        console.log(files);
        for(var i=0; i<files.length; i++){
          if (files[0].type !="audio/ogg" && files[0].type !="video/ogg" && files[0].type !="audio/mpeg" && files[0].type !="audio/mp3") {
            scope.displayError = true;
          }else{
            scope.uploads.push([ms.sealer("audio" + i, files[i].name), files]);
          };
        };
      }, false);*/

      document.getElementById('uploadAudio').addEventListener("change", function(event){
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
        console.log(files);
        for(var i=0; i<files.length; i++){
          if (files[0].type !="audio/ogg" && files[0].type !="video/ogg" && files[0].type !="audio/mpeg" && files[0].type !="audio/mp3") {
            scope.displayError = true;
          }else{
            scope.uploads.push([ms.sealer("audio" + i, files[i].name), files]);
          };
        };
      }, false);

      upload.listenOnInput(document.getElementById('uploadImage'));
      //upload.listenOnDrop(document.getElementById('avatar_drop_zone3'));

      upload.listenOnInput(document.getElementById('uploadAudio'));
      //upload.listenOnDrop(document.getElementById('avatar_drop_zone4'));

      scope.save = function(inputType) {
        var tempArr = [];
        for (var i = 0; i < scope.media.tags.length; i++) {
          tempArr.push(scope.media.tags[i].name);
        };
        var data = {
          token : localStorage["token"],
          item : {
            body:scope.media.url,
            username:scope.user.username,
            type: inputType,
            title:scope.media.title,
            description:scope.media.description,
            tags:tempArr,
            likes: {
               usernames: [],
               counter: 0 
            },
            buskedTotal:0,
            comments: [],
            timestamp:moment()
          }
        };
        console.log(scope.media);
        /*scope.gallery.push(data.item);*/
        socket.emit('restricted', 'request artistGalleryPush', data);
        scope.media.url="";
        scope.media.title="";
        scope.media.description="";
        scope.media.tags=[]; 
      };

        /* Transloadit start */
            var options = {
              wait: true,
              triggerUploadOnFileSelection: false,
              params: {
                auth: {
                  key: "ad2b7680b23f11e7bc5449685082b268"
                },
                steps: {
                  filter: {
                    use: ":original",
                    robot: "/file/filter",
                    accepts: [
                      [
                        "${file.mime}",
                        "regex",
                        "video"
                      ]
                    ],
                    error_on_decline: false
                  },
                  thumbnail: {
                    use: "filter",
                    robot: "/video/thumbs",
                    count: 1
                  },
                  video_webm: {
                    use: "filter",
                    robot: "/video/encode",
                    ffmpeg_stack: "v2.2.3",
                    preset: "webm",
                    width: 320,
                    height: 240
                  },
                  store: {
                    use: "video_webm",
                    robot: "/youtube/store",
                    credentials: "youtube_auth_1508490301",
                    title: "Title",
                    description: "Description",
                    category: "music",
                    keywords: "music",
                    visibility:"private",
                    result: true
                  }
                },
                fields:{
                  artist:scope.user.username,
                  token:localStorage['token'],
                  timestamp:moment()
                }
              }
            };
      $("#upload-form").transloadit(options);
      scope.saveFile = function() {
        $( "#upload-form" ).submit();
      };
      scope.saveUrl = function() {
        var options2 = {
              wait: true,
              triggerUploadOnFileSelection: false,
              params: {
                  auth: {
                    key: "ad2b7680b23f11e7bc5449685082b268"
                  },
                  steps: {
                    import: {
                      robot: '/http/import',
                      url: scope.media.url
                    },
                    store: {
                      use: "import",
                      robot: "/youtube/store",
                      credentials: "youtube_auth_1508490301",
                      title: scope.media.title,
                      description: scope.media.description,
                      category: "music",
                      keywords: "music",
                      visibility:"private"
                    }
                },
                fields:{
                  artist:scope.user.username,
                  token:localStorage['token'],
                  timestamp:moment()
                }
              }
            };
        $("#upload-form2").transloadit(options2);
        $( "#upload-form2" ).submit();
      };
      /* Transloadit end */
    }
  };
});