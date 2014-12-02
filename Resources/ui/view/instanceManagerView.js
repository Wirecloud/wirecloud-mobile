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
	    editInstance,
	    editInstanceName,
	    editInstanceURL,
	    editInstanceDoneButton,
	    editInstanceCloseButton,
	    publicSection,
	    privateSection,
	    headerPublic,
	    headerPrivate,
	    publicItems = [],
	    privateItems = [];
	   
	var publicInstFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'w4tPublicInst');
	var privateInstFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'w4tPrivateInst');    
	var section = []; /* Array of sections */
	
	/* Method to load public instance's list */
	var loadPublicInstances = function loadPublicInstances() {
		if (publicInstFile.exists()) {
			publicItems = JSON.parse(Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'w4tPublicInst').read().toString());
		} else {
			publicItems = [
				{ template: 'no_edit_template', connection : {text : 'Wirecloud CoNWeT'}, url : {text : 'https://wirecloud.conwet.fi.upm.es/'}, id : {text : '1'} },
				{ template: 'no_edit_template', connection : {text : 'Mashups Fi Lab 2'}, url : {text : 'http://wirecloud2.conwet.fi.upm.es/'}, id : {text : '2'} }
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
				{ connection : {text : 'Wirecloud CoNWeT'}, url : {text : 'https://wirecloud.conwet.fi.upm.es/'}, id : {text : '1'} }
			];
			// Save configuration
			privateInstFile.write(JSON.stringify(privateItems));
		}
	};
	
	var sectionClicked = function sectionClicked(e) {
		// When edit button is clicked
		if (e.bindId != null && e.bindId == 'edit_button') { 
			editInstanceMethod(e);
		}
		// When delete button is clicked
		else if (e.bindId != null && e.bindId == 'delete_button') { 
			deleteInstance(e);
		}
		// Other cases choose the instance for use
		else {
			selectInstance(e);
		}
	};
	
	/* Method to select an instance for use */
	var selectInstance = function selectInstance(e) {
		confView.animate({duration: 500, delay: 0, opacity: 0}, function(){
			logo.setOpacity(1);
			systemLabel.setOpacity(1);
			Yaast.Sandbox.currentURL = section[e.sectionIndex].getItemAt(e.itemIndex).url.text;
			Yaast.Sandbox.appConfig.config.lastInstanceName = section[e.sectionIndex].getItemAt(e.itemIndex).connection.text;
			Yaast.Sandbox.appConfig.config.lastInstanceURL = section[e.sectionIndex].getItemAt(e.itemIndex).url.text;
			formCallback();
			destroyConfiguration();
		});
	};
	
	/* Method to delete an instance */
	var deleteInstance = function deleteInstance(e) {
		var myEvent = e;
		var dialog = Ti.UI.createAlertDialog({
			cancel : 0,
			buttonNames : ['No','Yes'],
			message : 'Do you wanna delete it?',
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
					privateInstFile.write(JSON.stringify(privateItems), false);
				} else  { //Public section
					// Delete item in publicItems
					publicItems.splice(myEvent.itemIndex, 1);
					// Update file
					publicInstFile.write(JSON.stringify(publicItems), false);
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
		newInstance = Ti.UI.createView(Yaast.MergeObject(theme.instanceContainerView, {
			left : parseInt(theme.view.width * 0.2, 10),
			width : parseInt(theme.view.width * 0.6, 10)
		}));
		// Text Field for the Instance Name
		newInstanceName = Ti.UI.createTextField(Yaast.MergeObject(theme.inputTextField, {
			width: parseInt(newInstance.width * 0.9, 10),
			left: parseInt(newInstance.width * 0.05, 10),
			height: parseInt(newInstance.height * 0.2, 10),
			top: parseInt(newInstance.height * 0.15, 10),
			keyboardType: Ti.UI.KEYBOARD_DEFAULT,
			returnKeyType: Ti.UI.RETURNKEY_NEXT,
			hintText: "Instance Name"
		}));
		// Text Field for the Instance Url
		newInstanceURL = Ti.UI.createTextField(Yaast.MergeObject(theme.inputTextField, {
			top : parseInt(newInstance.getHeight() * 0.4, 10),
			width: parseInt(newInstance.width * 0.9, 10),
			left: parseInt(newInstance.width * 0.05, 10),
			height: parseInt(newInstance.height * 0.2, 10),
			keyboardType : Ti.UI.KEYBOARD_URL,
			returnKeyType : Ti.UI.RETURNKEY_DONE,
			hintText : "Instance URL"
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
			title : 'Done',
			left : parseInt(newInstance.width * 0.05, 10),
			bottom : parseInt(newInstance.width * 0.15, 10)
		}));
		//Add Back button
		newInstanceCloseButton = Ti.UI.createButton(Yaast.MergeObject(theme.button, {
			title : 'Back',
			right : parseInt(newInstance.width * 0.05, 10),
			bottom : parseInt(newInstance.width * 0.15, 10)
		}));
		// Method for the listener of Done Button
		newInstanceDoneButton.press = function press() {
			if (newInstanceName.value.length === 0 || newInstanceURL.value.length === 0) {
				// Create dialog to alert that there is a empty text field
				var dialog = Ti.UI.createAlertDialog({
					cancel : 0,
					buttonNames : ['Ok'],
					message : 'There is no name or URL',
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
						publicItems.push({connection: {text: newInstanceName.value}, url: {text : newInstanceURL.value}});
						publicInstFile.write(JSON.stringify(publicItems), false);
						// Add instance to publics
						publicSection.appendItems([{
							connection : {text : newInstanceName.value}, url : {text : newInstanceURL.value}
						}]);
						section.push(publicSection);
					} else {
						// Add instance to privates
						privateItems.push({connection: {text : newInstanceName.value}, url: {text : newInstanceURL.value}});
						privateInstFile.write(JSON.stringify(privateItems), false);
						privateSection.appendItems([{
							connection : {text : newInstanceName.value}, url : {text : newInstanceURL.value}
						}]);
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
	var editInstanceMethod = function editInstanceMethod(e) {
		// editInstance main view
		editInstance = Ti.UI.createView(Yaast.MergeObject(theme.instanceContainerView, {
			left : parseInt(theme.view.width * 0.2, 10),
			width : parseInt(theme.view.width * 0.6, 10)
		}));
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
			title : 'Done',
			left : parseInt(editInstance.width * 0.05, 10),
			bottom : parseInt(editInstance.width * 0.15, 10),
			fontSize : parseInt(Yaast.API.UI.getDefaultFontSize()) * 2
		}));
		// Add Back button
		editInstanceCloseButton = Ti.UI.createButton(Yaast.MergeObject(theme.button, {
			title : 'Back',
			right : parseInt(editInstance.width * 0.05, 10),
			bottom : parseInt(editInstance.width * 0.15, 10),
			fontSize : parseInt(Yaast.API.UI.getDefaultFontSize()) * 2
		}));
		// Method for the listener of Done Button
		editInstanceDoneButton.press = function press() {
			if (editInstanceName.value.length === 0 || editInstanceURL.value.length === 0) {
				// Create dialog to alert that there is a empty text field
				var dialog = Ti.UI.createAlertDialog({
					cancel : 0,
					buttonNames : ['Ok'],
					message : 'There is no name or URL',
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
						// Update instance in the public section
						publicSection.updateItemAt(e.itemIndex, {
							connection : {text : editInstanceName.value}, url : {text : editInstanceURL.value}
						});
						//publicItems.splice(e.itemIndex, 1, 
						//	{connection: {text : editInstanceName.value}, url: {text : editInstanceURL.value}});
						//publicInstFile.write(JSON.stringify(publicItems));
						//publicSection.setItems(publicItems);
						section.push(publicSection);
					} else {
						// Update instance in the private section
						privateSection.updateItemAt(e.itemIndex, {
							connection : {text : editInstanceName.value}, url : {text : editInstanceURL.value}
						});
						//privateItems.splice(e.itemIndex, 1, 
						//	{connection : {text : editInstanceName.value}, url : {text : editInstanceURL.value}});
						//privateInstFile.write(JSON.stringify(privateItems));
						//privateSection.setItems(privateItems);
						section.push(privateSection);
					}
					// TODO: Update also the instance to the personal archive or db
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
		// Create Instances List View: Define diferent style templates for items in the list view
		confInstanceListView = Ti.UI.createListView({
			templates : {
				'template' : theme.instanceListViewTemplate,
				'no_edit_template' : theme.instanceListViewTemplateWithoutButtons
			},
			defaultItemTemplate : 'template'
		});
		confInstanceMainView.add(confInstanceListView);

		// Private Instances Section
		privateSection = Ti.UI.createListSection();
		headerPrivate = Ti.UI.createView(theme.headerView);
		// Add section title
		headerPrivate.add(Ti.UI.createLabel(Yaast.MergeObject(theme.headerViewLabel, {
			text : 'Private'
		})));
		// Add '+' button to create new instance
		privateAddButton = Ti.UI.createButton(Yaast.MergeObject(theme.headerViewButton, {
			yesPublic : false
		}));
		// Add handler on click for '+' button
		privateAddButton.addEventListener('click', createNewInstance);
		headerPrivate.add(privateAddButton);
		privateSection.setHeaderView(headerPrivate);
		loadPrivateInstances();
		privateSection.setItems(privateItems);
		section.push(privateSection);
		
		// Public Instances Section
		publicSection = Ti.UI.createListSection();
		headerPublic = Ti.UI.createView(theme.headerView);
		// Add section title
		headerPublic.add(Ti.UI.createLabel(Yaast.MergeObject(theme.headerViewLabel, {
			text : 'Public'
		})));
		// Add '+' button to create new instance
		publicAddButton = Ti.UI.createButton(Yaast.MergeObject(theme.headerViewButton, {
			yesPublic : true
		}));
		publicAddButton.addEventListener('click', createNewInstance);
		headerPublic.add(publicAddButton);
		publicSection.setHeaderView(headerPublic);
		loadPublicInstances();
		publicSection.setItems(publicItems);
		section.push(publicSection);
		
		// Apply sections
		confInstanceListView.sections = section;
		// Add listener for the ListView
		confInstanceListView.addEventListener('itemclick', sectionClicked);
		// Add main view to parent
		parentWindow.add(confView);
	};

	var destroyConfiguration = function destroyConfiguration() {
		// Delete events Listeners
		privateAddButton.removeEventListener('click', createNewInstance);
		publicAddButton.removeEventListener('click', createNewInstance);
		confInstanceListView.removeEventListener('itemclick', sectionClicked);
		// Delete views
		parentWindow.remove(confView);
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

