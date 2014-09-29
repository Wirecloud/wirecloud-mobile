/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.3.0GA
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
        width: Yaast.API.UI.getPlatformWidth(),
        height: Yaast.API.UI.getPlatformHeight(),
        orientationModes: [Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT]
    };

    if(Yaast.API.HW.System.isApple() && parseFloat(Yaast.API.HW.System.getVersion(), 10) >= 7.0){
        _self.statusBarStyle = Ti.UI.iPhone.StatusBar.LIGHT_CONTENT;
    }

    return _self;

}());

module.exports = appWindowStyle;
