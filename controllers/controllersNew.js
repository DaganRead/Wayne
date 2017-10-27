var scrypt = require("../../lib/scrypt.js");
var controllers = {};
/*
 _______          _   _             
|__   __|        | \ | |            
   | | ___  _ __ |  \| | __ ___   __
   | |/ _ \| '_ \| . ` |/ _` \ \ / /
   | | (_) | |_) | |\  | (_| |\ V / 
   |_|\___/| .__/|_| \_|\__,_| \_/  
           | |                      
           |_|                      
*/
controllers.topNav = function ($scope, $window, socket, $location, levelAuthorisation, upload, ms, $timeout, Facebook, GoogleSignin) {
  if (localStorage['token']) {
    var data = {
      token : localStorage['token'],
      redirect : true
    }
    socket.emit('restricted', 'authenticate', data);
  } else{
    $scope.user = {
      username : '',
      avatar : 'default.svg'
    };
  };
/*
* Google
*/
    $scope.GoogleLogin = function () {
        GoogleSignin.signIn().then(function (user) {
            var username = data = {
              id: user.w3.Eea,
              username:String(user.w3.ig).replace(/\s/g,''),
              email:user.w3.U3,
              name:user.w3.ig
            };
            socket.emit('public', 'request loginRegister', data);
        }, function (err) {
            console.log(err);
        });
    };
/*************************************************************************************/
  /*
  * FaceBook
  */
  $scope.FBProfile = function() {
    Facebook.api('/me', {fields: 'id,name,email'}, function(response) {
      console.log(response);
      var data = {
        id:response.id,
        username: response.name.replace(/\s/g,''),
        email: response.email,
        name: response.name
      };
      socket.emit('public', 'request loginRegister', data);
    });
  };
  $scope.FBLogin = function() {
    // From now on you can use the Facebook service just as Facebook api says
    Facebook.login(function(response) {
      // Do something with response.
      console.log(response);
      $scope.FBProfile();
    });
  };
  $scope.getLoginStatus = function() {
      Facebook.getLoginStatus(function(response) {
        if(response.status === 'connected') {
          $scope.FBloggedIn = true;
          console.log(response);
          $scope.FBProfile();
        } else {
          $scope.FBloggedIn = false;
          console.log(response);
        }
      });
  }();
  $scope.$watch(function() {
    // This is for convenience, to notify if Facebook is loaded and ready to go.
    return Facebook.isReady();
  }, function(newVal) {
    // You might want to use this to disable/show/hide buttons and else
    $scope.facebookReady = true;
  });
  /*****************************************************************************/
  socket.on('restricted', 'recieve avatarSaved',function(fileName) {
        $scope.user.avatar = fileName;
  });
  socket.on('restricted', 'recieve login', function(userData) {
    console.log('TopBar:');
    localStorage['userData'] = JSON.stringify(userData);
    console.log(localStorage['userData']);
    $scope.user = userData;
    socket.user($scope.user);
    $scope.user['notifications'] = 0;
    $scope.user['authed'] = true;
    levelAuthorisation.levelAuthority = userData.levelAuthority;
    $scope.$root.$broadcast('registerModalWindowClose');
    $scope.$root.$broadcast('loginModalWindowClose');
    if (userData.redirect) {
      $location.path('/:' + userData.username); 
    };     
  });
    $scope.loginModalWindow = {
      html: '<form ng-submit="submit()" ng-controller="loginModalWindow"><span>Username:</span> <br/> <input type="text" ng-model="login.username" placeholder="Username"/> <br/><span>Password:</span> <br/> <input type="password" ng-model="login.password" placeholder="Password"/> <br/> <input type="submit" value="Submit"/> <br/><span>Or login with your</span><br/><span>favourite social network:</span><br /><input type="button" ng-click="GoogleLogin()" value="Google"/>&nbsp;&nbsp;<input type="button" ng-click="FBLogin()" value="Facebook"/><br /><span ng-click="forgotReset()" class="forgotReset">Forgot / Reset Password</span> <br/><span ng-click="register()" class="register">Need an account? Go register.</span></form>',
      title:'Login',
      use : 'loginModalWindow'
    };
    $scope.buskModalWindow = {
      html: '<form ng-submit="submit()" ng-controller="buskModalWindow"><h2>Busk btn</h2></form>',
      title:'Busk Artist',
      use : 'buskModalWindow'
    };
    $scope.avatarCropModalWindow = {
      html: '<section ng-controller="avatarCropModalWindow"><figure class="avatar"><img ng-src="{{myCroppedImage}}"/></figure><div class="cropArea"> <ui-cropper image="myImage" area-type="circle" canvas-scalemode="true" result-image="myCroppedImage"></ui-cropper> </div><input type="button" id="saveCrop" ng-click="saveCrop()" class="orangeActionButton" value="Crop" /></section>',
      title:'Finalise your avatar',
      use : 'avatarCropModalWindow'
    };
    $scope.bannerCropModalWindow = {
      html: '<section ng-controller="bannerCropModalWindow"><figure class="avatar"><img ng-src="{{myCroppedImage}}"/></figure><div class="cropArea"> <ui-cropper image="myImage" area-type="rectangle" aspect-ratio="3.14" result-image-size="{w: 1100,h: 350}" init-max-area="true" result-image="myCroppedImage"></ui-cropper> </div><input type="button" id="saveCrop" ng-click="saveCrop()" class="orangeActionButton" value="Crop" /></section>',
      title:'Finalise your banner',
      use : 'bannerCropModalWindow'
    };
    $scope.uploadImageCropModalWindow = {
      html: '<section ng-controller="uploadImageCropModalWindow"><figure class="avatar"><img ng-src="{{myCroppedImage}}"/></figure><div class="cropArea"> <ui-cropper image="myImage" area-type="rectangle" canvas-scalemode="true" result-image="myCroppedImage"></ui-cropper> </div><input type="button" id="saveCrop" ng-click="saveCrop()" class="orangeActionButton" value="Crop" /></section>',
      title:'Finalise your image',
      use : 'uploadImageCropModalWindow'
    };
    $scope.imageLargerCropModalWindow = {
      html: '<section ng-controller="imageLargerCropModalWindow"><img ng-src="{{myImage}}" /></section>',
      title:'Large view',
      use : 'uploadImageCropModalWindow'
    };

    /*$scope.bannerCropModalWindow = {
      html: '<section ng-controller="bannerCropModalWindow"><figure class="avatar"><img ng-src="{{myCroppedImage}}"/></figure><div class="cropArea"> <img-crop image="myImage" area-min-size="200" result-image-size="300" area-type="square" result-image="myCroppedImage"></img-crop> </div><input type="button" id="saveCrop" ng-click="saveCrop()" class="orangeActionButton" value="Crop" /></section>',
      title:'Finalise your banner',
      use : 'bannerCropModalWindow'
    };*/
  $scope.logoutEventHandler = function () {
    socket.emit('restricted', 'request logout', localStorage["token"]);
      $scope.user.authed = false; 
      localStorage.removeItem("token");
      $location.path('/');  
  };
  };
