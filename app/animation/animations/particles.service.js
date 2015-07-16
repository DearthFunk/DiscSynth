(function () {
	'use strict';
	angular
		.module('animationModule')
		.factory('particles', particlesFactory);

	particlesFactory.$inject = ['genColors'];

	function particlesFactory(genColors) {

		var particles = [];
		var maxParticles = 1000;

		var service = {
			draw: draw
		};

		return service;

		/////////////////////////////////////

		function newParticle(state) {
			return {
				position: {x: state.xCenter, y: state.yCenter},
				size: mathService.randomNumber(10, 20),
				fillColor: genColors.random.rgba(0.4),
				xMod: genColors.get.randomNumber(-4, 4),
				yMod: genColors.get.randomNumber(-4, 4),
				angle: 0,
				speed: genColors.get.randomNumber(0.1, 0.2),
				orbit: genColors.get.randomNumber(1, 8)
			}
		}

		function draw(ctx, state) {
			var db = state.averageDb / 10;
			for (var i = 0; i < maxParticles; i++) {
				if (angular.isUndefined(particles[i])) {
					particles.push(newParticle(state));
				}
				var particle = particles[i];
				particle.position.x += particle.xMod;
				particle.position.y += particle.yMod;
				particle.angle += particle.speed;
				if (db > 4) {
					var orbit = particle.orbit;
					particle.position.x += Math.cos(i + particle.angle) * orbit;
					particle.position.y += Math.sin(i + particle.angle) * orbit;
					if (particle.position.x < 0 || particle.position.x > w ||
						particle.position.y < 0 || particle.position.y > h ||
						particle.size < 0) {
						particles[i] = newParticle(state);
					}
				}
				particle.size -= 0.3;
				if (particle.size > 0) {
					ctx.beginPath();
					ctx.fillStyle = particle.fillColor;
					ctx.arc(particle.position.x, particle.position.y, particle.size, 0, Math.PI * 2, true);
					ctx.fill();
				}
			}
		}
	}
})();