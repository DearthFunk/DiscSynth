(function () {
	'use strict';
	angular
		.module('animationModule')
		.factory('tunnel', tunnelFactory);

	tunnelFactory.$inject = ['genColors'];

	function tunnelFactory(genColors) {
		var lines = [];
		var maxLines = 40;

		var service = {
			draw: draw
		};

		return service;

		///////////////////////////////////////

		function draw(ctx, state) {
			var nextIndex = false;
			var db = state.averageDb;
			ctx.lineWidth = 1;
			ctx.strokeStyle = genColors.convert.rgba('#FFFFFF', db > 10 ? db / 200 : 0);
			for (var index = 0; index < maxLines + 1; index++) {
				if (angular.isUndefined(lines[index]) && db > 0) {
					nextIndex = true;
					if (lines[index - 1] > 8 && lines.length < 300) {
						lines.push(1);
					}
				}
				else {
					lines[index] += 1 + (db / 5);
					ctx.beginPath();
					ctx.arc(
						state.xCenter,
						state.yCenter,
						lines[index],
						0,
						2 * Math.PI,
						true
					);
					ctx.stroke();
				}
			}
			for (index = 0; index < lines.length; index++) {
				if (lines[index] > state.xCenter + 60) {
					lines.splice(index, 1);
				}
			}
		}
	}
})();