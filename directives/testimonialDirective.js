app.directive("testimonial", function($interval) {
  return {
    restrict: 'E',
    templateUrl: '/directives/templates/testimonialDirective.html',
    scope: {},
    link: function(scope, elements, attrs) {
    	scope.testimonials = [{
		    avatar: "../images/client_avatar.png",
		    username: "Joe Soap",
		    details: "What an efficient and great platform to collaborate on."
		}, {
		    avatar: "../images/mentor_avatar.png",
		    username: "John James Jacoby",
		    details: "Great platform to collaborate on."
		}, {
		    avatar: "../images/creative_avatar.png",
		    username: "Agent Smith",
		    details: "What an efficient platform!"
		}];
		scope.testimonial = getRandomTestimonial();
		$interval(function() {scope.testimonial = getRandomTestimonial()}, 12000);
		function getRandomTestimonial() {
		    var testimonialCount = scope.testimonials.length;
		    var index = Math.floor(
		        (Math.random() * testimonialCount * 2) % testimonialCount
		    );
		    return (scope.testimonials[index]);
		};
    }
  };
});

