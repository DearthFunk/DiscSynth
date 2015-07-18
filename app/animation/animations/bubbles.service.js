(function () {
	'use strict';
	angular
		.module('animationModule')
		.factory('bubbles', bubblesFactory);

	bubblesFactory.$inject = ['genColors'];

	function bubblesFactory(genColors) {

		var balls = [];
		var totalBalls = 100;

		var service = {
			draw: draw,
			newBall: newBall
		};
		return service;

		//////////////////////////////////////


		function newBall (state) {
			return {
				x: genColors.get.randomNumber(0, state.w),
				y: state.h + 15,
				r: 15,
				yX: genColors.get.randomNumber(1, 5),
				rX: genColors.get.randomNumber(0.1, 2),
				color: genColors.random.rgb()
			};
		}

		function draw(ctx, state, averageDb) {
			for (var i = 0; i < totalBalls; i++) {
				if (angular.isUndefined(balls[i])) {
					balls.push(service.newBall(state));
				}
				var ball = balls[i];
				ball.y -= (ball.yX * (1 + (averageDb / 100)));
				ball.r -= (ball.rX * (1 + (averageDb / 30)));
				if (ball.y + ball.r < -15 || ball.r < 0) {
					balls[i] = service.newBall(state);
				}
				else {
					ctx.beginPath();
					ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2, false);
					ctx.fillStyle = ball.color;
					ctx.fill();
					ctx.closePath();
				}
			}
		}
	}
})();