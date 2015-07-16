(function () {
	'use strict';
	angular
		.module('animationModule')
		.factory('burst', burstFactory);

	burstFactory.$inject = [];

	function burstFactory() {

		var VisBurst = function (ctx) {
			this.ctx = ctx;
		};

		VisBurst.prototype.draw = function () {
			if (this.ctx) {

			}
		};
		return VisBurst;

	}
})();