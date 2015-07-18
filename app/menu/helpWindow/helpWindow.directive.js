(function () {
	'use strict';
	angular
		.module('menuModule')
		.directive('helpWindow', helpWindow);

	function helpWindow() {
		var directive = {
			restrict: 'EA',
			templateUrl: 'app/menu/helpWindow/helpWindow.html',
			replace: true,
			controller: helpWindowController,
			bindToController: true
		};
		return directive;
	}

	helpWindowController.$inject = ['$scope'];
	function helpWindowController($scope) {


	}
})();