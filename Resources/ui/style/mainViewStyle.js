/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.2.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 */

"use strict";

var mainViewStyle = (function() {

    var _self = {},
    heightView = (Ti.App.isApple) ? Ti.App.platformHeight - 20 : Ti.App.platformHeight;

    _self.view = {
        top: (Ti.App.isApple) ? 20 : 0,
        left: 0,
        height: heightView,
        width: Ti.App.platformWidth,
        backgroundColor: '#1F3346'
    };

    _self.line = {
        top: 0,
        left: 0,
        height: 1,
        width: _self.view.width,
        backgroundColor: '#DADADA'
    };

    _self.topBar = {
        top: (Ti.App.isApple) ? 1 : 0,
        left: 0,
        height: (Ti.App.isApple) ? 44 : '48dp',
        width: _self.view.width,
        backgroundColor: '#EAEAEA'
    };

    _self.button = {
        height: (Ti.App.isApple) ? 30 : '40dp',
        width: (Ti.App.isApple) ? 30 : '40dp',
        top: (Ti.App.isApple) ? 7 : '4dp',
        font : {
            fontSize : (Ti.App.isApple) ? '28' : '18dp',
            fontFamily : Ti.App.FontAwesome4.getFontFamily()
        },
        color: (Ti.App.isApple) ? '#34AADC' : '#C1C1C1',
        shadowColor: '#aaa',
        shadowOffset: {x:0, y:0},
        shadowRadius: 3,
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
    };

    _self.labelButton = {
        height: (Ti.App.isApple) ? 30 : '40dp',
        top: (Ti.App.isApple) ? 7 : '4dp',
        font : {
            fontSize : (Ti.App.isApple) ? '20' : '18dp',
            fontFamily : 'Default'
        },
        color: (Ti.App.isApple) ? '#34AADC' : '#C1C1C1',
        shadowColor: '#aaa',
        shadowOffset: {x:0, y:0},
        shadowRadius: 3,
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
    };

    if(Ti.App.isRetina){
        _self.topBar.height *= 2;
        _self.button.height *= 2;
        _self.button.width *= 2;
        _self.button.left *= 2;
        _self.button.top *= 2;
        _self.labelButton.height *= 2;
        _self.labelButton.left *= 2;
        _self.labelButton.top *= 2;
    }

    return _self;

}());

module.exports = mainViewStyle;
