(function () {
	'use strict';
	angular
		.module('animationModule')
		.factory('tunnel', tunnelFactory);

	tunnelFactory.$inject = ['genColors'];

	function tunnelFactory(genColors) {
		var rads = [];
		var maxLines = 900;

		var service = {
			draw: draw
		};

		return service;

		///////////////////////////////////////

		function draw(ctx, state, averageDb) {
			ctx.lineWidth = 1;
			ctx.strokeStyle = genColors.convert.rgba('#FFFFFF', averageDb > 10 ? averageDb / 200 : 0);
			for (var i = 0; i < maxLines + 1; i++) {

				if (angular.isUndefined(rads[i]) && averageDb > 0) {
					rads.push(1 + i);
				}

				if (rads[i]) {
					rads[i] += 1 + (averageDb / 5);
					ctx.beginPath();
					ctx.arc(
						state.xCenter,
						state.yCenter,
						rads[i],
						0,
						2 * Math.PI,
						true
					);
					ctx.stroke();
				}
			}
			for (i = 0; i < rads.length; i++) {
				if (rads[i] > state.xCenter + 60) {
					rads.splice(i, 1);
				}
			}
		}
	}
})();