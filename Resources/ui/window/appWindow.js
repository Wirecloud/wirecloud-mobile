/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.2.2GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 */

"use strict";

// Quick Start
if(!Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'composition').exists()){
    Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'composition').createDirectory();
}
if(!Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'component').exists()){
    Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'component').createDirectory();
}

var appWindow = (function () {

    Yaast.Sandbox = {
        'tabView': null,
        'componentPos': null
    };

    var theme = require('ui/style/appWindowStyle'),
     loginView = null, mainView = null, storeView = null,
     _self = {
         view: Ti.UI.createWindow(theme)
     };
     
     // Compatibility 3.3.0GA or above
     _self.view.addEventListener('open', function() {
        _self.view.activity.actionBar.hide();
     });

    _self.removeCredentials = function removeCredentials() {
        Ti.App.Properties.removeProperty('cookie_csrftoken');
        Ti.App.Properties.removeProperty('cookie_sessionid');
        Ti.App.Properties.removeProperty('cookie_oilsid');
    };

	_self.showMainView = function showMainView() {
	    if(loginView !== null){
	        _self.view.remove(loginView.view);
            loginView.destroy();
            loginView = null;
	    }
		if(storeView !== null){
		    _self.view.remove(storeView.view);
            storeView.destroy();
            storeView = null;
		}
		mainView = require('ui/view/mainView')(_self);
		_self.view.add(mainView.view);
	};

    _self.showLoginView = function showLoginView(){
        if(mainView !== null){
            _self.removeCredentials();
            _self.view.remove(mainView.view);
            mainView.destroy();
            mainView = null;
        }
        loginView = require('ui/view/loginView')(_self);
        _self.view.add(loginView.view);
    };

    _self.showStoreView = function showStoreView(){
        if(mainView !== null){
            _self.view.remove(mainView.view);
            mainView.destroy();
            mainView = null;
        }
        storeView = require('ui/view/storeView')(_self);
        _self.view.add(storeView.view);
    };

    _self.removeCredentials();
    _self.showLoginView();

	return _self;

}());

module.exports = appWindow;
