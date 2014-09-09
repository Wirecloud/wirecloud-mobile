
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
 
 	// Destroy DetailView
    _self.destroy = function destroy() {
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

		// Theme
    	theme = null;
    };

	/*var callback_function = function(data) {
		// TODO if error volver al main o reintentar?
		var _worksClass = require('workspace/workspaceManager');
		var _worksObject = _worksClass({
		    'topView' : (_isApple && _isIOS7) ? 20 : 0,
			'heightView' : (_isApple && _isIOS7) ? _self.height - 20 : _self.height,
			'data' : data
		}, userName);
		_worksClass = null;

		mainView.parentView.window.add(_worksObject);
	};*/

	/** @title: loadWorkspace (Function)
	 *  @usage: add Widgets and operators to ScrollView
	 *  @extras: require workspaceManager */
	var loadWorkspace = function loadWorkspace() { //TODO
		// clean all views
		//mainView.destroy();
		//mainView = null;
		mainView.parentView.showWorkspaceView(mashup.id);

		/*var _conObject = require('/connections/appConnection');
		_conObject.getWirecloud(callback_function, mashup.id);
		_conObject = null;*/
	};

	loadButton.addEventListener('click', loadWorkspace);

    return _self;

};

module.exports = mainViewDetail;
