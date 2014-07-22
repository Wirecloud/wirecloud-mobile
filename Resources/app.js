/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.2.2GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 * App Base Development Framework Team
 *
 *  Alejandro F.Carrera
 *  Carlos Blanco Vallejo
 *  Santiago Blanco Ventas
 *
 */

"use strict";

// Yaast Framework Init (Global Scope)
var Yaast = {
    "Log" : function(msg, type, error, extra){
        var self = {
            'name': 'W4TLog',
            'message': msg
        };
        if(error){
            self.details = (extra) ? {
                'message': error.message,
                'info': extra
            } : error.message;
            self.source = error.sourceURL;
        }
        Ti.API[type](self);
        return self;
    },
    "MergeObject" : function (obj1, obj2){
        var result = null, key;
        if (obj1 !== null && obj2 !== null){
            for (key in obj2){
                obj1[key] = obj2[key];
            }
            result = obj1;
        }
        return result;
    },
    "FontAwesome" : require('fonts/FontAwesome4'),
    "API" : {}
};
require('lib/API');

(function() {

	var osname = Ti.Platform.osname, Window,
        version = Ti.Platform.version,
        height = Ti.Platform.displayCaps.platformHeight,
        width = Ti.Platform.displayCaps.platformWidth,
        isTablet = (osname === 'ipad') || (osname === 'android' && (
                (Ti.Platform.Android.getPhysicalSizeCategory() === Ti.Platform.Android.PHYSICAL_SIZE_CATEGORY_LARGE) ||
                (Ti.Platform.Android.getPhysicalSizeCategory() === Ti.Platform.Android.PHYSICAL_SIZE_CATEGORY_XLARGE)
            )) || Math.min(Ti.Platform.displayCaps.getPlatformHeight(), Ti.Platform.displayCaps.getPlatformWidth()) >= 400;


    if (isTablet) {
        Window = require('ui/window/appWindow');
        Window.view.open();
    }
    else {
        Window = require('ui/window/appSmartPhone');
        Window.view.open();
    }

}());