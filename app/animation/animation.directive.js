(function () {
	'use strict';

	angular
		.module('discSynth')
		.directive('animationDirective', animation);

	function animation() {
		var directive = {
			restrict: 'EA',
			template: '<canvas class="animation"></canvas>',
			replace: true,
			controller: animationController,
			bindToController: true
		};
		return directive;
	}

	animationController.$inject = ['$scope', '$element', '$window', '$localStorage', 'animationService', 'audioService', 'MENU_SIZE'];
	function animationController($scope, $element, $window, $localStorage, animationService, audioService, MENU_SIZE) {

		var cnv = $element[0];
		var ctx = cnv.getContext('2d');
		var state = {
			w: 0,
			h: 0,
			xCenter: 0,
			yCenter: 0
		};

		$scope.windowResize = windowResize;
		$scope.clearCanvas = clearCanvas;
		$scope.animate = animate;
		angular.element($window).bind('resize', $scope.windowResize);

		$scope.windowResize();
		$scope.animate();

		/////////////////////////////////////////////

		function windowResize() {
			state.w = $window.innerWidth - MENU_SIZE;
			state.h = $window.innerHeight;
			state.xCenter = state.w/2;
			state.yCenter = state.h/2;
			cnv.style.width = state.w +'px';
			cnv.style.height = state.h + 'px';
			angular.element(cnv).attr({width: state.w, height: state.h });
		}

		function clearCanvas() {
			ctx.clearRect(0, 0, state.w, state.h);
		}

		function animate() {
			requestAnimationFrame(animate);
			if (animationService.animation) {
				$scope.clearCanvas();
				if (animationService.animation.service) {
					animationService.animation.service.draw(ctx, state, audioService.getAverageDB(), $localStorage.discLength, audioService.clickTrack);
				}

			}
		}
	}
})();