/*
 _                 _       
| |               (_)      
| |     ___   __ _ _ _ __  
| |    / _ \ / _` | | '_ \ 
| |___| (_) | (_| | | | | |
|______\___/ \__, |_|_| |_|
              __/ |        
             |___/         
*/
controllers.loginModalWindow = function ($scope, socket, $timeout, $http, $location) {
  $scope.login = {
    username : '',
    password : ''
  };

  socket.on('public', 'recieve token', function(token) {
    var data = {
      token : token,
      redirect : true
    };
    socket.emit('restricted', 'authenticate', data);
    localStorage["token"] = token; 
  });


  $scope.submit = function() {
    // server-side
    var data = $scope.login;
    data.password = scrypt.crypto_scrypt(scrypt.encode_utf8(data.password), scrypt.encode_utf8(data.password), 128, 8, 1, 32);
    data.password = scrypt.to_hex(data.password);
    socket.emit('public', 'request login', data);
    $scope.login = {
    username : '',
    password : ''
  };

  };
    
  $scope.forgotReset = function() {
    $scope.$root.$broadcast('loginModalWindowSwap');
    $timeout(function() {$scope.$root.$broadcast('forgotResetModalWindowOpen');}, 300);
  };

  $scope.register = function() {
    $scope.$root.$broadcast('loginModalWindowSwap');
    $timeout(function() {$scope.$root.$broadcast('registerModalWindowOpen');}, 300);
  }; 
};
/*
 _____            _     _            
|  __ \          (_)   | |           
| |__) |___  __ _ _ ___| |_ ___ _ __ 
|  _  // _ \/ _` | / __| __/ _ \ '__|
| | \ \  __/ (_| | \__ \ ||  __/ |   
|_|  \_\___|\__, |_|___/\__\___|_|   
             __/ |                   
            |___/                    
*/
controllers.registerModalWindow = function ($scope, $location, socket, $timeout, $http, levelAuthorisation) {
  $scope.categories = [];
    socket.on('public', 'recieve categories', function(data) {
        var tempArr = data.body;
        for (var i = 0; i < tempArr.length; i++) {
          var tempObj = {
            name: tempArr[i],
            ticked:false
          }
          $scope.categories.push(tempObj);
        };
    });
    socket.emit('public', 'request categories');  

  $scope.newuser = {
    username : '',
      email : '',
      password : '',
      password2 : '',
      levelAuthority : '',
      musicPref : []
    };
    $scope.$root.$on('updateLevelAuthority', function(data) {
      console.log('Change LOA 1');
      console.log(data);
      console.log('done');
      $scope.updateLevelAuthority(data);
    });

    $scope.$root.$on('updateLevelAuthority2', function() {
      console.log(levelAuthorisation.levelAuthority);
      $scope.newuser.levelAuthority = levelAuthorisation.levelAuthority;
      $scope.levelAuthority = levelAuthorisation.levelAuthority;
      console.log(levelAuthorisation.levelAuthority);
      console.log($scope.newuser.levelAuthority);
      $scope.hideLevelAuthority = true;
      $scope.showLevelAuthority = true;
    });

  $scope.hideLevelAuthority = false;
  $scope.showLevelAuthority = false;
  $scope.error=false;

  $scope.updateLevelAuthority = function(levelAuthority){
    console.log('loa: '+ $scope.newuser.levelAuthority);
    levelAuthorisation.levelAuthority = levelAuthority;
    $scope.newuser.levelAuthority = levelAuthorisation.levelAuthority;
    $scope.levelAuthority = levelAuthorisation.levelAuthority;
  };

  $scope.submit = function() {
    if ($scope.newuser.password === $scope.newuser.password2) {
        $scope.newuser.password = scrypt.crypto_scrypt(scrypt.encode_utf8($scope.newuser.password), scrypt.encode_utf8($scope.newuser.password), 128, 8, 1, 32);
        $scope.newuser.password = scrypt.to_hex($scope.newuser.password);
        $scope.newuser.password2 = "";
        socket.emit('public', 'request register user', JSON.stringify($scope.newuser));
        $scope.newuser.password = "";
    };    
  }; 

  socket.on('public', 'recieve register user successful', function(token) {
    console.log(token);
    var data = {
      token : token,
      redirect : true
    };
    //store the header data in a variable 
    localStorage["token"] = token;
    socket.emit('restricted', 'authenticate', data); 

  });
  socket.on('public', 'recieve register user rejected',function(data) {
    console.log('rejected'+ data);
    $scope.error = data;
  });
    $scope.showLevelAuthorityDiv = function() {
      $scope.hideLevelAuthority = true;
      $scope.showLevelAuthority = true;
    };
    $scope.hideLevelAuthorityDiv = function() {
      $scope.hideLevelAuthority = false;
      $scope.showLevelAuthority = false;
    };
};
/*
 ______                    _   _____                _   
|  ____|                  | | |  __ \              | |  
| |__ ___  _ __ __ _  ___ | |_| |__) |___  ___  ___| |_ 
|  __/ _ \| '__/ _` |/ _ \| __|  _  // _ \/ __|/ _ \ __|
| | | (_) | | | (_| | (_) | |_| | \ \  __/\__ \  __/ |_ 
|_|  \___/|_|  \__, |\___/ \__|_|  \_\___||___/\___|\__|
                __/ |                                   
               |___/                                    
*/
controllers.forgotResetModalWindow = function ($scope, $window, socket, $timeout) {
   $scope.login = function() {
      $scope.$root.$broadcast('forgotResetModalWindowSwap');
      $timeout(function() {$scope.$root.$broadcast('loginModalWindowOpen');}, 300);
    };
  $scope.email = '';
  $scope.submitReset = function() {
      socket.emit('public', 'request reset', $scope.email); 
      $scope.email = '';
  };
};
/*
 _____                             _____                 
|_   _|                           / ____|                
  | |  _ __ ___   __ _  __ _  ___| |     _ __ ___  _ __  
  | | | '_ ` _ \ / _` |/ _` |/ _ \ |    | '__/ _ \| '_ \ 
 _| |_| | | | | | (_| | (_| |  __/ |____| | | (_) | |_) |
|_____|_| |_| |_|\__,_|\__, |\___|\_____|_|  \___/| .__/ 
                        __/ |                     | |    
                       |___/                      |_|    
*/
controllers.bannerCropModalWindow = function ($scope, socket){
  $scope.myImage = '';
  $scope.myCroppedImage = '';
  $scope.fileList=[];
  $scope.saveCrop = function (){
    var data = {
      token : localStorage['token'],
      banner : $scope.myCroppedImage
    };
    socket.emit('restricted', 'request bannerUpdate', data);
    $scope.title = '';
  };
  $scope.$root.$on('crop banner', function(event, files) {
    console.log('called banner crop in controller');
    $scope.$root.$broadcast('bannerCropModalWindowOpen');
    console.log(files);
    for(var i=0; i<files.length; i++){
      console.log('Banner crop:');
      console.log(files[i].name);
      var uploadedFile = files[i]; 
      console.log(uploadedFile);
    };
    reader = new FileReader();

    reader.onload = function (event){
      $scope.$apply(function($scope){
        $scope.myImage = reader.result;
        //$scope.myImage = uploadEvent.target.result;
      });
    };
    reader.readAsDataURL(uploadedFile);
  });
};

