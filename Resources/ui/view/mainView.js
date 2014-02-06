/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.2.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 */

"use strict";

var mainView = function mainView() {

    // Create References
    var theme = require('ui/style/mainViewStyle'),
    topBar = Ti.UI.createView(theme.topBar),
    buttonLogout = Ti.UI.createLabel(Ti.App.mergeObject(theme.button,{
        left: (Ti.App.isApple) ? 14 : '8dp',
        text: Ti.App.FontAwesome4.getCharCode('fa-sign-out')
    })),
    buttonStore = Ti.UI.createLabel(Ti.App.mergeObject(theme.button,{
        left: (Ti.App.isApple) ? 14 : '8dp',
        text: Ti.App.FontAwesome4.getCharCode('fa-cloud')
    })),
    _self = Ti.UI.createView(theme.view);

    // Create Navigation Bar
    if(Ti.App.isApple){
        _self.add(Ti.UI.createView(theme.line));
    }
    topBar.add(buttonLogout);
    buttonStore.setLeft(topBar.getWidth() - buttonStore.getLeft() - buttonStore.getWidth() - 50);
    topBar.add(buttonStore);
    topBar.add(Ti.UI.createLabel(Ti.App.mergeObject(theme.labelButton,{
        left: buttonLogout.getLeft() + buttonLogout.getWidth(),
        text: ' Logout'
    })));
    topBar.add(Ti.UI.createLabel(Ti.App.mergeObject(theme.labelButton,{
        left: buttonStore.getLeft() + buttonStore.getWidth(),
        text: ' Store'
    })));
    _self.add(topBar);

	return _self;

};

module.exports = mainView;
