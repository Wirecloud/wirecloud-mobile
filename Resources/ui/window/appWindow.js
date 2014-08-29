/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.3.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 */

"use strict";

// Quick Start
if (!Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'composition').exists()) {
    Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'composition').createDirectory();
}
if (!Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'component').exists()) {
    Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'component').createDirectory();
}

var appWindow = ( function() {

        var theme = require('ui/style/appWindowStyle'), loginView = null,
        mainView = null, storeView = null, self = {
            window : Ti.UI.createWindow(theme)
        };

        // Compatibility 3.3.0GA or above (Android)
        if(!Yaast.API.HW.System.isApple()) {
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
                title : 'AppBase W4T - Aviso'
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
        if(!Yaast.API.HW.System.isApple()){
            self.window.addEventListener('android:back', quitFunction);
        }

        // Logout Function
        var logoutFunction = function logoutFunction() {
            var dialog = Ti.UI.createAlertDialog({
                cancel : 1,
                buttonNames : ['Cerrar', 'Cancelar'],
                message : '¿Quieres cerrar sesión?',
                title : 'AppBase W4T - Aviso'
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
            self.window.removeEventListener('android:back', quitFunction);
            self.window.addEventListener('android:back', logoutFunction);
            mainView = require('ui/view/mainView')(self, userName);
            self.window.add(mainView.view);
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
