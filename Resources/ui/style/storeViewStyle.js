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
    heightView = (Ti.App.API.HW.System.isApple()) ?
                  Ti.App.API.HW.System.getPlatformHeight() - 20 :
                  Ti.App.API.HW.System.getPlatformHeight(),
    rowHeight =  (Ti.App.API.HW.System.isApple()) ? 44 : '48dp',
    rowFontSize = (Ti.App.API.HW.System.isApple()) ? '20' : '18dp';

    _self.view = {
        top: (Ti.App.API.HW.System.isApple()) ? 20 : 0,
        left: 0,
        height: heightView,
        width: Ti.App.API.HW.System.getPlatformWidth(),
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
        top: (Ti.App.API.HW.System.isApple()) ? 1 : 0,
        left: 0,
        height: rowHeight,
        width: _self.view.width,
        backgroundColor: '#EAEAEA'
    };

    _self.button = {
        height: (Ti.App.API.HW.System.isApple()) ? 30 : '40dp',
        width: (Ti.App.API.HW.System.isApple()) ? 30 : '40dp',
        top: (Ti.App.API.HW.System.isApple()) ? 7 : '4dp',
        font : {
            fontSize : (Ti.App.API.HW.System.isApple()) ? '28' : '18dp',
            fontFamily : Ti.App.FontAwesome4.getFontFamily()
        },
        color: (Ti.App.API.HW.System.isApple()) ? '#34AADC' : '#C1C1C1',
        shadowColor: '#aaa',
        shadowOffset: {x:0, y:0},
        shadowRadius: 3,
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
    };

    _self.labelButton = {
        height: (Ti.App.API.HW.System.isApple()) ? 30 : '40dp',
        top: (Ti.App.API.HW.System.isApple()) ? 7 : '4dp',
        font : {
            fontSize : (Ti.App.API.HW.System.isApple()) ? '20' : '18dp',
            fontFamily : 'Default'
        },
        color: (Ti.App.API.HW.System.isApple()) ? '#34AADC' : '#C1C1C1',
        shadowColor: '#aaa',
        shadowOffset: {x:0, y:0},
        shadowRadius: 3,
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
    };

    _self.centerView = {
        left: 0,
        width: _self.view.width,
        height: _self.view.height - (_self.topBar.top + _self.topBar.height),
        top: _self.topBar.top + _self.topBar.height,
        backgroundColor: '#4F6C88'
    };

    if(Ti.App.API.HW.System.isRetina()){
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
