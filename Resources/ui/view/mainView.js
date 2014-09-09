
/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.3.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 */

"use strict";

var mainView = function mainView(parentWindow, userName) {
	Ti.API.info('----Loading MainView');
	var _isApple = Yaast.API.HW.System.isApple();
    // Create References
    var theme = require('ui/style/mainViewStyle');
    var topBar = Ti.UI.createView(theme.topBar);
    var wirecloudLogo = Ti.UI.createWebView(theme.logo);
    var buttonLogout = Ti.UI.createLabel(Yaast.MergeObject(theme.button, {
        left: (_isApple) ? 14 : 12,
        text: Yaast.FontAwesome.getCharCode('fa-sign-out')
    }));
    var buttonStore = Ti.UI.createLabel(Yaast.MergeObject(theme.button, {
        left: (_isApple) ? 14 : 12,
        text: Yaast.FontAwesome.getCharCode('fa-cloud')
    }));
    var leftView = Ti.UI.createView(theme.leftView);
    var rightView = Ti.UI.createView(theme.rightView);

    var _self = {
        compositions : {},
        detailView : null,
        view : Ti.UI.createView(theme.view),
        parentView: parentWindow
    };

    // Bind click ListView
    _self.clickRowListView = function clickRowListView(e) {
    	Ti.API.info('e.section.getItemAt(e.itemIndex).id.text: ' + e.section.getItemAt(e.itemIndex).id.text);
        _self.showDetailView(e.section.getItemAt(e.itemIndex).id.text);
    };

	// Add click event into listView
	theme.ownWorkspacesViewTemplate.events = {click: _self.clickRowListView};
    var ownWorkspacesView = Ti.UI.createListView({
        templates: {
            'template':theme.ownWorkspacesViewTemplate
        },
        defaultItemTemplate: 'template'
    });

    var publicWorkspacesView = Ti.UI.createListView({
        templates: {
            'template':theme.ownWorkspacesViewTemplate
        },
        defaultItemTemplate: 'template'
    });

	var createHeaderView = function createHeaderView(text) {
	    var view = Ti.UI.createLabel(theme.headerlabelView);
	    view.text = text;
	    return view;
	};

	_self.createWorkspaceLink = function createWorkspaceLink(data) {
		// TODO change it after fix shared attr bug
		if (data.owned && !data.shared) {
			// User Workspace
			Ti.API.info('TODO User Workspace: ' + JSON.stringify(data));
		} else if (data.owned && data.shared){
			// User and public Workspace
			Ti.API.info('TODO User & Public Workspace: ' + JSON.stringify(data));
		} else {
			// Public Workspace
			Ti.API.info('TODO Public Workspace: ' + JSON.stringify(data));
		}
		var result = {
            'title': {
                text: data.creator + '/' + data.name
            },
            'icon': {
            	text : (data.shared) ? Yaast.FontAwesome.getCharCode('fa-globe') :
                       Yaast.FontAwesome.getCharCode('fa-shield')
            },
            'id':{
            	text : data.id
            }
       };
       return result;
	};

	_self.setWorkspaces = function setWorkspaces(values) {
		if (values == "Error") {
			// getWirecloud error
			var _stringSearch;
			if (Ti.Network.online) _stringSearch = (_isApple) ? "error_connection_login_ios" : "error_connection_login_android";
			else _stringSearch = "error_connection_inet";
			var _alertError = Ti.UI.createAlertDialog({
				title: "Wirecloud",
				message: L(_stringSearch),
				buttonNames: [L("alert_button_accept")],
			});
			_alertError.show();
			_stringSearch = null;
			_alertError = null;
			Ti.API.info('Error getting Wirecoud Info');
		}
		else {
			// getWirecloud success
			var parsedValues = JSON.parse(values);
			// TODO file system persistence
			var newLink;
			var ownWorkspaces = Ti.UI.createListSection({headerView: createHeaderView('My Workspaces')});
			var publicWorkspaces = Ti.UI.createListSection({headerView: createHeaderView('Public Workspaces')});
            var rowsOwn = [];
            var rowsPublic = [];
			for (var i = 0; i < parsedValues.length; i ++) {
				newLink = _self.createWorkspaceLink(parsedValues[i]);
				if (parsedValues[i].owned) {
					rowsOwn.push(newLink);
				} else {
					rowsPublic.push(newLink);
				}
				
				_self.compositions[parsedValues[i].id] = parsedValues[i];
			}
			ownWorkspaces.setItems(rowsOwn);
			ownWorkspacesView.setSections([ownWorkspaces]);
			ownWorkspaces = null;
			publicWorkspaces.setItems(rowsPublic);
			publicWorkspacesView.setSections([publicWorkspaces]);
			publicWorkspaces = null;
            rowsOwn = null;
            rowsPublic = null;
            ownWorkspacesView.setTouchEnabled(true);
            ownWorkspacesView.height = leftView.height / 2;
            ownWorkspacesView.top=0;
            publicWorkspacesView.setTouchEnabled(true);
            leftView.add(ownWorkspacesView);
            publicWorkspacesView.height = leftView.height / 2;
            publicWorkspacesView.top = ownWorkspacesView.height;
            leftView.add(publicWorkspacesView);
            _self.view.add(leftView);
            _self.view.add(rightView);
		}
	};
	
	// Login Event and creation of MainView
	_self.getWirecloudInfo = function getWirecloudInfo(data){
		var _conObject = require('/connections/appConnection');
		var _conA = _conObject.getWorkspaces(_self.setWorkspaces);
		_conObject = null;
		_conA = null;
	};

    // Create Navigation Bar
    if(_isApple) {
        _self.view.add(Ti.UI.createView(theme.line));
    }
    topBar.add(buttonLogout);
    buttonLogout.setLeft(topBar.getWidth() - 140);
    buttonStore.setLeft(buttonLogout.getLeft() - 150);
    topBar.add(buttonStore);
    topBar.add(Ti.UI.createLabel(Yaast.MergeObject(theme.labelButton, {
        left: buttonLogout.getLeft() + 50,
        text: ' logOut'
    })));
    topBar.add(Ti.UI.createLabel(Yaast.MergeObject(theme.labelButton, {
        left: buttonStore.getLeft() + 50,
        text: ' Store'
    })));
    topBar.add(wirecloudLogo);
    topBar.add(Ti.UI.createLabel(Yaast.MergeObject(theme.welcomeLabel, {
        text: 'Welcome to Wirecloud 4 Tablet ' + userName
    })));
    _self.view.add(topBar);

    // Bind click Logout Button
    _self.clickLogoutButton = function clickLogoutButton() {
        parentWindow.showLoginView();
    };
    buttonLogout.addEventListener('singletap', _self.clickLogoutButton);

    // Bind click Store Button
    _self.clickStoreButton = function clickStoreButton() {
        parentWindow.showStoreView();
    };
    buttonStore.addEventListener('singletap', _self.clickStoreButton);

    // Create Connection to fill ListView
    _self.reloadTable = function reloadTable() {
    	Ti.API.info('----reloadTable in MainView');
        var compFolder = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'composition').getDirectoryListing();
        var i;
        if(compFolder.length === 0){
        	Ti.API.info('----No offline Workspaces availables');
        	// TODO esto no va, hay que usar secciones, ya que se trata de un listView
            //ownWorkspacesView.setTouchEnabled(false);
            //leftView.add(Ti.UI.createLabel(theme.leftListViewNoWorkspaces));
            _self.getWirecloudInfo();
        }
        else {
        	// TODO entrar con cosas guardadas en los meta (antes hay que crear los metadatos.. los defino en la detailView)
            var compositions = Ti.UI.createListSection();
            var rows = [];
            for(i = 0; i < compFolder.length; i++){
                var metadataComp = JSON.parse(Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,
                    'composition/' + compFolder[i] + '/', '.metadata').read().toString());
                _self.compositions[compFolder[i]] = metadataComp;
                rows.push({
                    id: {
                        text: compFolder[i]
                    },
                    title: {
                        text: metadataComp.name
                    },
                    icon: {
                        text : (metadataComp.icon === "") ? Yaast.FontAwesome.getCharCode('fa-columns') :
                               Yaast.FontAwesome.getCharCode(metadataComp.icon)
                    }
                });
                metadataComp = null;
            }
            compositions.setItems(rows);
            leftView.setSections([compositions]);
            compositions = null;
            rows = null;
            _self.view.add(leftView);
        }
        compFolder = null;
    };

    // Create Details View of Composition
    _self.showDetailView = function showDetailView(idComposition) {
    	if (_self.detailView !== null) {
    		rightView.remove(_self.detailView);
    		_self.detailView.destroy();
    	}
        _self.detailView = require('ui/view/mainViewDetail')(
            _self.compositions[idComposition],
            _self,
            userName
        );
        rightView.add(_self.detailView);
    };

    // Load Workspaces on ListView
    Ti.API.info('----Load Workspaces on ListView MainView');
    _self.reloadTable();

    // Destroy MainView
    _self.destroy = function destroy() {
    	// TopBar
    	buttonLogout.removeEventListener('singletap', _self.clickLogoutButton);
        buttonStore.removeEventListener('singletap', _self.clickStoreButton);
    	topBar.remove(buttonLogout);
    	topBar.remove(buttonStore);
    	topBar.remove(wirecloudLogo);
    	_self.view.remove(topBar);

    	// LeftView
        _self.view.remove(leftView);
        leftView.remove(ownWorkspacesView);
        ownWorkspacesView = null;
        leftView.remove(publicWorkspacesView);
		publicWorkspacesView = null;
        leftView = null;

    	// RightView
    	if (_self.detailView !== null) {
    		// Delete detailView
    		_self.view.remove(_self.detailView);
    		_self.detailView.destroy();
    	}
        _self.view.remove(rightView);
        rightView = null;

    	// Main view
    	_self.view = null;
        theme = null;
    };

    return _self;

};

module.exports = mainView;
