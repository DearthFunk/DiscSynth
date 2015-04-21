function getStorageInfo(discService,themeService,visualizerService) {
    return {
        active: true,
        vol: discService.node.masterGain.gain.value,
	    spd: discService.spd,
        len: discService.len,
        synthIndex: discService.synthIndex,
        themeIndex: themeService.theme.index,
        visualizerIndex: visualizerService.visualizerIndex,
        synthTemplates: angular.copy(discService.synthTemplates)
    };
}







