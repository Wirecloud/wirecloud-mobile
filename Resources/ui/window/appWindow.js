/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.3.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 */

"use strict";

var appWindow = ( function() {

	var _isApple = Yaast.API.HW.System.isApple();
	var _isIOS7 = (_isApple && Ti.Platform.version.split('.')[0] === '7') ? true : false;

    var theme = require('ui/style/appWindowStyle');
    var loginView = null;
    var mainView = null;
    var workspaceView = null;
    var storeView = null;
    var workspacesObject = null;
    var self = {
        window : Ti.UI.createWindow(theme),
        userName: null
    };

    // Compatibility 3.3.0GA or above (Android)
    if(!_isApple) {
        self.window.addEventListener('open', function() {
            self.window.activity.actionBar.hide();
        });
    }

    // Remove user Credentials
    var removeCredentials = function removeCredentials() {
        Ti.App.Properties.removeProperty('cookie_csrftoken');
        Ti.App.Properties.removeProperty('cookie_sessionid');
        Ti.App.Properties.removeProperty('cookie_oilsid');
    };

    // Quit Function (only for Android!)
    var quitFunction = function quitFunction() {
        var dialog = Ti.UI.createAlertDialog({
            cancel : 1,
            buttonNames : ['Aceptar', 'Cancelar'],
            message : 'La App se cerrará!',
            title : '- W4T -'
        });
        dialog.addEventListener('click', function(e) {
            if (e.index === 0) {
            	// Close the app 
                Ti.Android.currentActivity.finish();
            }
            dialog.hide();
            dialog = null;
        });
        dialog.show();
    };

	// Clean current View
	self.cleanCurrentView = function cleanCurrentView() {
		switch (Yaast.Sandbox.currentView) {
			case 'login':
			    if (!_isApple) {
                    self.window.removeEventListener('android:back', quitFunction);
                }
				self.window.remove(loginView.view);
                loginView.destroy();
                loginView = null;
				break;
			case 'menu':
			    if (!_isApple) {
                    self.window.removeEventListener('android:back', logoutFunction);
                }
                self.window.remove(mainView.view);
                mainView.destroy();
                mainView = null;
				break;
			case 'workspace':
			    if (!_isApple) {
                    self.window.removeEventListener('android:back', self.backToMainFunction);
                }
				self.window.remove(workspaceView.view);
				workspaceView.destroy();
                workspaceView = null;
				break;
			case null:
				Ti.API.info('++ APP Error trying to clean unknown view ++');
				break;
		}
		Yaast.Sandbox.currentView = null;
	};


	// -- LOGIN --

    // Show Login View
    self.showLoginView = function showLoginView() {

        loginView = require('ui/view/loginView')(self);
    	if (!_isApple) {
            self.window.addEventListener('android:back', quitFunction);
        }
        self.window.add(loginView.view);
        Yaast.Sandbox.currentView = 'login';
    };

    // Logout Function
    var logoutFunction = function logoutFunction() {
        var dialog = Ti.UI.createAlertDialog({
            cancel : 1,
            buttonNames : ['Cerrar', 'Cancelar'],
            message : '¿Quieres cerrar sesión?',
            title : '- W4T -- ' + self.userName
        });
        dialog.addEventListener('click', function(e) {
            if (e.index === 0) {
                self.cleanCurrentView();
                removeCredentials();
                self.showLoginView();
            }
            dialog.hide();
            dialog = null;
        });
        dialog.show();
    };


	// -- MAIN --

    // Show Main View
    self.showMainView = function showMainView(userName) {
        self.userName = userName;

		var timestamp = new Date().getTime();
        // Create directory and metainfo for new users
        var userMeta = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, Yaast.Sandbox.instanceDir + userName + '/usermeta');
        if (!userMeta.exists()) {
        	Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, Yaast.Sandbox.instanceDir).createDirectory();
        	Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, Yaast.Sandbox.instanceDir + userName).createDirectory();
        	var userDic = {};
        	userDic[userName] = timestamp;
            var initialInstanceMeta = {
            	'url': Yaast.Sandbox.currentURL,
        		'lastUser': userName,
        		'users': userDic,
        		'folderId':Yaast.Sandbox.appConfig.lastId
        	};
        	Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, Yaast.Sandbox.instanceDir + '/workspacemeta').write(JSON.stringify(initialInstanceMeta), false);
        	var initialMeta = {
        		'userName': userName,
        	};
        	userMeta.write(JSON.stringify(initialMeta), false);
        } else {
        	var metaInstance = JSON.parse(Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, Yaast.Sandbox.instanceDir + '/workspacemeta').read().toString());
        	// Update lasUser in meta
            metaInstance.lastUser = userName;
            metaInstance.users[userName] = timestamp;
        	Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, Yaast.Sandbox.instanceDir + '/workspacemeta').write(JSON.stringify(metaInstance), false);
        }

		// Back button
		if (!_isApple) {
            self.window.addEventListener('android:back', logoutFunction);
        }
        mainView = require('ui/view/mainView')(self, userName);
        self.window.add(mainView.view);
        Yaast.Sandbox.currentView = 'menu';
    };

    // backToMain Function
    self.backToMainFunction = function backToMainFunction() {
        var dialog = Ti.UI.createAlertDialog({
            cancel : 1,
            buttonNames : ['Volver', 'Cancelar'],
            message : '¿Quieres volver al menú de Workspaces?',
            title : '- W4T -- ' + self.userName
        });
        dialog.addEventListener('click', function(e) {
            if (e.index === 0) {
            	self.cleanCurrentView();
                self.showMainView(self.userName);
            }
            dialog.hide();
            dialog = null;
        });
        dialog.show();
    };

	// -- WORKSPACE --

    // Show workspace View
    self.showWorkspaceView = function showWorkspaceView(mashupId) {
    	self.cleanCurrentView();
        var _conObject = require('/connections/appConnection');
		_conObject.getWirecloud(workspaceViewCallback, mashupId);
		_conObject = null;
    };

	self.cleanAndReturnToMain = function cleanAndReturnToMain(){
		self.cleanCurrentView();
		self.showMainView(self.userName);
	};

	// showWorkspaceView Callback
	var workspaceViewCallback = function workspaceViewCallback(data) {
		// TODO if error volver al main o reintentar?
        if (!_isApple) {
            self.window.addEventListener('android:back', self.backToMainFunction);
        }

        var theWorkspaceInstance = require('ui/view/workspaceView');
		workspaceView = theWorkspaceInstance({
		    'topView' : Yaast.API.UI.getDefaultStatusBar(),
			'heightView' : Yaast.API.UI.getPlatformHeight() - Yaast.API.UI.getDefaultStatusBar(),
			'data' : data
		}, self.userName, self.cleanAndReturnToMain);

		self.window.add(workspaceView.view);
		Yaast.Sandbox.currentView = 'workspace';
	};


	// -- INIT --

	// Clean
    removeCredentials();
    
    // Load Login
    self.showLoginView();

    return self;

}());

module.exports = appWindow;
