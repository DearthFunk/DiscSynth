(function () {
	'use strict';
	angular
		.module('discSynth')
		.directive('html', html);

	html.$inject = [];
	function html() {
		var directive = {
			restrict: 'E',
			controller: htmlController,
			bindToController: true
		};
		return directive
	}

	htmlController.$inject = ['$element', '$rootScope', '$window', 'themeService', 'visualizerService', 'localStorageService'];
	function htmlController($element, $rootScope, $window, themeService, visualizerService, localStorageService) {

		$window.onblur = windowOnBlur;
		$window.onresize = windowOnResize;
		$window.onbeforeunload = windowOnBeforeUnload;

		$element.bind('mousedown', mouseDown);
		$element.bind('mousewheel', mouseWheel);
		$element.bind('mousemove', mouseMove);
		$element.bind('mouseup', mouseUp);
		$element.bind('keydown', keyDown);
		$element.bind('keyup', keyUp);

		/////////////////////////////////////////////////
		
		function windowOnBlur(event) {
			$rootScope.$broadcast('windowBlurEvent', event);
		}
		function windowOnResize() {
			$rootScope.$broadcast('windowResizeEvent', event);
			//visualizerService.windowResize();
		}
		function windowOnBeforeUnload() {
			var discSynthLocalStorage = localStorageService.getStorageInfo(themeService, visualizerService);
			localStorage.setItem('discSynthLocalStorage', JSON.stringify(discSynthLocalStorage));
		}

		/////////////////////////////////////////////////
		
		function mouseWheel(event) {
			if (event.target.localName !== 'textarea') {
				$rootScope.$broadcast('mouseWheelEvent', event);
			}
		}
		function mouseMove(event) {
			if (event.target.localName !== 'textarea') {
				$rootScope.$broadcast('mouseMoveEvent', event);
			}
		}
		function mouseDown(event) {
			if (event.target.localName !== 'textarea') {
				$rootScope.$broadcast('mouseDownEvent', event);
			}
		}
		function mouseUp(event) {
			if (event.target.localName !== 'textarea') {
				$rootScope.$broadcast('mouseUpEvent', event);
			}
		}
		function keyDown(event) {
			if (event.target.localName !== 'textarea') {
				$rootScope.$broadcast('keyDownEvent', event);
			}
		}
		function keyUp(event) {
			if (event.target.localName !== 'textarea') {
				$rootScope.$broadcast('keyUpEvent', event);
			}
		}
	}

})();