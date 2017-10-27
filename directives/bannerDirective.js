app.directive("banner",function() {
        function compile(element, attributes, transclude) {
                element.append("<img class='fader' />");
                return (link);
            };
        function link($scope, element, attributes) {
                var fader = element.find("img.fader");
                var primary = element.find("img.image");
                $scope.$watch(
                    "image.source",
                    function(newValue, oldValue) {
                        // If the $watch() is initializing, ignore.
                        if (newValue === oldValue) {
                            primary.prop("src", newValue);
                            primary.one("load", function() {
                                primary.addClass("show");
                            });
                            return;
                        }else if (primary.hasClass("show")) {
                            fader.prop("src", newValue);
                            fader.one("load", function() {
                                fader.toggleClass("show");
                                primary.toggleClass("show");
                            });
                            return;
                        }else{
                            primary.prop("src", newValue);
                            primary.one("load", function() {
                                fader.toggleClass("show");
                                primary.toggleClass("show");
                            });
                        };
                    }
                );
            };
            // Return the directive configuration.
        return ({
            compile: compile,
            restrict: 'E'
        });
    }
);