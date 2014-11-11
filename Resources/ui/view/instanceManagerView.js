/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.3.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 */

"use strict";

var instanceManagerView = function(parentWindow, logo, systemLabel, formCallback) {

	// Variables Comunes
	var theme = require('ui/style/instanceManagerViewStyle');
	var confView,
	    confTitle,instanceView,instanceTitle;

	/** Private Function to create Form Configuration */
	var createConfiguration = function createConfiguration() {

		confView = Ti.UI.createView(theme.view);
		confTitle = Ti.UI.createLabel(theme.configurationFormTitle);
		confView.add(confTitle);
		
		instanceView =Ti.UI.createView(Yaast.MergeObject(theme.containerView, {
			width : parentWindow.getWidth() * 0.9, 
			left : '5%',
			height : parentWindow.getHeight() * 0.7,
			bottom : '10%'
			}));
		instanceTitle = Ti.UI.createLabel(theme.instanceTitle);
		instanceView.add(instanceTitle);
		confView.add(instanceView);
		
		parentWindow.add(confView);
};
		var _self = {};
		createConfiguration();
		return _self;
	
	
};
module.exports = instanceManagerView; 