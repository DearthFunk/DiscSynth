angular.module('synthControlsModule', [])

    .directive('synthControls', function (discService) {
        return {
            restrict:'C',
            templateUrl:'directives/synthControls/synthControls.html',
            replace: true,
            link: function(scope) {

                scope.resetIndex = -1;
                scope.discService = discService;
                scope.oscWaveTypes = oscWaveTypes;

            }
        }
    });
