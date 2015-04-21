angular
	.module('visualizerModule')
	.factory('VisParticles', visParticlesFactory);

visParticlesFactory.$inject = [];

function visParticlesFactory() {

	var VisParticles = function (ctx) {
		this.ctx = ctx;
	};

	VisParticles.prototype.draw = function() {
		if (this.ctx) {

		}
	};
	return VisParticles;

}