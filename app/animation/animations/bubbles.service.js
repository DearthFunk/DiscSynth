(function () {
	'use strict';
	angular
		.module('animationModule')
		.factory('bubbles', bubblesFactory);

	bubblesFactory.$inject = ['mathService', 'colorService', 'browserService'];

	function bubblesFactory(mathService, colorService, browserService) {

		var balls = [];
		var totalBalls = browserService.isChrome ? 1000 : 100;

		var Bubbles = function (ctx) {
			this.ctx = ctx;
			this.audioDB = 0;
			this.balls = [];
		};

		Bubbles.prototype.draw = function () {
			if (this.ctx) {
				var db = this.audioDB;
				for (var i = 0; i < totalBalls; i++) {
					if (angular.isUndefined(balls[i])) {
						balls[i] = this.newBall();
					}
					var ball = balls[i];
					ball.y -= (ball.yX * (1 + (db / 100)));
					ball.r -= (ball.rX * (1 + (db / 30)));
					if (ball.y + ball.r < -15 || ball.r < 0) {
						balls[i] = this.newBall();
					}
					else {
						this.ctx.beginPath();
						this.ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2, false);
						this.ctx.fillStyle = ball.color;
						this.ctx.fill();
						this.ctx.closePath();
					}
				}
			}
		};
		Bubbles.prototype.newBall = function () {
			return {
				x: mathService.randomNumber(0, this.ctx.canvas.width),
				y: this.ctx.canvas.height + 15,
				r: 15,
				yX: mathService.randomNumber(1, 5),
				rX: mathService.randomNumber(0.1, 2),
				color: colorService.randomRGB()
			};
		};

		return Bubbles;

	}
})();