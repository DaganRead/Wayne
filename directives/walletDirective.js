app.directive("wallet", function(socket, upload, ms, $timeout, $document, $location) {
  return {
    restrict: 'E',
    replace:true,
    templateUrl: '/directives/templates/walletDirective.html',
    scope: false,
    link: function(scope, elements, attrs) {
      /*scope.walletLoaded=false;
      scope.wallet = {
        total: 0,
        monthTotal: 0,
        limit:200,
        transactions : []
      };

      socket.emit('restricted', 'request walletTransactions', localStorage["token"]);

      socket.on('restricted', 'recieve walletTransactions',function(data) {
        console.log('Updated transactions list');
        console.log(data);
        scope.user.wallet.transactions = data;
        scope.walletLoaded=true;
      });*/

/*      var dataWallet = {
        wallet: scope.wallet,
        token: localStorage["token"]
      };
      console.log(dataWallet);*/
      //socket.emit('restricted', 'request walletUpdate', dataWallet);

      /*socket.on('restricted', 'recieve walletUpdate',function(data) {
        console.log('requested wallet data');
        console.log(data);
        scope.wallet = data;
        /*scope.galleryLoaded=true;
      });*/
      //socket.emit('restricted', 'request wallet', localStorage["token"]);
      /*socket.on('restricted', 'recieve wallet',function(data) {
          console.log("wallet updated successfully");
          scope.wallet = data;
      });*/

      scope.upgrade = function() {
        scope.$root.$emit('subscriptionModalWindowOpen');
      };
    }
  };
});