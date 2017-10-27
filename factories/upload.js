app.factory('upload', function ($rootScope, socket, ms) {
	var uploader = new SocketIOFileUpload(socket)
  return uploader;
});
