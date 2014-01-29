/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.2.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 */

"use strict";

// Libraries
Ti.App.FontAwesome4 = require('fonts/FontAwesome4');
Ti.App.FontAwesome3 = require('fonts/FontAwesome');
Ti.App.API = require('lib/API');
Ti.App.mergeObject = function (obj1, obj2){
    var result = null, key;
    if (obj1 !== null && obj2 !== null){
        for (key in obj2){
            if (obj2.hasOwnProperty(key)){
                obj1[key] = obj2[key];
            }
        }
        result = obj1;
    }
    return result;
};

// Global Variables
Ti.App.isApple = (Ti.Platform.osname === 'ipad');

var appWindow = (function () {

    var _self = Ti.UI.createWindow({
        exitOnClose: true,
        navBarHidden: true,
        backgroundColor: '#FFFFFF',
        width: Ti.Platform.displayCaps.platformWidth,
        height: Ti.Platform.displayCaps.platformHeight,
        orientationModes: [Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT]
    }), loginView;

    // Quick Start
    if(Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'widgets').exists()){
        Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'widgets').createDirectory();
    }
    if(Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'operators').exists()){
        Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'operators').createDirectory();
	}

	// Login HTTP Basic Cache Deleted
	Ti.App.Properties.removeProperty('cookie_csrftoken');
	Ti.App.Properties.removeProperty('cookie_sessionid');

	_self.showMainView = function showMainView(data){

		loginView.destroy();
		_self.remove(loginView);
		loginView = null;
		var mainView = require('ui/view/mainView')(data);
		_self.add(mainView);
		mainView = null;
		delete _self.showMainView;

	};

	loginView = require('ui/view/loginView')(_self);
    _self.add(loginView);

	return _self;

}());

module.exports = appWindow;