controllers.uploadImageCropModalWindow = function ($scope, socket){
  $scope.myImage = '';
  $scope.myCroppedImage = '';
  $scope.fileList=[];
  $scope.saveCrop = function (){
    var data = {
      token : localStorage['token'],
      banner : $scope.myCroppedImage
    };
    socket.emit('restricted', 'request uploadImageUpdate', data);
    $scope.title = '';
  };
  $scope.$root.$on('crop uploadImage', function(event, files) {
    console.log('called uploadImage crop in controller');
    $scope.$root.$broadcast('uploadImageCropModalWindowOpen');
    console.log(files);
    for(var i=0; i<files.length; i++){
      console.log('uploadImage crop:');
      console.log(files[i].name);
      var uploadedFile = files[i]; 
      console.log(uploadedFile);
    };
    reader = new FileReader();

    reader.onload = function (event){
      $scope.$apply(function($scope){
        $scope.myImage = reader.result;
        //$scope.myImage = uploadEvent.target.result;
      });
    };
    reader.readAsDataURL(uploadedFile);
  });
};

controllers.avatarCropModalWindow = function ($scope, socket){
  $scope.myImage = '';
  $scope.myCroppedImage = '';
  $scope.fileList=[];
  $scope.saveCrop = function (){
    var data = {
      token : localStorage['token'],
      avatar : $scope.myCroppedImage
    };
    socket.emit('restricted', 'request avatarUpdate', data);
    $scope.title = '';
  };
  $scope.$root.$on('crop avatar', function(event, files) {
    console.log('called avater crop in controller');
    $scope.$root.$broadcast('avatarCropModalWindowOpen');
    console.log(files);
    for(var i=0; i<files.length; i++){
      console.log('Avatar crop:');
      console.log(files[i].name);
      var uploadedFile = files[i]; 
      console.log(uploadedFile);
    };
    reader = new FileReader();

    reader.onload = function (event){
      $scope.$apply(function($scope){
        $scope.myImage = reader.result;
        //$scope.myImage = uploadEvent.target.result;
      });
    };
    reader.readAsDataURL(uploadedFile);
  });
};

