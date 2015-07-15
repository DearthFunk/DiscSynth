(function () {
	'use strict';
	angular
		.module('modalModule', [])
		.directive('modal', modal);

	function modal() {
		var directive = {
			restrict: 'EA',
			templateUrl: 'app/modal/modal.html',
			transclude: true,
			controller: modalController,
			scope: {
				showModal: '=showModal'
			},
			bindToController: true
		};
		return directive;
	}

	modalController.$inject = ['$scope'];
	function modalController($scope) {

		$scope.preventProp = preventProp;

		//////////////////////////////////////////////

		function preventProp(e) {
			e.stopPropagation();
		}
	}
})();