/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.3.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 * App Base Development Framework Team
 *
 *  Alejandro F.Carrera
 *  Carlos Blanco Vallejo
 *  Santiago Blanco Ventas
 *
 */

"use strict";

// Yaast Framework Init (Global Scope)
var Yaast = {
    "Log": function(msg, type, error, extra) {
        var self = {
            'name': 'W4TLog',
            'message': msg
        };
        if(error) {
            self.details = (extra) ? {
                'message': error.message,
                'info': extra
            } : error.message;
            self.source = error.sourceURL;
        }
        Ti.API[type](self);
        return self;
    },
    "FontAwesome": require('fonts/FontAwesome4'),
    "Sandbox": {
    	'currentView': null,
    }
};
Yaast.API = require('lib/API');

Ti.API.info('WELCOME 2 Wirecloud 4 Tablet!!!');
Ti.API.info('Screen Density: ' + Yaast.API.UI.getScreenDensity());

// Merge shortcut
Yaast["MergeObject"] = Yaast.API.SW.Utils.mergeObject;

(function() {
	Ti.API.info('Ti.Platform.displayCaps.density: ' + Ti.Platform.displayCaps.density);
	Ti.API.info('Ti.Platform.displayCaps.dpi: ' + Ti.Platform.displayCaps.dpi);
	Ti.API.info('Ti.Platform.displayCaps.platformHeight: ' + Ti.Platform.displayCaps.platformHeight);
	Ti.API.info('Ti.Platform.displayCaps.platformWidth: ' + Ti.Platform.displayCaps.platformWidth);
	if(Ti.Platform.osname === 'android'){
		Ti.API.info('Ti.Platform.displayCaps.xdpi: ' + Ti.Platform.displayCaps.xdpi);
		Ti.API.info('Ti.Platform.displayCaps.ydpi: ' + Ti.Platform.displayCaps.ydpi);
		Ti.API.info('Ti.Platform.displayCaps.logicalDensityFactor: ' + Ti.Platform.displayCaps.logicalDensityFactor);
	}

    if (Yaast.API.HW.System.isTablet()) {
        var Window = require('ui/window/appWindow');
        Window.window.open();
    }
    else  alert("Wirecloud4Tablet has not compatibility with Smartphone's'");

}());