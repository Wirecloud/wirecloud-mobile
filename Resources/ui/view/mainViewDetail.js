
/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.3.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 */

"use strict";

var mainViewDetail = function mainViewDetail(mashup, mainView, userName) {

/* mashup structure
mashup = {
	name: string
	creator: string
	shared: bool
	...
}
*/
	var _isApple = Yaast.API.HW.System.isApple();
	var _isIOS7 = (_isApple && Ti.Platform.version.split('.')[0] === '7') ? true : false;

	var _dataWirecloud;

	// Theme reference
	var theme = require('ui/style/mainViewDetailStyle');

    // _self reference
    var _self = Ti.UI.createView(theme.view);
    _self.mashup = mashup;

	if (mashup === 'default') {
		// Default DetailView
		// Logo Icon
	 	var logoIcon = Ti.UI.createImageView(theme.logoIcon);
	 	_self.add(logoIcon);
	 	
		// Welcome Label
	 	var welcomeLabel = Ti.UI.createLabel(theme.welcomeLabel);
	 	welcomeLabel.text = userName + ',\nWelcome to Wirecloud 4 Tablet';
	 	_self.add(welcomeLabel);

	 	// Info Label
	 	var infoLabel = Ti.UI.createLabel(theme.infoLabel);
	 	infoLabel.text = 'Choose a dashboard from the left panel and use it!';
	 	_self.add(infoLabel);

	 	// Link label
	 	var linkLabel = Ti.UI.createLabel(theme.linkLabel);
	 	linkLabel.text = 'Manage your dashboards and create new ones visiting';
	 	_self.add(linkLabel);
	 	
	 	// Wirecloud link
	 	var wirecloudLink = Ti.UI.createView(theme.wirecloudLinkView);
	 	var wirecloudLinkText = Ti.UI.createLabel(theme.wirecloudLinkText);
	 	wirecloudLinkText.text = 'Wirecloud Site';
	 	wirecloudLink.add(wirecloudLinkText);
		var linkHandler = function linkHandler(e) {
			//open link in safari - application will close
			Titanium.Platform.openURL(Yaast.Sandbox.currentURL);
		};
		wirecloudLink.addEventListener('click', linkHandler);
		_self.add(wirecloudLink);

	} else {
	    // Main title
	    var mainTitle = Ti.UI.createLabel(theme.mainTitle);
	    mainTitle.text = mashup.name;
		_self.add(mainTitle);
	
	    // Creator
	    var creatorLabel = Ti.UI.createLabel(theme.creatorLabel);
	    creatorLabel.text = 'Mashup created by ' + mashup.creator;
	 	_self.add(creatorLabel);
	
	    // Description
	    var descriptionLabel = Ti.UI.createLabel(theme.descriptionLabel);
	    //creatorLabel.text += mashup.longdescripton;
	 	_self.add(descriptionLabel);
	
	 	// loadButton
	 	var loadButton = Ti.UI.createLabel(theme.loadButton);
	 	_self.add(loadButton);
	
		/** @title: loadWorkspace (Function)
		 *  @usage: add Widgets and operators to ScrollView
		 *  @extras: require workspaceManager */
		var loadWorkspace = function loadWorkspace() { //TODO
			mainView.parentView.showWorkspaceView(mashup.id);
		};
	
		loadButton.addEventListener('click', loadWorkspace);
	}

 	// Destroy DetailView
    _self.destroy = function destroy() {
    	if (_self.mashup === 'default') {
			// Logo Icon
		 	_self.remove(logoIcon);
		 	logoIcon = null;
		 	
			// Welcome Label
			_self.remove(welcomeLabel);
		 	welcomeLabel = null;
	
		 	// Info Label
			_self.remove(infoLabel);
		 	infoLabel = null;
	
		 	// Link label
			_self.remove(linkLabel);
		 	linkLabel = null;
		 	
		 	// Wirecloud link
			_self.remove(wirecloudLink);
			wirecloudLink.removeEventListener('click', linkHandler);
		 	wirecloudLink = null;
		 	linkHandler = null;
    	} else {
	    	// Main title
	    	_self.remove(mainTitle);
	    	mainTitle = null;
	
			// Creator
	    	_self.remove(creatorLabel);
	    	creatorLabel = null;
	
	    	// loadButton
	    	loadButton.removeEventListener('click', loadWorkspace);
	    	_self.remove(loadButton);
	    	loadButton = null;
		}
		// Theme
    	theme = null;
    };
    return _self;
};

module.exports = mainViewDetail;
