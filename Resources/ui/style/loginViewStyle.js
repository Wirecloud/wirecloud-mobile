/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.2.2GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 */

"use strict";

var loginViewStyle = (function() {

    var _self = {}, topView = (Yaast.API.HW.System.isApple()) ? 20 : 0;

    _self.view = {
        top: topView,
        left: 0,
        backgroundColor: '#FFFFFF',
        width: Yaast.API.HW.System.getPlatformWidth(),
        height: Yaast.API.HW.System.getPlatformHeight() - topView
    };

    _self.logo = {
        url: '../../images/logo_tab.svg',
        enableZoomControls : false,
        showScrollbars : false,
        touchEnabled : false
    };

    _self.systemLabel = {
        textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
        color: '#777',
        font : {
            fontSize : 32,
            fontFamily : 'Comfortaa'
        }
    };

    _self.internetLabel = {
        textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
        color: '#777',
        font : {
            fontSize : 26,
            fontFamily : 'Comfortaa'
        }
    };

    _self.internetIcon = {
        textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
        font : {
            fontSize : 25,
            fontFamily : Yaast.FontAwesome.getFontFamily()
        },
        text : Yaast.FontAwesome.getCharCode('fa-signal')
    };

    _self.activityLabel = {
        textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
        color: '#777',
        font : {
            fontSize : 26,
            fontFamily : 'Comfortaa'
        }
    };

    _self.containerView = {
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#66CCFF',
        backgroundColor: '#D5E4F1'
    };

    _self.inputTextField = {
        width: '90%',
        left: '5%',
        height: '30%',
        color: '#354B5D',
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#6890B2',
        paddingLeft: 10,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        autocapitalization: false,
        enableReturnKey: false,
        softKeyboardOnFocus : (Yaast.API.HW.System.isApple()) ? null : Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS,
        autocorrect: false,
        font: {
            fontSize: 20,
            fontFamily: 'Comfortaa'
        }
    };

    return _self;

}());

module.exports = loginViewStyle;
