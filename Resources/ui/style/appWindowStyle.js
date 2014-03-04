/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.2.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 */

"use strict";

var appWindowStyle = (function() {

    var _self = {
        exitOnClose: true,
        navBarHidden: true,
        backgroundColor: '#1F3346',
        width: Ti.App.API.HW.System.getPlatformWidth(),
        height: Ti.App.API.HW.System.getPlatformHeight(),
        orientationModes: [Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT]
    };

    return _self;

}());

module.exports = appWindowStyle;
