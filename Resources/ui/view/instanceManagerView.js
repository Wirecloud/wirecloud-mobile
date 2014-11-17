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
	var section = []; /* Array of sections */
		
	/* Testing Purpos*/
	var myTestFunction = function myTestFunction() { confViewTitle.text = 'HAS HECHO CLICK'; };
	
	var createNewInstance = function createNewInstance(e) {
		var button = e.source;
		/* newInstance main view */
		newInstance = Ti.UI.createView(Yaast.MergeObject(theme.containerView, {
			left : parseInt(theme.view.width * 0.2, 10),
			width : parseInt(theme.view.width * 0.6, 10)
		}));
		/* Text Field for the Instance Name */
		newInstanceName = Ti.UI.createTextField(Yaast.MergeObject(theme.inputTextField, {
			top : parseInt(newInstance.getHeight() * 0.15, 10),
			keyboardType : Ti.UI.KEYBOARD_DEFAULT,
			returnKeyType : Ti.UI.RETURNKEY_NEXT,
			hintText : "Instance Name"
		}));
		/* Text Field for the Instance Url */
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
		/* Listeners */
		newInstanceName.addEventListener('return', newInstanceName.getText);
		newInstanceURL.addEventListener('return', newInstanceURL.getText);
		/* Add Text Fields to the view */
		newInstance.add(newInstanceName);
		newInstance.add(newInstanceURL);
		/* Add Done button */
		/* TODO: improve style */
 		newInstanceDoneButton = Ti.UI.createButton(Yaast.MergeObject(theme.button, {
			title: 'Done',
			left: parseInt(newInstance.width * 0.05, 10),
			bottom: parseInt(newInstance.width * 0.15, 10),
			fontSize: parseInt(Yaast.API.UI.getDefaultFontSize())*2
		}));
		/* Add Back button */
		newInstanceCloseButton = Ti.UI.createButton(Yaast.MergeObject(theme.button, {
			title:'Back',
			right: parseInt(newInstance.width * 0.05, 10),
			bottom: parseInt(newInstance.width * 0.15, 10),
			fontSize: parseInt(Yaast.API.UI.getDefaultFontSize())*2
		}));
		newInstanceDoneButton.press = function press() {
			if(newInstanceName.value.length === 0 || newInstanceURL.value.length === 0) {
				/* Create dialog to alert that there is a empty text field */
				var dialog = Ti.UI.createAlertDialog({
	        		cancel : 0,
	      		 	buttonNames : ['Aceptar'],
					message : 'There is no name or URL',
          	 		title : '-- W4T --'
	    		});
	    		dialog.addEventListener('click', function() {
           		 	dialog.hide();
           		 	dialog = null;
       			});
       			dialog.show();
        	}
	        else {
	        	if (button.yesPublic) {
	        		 Ti.API.warn("yes!");
	        		publicSection.appendItems([
	        			{ connection: {text: newInstanceName.value}, url: {text: newInstanceURL.value} }
	        		]);
	        		section.push(publicSection);
	        	} else {
	        		Ti.API.warn("no!");
	        		privateSection.appendItems([
	        			{ connection: {text: newInstanceName.value}, url: {text: newInstanceURL.value} }
					]);
					section.push(privateSection);
	        	}
	        	newInstance.removeEventListener('click',createNewInstance);
	        	newInstanceDoneButton.removeEventListener('click', newInstanceDoneButton.press);
	        	newInstanceCloseButton.removeEventListener('click', newInstanceCloseButton.press);
	        	newInstanceName.removeEventListener('return', newInstanceName.getText);
	        	newInstanceURL.removeEventListener('return', newInstanceURL.getText);
	        	newInstance.remove(newInstanceDoneButton);
	        	newInstance.remove(newInstanceCloseButton);
	        	newInstance.remove(newInstanceName);
	        	newInstance.remove(newInstanceURL);
	        	newInstanceDoneButton = null;
	        	newInstanceCloseButton = null;
	        	newInstanceName = null;
	        	newInstanceURL = null;
	        	parentWindow.remove(newInstance);
				newInstance= null;
				//instance adde, TODO: contact with a database or something to make it persistent?
			}
		};
		newInstanceCloseButton.press = function press(){
			newInstance.removeEventListener('click',createNewInstance);
	        newInstanceDoneButton.removeEventListener('click', newInstanceDoneButton.press);
	        newInstanceCloseButton.removeEventListener('click', newInstanceCloseButton.press);
	        newInstanceName.removeEventListener('return', newInstanceName.getText);
	        newInstanceURL.removeEventListener('return', newInstanceURL.getText);
	        newInstance.remove(newInstanceDoneButton);
	        newInstance.remove(newInstanceCloseButton);
	        newInstance.remove(newInstanceName);
	        newInstance.remove(newInstanceURL);
	        newInstanceDoneButton = null;
	        newInstanceCloseButton = null;
	        newInstanceName = null;
	        newInstanceURL = null;
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

	var createConfiguration = function createConfiguration() {
		/* Create the main configuration view */
		confView = Ti.UI.createView(theme.view);
		confViewTitle = Ti.UI.createLabel(theme.configurationFormTitle);
		confView.add(confViewTitle);

		/* Create a Instance Container View */
		confInstanceContainer = Ti.UI.createView(theme.containerView);
		confInstanceContainerTitle = Ti.UI.createLabel(theme.instanceTitle);
		confInstanceContainer.add(confInstanceContainerTitle);
		confView.add(confInstanceContainer);

		/* Create Instaces Main View */
		confInstanceMainView = Ti.UI.createView(theme.connectionView);
		confInstanceContainer.add(confInstanceMainView);

		/* Create Instances List View */
		confInstanceListView = Ti.UI.createListView({
			templates: { /* Define diferent style templates for items in the list view */
				'template' : theme.connectionListViewTemplate,
				'template_connected' : theme.connectionListViewTemplateConected  /* change for ...Connected */
			},
			defaultItemTemplate: 'template'
		});
		confInstanceMainView.add(confInstanceListView);
		
		/* Private Instances Section */
		privateSection = Ti.UI.createListSection();
		var headerPrivate = Ti.UI.createView(theme.headerView);
		/* Add section title */
		headerPrivate.add(Ti.UI.createLabel(Yaast.MergeObject(theme.headerViewLabel, { text: 'Private'})));
		/* Add '+' button to create new instance */
		privateAddButton = Ti.UI.createButton(Yaast.MergeObject(theme.headerViewButton, {yesPublic: false}));
		/* Add handler on click */
		privateAddButton.addEventListener('click', createNewInstance);
		headerPrivate.add(privateAddButton);
		privateSection.setHeaderView(headerPrivate);
		/* Add predefine instances */
		privateSection.setItems([
			/* TODO: Load info from archive or db */
			{connection: {text: 'Wirecloud CoNWeT'}, url: {text: 'https://wirecloud.conwet.fi.upm.es/'}, id: {text: '1'} }
		]);
		section.push(privateSection);
		
		/* Public Instances Section */
		publicSection = Ti.UI.createListSection();
		var headerPublic = Ti.UI.createView(theme.headerView);
		/* Add section title */
		headerPublic.add(Ti.UI.createLabel(Yaast.MergeObject(theme.headerViewLabel, { text: 'Public' })));
		/* Add '+' button to create new instance */
		publicAddButton = Ti.UI.createButton(Yaast.MergeObject(theme.headerViewButton, {yesPublic: true}));
		//adding new instance starts here: 
		publicAddButton.addEventListener('click', createNewInstance);
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

	var destroyConfiguration = function destroyConfiguration() {
		/* Delete events Listeners */
		privateAddButton.removeEventListener('click', privateAddButton.press);
		delete privateAddButton.press;
	    publicAddButton.removeEventListener('click', publicAddButton.press);
	    delete publicAddButton.press;
	    /* Delete views */
	   	confInstanceMainView.remove(confInstanceListView);
	   	confInstanceListView = null;
	   	confInstanceContainer.remove(confInstanceMainView);
	   	confInstanceMainView = null;
	   	confInstanceContainer.remove(confInstanceContainerTitle);
	   	confInstanceContainerTitle = null;
	   	confView.remove(confInstanceContainer);
	   	confInstanceContainer = null;
	   	confView.remove(confViewTitle);
	   	confViewTitle = null;
	   	parentWindow.remove(confView);
	   	confView = null;
	};
	var _self = {};
	_self.destroy = function destroy() {
		/* Delete all view configuration */
		destroyConfiguration();
	};
	createConfiguration();
	return _self;
};

module.exports = instanceManagerView;

