(function () {
	'use strict';
	angular
		.module('animationModule')
		.factory('mathMachine', mathMachineFactory);

	mathMachineFactory.$inject = [];

	function mathMachineFactory() {

		var VisMathMachine = function (ctx) {
			this.ctx = ctx;
		};

		VisMathMachine.prototype.draw = function() {
			if (this.ctx) {

			}
		};
		return VisMathMachine;

	}
})();