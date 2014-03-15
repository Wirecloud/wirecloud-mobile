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

    _self.leftListView = {
        left: 0,
        height: _self.view.height - (_self.topBar.top + _self.topBar.height),
        width: _self.view.width * 0.3,
        top: _self.topBar.top + _self.topBar.height,
        separatorColor: '#8EAECC',
        separatorInsets:{
            right: 20
        },
        backgroundColor: '#3F566D'
    };

    _self.leftListViewTemplate = {
        childTemplates: [
            {
                type: 'Ti.UI.Label',
                bindId: 'icon',
                properties: {
                    layout: 'horizontal',
                    width:  rowHeight - 10,
                    height:  rowHeight - 10,
                    borderRadius: '10',
                    borderWidth: '1',
                    borderColor: '#0E171F',
                    backgroundColor: '#D4D4D4',
                    color: '#149F9D',
                    left: 10,
                    font: {
                        fontFamily: 'FontAwesome',
                        fontSize: rowFontSize
                    },
                    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
                }
            }, {
                type: 'Ti.UI.Label',
                bindId: 'title',
                properties: {
                    width:  _self.leftListView.width - (20 + (rowHeight - 10)),
                    layout: 'horizontal',
                    color: '#FFFFFF',
                    font: {
                        fontFamily:'Default',
                        fontSize: rowFontSize
                    },
                    left: 20 + (rowHeight - 10),
                    height: rowHeight,
                    textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
                }
            }
        ],
        properties: {
            selectedBackgroundColor: '#4F6C88',
            backgroundColor: '#3F566D'
        }
    };

    _self.leftListViewNoWorkspaces = {
        left: 0,
        height: _self.leftListView.height,
        top: _self.leftListView.top,
        width: _self.leftListView.width,
        color: '#3F566D',
        font: {
            fontFamily:'Default',
            fontSize: rowFontSize
        },
        text: Ti.Locale.getString('LABEL_NOWORKSPACE'),
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
    };

    _self.leftShadowView = {
        left: _self.leftListView.width,
        height: _self.leftListView.height,
        width: 15,
        top: _self.leftListView.top,
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
    };

    _self.rightView = {
        left: _self.leftListView.width,
        width: _self.view.width * 0.7,
        height: _self.leftListView.height,
        top: _self.leftListView.top,
        backgroundColor: '#4F6C88'
    };

    _self.leftHeaderListView = {
        left: 0,
        backgroundColor: '#3F566D',
        width: _self.leftListView.width,
        height: rowHeight,
        font : {
            fontSize : rowFontSize,
            fontFamily : 'Default'
        },
        color: (Ti.App.API.HW.System.isApple()) ? '#34AADC' : '#C1C1C1',
        shadowColor: '#aaa',
        shadowOffset: {x:0, y:0},
        shadowRadius: 3,
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        text: 'Compositions'
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
        _self.leftHeaderListView.height *= 2;
    }

    return _self;

}());

module.exports = mainViewStyle;
