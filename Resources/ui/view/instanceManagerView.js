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
	 /* TODO: Change Style names */
		
	var confView, confViewTitle,
		confInstanceContainer, confInstanceContainerTitle,
		confInstancesMainView;
	
	var createConfiguration = function createConfiguration() {
		/* Create the main configuration view */
		confView = Ti.UI.createView(theme.view);
		confViewTitle = Ti.UI.createLabel(theme.configurationFormTitle);
		confView.add(confViewTitle);
		
		/* Create a Instance Container View */
		confInstanceContainer = Ti.UI.createView(Yaast.MergeObject(theme.containerView, {
			/* This should be in 'instanceManagerViewStyle' */
			width: parentWindow.getWidth() * 0.9,
			left: '5%',
			height: parentWindow.getHeight() * 0.7,
			bottom: '10%'
			/* TODO: What append if there is a virtual navigationBar, bottom: '5%' doesn't work */
		}));
		confInstanceContainerTitle = Ti.UI.createLabel(theme.instanceTitle);
		confInstanceContainer.add(confInstanceContainerTitle);
		confView.add(confInstanceContainer);

		/* Create Instaces Main View */
		confInstancesMainView = Ti.UI.createView(theme.connectionView);
		confInstanceContainer.add(confInstancesMainView);

		/* Adding to parent window */
		parentWindow.add(confView);
	};
	
	var _self = {};
	createConfiguration();
	return _self;
};

module.exports = instanceManagerView;
