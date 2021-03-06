(function () {
	'use strict';
	angular
		.module('animationModule')
		.factory('burst', burstFactory);

	burstFactory.$inject = ['genColors'];

	function burstFactory(genColors) {

		var particles = [];
		var maxParticles = 40;

		var service = {
			draw: draw,
			newBurst: newBurst
		};
		return service;

		///////////////////////////////////////////////

		function newBurst(state) {
			return {
				speed: genColors.get.randomNumber(3, 10),
				x: state.w / 2,
				y: state.h / 2,
				xD: genColors.get.randomNumber(-1, 1),
				yD: genColors.get.randomNumber(-1, 1),
				rad: genColors.get.randomNumber(10, 150, 0),
				color: genColors.random.hex(),
				o: 1,
				drawBorder: Math.random() >= 0.8
			}
		}

		function draw(ctx, state, averageDb) {
			averageDb = averageDb < 10 ? 0 : averageDb;
			for (var i = 0; i < maxParticles; i++) {
				if (angular.isUndefined(particles[i]) && averageDb > 0) {
					particles.push(service.newBurst(state));
				}
				var p = particles[i];
				if (p && p.rad > 0) {
					ctx.beginPath();
					p.o -= 0.02;
					if (p.o < 0) {
						p.o = 0;
					}

					var gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.rad);
					gradient.addColorStop(0, 'rgba(255,255,255,0.7)');
					gradient.addColorStop(0.5, genColors.convert.rgba(p.color, p.o));
					gradient.addColorStop(1, genColors.convert.rgba(p.color, 0));
					ctx.fillStyle = gradient;

					ctx.arc(p.x, p.y, p.rad, Math.PI * 2, false);

					if (p.drawBorder) {
						ctx.strokeStyle = 'rgba(255,255,255,0.3)';
						ctx.stroke();
					}
					ctx.fill();

					p.rad -= (averageDb > 120 ? 6 : 3) - (averageDb / 100);
					p.x += (p.xD * p.speed);
					p.y += (p.yD * p.speed);
				}

				if (p && p.rad < 0 && averageDb > 0) {
					particles[i] = service.newBurst(state);
				}
			}
		}
	}
})();