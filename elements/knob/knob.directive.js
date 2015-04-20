angular.module('discSynth')

    .directive('knob', function (themeService,$timeout) {
        return {
            restrict:'C',
            scope: {
                size: "=size",
                label: "=label",
                callBack: "=callBack",
                minValue: "=minValue",
                maxValue: "=maxValue",
                knobValue: "=knobValue"
            },
            template:'<canvas data-ng-dblclick="resetToOriginal()" data-ng-mousedown="startMovingKnob($event)"></canvas>',
            replace: true,
            link: function(scope,element) {

	            if (typeof scope.knobValue == 'undefined')  {scope.knobValue = 0;}
                if (typeof scope.size == 'undefined')       {scope.size = 40;}
                var startY, originalMouseRotation;
                var rotating = false;
                var panAngleLimit = 160;
                var decimalPercision = 1000;
                var minValue =  typeof scope.minValue   == 'undefined' ? 0 : scope.minValue;
                var maxValue =  typeof scope.maxValue   == 'undefined' ? 1 : scope.maxValue;
                var runCallback = false;
                var size = scope.size;
                var half = scope.size/2;

                $timeout(function() {
                    runCallback = !(typeof scope.callBack == 'undefined');
                },100);

                var resetValue = Math.round(scope.knobValue * decimalPercision) / decimalPercision;
                var cnvs = element[0];
                var ctx = cnvs.getContext("2d");
                cnvs.style.width = size +'px';
                cnvs.style.height = size + 'px';
                angular.element(cnvs).attr({width: size + "px", height: size + "px"});
	            var rotationValue = (scope.knobValue - minValue) / (maxValue - minValue);
	            var lastValue = rotationValue;


                function getKnobValue() {
                    return Math.round(((maxValue - minValue) * rotationValue + minValue) * decimalPercision) / decimalPercision
                }

                function eraseAndDrawCanvas() {
                    ctx.clearRect(0, 0, size, size);
                    if (typeof scope.label != 'undefined') {
                        ctx.beginPath();
                        ctx.textAlign = 'center';
                        ctx.fillStyle = "#FFFFFF";
                        ctx.font = "13px Calibri";
                        ctx.fillText(scope.label, half, half + 4);
                        ctx.closePath();
                    }
                    ctx.beginPath();
                    ctx.strokeStyle = "rgba(255,255,255,0.8)";
                    ctx.lineWidth = 1;
                    ctx.arc(half,half,half - 3,0,Math.PI*2,false);
                    ctx.stroke();
                    ctx.closePath();
	                ctx.beginPath();
	                ctx.strokeStyle = "rgba(255,255,255,0.3)";
	                ctx.lineWidth = 1;
	                ctx.arc(half,half,half,0,Math.PI*2,false);
	                ctx.stroke();
	                ctx.closePath();

                    ctx.beginPath();
                    ctx.strokeStyle = themeService.theme.menuHighlight;
                    ctx.lineWidth = 7;
                    ctx.lineCap = "butt";
                    ctx.arc(half,half,half - 10, 0, Math.PI*2 * (rotationValue),false);
                    ctx.stroke();
                    ctx.closePath();
                }
                eraseAndDrawCanvas();

				scope.$watch("knobValue", function(newValue, oldValue){
					if(newValue == oldValue){ return; }
					rotationValue = (scope.knobValue - minValue) / (maxValue - minValue);
                    if (runCallback) {scope.callBack.toRun();}
                    eraseAndDrawCanvas();
				});

				scope.resetToOriginal = function() {
					scope.knobValue = resetValue;
                    if (runCallback) {scope.callBack.toRun();}
                    eraseAndDrawCanvas();
				};

                scope.startMovingKnob = function(event) {
                    rotating = true;
                    startY = event.clientY;
                    originalMouseRotation = rotationValue * panAngleLimit;
                };

                scope.$on('themeChangeEvent',function(){
                    eraseAndDrawCanvas();
                });
                scope.$on('mouseUpEvent', function() {
                    if (rotating) {
                        rotating = false;
                        var newKnob = getKnobValue();
                        if (scope.knobValue != newKnob) {
                            scope.knobValue = getKnobValue();
                            if (runCallback) {scope.callBack.toRun();}
                        }
                        eraseAndDrawCanvas();
                    }
                });


                scope.$on('mouseMoveEvent', function(event,args) {
                    if (rotating) {
                        var mouseRotation = originalMouseRotation + startY - args.clientY;
                        if (mouseRotation < 0) { mouseRotation = 0;}
                        if (mouseRotation > panAngleLimit)    { mouseRotation = panAngleLimit;}
						rotationValue =  (mouseRotation / panAngleLimit);
						if(lastValue != rotationValue){
							scope.knobValue = getKnobValue();
                            if (runCallback) {scope.callBack.toRun();}
                            eraseAndDrawCanvas();
							lastValue = mouseRotation;
						}
                    }
                });
            }
        }
    });