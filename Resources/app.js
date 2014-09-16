/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.3.0GA
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
    "Log": function(msg, type, error, extra) {
        var self = {
            'name': 'W4TLog',
            'message': msg
        };
        if(error) {
            self.details = (extra) ? {
                'message': error.message,
                'info': extra
            } : error.message;
            self.source = error.sourceURL;
        }
        Ti.API[type](self);
        return self;
    },
    "FontAwesome": require('fonts/FontAwesome4'),
    "Sandbox": {
    	'currentView': null,
    }
};
Yaast.API = require('lib/API');

// Merge shortcut
Yaast["MergeObject"] = Yaast.API.SW.Utils.mergeObject;

(function() {

    if (Yaast.API.HW.System.isTablet()) {
        var Window = require('ui/window/appWindow');
        Window.window.open();
    }
    else  alert("Wirecloud4Tablet has not compatibility with Smartphone's'");

}());