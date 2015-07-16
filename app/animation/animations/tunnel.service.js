(function () {
	'use strict';
	angular
		.module('animationModule')
		.factory('tunnel', tunnelFactory);

	tunnelFactory.$inject = ['mathService', 'genColors', 'browserService'];

	function tunnelFactory(mathService, genColors, browserService) {
		var service = {

		}

		return service;

	}
})();