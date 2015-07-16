(function () {
	'use strict';
	angular
		.module('animationModule')
		.factory('bubbles', bubblesFactory);

	bubblesFactory.$inject = ['mathService', 'genColors', 'browserService'];

	function bubblesFactory(mathService, genColors, browserService) {

		var balls = [];
		var totalBalls = browserService.isChrome ? 1000 : 100;

		var service = {
			draw: draw
		};
		return service;

		//////////////////////////////////////


		function newBall (state) {
			return {
				x: mathService.randomNumber(0, state.width),
				y: this.ctx.canvas.height + 15,
				r: 15,
				yX: mathService.randomNumber(1, 5),
				rX: mathService.randomNumber(0.1, 2),
				color: genColors.random.rgb()
			};
		}

		function draw(ctx, state) {
			var db = state.audioDB;
			for (var i = 0; i < totalBalls; i++) {
				if (angular.isUndefined(balls[i])) {
					balls.push(newBall());
				}
				var ball = balls[i];
				ball.y -= (ball.yX * (1 + (db / 100)));
				ball.r -= (ball.rX * (1 + (db / 30)));
				if (ball.y + ball.r < -15 || ball.r < 0) {
					balls[i] = newBall();
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