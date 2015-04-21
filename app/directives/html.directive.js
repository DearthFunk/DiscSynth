angular
	.module('discSynth')
	.directive('html', function($rootScope,$window, themeService, eventService, discService, visualizerService){
	return {
		restrict: 'E',
		link: function(scope,element){

			//window events
			$window.onblur = function(event) {
				$rootScope.$broadcast("windowBlurEvent",event);
			};
			$window.onresize = function() {
				$rootScope.$broadcast("windowResizeEvent",event);
				discService.windowResize();
				visualizerService.windowResize();
			};
			$window.onbeforeunload = function(){
				var discSynthLocalStorage = getStorageInfo(discService,themeService,visualizerService);
				localStorage.setItem('discSynthLocalStorage', JSON.stringify(discSynthLocalStorage));
			};

			//mouse events
			element.bind("mousewheel", function(event){
				if (event.target.localName != "textarea") {
					$rootScope.$broadcast("mouseWheelEvent",event);
				}
			});
			element.bind("mousemove", function(event) {
				if (event.target.localName != "textarea") {
					discService.handleMouseMove(event);
					$rootScope.$broadcast("mouseMoveEvent",event);
				}
			});
			element.bind("mousedown", function(event) {
				if (event.target.localName != "textarea") {
					discService.handleMouseDown(event);
					$rootScope.$broadcast("mouseDownEvent",event);
				}
			});
			element.bind("mouseup", function(event){
				if (event.target.localName != "textarea") {
					discService.handleMouseUp();
					$rootScope.$broadcast("mouseUpEvent",event);
				}
			});

			//keyboard events
			element.bind("keydown", function(event){
				if (event.target.localName != "textarea") {
					discService.handleKeyDown(event);
				}
			});
			element.bind("keyup", function(event) {
				if (event.target.localName != "textarea") {
					discService.handleKeyUp(event);
				}
			});
		}
	}
})
