(function () {
	'use strict';
	angular
		.module('discSynth')
		.directive('slider', slider);

	slider.$inject = [];
	function slider() {
		var directive = {
			restrict: 'EA',
			templateUrl: 'app/elements/slider/slider.html',
			bindToController: true,
			controller: sliderController,
			scope: {
				currentlyMoving: "=currentlyMoving",
				sliderValue: "=sliderValue",
				callBack: "=callBack",
				minValue: "=minValue",
				maxValue: "=maxValue"
			}
		};
		return directive;
	}

	sliderController.$inject = ['$scope', '$element', 'themeService'];
	function sliderController($scope, $element, themeService) {

		$scope.thumbWidth = 8;
		$scope.themeService = themeService;

		var lastValue = -1;
		var minValue = angular.isDefined($scope.minValue) ? $scope.minValue : 0;
		var maxValue = angular.isDefined($scope.maxValue) ? $scope.maxValue : 1;
		if (minValue >= maxValue) {
			minValue = 0;
			maxValue = 1;
		}
		if ($scope.sliderValue < minValue) {$scope.sliderValue = minValue}
		if ($scope.sliderValue > maxValue) {$scope.sliderValue = maxValue}
		var originalSliderValue = $scope.sliderValue;

		$scope.getWidth = getWidth;
		$scope.getLeftAdjust = getLeftAdjust;
		$scope.getOriginalLeftPos = getOriginalLeftPos;
		$scope.mouseDown = mouseDown;
		$scope.mouseUpEvent = mouseUpEvent;
		$scope.mouseMoveEvent = mouseMoveEvent;
		$scope.setSliderValueAndRunCallBack = setSliderValueAndRunCallBack;
		$scope.$on('mouseMoveEvent', $scope.mouseMoveEvent);
		$scope.$on('mouseUpEvent', $scope.mouseUpEvent);

		$scope.leftPos = $scope.getOriginalLeftPos();

		/////////////////////////////////////////////

		function getLeftAdjust() {
			return $element[0].getBoundingClientRect().left + ($scope.thumbWidth/2)
		}
		function getWidth() {
			return $element[0].getBoundingClientRect().width - $scope.thumbWidth;
		}
		function getOriginalLeftPos() {
			return (originalSliderValue-minValue) / (maxValue-minValue) * $scope.getWidth();
		}

		function mouseUpEvent() {
			if ($scope.currentlyMoving) {
				$scope.currentlyMoving = false;
			}
		}
		function mouseDown(event) {
			$scope.leftPos = event.clientX - $scope.getLeftAdjust();
			$scope.setSliderValueAndRunCallBack();
			$scope.currentlyMoving = true;
		}

		function setSliderValueAndRunCallBack(reset) {
			if (reset) {
				$scope.sliderValue = originalSliderValue;
				$scope.leftPos = $scope.getOriginalLeftPos();
			}
			else {
				$scope.sliderValue = ($scope.leftPos / $scope.getWidth()) * (maxValue -  minValue) + minValue;
			}
			if (angular.isDefined($scope.callBack)) {
				$scope.callBack($scope.sliderValue);
			}
		}

		function mouseMoveEvent(event, args) {
			if ($scope.currentlyMoving) {
				var width = $scope.getWidth();
				var leftPos = args.clientX - $scope.getLeftAdjust();
				$scope.leftPos = leftPos < 0 ? 0 : leftPos > width ? width : leftPos;
				if ($scope.leftPos !== lastValue) {
					lastValue = $scope.leftPos;
					$scope.setSliderValueAndRunCallBack();
				}
			}
		}

	}
})();