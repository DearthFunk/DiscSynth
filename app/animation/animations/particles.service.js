(function () {
	'use strict';
	angular
		.module('animationModule')
		.factory('particles', particlesFactory);

	particlesFactory.$inject = [];

	function particlesFactory() {

		var VisParticles = function (ctx) {
			this.ctx = ctx;
		};

		VisParticles.prototype.draw = function () {
			if (this.ctx) {

			}
		};
		return VisParticles;

	}
})();