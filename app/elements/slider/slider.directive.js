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
				callBack: "=callBack"
			},
			bindToController: true
		};
		return directive;
	}

	sliderController.$inject = ['$scope', '$element', 'themeService'];
	function sliderController($scope, $element, themeService) {

		var sliding, startX, originalX, newValue;
		var lastValue = $scope.sliderValue;
		var originalValue = $scope.sliderValue;
		var xMin = 0;

		$scope.thumbWidth = 8;
		$scope.themeService = themeService;
		$scope.width = $element[0].getBoundingClientRect().width;

		$scope.resetToOriginal = resetToOriginal;
		$scope.mouseUpEvent = mouseUpEvent;
		$scope.startMovingSlider = startMovingSlider;
		$scope.movePos = movePos;
		$scope.mouseMoveEvent = mouseMoveEvent;
		$scope.$on('mouseMoveEvent', $scope.mouseMoveEvent);
		$scope.$on('mouseUpEvent', $scope.mouseUpEvent);

		/////////////////////////////////////////////

		function resetToOriginal() {
			$scope.sliderValue = originalValue;
			if (angular.isDefined($scope.callBack)) {
				$scope.callBack($scope.sliderValue);
			}
		}

		function mouseUpEvent() {
			if (sliding) {
				if (angular.isDefined($scope.callBack)) {
					$scope.callBack($scope.sliderValue);
				}
				sliding = false;
				$scope.currentlyMoving = false;
			}
		}

		function startMovingSlider(event) {
			$scope.currentlyMoving = true;
			sliding = true;
			startX = event.clientX;
			newValue = $scope.sliderValue * ($scope.width - $scope.thumbWidth);
			originalX = newValue;
		}

		function movePos(e) {
			if (!sliding) {
				$scope.sliderValue = (e.clientX - $element[0].getBoundingClientRect().left) / $scope.width;
				$scope.startMovingSlider(e);

				if (angular.isDefined($scope.callBack)) {
					$scope.callBack($scope.sliderValue);
				}
			}
		}

		function mouseMoveEvent(event, args) {
			if (sliding) {
				var newLeft = originalX - startX + args.clientX;
				if (newLeft < xMin) {
					newLeft = xMin;
					$scope.sliderValue = 0;
				}
				if (newLeft > $scope.width) {
					newLeft = $scope.width;
					$scope.sliderValue = 1;
				}
				newValue = newLeft;
				if (lastValue != newValue) {
					$scope.sliderValue = ((xMin - newValue) / (xMin - $scope.width));
					if (angular.isDefined($scope.callBack)) {
						$scope.callBack($scope.sliderValue);
					}
					lastValue = newValue;
				}
			}
		}
	}
})();