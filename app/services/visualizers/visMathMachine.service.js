angular
	.module('visualizerModule')
	.factory('VisMathMachine', visMathMachineFactory);

visMathMachineFactory.$inject = [];

function visMathMachineFactory() {

	var VisMathMachine = function (ctx) {
		this.ctx = ctx;
	};

	VisMathMachine.prototype.draw = function() {
		if (this.ctx) {

		}
	};
	return VisMathMachine;

}