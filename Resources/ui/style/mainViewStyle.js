/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.3.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 */

"use strict";

var mainViewStyle = (function() {

	var _isApple = Yaast.API.HW.System.isApple();

    var _self = {};
    var heightView = Yaast.API.HW.UI.getPlatformHeight() - Yaast.API.HW.UI.getDefaultStatusBar();
    var rowHeight =  (_isApple) ? 44 : '48dp';
    var rowFontSize = (_isApple) ? '22' : '20dp';

    _self.view = {
        top: Yaast.API.HW.UI.getDefaultStatusBar(),
        left: 0,
        height: heightView,
        width: Yaast.API.HW.UI.getPlatformWidth(),
        backgroundColor: '#5F5F5F'
    };

    _self.line = {
        top: 0,
        left: 0,
        height: 1,
        width: _self.view.width,
        backgroundColor: '#DADADA'
    };

    _self.topBar = {
        top: 0,
        left: 0,
        height: 50,
        width: _self.view.width,
        backgroundColor: '#FFFFFF',
        verticalAlign: Titanium.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
        zIndex: 10000
    };

    _self.button = {
        font : {
            fontSize : parseInt(rowFontSize) * 2,
            fontFamily : Yaast.FontAwesome.getFontFamily()
        },
        color: (_isApple) ? '#34AADC' : '#969696',
        shadowColor: '#aaa',
        shadowOffset: {x:0, y:0},
        shadowRadius: 3,
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
    };

    _self.labelButton = {
        font : {
            fontSize : (_isApple) ? '20' : '18dp',
            fontFamily : 'Default'
        },
        color: (_isApple) ? '#34AADC' : '#969696',
        shadowColor: '#aaa',
        shadowOffset: {x:0, y:0},
        shadowRadius: 3,
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
    };

    _self.logo = {
        url: (Yaast.API.HW.System.isApple()) ? Ti.Filesystem.getResourcesDirectory()  + 'images/logo_tab.svg' : '../../images/logo_tab.svg',
        height: (_isApple) ? 30 : '40dp',
        width: '60dp',
        left: 15,
        enableZoomControls: false,
        showScrollbars: false,
        touchEnabled: false,
        disableBounce: false
    };

    _self.leftView = {
        top: _self.topBar.top + _self.topBar.height,
        left: 0,
        backgroundColor: '#3F566D',
        width : _self.view.width / 2,
        height: _self.view.height - _self.topBar.height - 12
    };

    _self.rightView = {
        top: _self.topBar.top + _self.topBar.height,
        left: _self.view.width / 2,
        width : _self.view.width / 2,
        backgroundColor: "#4F6C88",
        height: _self.view.height - _self.topBar.height - 13
    };

	_self.welcomeLabel = {
		color: '#3F566D',
		height: rowHeight,
		left: parseInt(_self.logo.left) + parseInt(_self.logo.width) + 40,
        font: {
            fontFamily: Yaast.FontAwesome.getFontFamily(),
            fontSize: parseInt(rowFontSize) * 1.5
        },
        shadowColor: '#aaa',
        shadowOffset: {x:0, y:0},
        shadowRadius: 3,
	};

	_self.headerlabelView = {
		height: rowHeight,
        font: {
            fontFamily: Yaast.FontAwesome.getFontFamily(),
            fontSize: rowFontSize
        },
        color: '#FFFFFF',
	};

    _self.ownWorkspacesViewTemplate = {
        childTemplates: [
            {
                type: 'Ti.UI.Label',
                bindId: 'icon',
                properties: {
                    layout: 'horizontal',
                    height:  rowHeight,
                    color: '#5679a4',
                    left: 10,
                    font: {
                        fontFamily: Yaast.FontAwesome.getFontFamily(),
                        fontSize: rowFontSize
                    },
                    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
                }
            }, {
                type: 'Ti.UI.Label',
                bindId: 'title',
                properties: {
                    layout: 'horizontal',
                    color: '#FFFFFF',
                    font: {
                        fontFamily:'Default',
                        fontSize: rowFontSize
                    },
                    left: 40,
                    height: rowHeight,
                    textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
                }
            }, {
                type: 'Ti.UI.Label',
                bindId: 'id',
                properties: {
                	visible: false
                }
            }
        ],
        properties: {
        	backgroundColor: '#2B3E50',
        	selectedBackgroundColor: 858585,
        },
        events: {}
    };

    /*_self.leftListViewNoWorkspaces = {
        left: 0,
        top: 0,
        height: '200dp',
        width: '200dp',
        backgroundColor: '#2a2a2a',
        opacity: 0.5,
        color: '#FFFFFF',
        font: {
            fontFamily:'Default',
            fontSize: rowFontSize
        },
        text: Ti.Locale.getString('LABEL_NOCOMPOSITION'),
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
    };

    _self.leftShadowView = {
        left: _self.leftView.width,
        height: _self.leftView.height,
        width: 15,
        top: _self.leftView.top,
        backgroundGradient: {
            type: 'linear',
            startPoint: { x: 0, y: 0 },
            endPoint: { x: 15, y: 0 },
            colors: [
                { color: '#3F566D', offset: 0.0 },
                { color: '#4F6C88', offset: 1.0 }
            ]
        },
        opacity: 1
    };*/

    _self.leftHeaderListView = {
        left: 0,
        backgroundColor: '#3F566D',
        width: _self.leftView.width,
        height: rowHeight,
        font : {
            fontSize : rowFontSize,
            fontFamily : 'Default'
        },
        color: (_isApple) ? '#34AADC' : '#C1C1C1',
        shadowColor: '#aaa',
        shadowOffset: {x:0, y:0},
        shadowRadius: 3,
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        text: Ti.Locale.getString('LABEL_COMPOSITION')
    };

    if(Yaast.API.HW.System.isRetina()){
        _self.topBar.height *= 2;
        _self.button.height *= 2;
        _self.button.width *= 2;
        _self.button.left *= 2;
        _self.button.top *= 2;
        _self.labelButton.height *= 2;
        _self.labelButton.left *= 2;
        _self.labelButton.top *= 2;
        _self.leftHeaderListView.height *= 2;
    }

    return _self;

}());

module.exports = mainViewStyle;
