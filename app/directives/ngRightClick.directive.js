(function () {
	'use strict';
	angular
		.module('discSynth')
		.directive('ngRightClick', ngRightClick);

	function ngRightClick($parse) {
		function returnFunction(scope, element, attrs) {
			var fn = $parse(attrs.ngRightClick);
			element.bind('contextmenu', contextMenuFunction);

			function contextMenuFunction(event) {
				function scopeApply() {
					event.preventDefault();
					fn(scope, {$event: event});
				}
				scope.$apply(scopeApply);
			}
		}
		return returnFunction;
	}

})();