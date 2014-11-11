/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.3.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 */

"use strict";

var instanceManagerView = function(parentWindow, logo, systemLabel, formCallback) {
	var theme = require('ui/style/instanceManagerViewStyle');
	/* TODO: Change Style names */

	var confView,
	    confViewTitle,
	    confInstanceContainer,
	    confInstanceContainerTitle,
	    confInstanceMainView,
	    confInstanceListView,
	    privateAddButton,
	    publicAddButton,
	    newInstance,
	    newInstanceName,
	    newInstanceURL,
	    newInstanceDoneButton,
	    publicSection,
	    privateSection;

	var createConfiguration = function createConfiguration() {
		/* Create the main configuration view */
		confView = Ti.UI.createView(theme.view);
		confViewTitle = Ti.UI.createLabel(theme.configurationFormTitle);
		confView.add(confViewTitle);

		/* Create a Instance Container View */
		confInstanceContainer = Ti.UI.createView(Yaast.MergeObject(theme.containerView, {
			/* This should be in 'instanceManagerViewStyle' */
			width : parentWindow.getWidth() * 0.9,
			left : '5%',
			height : parentWindow.getHeight() * 0.7,
			bottom : '10%'
			/* TODO: What append if there is a virtual navigationBar, bottom: '5%' doesn't work */
		}));
		confInstanceContainerTitle = Ti.UI.createLabel(theme.instanceTitle);
		confInstanceContainer.add(confInstanceContainerTitle);
		confView.add(confInstanceContainer);

		/* Create Instaces Main View */
		confInstanceMainView = Ti.UI.createView(theme.connectionView);
		confInstanceContainer.add(confInstanceMainView);

		/* Create Instances List View */
		confInstanceListView = Ti.UI.createListView({
			templates : {/* Define diferentes style templates for items in the list view */
				'template' : theme.connectionListViewTemplate,
				'template_connected' : theme.connectionListViewTemplateConected /* change for ...Connected */
			},
			defaultItemTemplate : 'template'
		});
		confInstanceMainView.add(confInstanceListView);
		var section = [];
		/* Array of sections */
		/* Private Instances Section */
		privateSection = Ti.UI.createListSection();
		var headerPrivate = Ti.UI.createView(theme.headerView);
		/* Add section title */
		headerPrivate.add(Ti.UI.createLabel(Yaast.MergeObject(theme.headerViewLabel, {
			text : 'Private',
			left : '0',
			width : '100%',
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER
		})));
		/* Add '+' button to create new instance */
		privateAddButton = Ti.UI.createButton(Yaast.MergeObject(theme.headerViewButton, {
			right : '1',
			width : '6%',
			title : Yaast.FontAwesome.getCharCode('fa-plus-circle'),
		}));
		headerPrivate.add(privateAddButton);
		privateSection.setHeaderView(headerPrivate);
		/* Add predefine instances */
		privateSection.setItems([
		/* TODO: Load info from archive or db */
		{
			connection : {
				text : 'Wirecloud CoNWeT'
			},
			url : {
				text : 'https://wirecloud.conwet.fi.upm.es/'
			},
			id : {
				text : '1'
			}
		}]);
		section.push(privateSection);
		/* Public Instances Section */
		publicSection = Ti.UI.createListSection();
		var headerPublic = Ti.UI.createView(theme.headerView);
		/* Add section title */
		headerPublic.add(Ti.UI.createLabel(Yaast.MergeObject(theme.headerViewLabel, {
			text : 'Public',
			left : '0',
			width : '100%',
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER
		})));
		/* Add '+' button to create new instance */
		publicAddButton = Ti.UI.createButton(Yaast.MergeObject(theme.headerViewButton, {
			right : '1',
			width : '6%',
			title : Yaast.FontAwesome.getCharCode('fa-plus-circle'),
		}));
		publicAddButton.press = function press() {
			newInstance = Ti.UI.createView(Yaast.MergeObject(theme.containerView, {
				left : '20%',
				width : '60%'
			}));
			newInstanceName = Ti.UI.createTextField(Yaast.MergeObject(theme.inputTextField, {
				top : parseInt(instanceFormContainer.getHeight() * 0.15, 10),
				keyboardType : Ti.UI.KEYBOARD_DEFAULT,
				returnKeyType : Ti.UI.RETURNKEY_NEXT,
				hintText : "Instance Name"
			}));
			newInstanceURL = Ti.UI.createTextField(Yaast.MergeObject(theme.inputTextField, {
				top : parseInt(instanceFormContainer.getHeight() * 0.4, 10),
				keyboardType : Ti.UI.KEYBOARD_URL,
				returnKeyType : Ti.UI.RETURNKEY_DONE,
				hintText : "Instance URL"
			}));
			newInstanceName.getText = function getText() {
				newInstanceName.blur();
			};
			newInstanceURL.getText = function getText() {
				newInstanceURL.blur();
			};
			newInstanceName.addEventListener('return', newInstanceName.getText);
			newInstanceURL.addEventListener('return', newInstanceURL.getText);
			newInstanceDoneButton = Ti.UI.createButton(Yaast.MergeObject(theme.button), {
				title : 'Done',
				left : '5%',
				bottom : '15%'
			});
			newInstanceDoneButton.press = function press() {
				if (newInstanceName.value.lenght != 0 && newInstanceURL.value.lenght != 0) {
					publicSection.setItems([{
						connection: { text: newInstanceName.value}, url: {text: newInstanceURL.value}},]);
					section.push(publicSection);
				}
			};
			newInstanceDoneButton.addEventListener('click',newInstanceDoneButton.press);
			parentWindow.add(newInstance);
		};
		publicAddButton.addEventListener('click', publicAddButton.press);
		headerPublic.add(publicAddButton);
		publicSection.setHeaderView(headerPublic);
		/* Add predefine instances */
		publicSection.setItems([
		/* TODO: Load info from archive or db */
		{
			connection : {
				text : 'Wirecloud CoNWeT'
			},
			url : {
				text : 'https://wirecloud.conwet.fi.upm.es/'
			},
			id : {
				text : '1'
			}
		}, {
			connection : {
				text : 'Mashups Fi Lab 2'
			},
			url : {
				text : 'http://wirecloud2.conwet.fi.upm.es/'
			},
			id : {
				text : '2'
			}
		}]);
		section.push(publicSection),
		/* Apply sections */
		confInstanceListView.sections =
		section;

		/* Adding to parent window */
		parentWindow.add(confView);
	};

	var _self = {};
	createConfiguration();
	return _self;
};

module.exports = instanceManagerView;

