angular.module('dropDownElement', [])

    .directive('dropDown', function() {
        return {
            restrict:'C',
            scope: {
                list: "=list",
                selected: "=selected"
            },
            templateUrl:'elements/dropDown/dropDown.html',
            replace: true,
            link: function(scope) {

                var adjust = 4;
	            scope.expanded = false;
	            scope.offset = 0;
	            scope.maxListLength = 10;

                function getIndex() {
                    var index = 0;
                    for (var i = 0; i < scope.list.length; i++) {
                        if (scope.list[i].txt == scope.selected) {
                            index = i;
                            break;
                        }
                    }
                    return index
                }

	            scope.toggleExpanded = function(){
	                scope.expanded = !scope.expanded;
                    var index = getIndex();
					if (index + scope.maxListLength > scope.list.length) {
						scope.offset = scope.list.length - scope.maxListLength;
					}
		            else {
						scope.offset = index;
					}
	            };

	            scope.scroll = function(directionUP) {
					directionUP ?
						scope.offset + scope.maxListLength + adjust < scope.list.length ?
							scope.offset += adjust :
							scope.offset = scope.list.length - scope.maxListLength
						:
						scope.offset - adjust < 0 ?
							scope.offset = 0 :
							scope.offset -= adjust;
	            };

                scope.selectValue = function(index) {
                    scope.expanded = false;
                    scope.selected = scope.list[index].type;

                }
            }
        }
    });
