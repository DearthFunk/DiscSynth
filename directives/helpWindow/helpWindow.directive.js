angular
	.module('helpWindowModule', [])
    .directive('helpWindow', helpWindow);

function helpWindow() {
	var directive = {
		restrict: 'EA',
		templateUrl: 'directives/helpWindow/helpWindow.html',
		replace: true,
		controller: helpWindowController,
		bindToController: true
	};
	return directive;
}

helpWindowController.$inject = ['$scope'];
function helpWindowController($scope) {


}