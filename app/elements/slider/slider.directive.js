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
			transclude: true,
			controller: sliderController,
			scope: {
				currentlyMoving: "=currentlyMoving",
				sliderValue: "=sliderValue",
				callBack: "=callBack",
				minValue: "=minValue",
				maxValue: "=maxValue"
			},
			bindToController: true
		};
		return directive;
	}

	sliderController.$inject = ['$scope', '$element', 'themeService'];
	function sliderController($scope, $element, themeService) {

		$scope.thumbWidth = 8;
		$scope.themeService = themeService;

		var lastValue = -1;
		var originalValue = $scope.sliderValue;
		var leftAdjust = $element[0].getBoundingClientRect().left + ($scope.thumbWidth/2);
		var width = $element[0].getBoundingClientRect().width - $scope.thumbWidth;
		var runCallBackFunction = angular.isDefined($scope.callBack);
		var minValue = angular.isDefined($scope.minValue) ? $scope.minValue : 0;
		var maxValue = angular.isDefined($scope.maxValue) ? $scope.maxValue : 1;
		if (minValue >= maxValue) {
			minValue = 0;
			maxValue = 1;
		}

		$scope.mouseUpEvent = mouseUpEvent;
		$scope.mouseDown = mouseDown;
		$scope.mouseMoveEvent = mouseMoveEvent;
		$scope.setSliderValueAndRunCallBack = setSliderValueAndRunCallBack;
		$scope.$on('mouseMoveEvent', $scope.mouseMoveEvent);
		$scope.$on('mouseUpEvent', $scope.mouseUpEvent);

		/////////////////////////////////////////////

		function setSliderValueAndRunCallBack(reset) {
			if (reset) {
				$scope.sliderValue = originalValue;
				$scope.leftPos = leftAdjust / 2;
			}
			else {
				$scope.sliderValue = ($scope.leftPos / width) * (maxValue -  minValue) + minValue;
			}
			if (runCallBackFunction) {
				$scope.callBack($scope.sliderValue);
			}
			if (reset) {
				console.log($scope.leftPos, $scope.sliderValue);
			}
		}

		function mouseUpEvent() {
			if ($scope.currentlyMoving) {
				$scope.setSliderValueAndRunCallBack();
				$scope.currentlyMoving = false;
			}
		}

		function mouseDown(event) {
			$scope.currentlyMoving = true;
			$scope.leftPos = event.clientX - leftAdjust;
			$scope.setSliderValueAndRunCallBack();
		}

		function mouseMoveEvent(event, args) {
			if ($scope.currentlyMoving) {
				var leftPos = args.clientX - leftAdjust;
				$scope.leftPos = leftPos < 0 ? 0 : leftPos > width ? width : leftPos;
				if ($scope.leftPos !== lastValue) {
					lastValue = $scope.leftPos;
					$scope.setSliderValueAndRunCallBack();
				}
			}
		}

	}
})();