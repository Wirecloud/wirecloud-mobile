/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.3.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 */

"use strict";

var loginViewStyle = (function() {

    var _os = (Yaast.API.HW.System.isApple()) ? "iPad" : "Android",
    _version = (_os === 'Android') ? " ~ " + Yaast.API.HW.System.getVersionString() : "",
    _self = {},
    _font = 'Comfortaa',
    _fontSize = Yaast.API.UI.getDefaultFontSize(),
    _background = '#2B3E50',
    _background2 = '#456082',
    _background3 = '#D5E4F1',
    _backgroundRed = '#FF8888',
    _backgroundGreen = '#99FF99',
    _editColor = "#FFA500",
    _editColor2 = "#CA7000",
    _deleteColor = "#FF5555",
    _deleteColor2 = "#AA0000",
    _fontColorGreen = "#00AA00",
    _fontColor = '#EBEBEB',
    _fontColorButton = '#354B5D', // 1F3346
    _rowHeight = Yaast.API.UI.getDefaultRowHeight();
    var viewHeight = Yaast.Sandbox.windowHeight;
    var baseTop = 0;
    if (Yaast.API.HW.System.isApple()) {
    	viewHeight = Yaast.Sandbox.windowHeight - Yaast.API.UI.getDefaultStatusBar();
    	baseTop = Yaast.API.UI.getDefaultStatusBar();
    } else {
    	viewHeight = Yaast.Sandbox.windowHeight;
    	baseTop = 0;
    }
    var viewWidth = parseInt(Yaast.API.UI.getPlatformWidth());
    Ti.API.info('loginView top: ' + parseInt(baseTop + (viewHeight * 0.5) / 100), 10);
    Ti.API.info('loginView left: ' + parseInt(baseTop + (viewHeight * 0.5) / 100));
    Ti.API.info('loginView height: ' + parseInt(viewHeight - ((viewHeight * 0.5) / 100) * 2), 10);
    Ti.API.info('loginView width: ' + parseInt(viewHeight - ((viewHeight * 0.5) / 100) * 2), 10);

    _self.view = {
        top: parseInt(baseTop +  ((viewHeight * 0.5) / 100), 10),
        left: parseInt(baseTop +  ((viewHeight * 0.5) / 100), 10),
        backgroundColor: _background,
        width: parseInt(viewWidth - (((viewHeight * 0.5) / 100) * 2), 10),
        height: parseInt(viewHeight - (((viewHeight * 0.5) / 100) * 2), 10),
        // Size test
        borderWidth: 1,
        borderColor: _background3,
    };
    //_self.view.height = Yaast.API.UI.getPlatformHeight() - _self.view.top;

	// General View

    _self.logo = {
    	// TODO check this image in retina
        image: (Yaast.API.HW.System.isApple()) ? Ti.Filesystem.getResourcesDirectory()  + 'images/logo_tab.png' : '../../images/logo_tab.png',
        width: parseInt(((_self.view.width / 2) - ((_self.view.width * 4) / 100)), 10),
        left: parseInt(_self.view.width * 0.02, 10), //'2%',
        enableZoomControls: false, 
        touchEnabled: false
    };

    _self.systemLabel = {
        top: parseInt(_self.view.width * 0.01), //'1%',
        left: parseInt(_self.view.width * 0.02), //'2%',
        height: Yaast.API.UI.getDefaultRowHeight(),
        text: _os + ' ' + Yaast.API.HW.System.getVersion() + _version,
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        color: _fontColor,
        font: {
            fontSize: parseInt((Ti.Platform.displayCaps.platformHeight*3.5)/100, 10),
            fontFamily: _font
        }
    };

    _self.spinner = {
  		message: L("checking_auth"),
  		style: (Yaast.API.HW.System.isApple()) ? Ti.UI.iPhone.ActivityIndicatorStyle.BIG : Ti.UI.ActivityIndicatorStyle.BIG_DARK,
  		top: parseInt((_self.view.height/2)-(Yaast.API.UI.getDefaultRowHeight()/2), 10),
  		right: parseInt(_self.view.width * 0.07, 10), //'7%',
  		color: _fontColor,
        font : {
            fontSize : parseInt((Ti.Platform.displayCaps.platformHeight*5)/100, 10),
            fontFamily : 'Bangla Sangam MN'
        }
    };
    
    
    /*
     * 
     *  Generales
     * 
     */
    
    _self.containerView = {
        width: parseInt(((_self.view.width)/2) - (_self.view.width*0.04), 10),
        height: parseInt((_self.view.height) * 0.6, 10),
        borderRadius: 15,
        borderWidth: 1,
        borderColor: _background3,
        backgroundColor: _background2
    };

    _self.inputTextField = {
        width: parseInt(parseInt(((_self.view.width)/2) - (_self.view.width*0.04), 10) * 0.9, 10),
        left: parseInt(parseInt(((_self.view.width)/2) - (_self.view.width*0.04), 10) * 0.05, 10),
        height: parseInt(parseInt(((_self.view.height)/2), 10) * 0.2, 10),
        color: '#354B5D',
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: _background3,
        paddingLeft: 5,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        autocapitalization: false,
        enableReturnKey: false,
        softKeyboardOnFocus: (Yaast.API.HW.System.isApple()) ? null :
            Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS,
        autocorrect: false,
        font: {
            fontSize: parseInt((Ti.Platform.displayCaps.platformHeight*3.5)/100, 10),
            fontFamily: _font
        }
    };
    
    _self.button = {
    	backgroundColor: _background3,
    	color: _fontColorButton,
    	borderRadius: 10,
        borderWidth: 1,
        paddingLeft: 5,
        borderColor: _background,
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		height: parseInt((Ti.Platform.displayCaps.platformHeight*6)/100, 10)+15,
    	font: {
            fontSize: _fontSize * 2,
            fontFamily: _font
        }
    };
    
    
   	/*
   	 *
   	 * Login Page 
   	 *  
   	 */
    _self.instanceName = {
        top: _rowHeight * 0.2,
        left:'2%',
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        width: _self.containerView.width * 0.85,
        color: _fontColor,
        wordWrap: false,
        ellipsize: true,
        font: {
            fontSize: _fontSize * 2,
            fontFamily: _font
        }
    };

    _self.instanceURL = {
        top: (_self.view.height * 5 / 100) + _self.instanceName.top + (_rowHeight * 0.1),
        left:'2%',
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        width: _self.containerView.width * 0.85,
        color: _fontColor,
        wordWrap: false,
        ellipsize: true,
        font: {
            fontSize: _fontSize,
            fontFamily: _font
        }
    };

    _self.configButtonIcon = {
        top: '4%',
        right:'2%',
        width: _self.containerView.width * 0.1,
        color: '#FFFFFF',
        textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
        text: Yaast.FontAwesome.getCharCode('fa-cog'),
        ellipsize: true,
        font: {
            fontSize: _fontSize * 2,
            fontFamily: Yaast.FontAwesome.getFontFamily(),
        }
    };    
	
	_self.checkboxUser = {
    	bottom : parseInt(_self.containerView.height * 0.23, 10),
		left : parseInt(_self.containerView.width * 0.06, 10),
		title : L('label_login_remember_user'),
    	style : Titanium.UI.Android.SWITCH_STYLE_CHECKBOX,
    	value : false,
    	font: {
            fontSize: _fontSize,
            fontFamily: _font
        }
    };
    return _self;

}());

module.exports = loginViewStyle;
