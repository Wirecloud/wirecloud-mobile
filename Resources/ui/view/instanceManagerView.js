/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.3.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 */

"use strict";

var instanceManagerView = function (parentWindow, logo, systemLabel, formCallback) {
	var theme = require('ui/style/instanceManagerViewStyle');
	
	var confView, confViewTitle,
		confInstanceContainer, confInstanceContainerTitle;
	
	var createConfiguration = function createConfiguration() {
		/* Create the main configuration view */
		confView = Ti.UI.createView(theme.view);
		confViewTitle = Ti.UI.createLabel(theme.configurationFormTitle); /* TODO: Change Style names */
		confView.add(confViewTitle);
		/* Create a Instance Container View */
		confInstanceContainer = Ti.UI.createView(theme.containerView);
		confInstanceContainerTitle = Ti.UI.createLabel(theme.configurationFormTitle);
		confInstanceContainer.add(confInstanceContainerTitle);
		confView.add(confInstanceContainer);
		/* Adding to parent window */
		parentWindow.add(confView);
	};
	
	var _self = {};
	createConfiguration();
	return _self;
};

module.exports = instanceManagerView;
