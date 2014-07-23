/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.3.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 */

"use strict";

var appSmartPhone = (function () {

    var _self = {
        view: Ti.UI.createWindow({
            exitOnClose: true,
            navBarHidden: true,
            backgroundColor: '#1F3346',
            width: Ti.Platform.displayCaps.getPlatformWidth(),
            height: Ti.Platform.displayCaps.getPlatformHeight()
        })
    };

    _self.view.add(Ti.UI.createLabel({
        left: 10,
        top: 0,
        height: _self.getHeight(),
        width: _self.getWidth() - 20,
        color: '#B59D79',
        font: {
            fontFamily:'Default',
            fontSize: (Ti.Platform.getOsName() === 'ipad' ||
                       Ti.Platform.getOsName() === 'iphone') ? '22' : '20dp'
        },
        text: Ti.Locale.getString('LABEL_NOSMARTPHONE'),
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
    }));

    return _self;

}());

module.exports = appSmartPhone;
