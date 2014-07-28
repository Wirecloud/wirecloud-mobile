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
    _self = {};

    _self.view = {
        top: Yaast.API.HW.UI.getDefaultStatusBar(),
        left: 0,
        backgroundColor: '#FFFFFF',
        width: Yaast.API.HW.UI.getPlatformWidth()
    };
    _self.view.height = Yaast.API.HW.UI.getPlatformHeight() - _self.view.top;

    _self.logo = {
        url: '../../images/logo_tab.svg',
        height: (_self.view.width/2 !== 800) ? parseInt((500 * ((_self.view.width/2)/800)), 10) : 500,
        width: _self.view.width/2,
        left: parseInt(((_self.view.width/2) * 0.05), 10),
        enableZoomControls: false,
        showScrollbars: false,
        touchEnabled: false,
        disableBounce: false
    };
    _self.logo.top = parseInt((_self.view.height-_self.logo.height)/2, 10);

    _self.systemLabel = {
        top: parseInt(_self.view.height * 0.075, 10),
        left: parseInt(_self.view.width/2+(_self.view.width/2 * 0.15), 10),
        height: Yaast.API.HW.UI.getDefaultRowHeight(),
        text: _os + ' ' + Yaast.API.HW.System.getVersion() + _version,
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        color: '#1F3346',
        font: {
            fontSize: 32,
            fontFamily: 'Comfortaa'
        }
    };

    _self.internetLabel = {
        top: _self.systemLabel.top + _self.systemLabel.height + 30,
        left: _self.systemLabel.left,
        height: _self.systemLabel.height,
        text: (Yaast.API.HW.Network.isOnline()) ? 'Conectado' : 'Desconectado',
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        color: '#1F3346',
        font: {
            fontSize: 32,
            fontFamily: 'Comfortaa'
        }
    };

    _self.internetIcon = {
        top: _self.internetLabel.top,
        left: _self.internetLabel.left + 180,
        height: _self.internetLabel.height,
        color: (Yaast.API.HW.Network.isOnline()) ? "#00FF00" : "#FF0000",
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        font: {
            fontSize: 32,
            fontFamily: Yaast.FontAwesome.getFontFamily()
        },
        text: Yaast.FontAwesome.getCharCode('fa-signal')
    };

    _self.activityLabel = {
        left: _self.systemLabel.left,
        width: parseInt(_self.view.width/2 * 0.7,10),
        top: parseInt(((_self.view.height-_self.logo.height)/2)+(_self.logo.height/2), 10),
        text: 'Conectando, espere por favor',
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        color: '#1F3346',
        font: {
            fontSize: 26,
            fontFamily: 'Comfortaa'
        }
    };

    _self.containerView = {
        height: _self.logo.height/2,
        width: _self.activityLabel.width,
        left: _self.systemLabel.left,
        top: parseInt(((_self.view.height-_self.logo.height)/2)+(_self.logo.height/4), 10),
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
        softKeyboardOnFocus: (Yaast.API.HW.System.isApple()) ? null :
            Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS,
        autocorrect: false,
        font: {
            fontSize: 20,
            fontFamily: 'Comfortaa'
        }
    };

    return _self;

}());

module.exports = loginViewStyle;
