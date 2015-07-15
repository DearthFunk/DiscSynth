(function () {
	'use strict';
	angular
		.module('eventServiceModule', [])
		.factory("eventService", eventService);

	eventService.$inject = [];

	function eventService() {
		var service = {
			events: {
				mouseX: 0,
				mouseY: 0,
				angle: 0,
				mouseDown: false,
				keyFx1: false,
				keyFx2: false,
				keySquare: false
			}
		};
		return service;
	}
})();