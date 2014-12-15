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
	    confPublicInstanceListView,
	    confPrivateInstanceListView,
	    privateAddButton,
	    publicAddButton,
	    newInstance,
	    newInstanceName,
	    newInstanceURL,
	    newInstanceDoneButton,
	    newInstanceCloseButton,
	    editInstance,
	    editInstanceName,
	    editInstanceURL,
	    editInstanceDoneButton,
	    editInstanceCloseButton,
	    publicSection,
	    privateSection,
	    publicHeader,
	    publicItems = [],
	    privateItems = [],
	    publicSections = [],
	    privateSections = [],
	    privateLabel,
	    publicLabel;
	   
	var publicInstFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'w4tPublicInst');
	var privateInstFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'w4tPrivateInst');    
	
	/* Method to load public instance's list */
	var loadPublicInstances = function loadPublicInstances() {
		if (publicInstFile.exists()) {
			publicItems = JSON.parse(Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'w4tPublicInst').read().toString());
		} else {
			publicItems = [
				{ template: 'no_edit_template', connection : {text : 'Wirecloud CoNWeT'}, url : {text : 'https://wirecloud.conwet.fi.upm.es/'}, id : {text : '1'} },
				{ template: 'no_edit_template', connection : {text : 'Mashups Fi Lab 2'}, url : {text : 'http://wirecloud2.conwet.fi.upm.es/'}, id : {text : '2'} },
				//Testing Purpose
				{ template: 'no_edit_template', connection : {text : 'Mashups Fi Lab 3'}, url : {text : 'http://wirecloud2.conwet.fi.upm.es/'}, id : {text : '0'} },
				{ template: 'no_edit_template', connection : {text : 'Mashups Fi Lab 4'}, url : {text : 'http://wirecloud2.conwet.fi.upm.es/'}, id : {text : '0'} },
				{ template: 'no_edit_template', connection : {text : 'Mashups Fi Lab 5'}, url : {text : 'http://wirecloud2.conwet.fi.upm.es/'}, id : {text : '0'} }
			];
			// Save configuration
			publicInstFile.write(JSON.stringify(publicItems));
		}
	};
	
	/* Method to load private instance's list */
	var loadPrivateInstances = function loadPrivateInstances() {
		if (privateInstFile.exists()) {
			privateItems = JSON.parse(Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'w4tPrivateInst').read().toString());
		} else {
			privateItems = [
				{ connection : {text : 'Wirecloud CoNWeT'}, url : {text : 'https://wirecloud.conwet.fi.upm.es/'}, id : {text : '1'} },
				// Testing Purpose
				{ connection : {text : 'Wirecloud CoNWeT 2'}, url : {text : 'https://wirecloud.conwet.fi.upm.es/'}, id : {text : '0'} },
				{ connection : {text : 'Wirecloud CoNWeT 3'}, url : {text : 'https://wirecloud.conwet.fi.upm.es/'}, id : {text : '0'} },
				{ connection : {text : 'Wirecloud CoNWeT 4'}, url : {text : 'https://wirecloud.conwet.fi.upm.es/'}, id : {text : '0'} },
				{ connection : {text : 'Wirecloud CoNWeT 5'}, url : {text : 'https://wirecloud.conwet.fi.upm.es/'}, id : {text : '0'} }
			];
			// Save configuration
			privateInstFile.write(JSON.stringify(privateItems));
		}
	};
	
	var publicSectionClicked = function publicSectionClicked(e) {
		// When edit button is clicked
		if (e.bindId != null && e.bindId == 'edit_button') { 
			editInstanceMethod(e, true);
		}
		// When delete button is clicked
		else if (e.bindId != null && e.bindId == 'delete_button') { 
			deleteInstance(e, true);
		}
		// Other cases choose the instance for use
		else {
			selectInstance(e, true);
		}
	};
	
	var privateSectionClicked = function privateSectionClicked(e) {
		// When edit button is clicked
		if (e.bindId != null && e.bindId == 'edit_button') { 
			editInstanceMethod(e, false);
		}
		// When delete button is clicked
		else if (e.bindId != null && e.bindId == 'delete_button') { 
			deleteInstance(e, false);
		}
		// Other cases choose the instance for use
		else {
			selectInstance(e, false);
		}
	};
	
	/* Method to select an instance for use */
	var selectInstance = function selectInstance(e, p) {
		confView.animate({duration: 500, delay: 0, opacity: 0}, function(){
			// Updates publicInstFile
			publicInstFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'w4tPublicInst');
			publicInstFile.write(JSON.stringify(publicItems));
			// Update privateInstFile
			privateInstFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'w4tPrivateInst');
			privateInstFile.write(JSON.stringify(privateItems));
			// Restore Logo and SystemLabel
			var section;
			if (p == true) { section = publicSections; }
			else { section = privateSections; }
			Yaast.Sandbox.currentURL = section[e.sectionIndex].getItemAt(e.itemIndex).url.text;
			Yaast.Sandbox.appConfig.config.lastInstanceName = section[e.sectionIndex].getItemAt(e.itemIndex).connection.text;
			Yaast.Sandbox.appConfig.config.lastInstanceURL = section[e.sectionIndex].getItemAt(e.itemIndex).url.text;
			formCallback();
			destroyConfiguration();
		});
		logo.animate({duration: 500, delay: 500, opacity: 1},function(){});
		systemLabel.animate({duration: 500, delay: 500, opacity: 1},function(){});
	};
	
	/* Method to delete an instance */
	var deleteInstance = function deleteInstance(e, p) {
		var myEvent = e;
		var dialog = Ti.UI.createAlertDialog({
			cancel : 0,
			buttonNames : [L("no"),L("yes")],
			message : L("confirmation_instance_deletion"),
			title : 'Wirecloud 4 Tablet'
		});
		dialog.press = function press(e) {
			if (e.index == 1) {
				// TODO: Delete from the personal archive or db */
				myEvent.section.deleteItemsAt(myEvent.itemIndex, 1);
				if (myEvent.sectionIndex == 0) { //Private section
					// Delete item in privateItems
					privateItems.splice(myEvent.itemIndex, 1);
					// Update file
				} else  { //Public section
					// Delete item in publicItems
					publicItems.splice(myEvent.itemIndex, 1);
				}
			}
			dialog.hide();
			// Destroy dialog
			dialog.removeEventListener('click', dialog.press);
			delete dialog.press;
			dialog = null;
		};
		dialog.addEventListener('click', dialog.press);
		dialog.show();
	};
	
	/* Method to create new instances */
	var createNewInstance = function createNewInstance(e) {
		var button = e.source;
		// newInstance main view
		newInstance = Ti.UI.createView(theme.editCreateInstanceView);
		// Text Field for the Instance Name
		newInstanceName = Ti.UI.createTextField(Yaast.MergeObject(theme.inputTextField, {
			width: parseInt(newInstance.width * 0.9, 10),
			left: parseInt(newInstance.width * 0.05, 10),
			height: parseInt(newInstance.height * 0.2, 10),
			top: parseInt(newInstance.height * 0.15, 10),
			keyboardType: Ti.UI.KEYBOARD_DEFAULT,
			returnKeyType: Ti.UI.RETURNKEY_NEXT,
			hintText: L("label_instance_name")
		}));
		// Text Field for the Instance Url
		newInstanceURL = Ti.UI.createTextField(Yaast.MergeObject(theme.inputTextField, {
			top : parseInt(newInstance.getHeight() * 0.4, 10),
			width: parseInt(newInstance.width * 0.9, 10),
			left: parseInt(newInstance.width * 0.05, 10),
			height: parseInt(newInstance.height * 0.2, 10),
			keyboardType : Ti.UI.KEYBOARD_URL,
			returnKeyType : Ti.UI.RETURNKEY_DONE,
			hintText : L("label_url")
		}));
		//Method to force the textField to lose the focus
		newInstanceName.getText = function getText() {
			newInstanceName.blur();
		};
		newInstanceURL.getText = function getText() {
			newInstanceURL.blur();
		};
		// Listeners for the key
		newInstanceName.addEventListener('return', newInstanceName.getText);
		newInstanceURL.addEventListener('return', newInstanceURL.getText);
		// Add Text Fields to the view
		newInstance.add(newInstanceName);
		newInstance.add(newInstanceURL);
		// TODO: improve style of the buttons
		//Add Done button
		newInstanceDoneButton = Ti.UI.createButton(Yaast.MergeObject(theme.button, {
			title : L('button_done'),
			left  : parseInt(newInstance.width * 0.13, 10)
		}));
		//Add Back button
		newInstanceCloseButton = Ti.UI.createButton(Yaast.MergeObject(theme.button, {
			title : L('button_back'),
			right : parseInt(newInstance.width * 0.13, 10)
		}));
		// Method for the listener of Done Button
		newInstanceDoneButton.press = function press() {
			if (newInstanceName.value.length === 0 || newInstanceURL.value.length === 0) {
				// Create dialog to alert that there is a empty text field
				var dialog = Ti.UI.createAlertDialog({
					cancel : 0,
					buttonNames : [L('button_ok')],
					message : L("error_missing_field"),
					title : '-- W4T --'
				});
				dialog.press = function press() {
					dialog.hide();
					dialog.removeEventListener('click', dialog.press);
					dialog = null;
				};
				dialog.addEventListener('click', dialog.press);
				dialog.show();
			} else {
				newInstance.animate({duration: 500, delay: 0, opacity: 0}, function(){
					// TODO: Add also the instance to the personal archive or db
					if (button.yesPublic) {
						// Update public list
						publicItems.push({connection: {text: newInstanceName.value}, url: {text : newInstanceURL.value}});
						// Update public section
						publicSection.setItems(publicItems);
						// Update section
						section.push(publicSection);
					} else {
						// Update private list
						privateItems.push({connection: {text : newInstanceName.value}, url: {text : newInstanceURL.value}});
						// Update private section
						privateSection.setItems(privateItems);
						// Update section
						section.push(privateSection);
					}
					destroy();
				});
			}
		};
		// Method for the listener of Close Button
		newInstanceCloseButton.press = function press(){ destroy(); };
		// Destroy newInstance elements
		function destroy() {
			parentWindow.remove(newInstance);
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
			newInstance = null;
		};
		// Add listeners to the buttons
		newInstanceDoneButton.addEventListener('click', newInstanceDoneButton.press);
		newInstanceCloseButton.addEventListener('click', newInstanceCloseButton.press);
		// Add buttons to the newInstace view
		newInstance.add(newInstanceDoneButton);
		newInstance.add(newInstanceCloseButton);
		// Add editInstance view to the parent
		parentWindow.add(newInstance);
	};

	/* Method to edit instances */
	var editInstanceMethod = function editInstanceMethod(e, p) {
		// editInstance main view
		editInstance = Ti.UI.createView(theme.editCreateInstanceView);
		// Text Field for the Instance Name
		editInstanceName = Ti.UI.createTextField(Yaast.MergeObject(theme.inputTextField, {
			width: parseInt(editInstance.width * 0.9, 10),
			left: parseInt(editInstance.width * 0.05, 10),
			height: parseInt(editInstance.height * 0.2, 10),
			top: parseInt(editInstance.height * 0.15, 10),
			value : section[e.sectionIndex].getItemAt(e.itemIndex).connection.text
		}));
		// Text Field for the Instance Url
		editInstanceURL = Ti.UI.createTextField(Yaast.MergeObject(theme.inputTextField, {
			top : parseInt(editInstance.getHeight() * 0.4, 10),
			width: parseInt(editInstance.width * 0.9, 10),
			left: parseInt(editInstance.width * 0.05, 10),
			height: parseInt(editInstance.height * 0.2, 10),
			value : section[e.sectionIndex].getItemAt(e.itemIndex).url.text
		}));
		//Method to force the textField to lose the focus
		editInstanceName.getText = function getText() {
			editInstanceName.blur();
		};
		editInstanceURL.getText = function getText() {
			editInstanceURL.blur();
		};
		// Listeners for the key
		editInstanceName.addEventListener('return', editInstanceName.getText);
		editInstanceURL.addEventListener('return', editInstanceURL.getText);
		// Add Text Fields to the view
		editInstance.add(editInstanceName);
		editInstance.add(editInstanceURL);
		// TODO: improve style
		// Add Done button
		editInstanceDoneButton = Ti.UI.createButton(Yaast.MergeObject(theme.button, { 
			title : L('button_done'),
			left  : parseInt(editInstance.width * 0.13, 10)
		}));
		// Add Back button
		editInstanceCloseButton = Ti.UI.createButton(Yaast.MergeObject(theme.button, {
			title : L('button_back'),
			right : parseInt(editInstance.width * 0.13, 10)
		}));
		// Method for the listener of Done Button
		editInstanceDoneButton.press = function press() {
			if (editInstanceName.value.length === 0 || editInstanceURL.value.length === 0) {
				// Create dialog to alert that there is a empty text field
				var dialog = Ti.UI.createAlertDialog({
					cancel : 0,
					buttonNames : [L('button_ok')],
					message : L("error_missing_field"),
					title : '-- W4T --'
				});
				dialog.press = function press() {
					dialog.hide();
					dialog.removeEventListener('click', dialog.press);
					dialog = null;
				};
				dialog.addEventListener('click', dialog.press);
				dialog.show();
			} else {
				editInstance.animate({duration: 500, delay: 0, opacity: 0}, function() {
					if (e.sectionIndex == 1) {
						// Update public list
						publicItems.splice(e.itemIndex, 1, 
							{connection: {text : editInstanceName.value}, url: {text : editInstanceURL.value}});
						// Update public section
						publicSection.setItems(publicItems);
						// Update section
						section.push(publicSection);
					} else {
						// Update private list
						privateItems.splice(e.itemIndex, 1, 
							{connection : {text : editInstanceName.value}, url : {text : editInstanceURL.value}});
						// Update private section
						privateSection.setItems(privateItems);
						// Update section
						section.push(privateSection);
					}
					destroy();
				});	
			}
		};
		// Method for the listener of Close Button
		editInstanceCloseButton.press = function press() { destroy(); };
		// Delete editInstanceMethod elements
		function destroy() {
			parentWindow.remove(editInstance);
			editInstanceDoneButton.removeEventListener('click', editInstanceDoneButton.press);
			editInstanceCloseButton.removeEventListener('click', editInstanceCloseButton.press);
			editInstanceName.removeEventListener('return', editInstanceName.getText);
			editInstanceURL.removeEventListener('return', editInstanceURL.getText);
			editInstance.remove(editInstanceDoneButton);
			editInstance.remove(editInstanceCloseButton);
			editInstance.remove(editInstanceName);
			editInstance.remove(editInstanceURL);
			editInstanceDoneButton = null;
			editInstanceCloseButton = null;
			editInstanceName = null;
			editInstanceURL = null;
			editInstance = null;
		}
		// Add listeners to buttons
		editInstanceDoneButton.addEventListener('click', editInstanceDoneButton.press);
		editInstanceCloseButton.addEventListener('click', editInstanceCloseButton.press);
		// Add buttons to editInstance view
		editInstance.add(editInstanceDoneButton);
		editInstance.add(editInstanceCloseButton);
		// Add editInstance view to parent
		parentWindow.add(editInstance);
	};

	/* Method to create instance manager configuration */
	var createConfiguration = function createConfiguration() {
		// Create the main configuration view
		confView = Ti.UI.createView(theme.view);
		confViewTitle = Ti.UI.createLabel(theme.viewTitle);
		confView.add(confViewTitle);
		
		// Create a Instance Container View
		confInstanceContainer = Ti.UI.createView(theme.instanceContainerView);
		confInstanceContainerTitle = Ti.UI.createLabel(theme.instanceContainerViewTitle);
		confInstanceContainer.add(confInstanceContainerTitle);
		confView.add(confInstanceContainer);

		// Create Instaces Main View 
		confInstanceMainView = Ti.UI.createView(theme.instanceMainView);
		confInstanceContainer.add(confInstanceMainView);
		
		//LISTS
		
		// Create Private Instances List View
		confPrivateInstanceListView = Ti.UI.createListView({
			templates : {
				'template' : theme.instanceListViewTemplate
			},
			defaultItemTemplate : 'template'
		});
		// Private Instances Section
		privateSection = Ti.UI.createListSection();
		// Add section title
		privateLabel = Ti.UI.createLabel(Yaast.MergeObject(theme.headerViewLabel, {
			text : L('label_private_section'),
			top : 0
		}));
		// Add '+' button to create new instance
		privateAddButton = Ti.UI.createButton(Yaast.MergeObject(theme.headerViewButton, {
			yesPublic : false
		}));
		// Add handler on click for '+' button
		privateAddButton.addEventListener('click', createNewInstance);
		confInstanceMainView.add(privateLabel);
		confInstanceMainView.add(privateAddButton);
		confPrivateInstanceListView.top = privateLabel.height;
		confPrivateInstanceListView.height = parseInt(confInstanceMainView.height * 0.5, 10) - privateLabel.height;
		confInstanceMainView.add(confPrivateInstanceListView);
		loadPrivateInstances();
		privateSection.setItems(privateItems);
		privateSections.push(privateSection);
		
		// Create Public Instances List View
		confPublicInstanceListView = Ti.UI.createListView({
			templates : {
				'template' : theme.instanceListViewTemplate,
				'no_edit_template' : theme.instanceListViewTemplateWithoutButtons
			},
			defaultItemTemplate : 'template'
		});
		// Public Instances Section
		publicSection = Ti.UI.createListSection();
		// Add section title
		publicLabel = Ti.UI.createLabel(Yaast.MergeObject(theme.headerViewLabel, {
			text : L('label_public_section'),
			top: parseInt(confInstanceMainView.height * 0.5, 10),
		}));
		// Add '+' button to create new instance
		publicAddButton = Ti.UI.createButton(Yaast.MergeObject(theme.headerViewButton, {
			yesPublic : true,
			top : parseInt(confInstanceMainView.height * 0.5, 10)
		}));
		publicAddButton.addEventListener('click', createNewInstance);
		confInstanceMainView.add(publicLabel);
		confInstanceMainView.add(publicAddButton);
		confPublicInstanceListView.top = parseInt(confInstanceMainView.height * 0.5, 10) + publicLabel.height;
		confPublicInstanceListView.height = parseInt(confInstanceMainView.height * 0.5, 10) - publicLabel.height;
		confInstanceMainView.add(confPublicInstanceListView);
		loadPublicInstances();
		publicSection.setItems(publicItems);
		publicSections.push(publicSection);
		
		// Apply sections
		confPublicInstanceListView.sections = publicSections;
		confPrivateInstanceListView.sections = privateSections;
		// Add listener for the ListView
		confPublicInstanceListView.addEventListener('itemclick', publicSectionClicked);
		confPrivateInstanceListView.addEventListener('itemclick', privateSectionClicked);
		// Add main view to parent
		parentWindow.add(confView);
	};

	var destroyConfiguration = function destroyConfiguration() {
		// Delete events Listeners
		privateAddButton.removeEventListener('click', createNewInstance);
		publicAddButton.removeEventListener('click', createNewInstance);
		confPublicInstanceListView.removeEventListener('itemclick', publicSectionClicked);
		confPrivateInstanceListView.removeEventListener('itemclick', privateSectionClicked);
		// Delete views
		parentWindow.remove(confView);
		confInstanceMainView.remove(confPublicInstanceListView);
		confPublicInstanceListView = null;
		confInstanceMainView.remove(confPrivateInstanceListView);
		confPrivateInstanceListView = null;
		confInstanceContainer.remove(confInstanceMainView);
		confInstanceMainView = null;
		confInstanceContainer.remove(confInstanceContainerTitle);
		confInstanceContainerTitle = null;
		confView.remove(confInstanceContainer);
		confInstanceContainer = null;
		confView.remove(confViewTitle);
		confViewTitle = null;
		confView = null;
		theme = null;
		_self = null;
	};
	var _self = {};
	//_self.destroy = function destroy() {
		// Delete all view configuration
		// destroyConfiguration();
		// theme = null;
		// _self = null;
	//};
	createConfiguration();
	return _self;
};

module.exports = instanceManagerView;

