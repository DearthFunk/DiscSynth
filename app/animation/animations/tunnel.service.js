(function () {
	'use strict';
	angular
		.module('animationModule')
		.factory('tunnel', tunnelFactory);

	tunnelFactory.$inject = ['genColors'];

	function tunnelFactory(genColors) {
		var rads = [0];

		var service = {
			draw: draw
		};

		return service;

		///////////////////////////////////////

		function draw(ctx, state, averageDb) {
			var nextIndex = false;
			ctx.lineWidth = 1;
			ctx.strokeStyle = genColors.convert.rgba("#FFFFFF", averageDb > 10 ? averageDb / 200 : 0);

			for (var index = 0; index < rads.length + 1; index++) {
				if (angular.isDefined(rads[index])) {
					rads[index] += 1 + (averageDb / 5);
					ctx.beginPath();
					ctx.arc(
						state.xCenter,
						state.yCenter,
						rads[index],
						0,
						2 * Math.PI,
						true
						);
					ctx.stroke();
				}
				else if (!nextIndex && rads.length) {
					nextIndex = true;
					if (rads[index - 1] > 8 && rads.length < 300) {
						rads.push(1);
					}
				}
			}
			for (index = 0; index < rads.length; index++) {
				if (rads[index] > state.xCenter + 60) {
					rads.splice(index, 1);
				}
			}
		}
	}
})();