(function () {
	'use strict';
	angular
		.module('animationModule')
		.factory('tunnel', tunnelFactory);

	tunnelFactory.$inject = ['mathService', 'colorService', 'browserService'];

	function tunnelFactory(mathService, colorService, browserService) {
		var service = {

		}

		return service;

	}
})();