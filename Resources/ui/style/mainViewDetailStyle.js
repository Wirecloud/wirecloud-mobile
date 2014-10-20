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
                  Yaast.API.UI.getPlatformHeight() - 20 :
                  Yaast.API.UI.getPlatformHeight(),
    rowHeight =  Yaast.API.UI.getDefaultRowHeight(),
    rowFontSize = Yaast.API.UI.getDefaultFontSize(),
    _fontSize = Yaast.API.UI.getDefaultFontSize();

    _self.view = {
        left: 0,
        top: 0,
        width: Yaast.API.UI.getPlatformWidth() * 0.5,
        height: heightView,
        backgroundColor: '#4F6C88',
    };

	_self.mainTitle = {
		color: '#FFFFFF',
		height: rowHeight,
        font: {
            fontFamily: Yaast.FontAwesome.getFontFamily(),
            fontSize: parseInt(rowFontSize) * 2.2
        },
        shadowColor: '#aaa',
        shadowOffset: {x:0, y:0},
        shadowRadius: 3,
        top: 20
	};

	_self.creatorLabel = {
		color: '#D1D1D1',
		height: rowHeight,
        font: {
            fontFamily: Yaast.FontAwesome.getFontFamily(),
            fontSize: parseInt(_fontSize)
        },
        left: 15,
        top: parseInt(rowHeight) + 30
	};

	_self.descriptionLabel = {
		color: '#FFFFFF',
		height: parseInt(heightView * 60 / 100),
        font: {
            fontFamily: Yaast.FontAwesome.getFontFamily(),
            fontSize: _fontSize
        },
        left: 15,
        top: _self.creatorLabel.top + parseInt(rowHeight * 1.5),
        verticalAlign: Titanium.UI.TEXT_VERTICAL_ALIGNMENT_TOP
	};

	_self.loadButton = {
        font : {
            fontSize : parseInt(_fontSize) * 3,
            fontFamily : Yaast.FontAwesome.getFontFamily()
        },
        color: '#FFFFFF',
        shadowColor: '#aaa',
        shadowOffset: {x:0, y:0},
        shadowRadius: 3,
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        text: "Show!  " + Yaast.FontAwesome.getCharCode('fa-external-link'),
        top: parseInt(_self.descriptionLabel.top + _self.descriptionLabel.height)
	};

	// Default 
	_self.logoIcon = {
    	// TODO check this image in retina
        image: (Yaast.API.HW.System.isApple()) ? Ti.Filesystem.getResourcesDirectory()  + 'images/wc2.png' : '../../images/wc2.png',
        width: parseInt((_self.view.width / 2) , 10),
        height: parseInt((_self.view.height / 4) , 10),
        enableZoomControls: false, 
        touchEnabled: false,
        top: rowHeight
	};
	 _self.welcomeLabel = {
		color: '#FFFFFF',
		height: rowHeight * 2,
        font: {
            fontFamily: Yaast.FontAwesome.getFontFamily(),
            fontSize: _fontSize * 2
        },
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        shadowColor: '#FFFFFF',
        shadowOffset: {x:0, y:0},
        shadowRadius: 3,
        top: _self.logoIcon.top + _self.logoIcon.height + rowHeight
	};
	_self.infoLabel = {
		color: '#FFFFFF',
		height: rowHeight * 1.5,
        font: {
            fontFamily: Yaast.FontAwesome.getFontFamily(),
            fontSize: _fontSize * 1.5
        },
        shadowColor: '#FFFFFF',
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        shadowOffset: {x:0, y:0},
        shadowRadius: 3,
        top: _self.welcomeLabel.top + _self.welcomeLabel.height + rowHeight * 1.5
	};
	_self.linkLabel = {
		color: '#FFFFFF',
		height: rowHeight,
        font: {
            fontFamily: Yaast.FontAwesome.getFontFamily(),
            fontSize: _fontSize
        },
        shadowColor: '#FFFFFF',
        shadowOffset: {x:0, y:0},
        shadowRadius: 3,
        top: _self.infoLabel.top + _self.infoLabel.height + rowHeight
	};
	_self.wirecloudLinkView = {
		color: '#FFFFFF',
		height: rowHeight,
		backgroundColor: 'FFFFFF',
		width:'100%',
        font: {
            fontFamily: Yaast.FontAwesome.getFontFamily(),
            fontSize: _fontSize *1.5
        },
        wordWrap: false,
        top: _self.linkLabel.top + _self.linkLabel.height
	};
	_self.wirecloudLinkText = {
		color: '#F5BD76',
		height: rowHeight,
        font: {
            fontFamily: Yaast.FontAwesome.getFontFamily(),
            fontSize: _fontSize *1.5
        },
	};

    return _self;

}());

module.exports = mainViewDetailStyle;

