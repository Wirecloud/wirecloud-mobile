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
	    privateSection;
	var section = [];
	/* Array of sections */

	/* Testing Purpose */
	var myTestFunction = function myTestFunction(e) {
		if (e.bindId != null && e.bindId == 'edit_button') {/* When edit button is pressed */
			/* TODO: Show edit view */
			confViewTitle.text = 'HAS HECHO CLICK';
		} else {/* Other cases */
			Ti.API.warn('pressed id: ' + e.bindId);
		}
	};

	var sectionClicked = function sectionClicked(e) {
		Ti.API.warn('Pressed id: ' + e.bindId);
		if (e.bindId != null && e.bindId == 'edit_button') {
			editInstanceMethod(e);
		}
		else if (e.bindId != null && e.bindId == 'delete_button') {
			deleteInstance(e);
		}
		else {
		//if (e.bindId != null && e.bindId != 'edit_button' && e.bindId != 'delete_button') {
			selectInstance(e);
		}
	};
	var selectInstance = function selectInstance(e) {
		Yaast.Sandbox.currentURL = section[e.sectionIndex].getItemAt(e.itemIndex).url.text;
		Yaast.Sandbox.appConfig.config.lastInstanceName = section[e.sectionIndex].getItemAt(e.itemIndex).connection.text;
		Yaast.Sandbox.appConfig.config.lastInstanceURL = section[e.sectionIndex].getItemAt(e.itemIndex).url.text;
		formCallback();
		destroyConfiguration();
	};
		var deleteInstance = function deleteInstance(e) {
		e.section.deleteItemsAt(e.itemIndex, 1);
	};

	/* View for create new instances */
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
			title : 'Done',
			left : parseInt(newInstance.width * 0.05, 10),
			bottom : parseInt(newInstance.width * 0.15, 10),
			fontSize : parseInt(Yaast.API.UI.getDefaultFontSize()) * 2
		}));
		/* Add Back button */
		newInstanceCloseButton = Ti.UI.createButton(Yaast.MergeObject(theme.button, {
			title : 'Back',
			right : parseInt(newInstance.width * 0.05, 10),
			bottom : parseInt(newInstance.width * 0.15, 10),
			fontSize : parseInt(Yaast.API.UI.getDefaultFontSize()) * 2
		}));
		newInstanceDoneButton.press = function press() {
			if (newInstanceName.value.length === 0 || newInstanceURL.value.length === 0) {
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
			} else {
				if (button.yesPublic) {
					Ti.API.warn("yes!");
					publicSection.appendItems([{
						connection : {
							text : newInstanceName.value
						},
						url : {
							text : newInstanceURL.value
						}
					}]);
					section.push(publicSection);
				} else {
					Ti.API.warn("no!");
					privateSection.appendItems([{
						connection : {
							text : newInstanceName.value
						},
						url : {
							text : newInstanceURL.value
						}
					}]);
					section.push(privateSection);
				}
				newInstance.removeEventListener('click', createNewInstance);
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
				newInstance = null;
				//instance adde, TODO: contact with a database or something to make it persistent?
			}
		};
		newInstanceCloseButton.press = function press() {
			newInstance.removeEventListener('click', createNewInstance);
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
			newInstance = null;
		};
		newInstanceDoneButton.addEventListener('click', newInstanceDoneButton.press);
		newInstanceCloseButton.addEventListener('click', newInstanceCloseButton.press);
		//added to the window
		newInstance.add(newInstanceDoneButton);
		newInstance.add(newInstanceCloseButton);
		parentWindow.add(newInstance);
	};

	/* View for edit instances */
	var editInstanceMethod = function editInstanceMethod(e) {
		/* editInstance main view */
		editInstance = Ti.UI.createView(Yaast.MergeObject(theme.containerView, {
			left : parseInt(theme.view.width * 0.2, 10),
			width : parseInt(theme.view.width * 0.6, 10)
		}));
		/* Text Field for the Instance Name */
		editInstanceName = Ti.UI.createTextField(Yaast.MergeObject(theme.inputTextField, {
			top : parseInt(editInstance.getHeight() * 0.15, 10),
			keyboardType : Ti.UI.KEYBOARD_DEFAULT,
			returnKeyType : Ti.UI.RETURNKEY_NEXT,
			value : section[e.sectionIndex].getItemAt(e.itemIndex).connection.text
		}));
		/* Text Field for the Instance Url */
		editInstanceURL = Ti.UI.createTextField(Yaast.MergeObject(theme.inputTextField, {
			top : parseInt(editInstance.getHeight() * 0.4, 10),
			keyboardType : Ti.UI.KEYBOARD_URL,
			returnKeyType : Ti.UI.RETURNKEY_DONE,
			value : section[e.sectionIndex].getItemAt(e.itemIndex).url.text
		}));

		/* Add Text Fields to the view */
		editInstance.add(editInstanceName);
		editInstance.add(editInstanceURL);
		/* Add Done button */
		/* TODO: improve style */
		editInstanceDoneButton = Ti.UI.createButton(Yaast.MergeObject(theme.button, {
			title : 'Done',
			left : parseInt(editInstance.width * 0.05, 10),
			bottom : parseInt(editInstance.width * 0.15, 10),
			fontSize : parseInt(Yaast.API.UI.getDefaultFontSize()) * 2
		}));
		/* Add Back button */
		editInstanceCloseButton = Ti.UI.createButton(Yaast.MergeObject(theme.button, {
			title : 'Back',
			right : parseInt(editInstance.width * 0.05, 10),
			bottom : parseInt(editInstance.width * 0.15, 10),
			fontSize : parseInt(Yaast.API.UI.getDefaultFontSize()) * 2
		}));

		editInstanceDoneButton.press = function press() {
			if (editInstanceName.value.length === 0 || editInstanceURL.value.length === 0) {
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
			} else {
				if (e.sectionIndex == 1) {
					Ti.API.warn("yes!");
					publicSection.updateItemAt(e.itemIndex, {
						connection : {
							text : editInstanceName.value
						},
						url : {
							text : editInstanceURL.value
						}
					});
					section.push(publicSection);
				} else {
					Ti.API.warn("no!");
					privateSection.updateItemAt(e.itemIndex, {
						connection : {
							text : editInstanceName.value
						},
						url : {
							text : editInstanceURL.value
						}
					});
					section.push(privateSection);
				}
				editInstance.removeEventListener('click', editInstanceMethod);
				editInstanceDoneButton.removeEventListener('click', editInstanceDoneButton.press);
				editInstanceCloseButton.removeEventListener('click', editInstanceCloseButton.press);
				//editInstanceName.removeEventListener('return', editInstanceName.getText);
				//editInstanceURL.removeEventListener('return', editInstanceURL.getText);
				editInstance.remove(editInstanceDoneButton);
				editInstance.remove(editInstanceCloseButton);
				editInstance.remove(editInstanceName);
				editInstance.remove(editInstanceURL);
				editInstanceDoneButton = null;
				editInstanceCloseButton = null;
				editInstanceName = null;
				editInstanceURL = null;
				parentWindow.remove(editInstance);
				editInstance = null;
				//instance adde, TODO: contact with a database or something to make it persistent?
			}
		};
		editInstanceCloseButton.press = function press() {
			editInstance.removeEventListener('click', editInstanceMethod);
			editInstanceDoneButton.removeEventListener('click', editInstanceDoneButton.press);
			editInstanceCloseButton.removeEventListener('click', editInstanceCloseButton.press);
			editInstance.remove(editInstanceDoneButton);
			editInstance.remove(editInstanceCloseButton);
			editInstance.remove(editInstanceName);
			editInstance.remove(editInstanceURL);
			editInstanceDoneButton = null;
			editInstanceCloseButton = null;
			editInstanceName = null;
			editInstanceURL = null;
			parentWindow.remove(editInstance);
			editInstance = null;
			//instance adde, TODO: contact with a database or something to make it persistent?
		};
		editInstanceCloseButton.press = function press() {
			editInstance.removeEventListener('click', editInstanceMethod);
			editInstanceDoneButton.removeEventListener('click', editInstanceDoneButton.press);
			editInstanceCloseButton.removeEventListener('click', editInstanceCloseButton.press);
			editInstance.remove(editInstanceDoneButton);
			editInstance.remove(editInstanceCloseButton);
			editInstance.remove(editInstanceName);
			editInstance.remove(editInstanceURL);
			editInstanceDoneButton = null;
			editInstanceCloseButton = null;
			editInstanceName = null;
			editInstanceURL = null;
			parentWindow.remove(editInstance);
			editInstance = null;
		};
		editInstanceDoneButton.addEventListener('click', editInstanceDoneButton.press);
		editInstanceCloseButton.addEventListener('click', editInstanceCloseButton.press);
		//added to the window
		editInstance.add(editInstanceDoneButton);
		editInstance.add(editInstanceCloseButton);
		parentWindow.add(editInstance);
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
			templates : {/* Define diferent style templates for items in the list view */
				'template' : theme.connectionListViewTemplate,
				'template_connected' : theme.connectionListViewTemplateConected /* change for ...Connected */
			},
			defaultItemTemplate : 'template'
		});
		confInstanceMainView.add(confInstanceListView);

		/* Private Instances Section */
		privateSection = Ti.UI.createListSection();
		var headerPrivate = Ti.UI.createView(theme.headerView);
		/* Add section title */
		headerPrivate.add(Ti.UI.createLabel(Yaast.MergeObject(theme.headerViewLabel, {
			text : 'Private'
		})));
		/* Add '+' button to create new instance */
		privateAddButton = Ti.UI.createButton(Yaast.MergeObject(theme.headerViewButton, {
			yesPublic : false
		}));
		/* Add handler on click */
		privateAddButton.addEventListener('click', createNewInstance);
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
			text : 'Public'
		})));
		/* Add '+' button to create new instance */
		publicAddButton = Ti.UI.createButton(Yaast.MergeObject(theme.headerViewButton, {
			yesPublic : true
		}));
		//adding new instance starts here:
		publicAddButton.addEventListener('click', createNewInstance);
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
		section.push(publicSection);
		/* Apply sections */
		confInstanceListView.sections = section;

		confInstanceListView.addEventListener('itemclick', sectionClicked);

		parentWindow.add(confView);
	};

	var destroyConfiguration = function destroyConfiguration() {
		/* Delete events Listeners */
		if (privateAddButton.press != null) {
			privateAddButton.removeEventListener('click', privateAddButton.press);
		}
		delete privateAddButton.press;
		if (publicAddButton.press != null) {
			publicAddButton.removeEventListener('click', publicAddButton.press);
		}
		delete publicAddButton.press;
		/* Delete views */
		confInstanceListView.removeEventListener('itemclick', sectionClicked);
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

