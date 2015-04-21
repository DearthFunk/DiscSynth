angular
	.module('modalModule')
    .directive('helpWindow', helpWindow);

function helpWindow() {
	var directive = {
		restrict: 'EA',
		templateUrl: 'app/modal/helpWindow/helpWindow.html',
		replace: true,
		controller: helpWindowController,
		bindToController: true
	};
	return directive;
}

helpWindowController.$inject = ['$scope'];
function helpWindowController($scope) {


}