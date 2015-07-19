(function () {
	'use strict';
	angular
		.module('discSynth')
		.directive('knob', knob);

	knob.$inject = [];

	function knob() {
		var directive = {
			restrict: 'EA',
			scope: {
				size: '=size',
				label: '=?label',
				minValue: '=?minValue',
				maxValue: '=?maxValue',
				knobValue: '=knobValue'
			},
			template: '<canvas class="knob" data-ng-dblclick="setKnobValue(true)" data-ng-mousedown="mouseDownEvent($event)"></canvas>',
			replace: true,
			controller: knobController,
			bindToController: true
		};
		return directive;
	}

	knobController.$inject = ['$scope', '$element', '$window', 'themeService'];

	function knobController($scope, $element, $window, themeService) {

		if (angular.isUndefined($scope.size)) {
			$scope.size = 40;
		}

		var min = angular.isUndefined($scope.minValue) ? 0 : $scope.minValue;
		var max = angular.isUndefined($scope.maxValue) ? 1 : $scope.maxValue;
		var range = max - min;

		var startY, startRotation, rotationValue;
		var panAngleLimit = 160;
		var decimalPercision = 1000;
		var cnvs = $element[0];
		var ctx = cnvs.getContext('2d');
		var originalRotationValue = ($scope.knobValue - min) / range;
		var resetValue = Math.round($scope.knobValue * decimalPercision) / decimalPercision;

		cnvs.style.width = $scope.size + 'px';
		cnvs.style.height = $scope.size + 'px';
		angular.element(cnvs).attr({width: $scope.size + 'px', height: $scope.size + 'px'});

		$scope.eraseAndDrawCanvas = eraseAndDrawCanvas;
		$scope.mouseDownEvent = mouseDownEvent;
		$scope.mouseUpEvent = mouseUpEvent;
		$scope.mouseMoveEvent = mouseMoveEvent;
		$scope.setKnobValue = setKnobValue;
		$scope.externalUpdateKnobValue = externalUpdateKnobValue;

		$scope.setKnobValue(true);

		$scope.$on('redrawSliders', $scope.eraseAndDrawCanvas);
		$scope.$watch('knobValue', $scope.externalUpdateKnobValue);

		////////////////////////////////////////////////////////////////

		function eraseAndDrawCanvas() {
			ctx.clearRect(0, 0, $scope.size, $scope.size);
			var half = $scope.size / 2;
			if ($scope.label) {
				ctx.beginPath();
				ctx.textAlign = 'center';
				ctx.fillStyle = '#FFFFFF';
				ctx.font = '13px Calibri';
				ctx.fillText($scope.label, half, half + 4);
				ctx.closePath();
			}
			ctx.beginPath();
			ctx.strokeStyle = 'rgba(255,255,255,0.5)';
			ctx.lineWidth = 1;
			ctx.arc(half, half, half - 3, 0, Math.PI * 2, false);
			ctx.stroke();
			ctx.closePath();

			ctx.beginPath();
			ctx.strokeStyle = themeService.theme.menuHighlight;
			ctx.lineWidth = 7;
			ctx.lineCap = 'butt';
			ctx.arc(half, half, half - 10, 0, Math.PI * 2 * (rotationValue), false);
			ctx.stroke();
			ctx.closePath();
		}

		function setKnobValue(reset){
			if (reset) {
				$scope.knobValue = resetValue;
				rotationValue = originalRotationValue;
			}
			else {
				$scope.knobValue = Math.round((range * rotationValue + min) * decimalPercision) / decimalPercision;
			}
			$scope.eraseAndDrawCanvas();
		}

		function externalUpdateKnobValue() {
			console.log(1);
			rotationValue = ($scope.knobValue - min) / range;
			$scope.eraseAndDrawCanvas();
		}

		///////////////////////////////////////////////

		function mouseDownEvent(e) {
			angular.element($window).bind('mouseup', $scope.mouseUpEvent);
			angular.element($window).bind('mousemove', $scope.mouseMoveEvent);
			startY = e.clientY;
			startRotation = rotationValue * panAngleLimit;
		}
		function mouseUpEvent() {
			angular.element($window).unbind('mouseup', $scope.mouseUpEvent);
			angular.element($window).unbind('mousemove', $scope.mouseMoveEvent);
			$scope.setKnobValue();
		}
		function mouseMoveEvent(e) {
			var mouseRotation = startRotation + startY - e.clientY;
			if (mouseRotation < 0) { mouseRotation = 0; }
			if (mouseRotation > panAngleLimit) { mouseRotation = panAngleLimit;	}
			rotationValue = mouseRotation / panAngleLimit;
			$scope.setKnobValue();
			$scope.$apply();
		}
	}
})();