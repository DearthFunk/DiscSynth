angular
	.module('discSynth', [

	    'eventServiceModule',
	    'discServiceModule',
	    'themeServiceModule',
	    'visualizerServiceModule',

	    'knobElement',
		'sliderHorizontalElement',
	    'dropDownElement',

	    'importExportWindowModule',
	    'helpWindowModule',
	    'synthControlsModule',
	    'menuModule'
	])
	.constant('SYNTHS', [
		{osc1:{type:"sine",detune:-400},osc2:{type:"square",detune:0},osc3:{type:"sawtooth",detune:1675},bitcrusher:{bypass:false,bits:4,bufferSize:4096,normFreq:0},delay:{bypass:true,wetLevel:0.5,dryLevel:1,feedback:0.44999998807907104,delayTime:0.10000000149011612,cutoff:20000},overdrive:{bypass:true,curveAmount:0.725,drive:1,outputGain:1},moogfilter:{bypass:false,bufferSize:5910.4,cutoff:0.552,resonance:3.8},tremolo:{bypass:true,intensity:0.3,rate:5,stereoPhase:100},convolver:{bypass:true,highCut: 22050,lowCut: 20,dryLevel: 1,wetLevel: 1}},
		{osc1:{type:"square",detune:-925},osc2:{type:"square",detune:0},osc3:{type:"sawtooth",detune:-925},bitcrusher:{bypass:false,bits:4,bufferSize:4096,normFreq:0},delay:{bypass:false,wetLevel:0.5,dryLevel:1,feedback:0.44999998807907104,delayTime:0.10000000149011612,cutoff:20000},overdrive:{bypass:true,curveAmount:0.725,drive:1,outputGain:1},moogfilter:{bypass:false,bufferSize:5910.4,cutoff:0.552,resonance:3.8},tremolo:{bypass:true,intensity:0.3,rate:5,stereoPhase:30},convolver:{bypass:false,highCut: 22050,lowCut: 20,dryLevel: 1,wetLevel: 1}},
		{osc1:{type:"square",detune:-1000},osc2:{type:"sine",detune:200},osc3:{type:"sine",detune:1000},bitcrusher:{bypass:true,bits:4,bufferSize:4096,normFreq:0},delay:{bypass:false,wetLevel:0.718999981880188,dryLevel:1,feedback:0.593999981880188,delayTime:121.9749984741211,cutoff:20000},overdrive:{bypass:false,curveAmount:0.95,drive:0.9440000057220459,outputGain:1},moogfilter:{bypass:true,bufferSize:5910.4,cutoff:0.552,resonance:3.8},tremolo:{bypass:true,intensity:0.831,rate:0.594,stereoPhase:0},convolver:{bypass:true,highCut: 22050,lowCut: 20,dryLevel: 1,wetLevel: 1}},
		{osc1:{type:"square",detune:0},osc2:{type:"square",detune:0},osc3:{type:"sawtooth",detune:0},bitcrusher:{bypass:true,bits:4,bufferSize:4096,normFreq:0},delay:{bypass:true,wetLevel:0.5,dryLevel:1,feedback:0.44999998807907104,delayTime:0.10000000149011612,cutoff:20000},overdrive:{bypass:false,curveAmount:0.725,drive:1,outputGain:1},moogfilter:{bypass:true,bufferSize:4096,cutoff:0.065,resonance:3.5},tremolo:{bypass:true,intensity:0.3,rate:5,stereoPhase:180},convolver:{bypass:false,highCut: 22050,lowCut: 20,dryLevel: 1,wetLevel: 1}},
		{osc1:{type:"sine",detune:0},osc2:{type:"sine",detune:600},osc3:{type:"sine",detune:0},bitcrusher:{bypass:true,bits:4,bufferSize:4096,normFreq:0},delay:{bypass:false,wetLevel:1,dryLevel:0,feedback:0.6940000057220459,delayTime:16.975000381469727,cutoff:3752.875},overdrive:{bypass:true,curveAmount:0.725,drive:1,outputGain:1},moogfilter:{bypass:false,bufferSize:1777.6,cutoff:0.215,resonance:0.525},tremolo:{bypass:true,intensity:0.875,rate:1,stereoPhase:0},convolver:{bypass:false,highCut: 22050,lowCut: 20,dryLevel: 1,wetLevel: 1}},
		{osc1:{type:"square",detune:-1175},osc2:{type:"sawtooth",detune:475},osc3:{type:"triangle",detune:-475},bitcrusher:{bypass:false,bits:4,bufferSize:4096,normFreq:0},delay:{bypass:false,wetLevel:0.5,dryLevel:1,feedback:0.44999998807907104,delayTime:0.10000000149011612,cutoff:20000},overdrive:{bypass:false,curveAmount:0.725,drive:1,outputGain:1},moogfilter:{bypass:false,bufferSize:12260.8,cutoff:0.252,resonance:0.55},tremolo:{bypass:true,intensity:0.3,rate:5,stereoPhase:0},convolver:{bypass:true,highCut: 22050,lowCut: 20,dryLevel: 1,wetLevel: 1}}
	])
	.controller('discController', discController);

	discController.$inject = ['$scope', 'themeService'];

    function discController( $scope , themeService ){
        $scope.importExportVisible = false;
        $scope.helpWindowVisible = false;
        $scope.themeService = themeService;
    }
