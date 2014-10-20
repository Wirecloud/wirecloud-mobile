/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.3.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 */

"use strict";

var appWindowStyle = (function() {

	Ti.API.info('getPlatformHeight: ' + Yaast.API.UI.getPlatformHeight());
	Ti.API.info('getPlatformWidth: ' + Yaast.API.UI.getPlatformWidth());
	Ti.API.info('getDefaultStatusBar: ' + Yaast.API.UI.getDefaultStatusBar());
	Ti.API.info('window HEIGHT: default');
	Ti.API.info('window WIDTH: default');
	Ti.API.info('window top: ' + parseInt(Yaast.API.UI.getDefaultStatusBar()));
    var _self = {
    	top: Yaast.API.UI.getDefaultStatusBar(),
        exitOnClose: true,
        navBarHidden: true,
        backgroundColor: '#001F6F',
        // Size test
        borderWidth: 1,
        borderColor: '#FFFFFF',
    };

    if(Yaast.API.HW.System.isApple() && parseFloat(Yaast.API.HW.System.getVersion(), 10) >= 7.0){
        _self.statusBarStyle = Ti.UI.iPhone.StatusBar.LIGHT_CONTENT;
    }

    return _self;

}());

module.exports = appWindowStyle;
