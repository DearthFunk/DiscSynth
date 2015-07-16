(function () {
	'use strict';
	angular
		.module('animationModule')
		.factory('mathMachine', mathMachineFactory);

	mathMachineFactory.$inject = [];

	function mathMachineFactory() {

		var service = {
			draw: draw
		};
		return service;

		///////////////////////////////

		function draw(ctx, state) {
			for (var i = 0; i < state.discLength; i++) {
				var angleSize = (1 / totalLines) * Math.PI * 2;
				var db = state.average();
				var a1 = angleSize * i;
				var a2 = angleSize * (i + 1);
				var playAngle = state.clickTrack == i;
				var numConnectors = playAngle ? 25 : 10;
				for (var connector = 0; connector < numConnectors; connector++) {
					var angleAdjust = connector / numConnectors;
					var rad = db * 3 * ( playAngle ? 1.8 : 1);
					var x1 = state.xCenter + (rad * angleAdjust) * Math.cos(a1);
					var y1 = state.yCenter + (rad * angleAdjust) * Math.sin(a1);
					var x2 = state.xCenter + (rad * (1 - angleAdjust)) * Math.cos(a2);
					var y2 = state.yCenter + (rad * (1 - angleAdjust)) * Math.sin(a2);
					ctx.beginPath();
					ctx.strokeStyle = playAngle ? '#FFFFFF' : 'rgba(255,255,255,0.7)';
					ctx.moveTo(x1, y1);
					ctx.lineTo(x2, y2);
					ctx.stroke();
					ctx.closePath();
				}
			}
			ctx.strokeStyle = '';
		}
	}
})();