controllers.imageLargerCropModalWindow = function ($scope, socket){
  console.log('in coont');
  $scope.myImage = '';
  $scope.$root.$on('send imageLarger', function(event, src) {
    console.log('imiage in coont');
    $scope.myImage = src;
    $scope.$root.$broadcast('imageLargerModalWindowOpen');
  });
};

/*
  _____      _   _   _                 
 / ____|    | | | | (_)                
| (___   ___| |_| |_ _ _ __   __ _ ___ 
 \___ \ / _ \ __| __| | '_ \ / _` / __|
 ____) |  __/ |_| |_| | | | | (_| \__ \
|_____/ \___|\__|\__|_|_| |_|\__, |___/
                              __/ |    
                             |___/     
*/
controllers.buskModalWindow = function ($scope, $window, socket) {

};
controllers.howItWorksPage = function ($scope, $window, socket, $interval) {
    $scope.howItWorksPage = {
      html: ''
    };

    socket.on('public', 'recieve cms page', function(data) {
        $scope.howItWorksPage.html = data.body;
    });
    socket.emit('public', 'request cms page', 'how-it-works'); 
};
controllers.questionsAnswersPage = function ($scope, $window, socket, $interval) {
    $scope.questionsAnswersPage = {
      html: ''
    };

    socket.on('public', 'recieve cms page', function(data) {
        $scope.questionsAnswersPage.html = data.body;
    });
    socket.emit('public', 'request cms page', 'questions-and-answers'); 
};
controllers.termsConditionsPage = function ($scope, $window, socket, $interval) {
    $scope.termsConditionsPage = {
      html: ''
    };

    socket.on('public', 'recieve cms page', function(data) {
        $scope.termsConditionsPage.html = data.body;
    });
    socket.emit('public', 'request cms page', 'terms-and-conditions'); 
};
controllers.privacyPolicyPage = function ($scope, $window, socket, $interval) {
    $scope.privacyPolicyPage = {
      html: ''
    };

    socket.on('public', 'recieve cms page', function(data) {
        $scope.privacyPolicyPage.html = data.body;
    });
    socket.emit('public', 'request cms page', 'privacy-policy'); 
};

