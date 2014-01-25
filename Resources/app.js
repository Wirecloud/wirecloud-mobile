/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.2.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 */

"use strict";

(function() {

	var osname = Ti.Platform.osname,
        version = Ti.Platform.version,
        height = Ti.Platform.displayCaps.platformHeight,
        width = Ti.Platform.displayCaps.platformWidth,
        isTablet = osname === 'ipad' || (osname === 'android' && (width >= 800 && height >= 480));

    if (isTablet) {
        var Window = require('ui/window/appWindow');
        Window.open();
    }

    else {
        //TODO Smartphone Compatibility
        alert("Not compatible");
    }

}());