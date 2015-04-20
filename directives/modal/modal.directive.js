angular
	.module('modalModule', [])
    .directive('modal', modal);

function modal() {
	var directive = {
		restrict: 'EA',
		templateUrl: 'directives/modal/modal.html',
		replace: true,
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

	console.log(1);

	//////////////////////////////////////////////

    function preventProp(e) {
        e.stopPropagation();
    }
}