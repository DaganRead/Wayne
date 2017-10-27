var app = angular.module('app', ['ngRoute','ngSanitize', 'ui.materialize','uiCropper', 'ui.bootstrap.datetimepicker', 'checklist-model', 'ui.tinymce', 'luegg.directives', 'videosharing-embed', "isteven-multi-select", 'facebook','google-signin']);
app.constant('levelAuthorisation', { levelAuthority : '' });
app.filter('startFrom', function() {
	return function(input, start) {
		start = +start; //parse to int
		return input.slice(start);
	}
});
app.config(function($routeProvider, $locationProvider, levelAuthorisation, FacebookProvider, GoogleSigninProvider){
	/*	use the HTML5 History API	*/
	$locationProvider.html5Mode(true);
	// Set your appId through the setAppId method or
     // use the shortcut in the initialize method directly.
    FacebookProvider.init('1265351020144708');
	GoogleSigninProvider.init({
    	client_id: '896924612378-d2jlnkpl28b0p7p383broikd3s6m3qpm.apps.googleusercontent.com',
    });
	/*	Router	*/
	$routeProvider
		.when('/',{
			controller:'redirect',
			templateUrl:'views/redirect.html'
		})
		.when('/landingPage',{
			controller:'landingPage',
			templateUrl:'views/landingPage.html'
		})
		.when('/explore',{
			controller:'viewOther',
			templateUrl:'views/explore.html'
		})
		.when('/explore/:username',{
			controller:'viewOther',
			templateUrl:'views/other.html'
		})
		.when('/paypal-success',{
			controller:'landingPage',
			templateUrl:'views/paypal-success.html'
		})
		.when('/paypal-finalise',{
			controller:'paypal',
			templateUrl:'views/paypal-finalise.html'
		})
		.when('/paypal-cancel',{
			controller:'paypal',
			templateUrl:'views/paypal-cancel.html'
		})
        .when('/:username/home',{   
            controller:'dashboard',
            templateUrl:'views/home.html' 
        })
        .when('/:username/profile',{   
            controller:'dashboard',
            templateUrl:'views/profile.html' 
        })
        .when('/:username/account',{   
            controller:'dashboard',
            templateUrl:'views/account.html'
        })
        .when('/:username/playlist',{   
            controller:'dashboard',
            templateUrl:'views/playlist.html'
        })
        .when('/:username/wall',{   
            controller:'dashboard', 
            templateUrl:'views/wall.html' 
        })
        .when('/:username/wallet',{   
            controller:'dashboard', 
            templateUrl:'views/wallet.html'
        })
        .when('/:username/people',{   
        	controller:'dashboard', 
        	templateUrl:'views/people.html'
        })
        .when('/:username/media',{   
        	controller:'dashboard',
        	templateUrl:'views/media.html' 
        })
        .when('/:username/upload',{   
        	controller:'dashboard',
        	templateUrl:'views/upload.html'
        })
		.when('/explore/artists/:username',{
			controller:'dashboard',
			templateUrl:'views/artist/profile.html'
		})
		.when('/explore/fans/:username',{
			controller:'dashboard',
			templateUrl:'views/fan/profile.html'
		})
		.when('/admin/dashboard',{
			controller:'adminDashboard',
			templateUrl:'views/dashboard.html'
		})
		.when('/privacy-policy',{
			controller:'dashboard',
			templateUrl:'views/privacy-policy.html'
		})
		.when('/questions-and-answers',{
			controller:'dashboard',
			templateUrl:'views/questions-and-answers.html'
		})
		.when('/how-it-works',{
			controller:'dashboard',
			templateUrl:'views/how-it-works.html'
		})
		.when('/terms-and-conditions',{
			controller:'dashboard',
			templateUrl:'views/terms-and-conditions.html'
		})
		.when('/error',{
			controller:'error',
			templateUrl:'views/error.html'
		})
		.otherwise({ redirectTo: '/error' });
}).run( function($rootScope, $location, socket) {
    // register listener to watch route changes
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
      if ( localStorage['userData'] != undefined) {
      	var data = JSON.parse(localStorage['userData']);
      	if (next.templateUrl=='') {
      		//if wrong directory change on levelAuthority
      	}
      }         
    });
 });
