/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.3.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 */

"use strict";

var mainViewDetailStyle = (function() {

	var _isApple = Yaast.API.HW.System.isApple();
	var _isIOS7 = (_isApple && Ti.Platform.version.split('.')[0] === '7') ? true : false;

    var _self = {},
    heightView = (_isApple) ?
                  Yaast.API.HW.UI.getPlatformHeight() - 20 :
                  Yaast.API.HW.UI.getPlatformHeight(),
    rowHeight =  (_isApple) ? 44 : '48dp',
    rowFontSize = (_isApple) ? '20' : '18dp';

    _self.view = {
        left: Yaast.API.HW.UI.getPlatformWidth() * 0.5,
        width: Yaast.API.HW.UI.getPlatformWidth() * 0.5,
        height: heightView,
        top: rowHeight,
        backgroundColor: '#4F6C88'
    };

	_self.mainTitle = {
		color: '#FFFFFF',
		height: rowHeight,
        font: {
            fontFamily: Yaast.FontAwesome.getFontFamily(),
            fontSize: parseInt(rowFontSize) * 2.4
        },
        shadowColor: '#aaa',
        shadowOffset: {x:0, y:0},
        shadowRadius: 3,
        top: 20
	};

	_self.creatorLabel = {
		color: '#FFFFFF',
		height: rowHeight,
        font: {
            fontFamily: Yaast.FontAwesome.getFontFamily(),
            fontSize: rowFontSize
        },
        left: 15,
        top: parseInt(rowHeight) + 30
	};
	
	_self.loadButton = {
        font : {
            fontSize : parseInt(rowFontSize) * 4,
            fontFamily : Yaast.FontAwesome.getFontFamily()
        },
        color: '#5679a4',
        shadowColor: '#aaa',
        shadowOffset: {x:0, y:0},
        shadowRadius: 3,
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        text: Yaast.FontAwesome.getCharCode('fa-external-link'),
        top: _self.view.height / 2
	};

    return _self;

}());

module.exports = mainViewDetailStyle;

