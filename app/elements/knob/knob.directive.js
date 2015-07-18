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
				label: '=label',
				callBack: '=callBack',
				minValue: '=minValue',
				maxValue: '=maxValue',
				knobValue: '=knobValue'
			},
			template: '<canvas data-ng-dblclick="resetToOriginal()" data-ng-mousedown="mouseDownEvent($event)"></canvas>',
			replace: true,
			controller: knobController,
			bindToController: true
		};
		return directive;
	}

	knobController.$inject = ['$scope', '$element', '$window', 'themeService'];

	function knobController($scope, $element, $window, themeService) {

		if (angular.isUndefined($scope.knobValue)) {
			$scope.knobValue = 0;
		}
		if (angular.isUndefined($scope.size)) {
			$scope.size = 40;
		}
		if (angular.isUndefined($scope.size)) {
			$scope.size = 40;
		}
		if (angular.isUndefined($scope.label)) {
			$scope.label = '';
		}
		var minValue = angular.isUndefined($scope.minValue) ? 0 : $scope.minValue;
		var maxValue = angular.isUndefined($scope.maxValue) ? 1 : $scope.maxValue;

		var startY, originalMouseRotation;
		var panAngleLimit = 160;
		var decimalPercision = 1000;
		var resetValue = Math.round($scope.knobValue * decimalPercision) / decimalPercision;
		var cnvs = $element[0];
		var ctx = cnvs.getContext('2d');
		var rotationValue = ($scope.knobValue - minValue) / (maxValue - minValue);
		var lastValue = rotationValue;

		cnvs.style.width = $scope.size + 'px';
		cnvs.style.height = $scope.size + 'px';
		angular.element(cnvs).attr({width: $scope.size + 'px', height: $scope.size + 'px'});

		$scope.getKnobValue = getKnobValue;
		$scope.eraseAndDrawCanvas = eraseAndDrawCanvas;
		$scope.knobValueUpdate = knobValueUpdate;
		$scope.resetToOriginal = resetToOriginal;
		$scope.mouseDownEvent = mouseDownEvent;
		$scope.mouseUpEvent = mouseUpEvent;
		$scope.mouseMoveEvent = mouseMoveEvent;

		$scope.eraseAndDrawCanvas();

		$scope.$watch('knobValue', $scope.knobValueUpdate);

		////////////////////////////////////////////////////////////////

		function getKnobValue() {
			return Math.round(((maxValue - minValue) * rotationValue + minValue) * decimalPercision) / decimalPercision
		}

		function eraseAndDrawCanvas() {
			ctx.clearRect(0, 0, $scope.size, $scope.size);
			if ($scope.label.length > 0) {
				ctx.beginPath();
				ctx.textAlign = 'center';
				ctx.fillStyle = '#FFFFFF';
				ctx.font = '13px Calibri';
				ctx.fillText($scope.label, $scope.size / 2, $scope.size / 2 + 4);
				ctx.closePath();
			}
			ctx.beginPath();
			ctx.strokeStyle = 'rgba(255,255,255,0.5)';
			ctx.lineWidth = 1;
			ctx.arc($scope.size / 2, $scope.size / 2, $scope.size / 2 - 3, 0, Math.PI * 2, false);
			ctx.stroke();
			ctx.closePath();

			ctx.beginPath();
			ctx.strokeStyle = themeService.theme.menuHighlight;
			ctx.lineWidth = 7;
			ctx.lineCap = 'butt';
			ctx.arc($scope.size / 2, $scope.size / 2, $scope.size / 2 - 10, 0, Math.PI * 2 * (rotationValue), false);
			ctx.stroke();
			ctx.closePath();
		}

		function knobValueUpdate(newValue, oldValue) {
			if (newValue === oldValue) {
				return false;
			}
			rotationValue = ($scope.knobValue - minValue) / (maxValue - minValue);
			$scope.eraseAndDrawCanvas();
		}

		function resetToOriginal() {
			$scope.knobValue = resetValue;
			$scope.eraseAndDrawCanvas();
		}

		///////////////////////////////////////////////

		function mouseDownEvent(e) {
			angular.element($window).bind('mouseup', $scope.mouseUpEvent);
			angular.element($window).bind('mousemove', $scope.mouseMoveEvent);
			startY = e.clientY;
			originalMouseRotation = rotationValue * panAngleLimit;
		}
		function mouseUpEvent() {
			angular.element($window).unbind('mouseup', $scope.mouseUpEvent);
			angular.element($window).unbind('mousemove', $scope.mouseMoveEvent);
			var newKnob = $scope.getKnobValue();
			if ($scope.knobValue !== newKnob) {
				$scope.knobValue = $scope.getKnobValue();
			}
			$scope.eraseAndDrawCanvas();
		}
		function mouseMoveEvent(e) {
			var mouseRotation = originalMouseRotation + startY - e.clientY;
			if (mouseRotation < 0) { mouseRotation = 0; }
			if (mouseRotation > panAngleLimit) { mouseRotation = panAngleLimit;	}
			rotationValue = (mouseRotation / panAngleLimit);
			if (lastValue !== rotationValue) {
				$scope.knobValue = $scope.getKnobValue();
				$scope.eraseAndDrawCanvas();
				lastValue = mouseRotation;
			}
		}
	}
})();