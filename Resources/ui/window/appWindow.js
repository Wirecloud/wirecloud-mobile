/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.2.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 */

"use strict";

// Libraries
/** It shows a message on the console log.
 * @param {String} msg It will be shown on console.
 * @param {String} newType message level to show on console.
 * @param {Object} error javascript exception object.
 * @param {Object} extra datails about error. */
Ti.App.Log = function(msg, newType, error, extra){
    var type = 'Error', _self = {
        'name': 'AppBaseLog',
        'message': msg
    };
    if(error){
        _self.details = (extra) ? {
            'message': error.message,
            'info': extra
        } : error.message;
        _self.source = error.sourceURL;
    }
    if(newType){
        type = newType;
    }
    Ti.API[type](_self);
    return _self;
};
Ti.App.FontAwesome4 = require('fonts/FontAwesome4');
Ti.App.FontAwesome3 = require('fonts/FontAwesome');
Ti.App.API = require('lib/API');
Ti.App.mergeObject = function (obj1, obj2){
    var result = null, key;
    if (obj1 !== null && obj2 !== null){
        for (key in obj2){
            obj1[key] = obj2[key];
        }
        result = obj1;
    }
    return result;
};

// Global Variables
Ti.App.isApple = (Ti.Platform.getOsname() === 'ipad' || Ti.Platform.getOsname() === 'iphone');
Ti.App.isRetina = (Ti.App.isApple && Ti.Platform.displayCaps.getDpi() === 260) ? true : false;
Ti.App.platformHeight = Ti.Platform.displayCaps.getPlatformHeight();
Ti.App.platformWidth = Ti.Platform.displayCaps.getPlatformWidth();

var appWindow = (function () {

    var theme = require('ui/style/appWindowStyle'),
     _self = Ti.UI.createWindow(theme), loginView;

    // Quick Start
    if(Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'composition').exists()){
        Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'composition').createDirectory();
    }
    if(Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'component').exists()){
        Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'component').createDirectory();
	}

	// Login HTTP Basic Cache Deleted
	Ti.App.Properties.removeProperty('cookie_csrftoken');
	Ti.App.Properties.removeProperty('cookie_sessionid');
	Ti.App.Properties.removeProperty('cookie_oilsid');

	_self.showMainView = function showMainView(data) {

		_self.remove(loginView.view);
		loginView.destroy();
		loginView = null;
		var mainView = require('ui/view/mainView')(data);
		_self.add(mainView);
		mainView = null;
		delete _self.showMainView;

	};

	loginView = require('ui/view/loginView')(_self);
    _self.add(loginView.view);

	return _self;

}());

module.exports = appWindow;

