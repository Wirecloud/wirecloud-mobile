
/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.3.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 */

"use strict";

var mainViewDetail = function mainViewDetail(compData) {

	var theme = require('ui/style/mainViewDetailStyle');

    // Create References
    var _self = Ti.UI.createView(theme.view);
    
    _self.destroy = function destroy() {
    	theme = null;
    };
    return _self;

};

module.exports = mainViewDetail;
