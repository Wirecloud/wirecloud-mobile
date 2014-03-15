
/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.2.2GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 */

"use strict";

var storeView = function storeView(parentWindow) {

    // Create References
    var theme = require('ui/style/storeViewStyle'),
    topBar = Ti.UI.createView(theme.topBar),
    buttonLogout = Ti.UI.createLabel(Ti.App.mergeObject(theme.button,{
        left: (Ti.App.API.HW.System.isApple()) ? 14 : '8dp',
        text: Ti.App.FontAwesome4.getCharCode('fa-sign-out')
    })),
    buttonManager = Ti.UI.createLabel(Ti.App.mergeObject(theme.button,{
        left: (Ti.App.API.HW.System.isApple()) ? 14 : '8dp',
        text: Ti.App.FontAwesome4.getCharCode('fa-desktop')
    })),
    centerView = Ti.UI.createView(theme.centerView),
    compositions = {},
    _self = {
        view : Ti.UI.createView(theme.view)
    };

    // Create Navigation Bar
    if(Ti.App.API.HW.System.isApple()){
        _self.view.add(Ti.UI.createView(theme.line));
    }
    topBar.add(buttonLogout);
    buttonManager.setLeft(topBar.getWidth() - (buttonManager.getLeft() + buttonManager.getWidth() + 60));
    topBar.add(buttonManager);
    topBar.add(Ti.UI.createLabel(Ti.App.mergeObject(theme.labelButton,{
        left: buttonLogout.getLeft() + buttonLogout.getWidth(),
        text: ' ' + Ti.Locale.getString("BUTTON_LOGOUT")
    })));
    topBar.add(Ti.UI.createLabel(Ti.App.mergeObject(theme.labelButton,{
        left: buttonManager.getLeft() + buttonManager.getWidth(),
        text: ' ' + Ti.Locale.getString("BUTTON_MANAGER_COMPOSITION")
    })));
    _self.view.add(topBar);

    // Add Views
    _self.view.add(centerView);

    // Bind click Logout Button
    _self.clickLogoutButton = function clickLogoutButton() {
        parentWindow.showLoginView();
    };
    buttonLogout.addEventListener('singletap', _self.clickLogoutButton);

    // Bind click Manager Button
    _self.clickManagerButton = function clickManagerButton() {
        parentWindow.showMainView();
    };
    buttonManager.addEventListener('singletap', _self.clickManagerButton);

    // Destroy StoreView
    _self.destroy = function destroy(){
        _self.view.remove(centerView);
        buttonLogout.removeEventListener('singletap', _self.clickLogoutButton);
        buttonManager.removeEventListener('singletap', _self.clickManagerButton);
        theme = null;
    };

    return _self;

};

module.exports = storeView;
