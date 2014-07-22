
/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.2.2GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 */

"use strict";

var mainView = function mainView(parentWindow) {

    // Create References
    var theme = require('ui/style/mainViewStyle'),
    topBar = Ti.UI.createView(theme.topBar),
    buttonLogout = Ti.UI.createLabel(Yaast.MergeObject(theme.button, {
        left: (Yaast.API.HW.System.isApple()) ? 14 : '8dp',
        text: Yaast.FontAwesome.getCharCode('fa-sign-out')
    })),
    buttonStore = Ti.UI.createLabel(Yaast.MergeObject(theme.button, {
        left: (Yaast.API.HW.System.isApple()) ? 14 : '8dp',
        text: Yaast.FontAwesome.getCharCode('fa-cloud')
    })),
    leftView = Ti.UI.createListView(Yaast.MergeObject(theme.leftListView, {
        templates: {
            'template': theme.leftListViewTemplate
        },
        defaultItemTemplate: 'template'
    })),
    shadowView = Ti.UI.createView(theme.leftShadowView),
    _self = {
        compositions : {},
        detailView : null,
        view : Ti.UI.createView(theme.view)
    };

    // Create Navigation Bar
    if(Yaast.API.HW.System.isApple()) {
        _self.view.add(Ti.UI.createView(theme.line));
    }
    topBar.add(buttonLogout);
    buttonStore.setLeft(topBar.getWidth() - (buttonStore.getLeft() + buttonStore.getWidth() + 50));
    topBar.add(buttonStore);
    topBar.add(Ti.UI.createLabel(Yaast.MergeObject(theme.labelButton, {
        left: buttonLogout.getLeft() + buttonLogout.getWidth(),
        text: ' ' + Ti.Locale.getString("BUTTON_LOGOUT")
    })));
    topBar.add(Ti.UI.createLabel(Yaast.MergeObject(theme.labelButton, {
        left: buttonStore.getLeft() + buttonStore.getWidth(),
        text: ' ' + Ti.Locale.getString("BUTTON_STORE")
    })));
    _self.view.add(topBar);

    // Create Left Header ListView
    //leftView.setHeaderView(Ti.UI.createLabel(theme.leftHeaderListView));

    // Add Views
    _self.view.add(shadowView);
    _self.view.add(leftView);

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

    // Bind click ListView
    _self.clickRowListView = function clickRowListView(e) {
        _self.showDetailView(e.section.getItemAt(e.itemIndex).id.text);
    };
    leftView.addEventListener('itemclick', _self.clickRowListView);

    // Create Connection to fill ListView
    _self.reloadTable = function reloadTable() {
        var compFolder = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'composition').getDirectoryListing(), i;
        if(compFolder.length === 0){
            leftView.setTouchEnabled(false);
            leftView.add(Ti.UI.createLabel(theme.leftListViewNoWorkspaces));
        }
        else{
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
        }
        compFolder = null;
    };

    // Create Details View of Composition
    _self.showDetailView = function showDetailView(idComposition) {
        _self.detailView = require('ui/view/mainViewDetail')(
            _self.compositions[idComposition]
        );
        _self.view.add(_self.detailView);
    };

    // Load Workspaces on ListView
    _self.reloadTable();

    // Destroy MainView
    _self.destroy = function destroy() {
        if(_self.detailView !== null){
            _self.view.remove(_self.detailView);
        }
        _self.view.remove(shadowView);
        _self.view.remove(leftView);
        leftView.removeEventListener('itemclick', _self.clickRowListView);
        buttonLogout.removeEventListener('singletap', _self.clickLogoutButton);
        buttonStore.removeEventListener('singletap', _self.clickStoreButton);
        theme = null;
    };

    return _self;

};

module.exports = mainView;
