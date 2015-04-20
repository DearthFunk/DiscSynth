angular
	.module('discSynth')
    .directive('dropDown', dropDown);

dropDown.$inject = [];
function dropDown() {
	var directive = {
		restrict: 'EA',
		templateUrl: 'elements/dropDown/dropDown.html',
		transclude: true,
		controller: dropDownController,
		scope: {
			list: '=list',
			selected: '=selected'
		},
		bindToController: true
	};

	return directive;
}

	dropDownController.$inject = ['$scope'];
	function dropDownController($scope) {

	    var adjust = 4;
		$scope.expanded = false;
		$scope.offset = 0;
		$scope.maxListLength = 10;

		$scope.toggleExpanded = toggleExpanded;
		$scope.scroll = scroll;
		$scope.selectValue = selectValue;
		$scope.getIndex = getIndex;

		////////////////////////////////////////

	    function getIndex() {
	        var index = 0;
	        for (var i = 0; i < $scope.list.length; i++) {
	            if ($scope.list[i].txt == $scope.selected) {
	                index = i;
	                break;
	            }
	        }
	        return index
	    }
		function toggleExpanded(){
	        $scope.expanded = !$scope.expanded;
	        var index = $scope.getIndex();
			$scope.offset = index + $scope.maxListLength > $scope.list.length ?
				$scope.list.length - $scope.maxListLength :
				index;
	    }
		function scroll(directionUP) {
			directionUP ?
				$scope.offset + $scope.maxListLength + adjust < $scope.list.length ?
					$scope.offset += adjust :
					$scope.offset = $scope.list.length - $scope.maxListLength
				:
				$scope.offset - adjust < 0 ?
					$scope.offset = 0 :
					$scope.offset -= adjust;
	    }
		function selectValue(index) {
	        $scope.expanded = false;
	        $scope.selected = $scope.list[index].type;
	    }
	}