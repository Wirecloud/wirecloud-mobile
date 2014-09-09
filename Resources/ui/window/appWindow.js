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
        var worksClass = null;
		var worksObject = null;
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

        // Quit Function
        var quitFunction = function quitFunction() {
            var dialog = Ti.UI.createAlertDialog({
                cancel : 1,
                buttonNames : ['Aceptar', 'Cancelar'],
                message : '¿Quieres salir de la App?',
                title : '- W4T -'
            });
            dialog.addEventListener('click', function(e) {
                if (e.index === 0) {
                    Ti.Android.currentActivity.finish();
                }
                dialog.hide();
                dialog = null;
            });
            dialog.show();
        };
        if(!_isApple){
            self.window.addEventListener('android:back', quitFunction);
        }

        // Logout Function
        var logoutFunction = function logoutFunction() {
            var dialog = Ti.UI.createAlertDialog({
                cancel : 1,
                buttonNames : ['Cerrar', 'Cancelar'],
                message : '¿Quieres cerrar sesión?',
                title : '- W4T -'
            });
            dialog.addEventListener('click', function(e) {
                if (e.index === 0) {                    
                    self.window.removeEventListener('android:back', logoutFunction);
                    self.window.addEventListener('android:back', quitFunction);
                    self.showLoginView();
                }
                dialog.hide();
                dialog = null;
            });
            dialog.show();
        };

        // backToMain Function
        var backToMainFunction = function backToMainFunction() {
            var dialog = Ti.UI.createAlertDialog({
                cancel : 1,
                buttonNames : ['Cerrar', 'Cancelar'],
                message : '¿Quieres volver al menú de Workspaces?',
                title : '- W4T -'
            });
            dialog.addEventListener('click', function(e) {
                if (e.index === 0) {                    
                    self.window.removeEventListener('android:back', backToMainFunction);
                    self.window.addEventListener('android:back', logoutFunction);
                    self.showMainView(userName);
                }
                dialog.hide();
                dialog = null;
            });
            dialog.show();
        };


        // Remove Credentials of Login
        var removeCredentials = function removeCredentials() {
            Ti.App.Properties.removeProperty('cookie_csrftoken');
            Ti.App.Properties.removeProperty('cookie_sessionid');
            Ti.App.Properties.removeProperty('cookie_oilsid');
        };

        // Show Main View
        self.showMainView = function showMainView(userName) {
            if (loginView !== null) {
                self.window.remove(loginView.view);
                loginView.destroy();
                loginView = null;
            }
            self.userName = userName;
            self.window.removeEventListener('android:back', quitFunction);
            self.window.addEventListener('android:back', logoutFunction);
            mainView = require('ui/view/mainView')(self, userName);
            self.window.add(mainView.view);
        };

		var workspaceManagerCallback = function workspaceManagerCallback(data) {
			// TODO if error volver al main o reintentar?
			worksClass = require('workspace/workspaceManager');
			worksObject = worksClass({
			    'topView' : (_isApple && _isIOS7) ? 20 : 0,
				'heightView' : Yaast.API.HW.UI.getPlatformHeight() - Yaast.API.HW.UI.getDefaultStatusBar(),
				'data' : data
			}, self.userName);
			worksClass = null;

			self.window.add(worksObject);
		};

        // Show workspace View
        self.showWorkspaceView = function showWorkspaceView(mashupId) {
            if (mainView !== null) {
                self.window.remove(mainView.view);
                mainView.destroy();
                mainView = null;
            }

            var _conObject = require('/connections/appConnection');
			_conObject.getWirecloud(workspaceManagerCallback, mashupId);
			_conObject = null;

            self.window.removeEventListener('android:back', logoutFunction);
            self.window.addEventListener('android:back', backToMainFunction);
        };

        // Show Login View
        self.showLoginView = function showLoginView() {
            if (mainView !== null) {
                removeCredentials();
                self.window.remove(mainView.view);
                mainView.destroy();
                mainView = null;
            }
            loginView = require('ui/view/loginView')(self);
            self.window.add(loginView.view);
        };

        removeCredentials();
        self.showLoginView();

        return self;

    }());

module.exports = appWindow;
