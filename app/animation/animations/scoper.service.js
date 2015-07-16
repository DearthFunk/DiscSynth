(function () {
	'use strict';
	angular
		.module('animationModule')
		.factory('scoper', scoperFactory);

	scoperFactory.$inject = [];

	function scoperFactory() {

		var VisTunnel = function () {
			this.audioData = [];
		};

		VisTunnel.prototype.draw = function () {
			if (this.ctx) {

			}
		};

		return VisTunnel;
	}
})();