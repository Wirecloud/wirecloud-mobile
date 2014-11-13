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
	    newInstanceCloseButton,
	    publicSection,
	    privateSection;
	    
	/* Testing Purpos*/
	var myTestFunction = function myTestFunction() { confViewTitle.text = 'HAS HECHO CLICK'; };

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
			templates: { /* Define diferentes style templates for items in the list view */
				'template-public' : theme.connectionListPublicViewTemplate,
				'template-private' : theme.connectionListPrivateViewTemplate,
				'template_connected' : theme.connectionListViewTemplateConected  /* change for ...Connected */
			},
			defaultItemTemplate: 'template-public'
		});
		confInstanceMainView.add(confInstanceListView);
		var section = [];
		/* Array of sections */
		/* Private Instances Section */
		privateSection = Ti.UI.createListSection();
		var headerPrivate = Ti.UI.createView(theme.headerView);
		/* Add section title */
		headerPrivate.add(Ti.UI.createLabel(Yaast.MergeObject(theme.headerViewLabel, { text: 'Private' })));
		/* Add '+' button to create new instance */
		privateAddButton = Ti.UI.createButton(theme.headerViewButton);
		/* Add '+' button to create new instance */
		privateAddButton = Ti.UI.createButton(Yaast.MergeObject(theme.headerViewButton, {
			right : '1',
			width : '6%',
			title : Yaast.FontAwesome.getCharCode('fa-plus-circle'),
		}));
		privateAddButton.press = function press() {
			//a window
			newInstance = Ti.UI.createView(Yaast.MergeObject(theme.containerView, {
				left : '20%',
				width : '60%'
			}));
			//a field for the text
			newInstanceName = Ti.UI.createTextField(Yaast.MergeObject(theme.inputTextField, {
				top : parseInt(newInstance.getHeight() * 0.15, 10),
				keyboardType : Ti.UI.KEYBOARD_DEFAULT,
				returnKeyType : Ti.UI.RETURNKEY_NEXT,
				hintText : "Instance Name"
			}));
			//a field for the url
			newInstanceURL = Ti.UI.createTextField(Yaast.MergeObject(theme.inputTextField, {
				top : parseInt(newInstance.getHeight() * 0.4, 10),
				keyboardType : Ti.UI.KEYBOARD_URL,
				returnKeyType : Ti.UI.RETURNKEY_DONE,
				hintText : "Instance URL"
			}));
			//so far, i don't know what the heck is done here
			newInstanceName.getText = function getText() {
				newInstanceName.blur();
			};
			newInstanceURL.getText = function getText() {
				newInstanceURL.blur();
			};
			//listeners for the proper return key 
			newInstanceName.addEventListener('return', newInstanceName.getText);
			newInstanceURL.addEventListener('return', newInstanceURL.getText);
			//added to the window
			newInstance.add(newInstanceName);
			newInstance.add(newInstanceURL);
			//the "done" button
 			newInstanceDoneButton = Ti.UI.createButton(Yaast.MergeObject(theme.button, {
				title : 'Done',
				left : '5%',
				bottom : '15%',
				fontSize : parseInt(Yaast.API.UI.getDefaultFontSize())*2
			}));
			newInstanceCloseButton = Ti.UI.createButton(Yaast.MergeObject(theme.button, {
				title:'Back',
				right:'5%',
				bottom:'15%',
				fontSize : parseInt(Yaast.API.UI.getDefaultFontSize())*2
				}));
			newInstanceDoneButton.press = function press() {
				if(newInstanceName.value.length === 0 || newInstanceURL.value.length === 0) {//show error
		    	}
	        else{
				
					//instance adde, TODO: contact with a database or something to make it persistent?
					privateSection.appendItems([{
						connection: { template: 'template-private',text: newInstanceName.value}, url: {text: newInstanceURL.value}},]);
					section.push(privateSection);
					parentWindow.remove(newInstance);
					newInstance= null;
				}
			};
			newInstanceCloseButton.press = function press(){
				parentWindow.remove(newInstance);
				newInstance =null;
			};
			newInstanceDoneButton.addEventListener('click',newInstanceDoneButton.press);
			newInstanceCloseButton.addEventListener('click',newInstanceCloseButton.press);
			//added to the window
			newInstance.add(newInstanceDoneButton);
			newInstance.add(newInstanceCloseButton);
			parentWindow.add(newInstance);
		};
		privateAddButton.addEventListener('click', privateAddButton.press);
		headerPrivate.add(privateAddButton);
		privateSection.setHeaderView(headerPrivate);
		/* Add predefine instances */
		privateSection.setItems([
			/* TODO: Load info from archive or db */
			{template: 'template-private', connection: {text: 'Wirecloud CoNWeT'}, url: {text: 'https://wirecloud.conwet.fi.upm.es/'}, id: {text: '1'} }
		]);
		section.push(privateSection);
		
		/* Public Instances Section */
		publicSection = Ti.UI.createListSection();
		var headerPublic = Ti.UI.createView(theme.headerView);
		/* Add section title */
		headerPublic.add(Ti.UI.createLabel(Yaast.MergeObject(theme.headerViewLabel, { text: 'Public' })));
		/* Add '+' button to create new instance */
		publicAddButton = Ti.UI.createButton(theme.headerViewButton);
		//adding new instance starts here:
		publicAddButton.press = function press() {
			//a window
			newInstance = Ti.UI.createView(Yaast.MergeObject(theme.containerView, {
				left : '20%',
				width : '60%'
			}));
			//a field for the text
			newInstanceName = Ti.UI.createTextField(Yaast.MergeObject(theme.inputTextField, {
				top : parseInt(newInstance.getHeight() * 0.15, 10),
				keyboardType : Ti.UI.KEYBOARD_DEFAULT,
				returnKeyType : Ti.UI.RETURNKEY_NEXT,
				hintText : "Instance Name"
			}));
			//a field for the url
			newInstanceURL = Ti.UI.createTextField(Yaast.MergeObject(theme.inputTextField, {
				top : parseInt(newInstance.getHeight() * 0.4, 10),
				keyboardType : Ti.UI.KEYBOARD_URL,
				returnKeyType : Ti.UI.RETURNKEY_DONE,
				hintText : "Instance URL"
			}));
			//so far, i don't know what the heck is done here
			newInstanceName.getText = function getText() {
				newInstanceName.blur();
			};
			newInstanceURL.getText = function getText() {
				newInstanceURL.blur();
			};
			//listeners for the proper return key 
			newInstanceName.addEventListener('return', newInstanceName.getText);
			newInstanceURL.addEventListener('return', newInstanceURL.getText);
			//added to the window
			newInstance.add(newInstanceName);
			newInstance.add(newInstanceURL);
			//the "done" button
 			newInstanceDoneButton = Ti.UI.createButton(Yaast.MergeObject(theme.button, {
				title : 'Done',
				left : '5%',
				bottom : '15%',
				fontSize : parseInt(Yaast.API.UI.getDefaultFontSize())*2
			}));
			newInstanceCloseButton = Ti.UI.createButton(Yaast.MergeObject(theme.button, {
				title:'Back',
				right:'5%',
				bottom:'15%',
				fontSize : parseInt(Yaast.API.UI.getDefaultFontSize())*2
				}));
			newInstanceDoneButton.press = function press() {
		    if(newInstanceName.value.length === 0 || newInstanceURL.value.length === 0) {//show error
		    	}
	        else{
				
					//instance adde, TODO: contact with a database or something to make it persistent?
					publicSection.appendItems([{
						connection: { text: newInstanceName.value}, url: {text: newInstanceURL.value}},]);
					section.push(publicSection);
					parentWindow.remove(newInstance);
					newInstance= null;
				}
			};
			newInstanceCloseButton.press = function press(){
				parentWindow.remove(newInstance);
				newInstance =null;
			};
			newInstanceDoneButton.addEventListener('click',newInstanceDoneButton.press);
			newInstanceCloseButton.addEventListener('click',newInstanceCloseButton.press);
			//added to the window
			newInstance.add(newInstanceDoneButton);
			newInstance.add(newInstanceCloseButton);
			parentWindow.add(newInstance);
		};
		publicAddButton.addEventListener('click', publicAddButton.press);
		headerPublic.add(publicAddButton);
		publicSection.setHeaderView(headerPublic);
		/* Add predefine instances */
		publicSection.setItems([
			/* TODO: Load info from archive or db */
			{connection: {text: 'Wirecloud CoNWeT'}, url: {text: 'https://wirecloud.conwet.fi.upm.es/'}, id: {text: '1'} },
			{connection: {text: 'Mashups Fi Lab 2'}, url: {text: 'http://wirecloud2.conwet.fi.upm.es/'}, id: {text: '2'} }
		]);
		section.push(publicSection);
		/* Apply sections */
		confInstanceListView.sections = section;
		//confInstanceListView.addEventListener('itemclick', myTestFunction());
		/* Adding to parent window */
		parentWindow.add(confView);
	};

	var _self = {};
	createConfiguration();
	return _self;
};

module.exports = instanceManagerView;

