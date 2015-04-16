angular.module('helpWindowModule', [])

    .directive('helpWindow', function () {
        return {
            restrict:'C',
            templateUrl:'directives/helpWindow/helpWindow.html',
            replace: true,
            link: function(scope)	{



                scope.preventProp = function(e) {
                    e.stopPropagation();

                }
            }
        }
    });