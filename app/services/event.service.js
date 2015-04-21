angular.module('eventServiceModule', [])

    .service("eventService", function($window){
        var eventServiceScope = this;
        eventServiceScope.events = {
	        mouseX: 0,
	        mouseY: 0,
	        angle: 0,
	        mouseDown: false,
	        keyFx1: false,
	        keyFx2: false,
	        keySquare: false
        };
    });

