/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.2.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 */

"use strict";

var loginViewStyle = (function() {

    var _self = {};

    _self.logo = {
        url : Ti.Filesystem.resourcesDirectory + 'images/logo_tab.svg',
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
            fontFamily : Ti.App.FontAwesome4.getFontFamily()
        },
        text : Ti.App.FontAwesome4.getCharCode('fa-signal')
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
        width : '90%',
        left : '5%',
        color : '#354B5D',
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#6890B2',
        paddingLeft: 10,
        font : {
            fontSize : 20,
            fontFamily : 'Comfortaa'
        }
    };

    return _self;

}());

module.exports = loginViewStyle;