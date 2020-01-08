(function () {
	'use strict';
	angular
		.module('discSynth')
		.directive('slider', slider);

	slider.$inject = [
		'themeService',
		'$window'
	];
	function slider(
		themeService,
		$window
	) {
		var directive = {
			restrict: 'EA',
			templateUrl: 'CACHE/elements/slider/slider.html',
			scope: {
				currentlyMoving: "=currentlyMoving",
				sliderValue: "=sliderValue",
				callBack: "=callBack",
				minValue: "=minValue",
				maxValue: "=maxValue",
				fixedValue: "=fixedValue"
			},
			link: linkFunction,
		};
		return directive;

		function linkFunction(scope, elem){
			var lastValue = -1;
			var runCallBack = angular.isDefined(scope.callBack);
			var toFixedValue = angular.isDefined(scope.fixedValue);
			var minValue = angular.isDefined(scope.minValue) ? scope.minValue : 0;
			var maxValue = angular.isDefined(scope.maxValue) ? scope.maxValue : 1;
			if (minValue === maxValue) {
				minValue = 0;
				maxValue = 1;
			}
			var minIsBigger = minValue > maxValue;
			if (minIsBigger) {
				var x = maxValue;
				maxValue = minValue;
				minValue = x;
			}
			if (scope.sliderValue < minValue) {scope.sliderValue = minValue}
			if (scope.sliderValue > maxValue) {scope.sliderValue = maxValue}
			var originalSliderValue = scope.sliderValue;

			scope.thumbWidth = 8;
			scope.themeService = themeService;
			scope.getWidth = getWidth;
			scope.getLeftAdjust = getLeftAdjust;
			scope.getOriginalLeftPos = getOriginalLeftPos;
			scope.mouseDown = mouseDown;
			scope.mouseUpEvent = mouseUpEvent;
			scope.mouseMoveEvent = mouseMoveEvent;
			scope.setSliderValueAndRunCallBack = setSliderValueAndRunCallBack;

			scope.leftPos = scope.getOriginalLeftPos();

			/////////////////////////////////////////////

			function getLeftAdjust() {
				return elem[0].querySelector('.sliderContainer').getBoundingClientRect().left + (scope.thumbWidth/2)
			}

			function getWidth() {
				return elem[0].querySelector('.sliderContainer').getBoundingClientRect().width - scope.thumbWidth;
			}

			function getOriginalLeftPos() {
				return (originalSliderValue-minValue) / (maxValue-minValue) * scope.getWidth();
			}

			function mouseUpEvent() {
				angular.element($window).unbind('mouseup', mouseUpEvent);
				angular.element($window).unbind('mousemove', mouseMoveEvent);
				if (scope.currentlyMoving){
					scope.currentlyMoving.val = false;
				}
				scope.$apply();
			}

			function mouseDown(event) {
				if (scope.currentlyMoving){
					scope.currentlyMoving.val = true;
				}
				scope.leftPos = event.clientX - scope.getLeftAdjust();
				scope.setSliderValueAndRunCallBack();
				angular.element($window).bind('mouseup', mouseUpEvent);
				angular.element($window).bind('mousemove', mouseMoveEvent);
			}

			function setSliderValueAndRunCallBack(reset) {
				if (reset) {
					scope.sliderValue = toFixedValue ?
						parseInt(originalSliderValue.toFixed(scope.fixedValue)) :
						originalSliderValue;
					scope.leftPos = scope.getOriginalLeftPos();
				}
				else {
					var newSlider = minIsBigger ?
						(scope.leftPos / scope.getWidth()) * (minValue - maxValue) + maxValue :
						(scope.leftPos / scope.getWidth()) * (maxValue - minValue) + minValue;
					scope.sliderValue = toFixedValue ?
						parseFloat(newSlider.toFixed(scope.fixedValue)) :
						newSlider;
				}
				if (runCallBack) {
					scope.callBack(scope.sliderValue);
				}
			}

			function mouseMoveEvent(event) {
				var width = scope.getWidth();
				var leftPos = event.clientX - scope.getLeftAdjust();
				scope.leftPos = leftPos < 0 ? 0 : leftPos > width ? width : leftPos;
				if (scope.leftPos !== lastValue) {
					lastValue = scope.leftPos;
					scope.setSliderValueAndRunCallBack();
				}
				scope.$apply();
			}
		}
	}
})();