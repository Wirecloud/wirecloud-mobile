
// This application template requires Titanium Mobile SDK 1.8 or later');	  	

// Method: Init Application
(function() {
	
	var osname = Ti.Platform.osname,
		version = Ti.Platform.version,
		height = Ti.Platform.displayCaps.platformHeight,
		width = Ti.Platform.displayCaps.platformWidth,
	    isTablet = osname === 'ipad' || (osname === 'android' && (width >= 800 && height >= 480));
	    
	if (isTablet) {
		var Window = require('appWindow');
		new Window().open();
	}

	else alert("Not compatible");
	
})();