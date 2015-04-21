(function () {
	'use strict';

	angular
		.module('menuServiceModule', [])
		.factory('menu', menu);

	menu.$inject = [];

	function menu() {

		var service = {
			themeIndex: 0
		};

		return service;

	}
})();