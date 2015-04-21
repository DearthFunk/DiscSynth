angular.module('discSynth')

    .directive('slider', function(themeService) {
        return {
            restrict:'C',
            scope: {
                currentlyMoving: "=currentlyMoving",
                sliderValue: "=sliderValue",
	            callBack: "=callBack"
            },
            templateUrl:'app/elements/slider/slider.html',
            replace: true,
            link: function(scope,element) {

	            scope.thumbWidth = 8;
	            scope.themeService = themeService;
                scope.width = element[0].getBoundingClientRect().width;


                var sliding, startX, originalX, newValue;
	            var lastValue = scope.sliderValue;
				var originalValue = scope.sliderValue;
                var xMin = 0;

				scope.resetToOriginal = function() {
					scope.sliderValue = originalValue;
					if (angular.isDefined(scope.callBack)){scope.callBack(scope.sliderValue);}
				};

	            scope.$on('mouseUpEvent', function() {
		            if (sliding) {
			            if (angular.isDefined(scope.callBack)){scope.callBack(scope.sliderValue);}
			            sliding = false;
                        scope.currentlyMoving = false;
		            }

	            });

                scope.startMovingSlider = function(event) {
                    scope.currentlyMoving = true;
                    sliding = true;
                    startX = event.clientX;
                    newValue = scope.sliderValue * (scope.width - scope.thumbWidth);
                    originalX = newValue;
                };

	            scope.movePos = function(e) {
		            if (!sliding) {
			            scope.sliderValue = (e.clientX - element[0].getBoundingClientRect().left) / scope.width;
			            scope.startMovingSlider(e);

			            if (angular.isDefined(scope.callBack)){
				            scope.callBack(scope.sliderValue);}
		            }
	            };

                scope.$on('mouseMoveEvent', function(event, args) {
                    if(sliding){

                        var newLeft = originalX - startX + args.clientX;

                        if(newLeft < xMin)       {newLeft = xMin;        scope.sliderValue = 0;}
                        if(newLeft > scope.width){newLeft = scope.width; scope.sliderValue = 1;}
                        newValue = newLeft;

                        if(lastValue != newValue){
                            scope.sliderValue = ((xMin - newValue) / (xMin - scope.width));
	                        if (angular.isDefined(scope.callBack)){
		                        scope.callBack(scope.sliderValue);}
                            lastValue = newValue;
                        }
                    }
                });


            }
        }
    });
