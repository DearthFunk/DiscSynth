(function () {
	'use strict';
	angular
		.module('animationModule')
		.factory('scoper', scoperFactory);

	scoperFactory.$inject = [];

	function scoperFactory() {

		var service = {
			draw: draw
		};

		return service;

		///////////////////////////////

		function draw(ctx, state, averageDb) {
			if (averageDb > 10) {
				var timeArray = state.timeArray;
				var barWidth = state.w / timeArray.length;
				ctx.beginPath();
				ctx.lineWidth = 4;
				ctx.lineCap = 'round';
				ctx.lineJoin = 'round';
				ctx.strokeStyle = 'rgba(255,255,255,0.7)';

				for (var i = 0; i < timeArray.length; i++) {
					var percent = timeArray[i] / 256;
					var percent2 = i < timeArray.length ? timeArray[i + 1] / 256 : timeArray[i] / 256;
					var height = state.h * percent;
					var height2 = state.h * percent2;
					var offset = state.h - height - 1;
					var offset2 = state.h - height2 - 1;
					ctx.moveTo(i * barWidth, offset);
					ctx.lineTo(i * barWidth + barWidth, offset2);
				}
				ctx.stroke();
				ctx.closePath();
			}
		}
	}
})();