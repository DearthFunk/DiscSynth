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

	htmlController.$inject = ['$element', '$rootScope', '$window', 'themeService', 'visualizerService', 'localStorageService', 'audioService', 'discService'];
	function htmlController($element, $rootScope, $window, themeService, visualizerService, localStorageService, audioService, discService) {

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
			localStorageService.setLocalStorage(themeService,visualizerService, audioService, discService);
		}

		/////////////////////////////////////////////////
		
		function mouseWheel(event) {
			if (event.target.localName === 'textarea'){return;}
			$rootScope.$broadcast('mouseWheelEvent', event);
		}
		function mouseMove(event) {
			if (event.target.localName === 'textarea'){return;}
			$rootScope.$broadcast('mouseMoveEvent', event);
		}
		function mouseDown(event) {
			if (event.target.localName === 'textarea'){return;}
			$rootScope.$broadcast('mouseDownEvent', event);
		}
		function mouseUp(event) {
			if (event.target.localName === 'textarea'){return;}
			$rootScope.$broadcast('mouseUpEvent', event);
		}
		function keyDown(event) {
			if (event.target.localName === 'textarea'){return;}
			$rootScope.$broadcast('keyDownEvent', event);
		}
		function keyUp(event) {
			if (event.target.localName === 'textarea'){return;}
			$rootScope.$broadcast('keyUpEvent', event);
		}
	}

})();