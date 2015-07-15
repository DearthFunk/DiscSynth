(function () {
	'use strict';
	angular
		.module('visualizerModule')
		.factory('VisBurst', visBurstFactory);

	visBurstFactory.$inject = [];

	function visBurstFactory() {

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