/*
* Contact Form
*/
controllers.contactForm = function ($scope, $window, socket) {
  $scope.newMail={
    name: '',
    email:'',
    subject:'',
    text:''
  };
  $scope.submit = function() {
    socket.emit('public', 'request contact form', $scope.newMail);
  };
};
/*
 _                     _ _             _____                 
| |                   | (_)           |  __ \                
| |     __ _ _ __   __| |_ _ __   __ _| |__) |_ _  __ _  ___ 
| |    / _` | '_ \ / _` | | '_ \ / _` |  ___/ _` |/ _` |/ _ \
| |___| (_| | | | | (_| | | | | | (_| | |  | (_| | (_| |  __/
|______\__,_|_| |_|\__,_|_|_| |_|\__, |_|   \__,_|\__, |\___|
                                  __/ |            __/ |     
                                 |___/            |___/      
*/
controllers.landingPage = function ($scope, $window, socket, $interval, levelAuthorisation, $timeout) {
    $scope.registerModalWindow = {
      html: '<form class="registerForm" ng-submit="submit()" ng-controller="registerModalWindow"> <div class="animate-hide register-levelAuthority" ng-hide="hideLevelAuthority"><input type="radio" id="mentorRadio2" ng-model="levelAuthority" value="fan" ng-change="updateLevelAuthority(levelAuthority)"> <label for="mentorRadio2"> <article class="levelAuthority-item mentor-avatar"> <figure class="persona-info"> <span>Fan</span> </figure> </article> <figcaption>Description of Fan user role goes here.</figcaption> </label> <input type="radio" id="creativeRadio2" ng-model="levelAuthority" value="artist" ng-change="updateLevelAuthority(levelAuthority)"> <label for="creativeRadio2"> <article class="levelAuthority-item creative-avatar"> <figure class="persona-info"> <span>Artist</span> </figure> </article> <figcaption>Description of Artist user role goes here.</figcaption> </label> <br/> <md-next ng-click="showLevelAuthorityDiv()">Next</md-next> </div><div class="register-basic animate-show" ng-show="showLevelAuthority"> <md-prev ng-click="hideLevelAuthorityDiv()"></md-prev> <br/> <label for="usernameText">Username</label> <br/><input type="text" ng-model="newuser.username" id="usernameText" placeholder="Username"/> <br/> <label for="emailAddressEmail">Email Address</label> <br/><input type="email" ng-model="newuser.email" id="emailAddressEmail" placeholder="Email Address"/> <br/><label ng-if="newuser.levelAuthority === \'fan\'" for="musicPref">Music Preferences</label><label ng-if="newuser.levelAuthority === \'artist\'" for="musicPref">Music Genre</label><br/><div isteven-multi-select input-model="categories" output-model="newuser.musicPref" button-label="name" item-label="name" max-labels="3" tick-property="ticked" orientation="horizontal"></div><br /><label for="passwordPassword">Password</label> <br/><input type="password" ng-model="newuser.password" id="passwordPassword" placeholder="Password"/> <br/> <label for="passwordPassword2">Password</label> <br/><input type="password" ng-model="newuser.password2" id="passwordPassword2" placeholder="Password"/> <br/> <input type="submit" value="Submit"/> </div><br/></form>',
      title:'Register',
      use : 'registerModalWindow'
    };
    $scope.forgotResetModalWindow = {
      html: '<form ng-submit="submitReset()" ng-controller="forgotResetModalWindow"><md-prev ng-click="login()"></md-prev><span>Email:</span><br /><input type="email" ng-model="email" placeholder="Email Address"/><br /><br /><input type="submit" value="Submit"/></form>',
      title:'Reset',
      use : 'forgotResetModalWindow'
    };
    $scope.landingPage = {
      html: ''
    };

    socket.on('public', 'recieve cms page', function(data) {
        $scope.landingPage.html = data.body;
    });
    socket.emit('public', 'request cms page', 'landing'); 
    $scope.joinTeamModalEnterEventHandler = function(loa) {
      //$scope.$root.$broadcast('updateLevelAuthority', loa);
      var datatosend = String(loa);
      levelAuthorisation.levelAuthority = datatosend;
      console.log("selected loa");
      console.log(levelAuthorisation.levelAuthority);
      console.log("selected done");
      //$scope.$root.$broadcast('updateLevelAuthority', datatosend);
      $scope.$root.$broadcast('updateLevelAuthority2');
      $timeout(function() {$scope.$root.$broadcast('registerModalWindowOpen');}, 300);
    };

/*
 ____                              
|  _ \                             
| |_) | __ _ _ __  _ __   ___ _ __ 
|  _ < / _` | '_ \| '_ \ / _ \ '__|
| |_) | (_| | | | | | | |  __/ |   
|____/ \__,_|_| |_|_| |_|\___|_|   
*/
  $scope.images = [{
      source: "../images/banner/banner_0.jpg",
      title: "Project Title 0"
  }, {
      source: "../images/banner/banner_1.jpg",
      title: "Project Title 1"
  }, {
      source: "../images/banner/banner_2.jpg",
      title: "Project Title 2"
  }];
  $scope.image = getRandomImage();
  $interval(function() {$scope.image = getRandomImage()}, 15000);
  function getRandomImage() {
      var imageCount = $scope.images.length;
      var index = Math.floor(
          (Math.random() * imageCount * 2) % imageCount
      );
      return ($scope.images[index]);
  }
/*
 _______        _   _                       _       _     
|__   __|      | | (_)                     (_)     | |    
   | | ___  ___| |_ _ _ __ ___   ___  _ __  _  __ _| |___ 
   | |/ _ \/ __| __| | '_ ` _ \ / _ \| '_ \| |/ _` | / __|
   | |  __/\__ \ |_| | | | | | | (_) | | | | | (_| | \__ \
   |_|\___||___/\__|_|_| |_| |_|\___/|_| |_|_|\__,_|_|___/
*/
  
};
/*
 _____            __ _ _      
|  __ \          / _(_) |     
| |__) | __ ___ | |_ _| | ___ 
|  ___/ '__/ _ \|  _| | |/ _ \
| |   | | | (_) | | | | |  __/
|_|   |_|  \___/|_| |_|_|\___|
*/
controllers.dashboard = function ($scope, socket, ms, $window) {
  if (localStorage['userData']) {
        var newData = JSON.parse(localStorage['userData']);
          $scope.user = newData;
          $scope.user.password = '';
  } else{
    socket.emit('restricted', 'request profile', localStorage["token"]);
  };
  /*socket.on('restricted', 'recieve profile',function(data) {
    var newData = data;
    $scope.user = newData;

  });*/

  $scope.searchPeople = '';
  $scope.tabSelect = true;
  $scope.navto='profile';
  $scope.peopleTab='friends';
  $scope.$root.$on('profileNav', function(event, data) {
    $scope.navto=data;
  });
  $scope.goTo = function(selection) {
    $scope.navto=selection;
  var newData = JSON.parse(localStorage['userData']);
          $scope.user = newData;
          $scope.user.password = '';
  };
  $scope.tabToInvitations = function(selection) {
    if ($scope.tabSelect == true) {
      $scope.peopleTab='invitations';
      $scope.tabSelect = false;
      $scope.searchPeople = '';
    };
  };
  $scope.tabToFriends = function(selection) {
    if ($scope.tabSelect == false) {
      $scope.peopleTab='friends';
      $scope.tabSelect = true;
      $scope.searchPeople = '';
    };
  };
  /*
  * Admin Sections ******************************************************************************************
  */
  $scope.updateSelectedPage = function() {
    var data = {
      title:$scope.currentSelectedPage,
      body:$scope.tinymceModel,
      swap:true
    };
    socket.emit('restricted', 'request page update', data);
  };
  $scope.currentSelectedPage="";
  $scope.tinymceModel="";
  $scope.newCategory='';
  $scope.newFeaturedVideo={
    url:''
  };
  $scope.newBannerImage='';
  $scope.categories=[];
  $scope.featuredVideos=[];
  $scope.bannerImages=[];
  $scope.tinymceModel="";
  $scope.tinymceOptions = {
    inline: false,
    plugins : 'advlist autolink lists link image charmap hr anchor pagebreak searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking table contextmenu directionality emoticons template paste textcolor colorpicker textpattern imagetools codesample toc',
    skin: 'lightgray',
    theme : 'modern'
  };
  $scope.saveHTML = function() {
    console.log($scope.tinymceModel);
    var data = {
      title:$scope.currentSelectedPage,
      body:$scope.tinymceModel,
      swap:false
    };
    socket.emit('restricted', 'request page update', data); 
  };
  /*Featured Video*/
  $scope.addFeaturedVideo = function(newVideo) {
  $scope.featuredVideos.push(newVideo);
    socket.emit('restricted', 'request featured-videos update', $scope.featuredVideos); 
  };
  $scope.newVideo={
    url:""
  };
  $scope.removeFeaturedVideo = function(featuredVideo) {
    $scope.featuredVideos.every(function(element, index, array) {
      if (element === featuredVideo) {
        $scope.featuredVideos.splice(index, 1);
        /*scope.project.tasks = scope.tasks;
        userData.projects[projectIndex].tasks = scope.tasks;
        localStorage['userData'] = JSON.stringify(userData);*/
        socket.emit('restricted', 'request featured-videos update', $scope.featuredVideos);
        return false;
      } else{
        return true;
      };
    });    
  };
  /*Category*/
  $scope.addCategory = function(newCategory) {
    $scope.categories.push(newCategory);
    socket.emit('restricted', 'request categories update', $scope.categories);
    $scope.newCategory = '';
  };
  $scope.removeCategory = function(category) {
    $scope.categories.every(function(element, index, array) {
      if (element === category) {
        $scope.categories.splice(index, 1);
        /*scope.project.tasks = scope.tasks;
        userData.projects[projectIndex].tasks = scope.tasks;
        localStorage['userData'] = JSON.stringify(userData);*/
        socket.emit('restricted', 'request categories update', $scope.categories);
        return false;
      } else{
        return true;
      };
    });    
  };
    /*Banner Images*/
  $scope.addBanner = function() {
    $scope.bannerImages.push($scope.newBannerImage);
    var data = {
      title:$scope.currentSelectedPage,
      body:$scope.tinymceModel,
      swap:false
    };
    socket.emit('restricted', 'request page update', data); 
  };
  socket.on('restricted', 'recieve page', function(data) {
    if (data.title === 'featured-videos') {
      $scope.featuredVideos=data.body;
    } else if (data.title === 'categories') {
      $scope.categories=data.body;
    } else{
      $scope.tinymceModel=data.body;
    };
  });

  /* Profile Sections          ***************************************************************************************
        socket.on('public', 'upload complete',function(event) {
        for(var i=0; i<$scope.uploads.length; i++){
          var uploadedFileName = event.file.name,
          uploadedFile = $scope.uploads[i][1][0]; 
          console.log($scope.uploads[i][0].username);
          if(ms.unsealer($scope.uploads[i][0], uploadedFileName)){
            if ($scope.uploads[i][0].username === 'banner'+i) {
              console.log('upload complete');
              console.log($scope.uploads[i][1]);
              $scope.$root.$broadcast('crop banner', $scope.uploads[i][1]);
            }else{
                console.log('upload complete portfolioProject');
                console.log($scope.uploads[i][1]);
                var reader = new FileReader();

                reader.onload = function (loadevent){
                  $scope.$apply(function($scope){
                    var canvas, ctx, neededHeight, neededWidth, tempImage = new Image();
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
                    //scope.myImage = uploadEvent.target.result;
                    $scope.banner = canvas.toDataURL("image/jpeg");
                    var data = {
                      token:localStorage['token'],
                      banner:canvas.toDataURL("image/jpeg")
                    };
                    socket.emit('restricted', 'request bannerUpdate', data);
                    localStorage['userData'] = JSON.stringify($scope.user);
                    //
                    }, false);
                    tempImage.src = reader.result;            
                  });
                };
                reader.readAsDataURL(uploadedFile);
            };
          };
        };
        $scope.uploads = []; 
      });
/**************/
};
/*
 _____           _           _       
|  __ \         (_)         | |      
| |__) | __ ___  _  ___  ___| |_ ___ 
|  ___/ '__/ _ \| |/ _ \/ __| __/ __|
| |   | | | (_) | |  __/ (__| |_\__ \
|_|   |_|  \___/| |\___|\___|\__|___/
               _/ |                  
              |__/                   
*/

controllers.adminDashboard = function ($scope, $window, socket) {

};
controllers.creativeDashboard = function ($scope, $window, socket) {

};

controllers.mentorDashboard = function ($scope, $window, socket) {

};
controllers.error = function ($scope, $window, socket) {
  socket.emit('public', 'request error');
  socket.on('public', 'recieve error',function(data) {
    $scope.loginpage = data.loginpage;
  });
};

//search up prototype chain
app.controller(controllers);