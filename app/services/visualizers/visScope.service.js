(function () {
	'use strict';
	angular
		.module('visualizerModule')
		.factory('VisTunnel', visTunnelFactory);

	visTunnelFactory.$inject = [];

	function visTunnelFactory() {

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