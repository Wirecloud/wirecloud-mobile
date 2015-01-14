/*
 * Copyright (c) 2014 CoNWeT Lab., Universidad Politecnica de Madrid.
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.3.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

"use strict";

var mainViewStyle = ( function() {

		var _isApple = Yaast.API.HW.System.isApple();

		var _self = {};
		var heightView = Yaast.API.UI.getPlatformHeight() - Yaast.API.UI.getDefaultStatusBar();
		var rowHeight = Yaast.API.UI.getDefaultRowHeight();
		var rowFontSize = Yaast.API.UI.getDefaultFontSize();
		var _fontSize = Yaast.API.UI.getDefaultFontSize();

		_self.view = {
			top : 0,
			left : 0,
			height : heightView,
			width : Yaast.API.UI.getPlatformWidth(),
			backgroundColor : '#5F5F5F'
		};

		_self.line = {
			top : 0,
			left : 0,
			height : 1,
			width : _self.view.width,
			backgroundColor : '#DADADA'
		};

		_self.topBar = {
			top : 0,
			left : 0,
			height : parseInt(_self.view.height * 0.05, 10),
			width : _self.view.width,
			backgroundColor : '#FFFFFF',
			verticalAlign : Titanium.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
			zIndex : 10000
		};

		_self.button = {
			font : {
				fontSize : parseInt(rowFontSize) * 2,
				fontFamily : Yaast.FontAwesome.getFontFamily()
			},
			color : (_isApple) ? '#34AADC' : '#969696',
			shadowColor : '#aaa',
			shadowOffset : {
				x : 0,
				y : 0
			},
			shadowRadius : 3,
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		};

		_self.labelButton = {
			font : {
				fontSize : (_isApple) ? '20' : '18dp',
				fontFamily : 'Default'
			},
			color : (_isApple) ? '#34AADC' : '#969696',
			shadowColor : '#aaa',
			shadowOffset : {
				x : 0,
				y : 0
			},
			shadowRadius : 3,
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER
		};

		_self.logo = {
			url : (Yaast.API.HW.System.isApple()) ? Ti.Filesystem.getResourcesDirectory() + 'images/logo_tab.svg' : '../../images/logo_tab.svg',
			top : parseInt(_self.topBar.height * 0.01, 10),
			height : parseInt(_self.topBar.height * 1.5, 10),
			width : parseInt(_self.topBar.height * 1.5, 10),
			left : parseInt(_self.view.width * 0.02, 10),
			enableZoomControls : false,
			showScrollbars : false,
			touchEnabled : false,
			disableBounce : false
		};

		_self.leftView = {
			top : _self.topBar.top + _self.topBar.height,
			left : 0,
			backgroundColor : '#3F566D',
			width : _self.view.width / 2,
			height : _self.view.height - _self.topBar.height - 12
		};

		_self.rightView = {
			top : _self.topBar.top + _self.topBar.height,
			left : _self.view.width / 2,
			width : _self.view.width / 2,
			backgroundColor : "#4F6C88",
			height : _self.view.height - _self.topBar.height - 13
		};

		_self.welcomeLabel = {
			color : '#3F566D',
			height : rowHeight,
			left : parseInt(_self.logo.left) + parseInt(_self.logo.width) + parseInt(_self.topBar.width) * 0.01,
			font : {
				fontFamily : Yaast.FontAwesome.getFontFamily(),
				fontSize : parseInt(rowFontSize) * 2
			},
			shadowColor : '#aaa',
			shadowOffset : {
				x : 0,
				y : 0
			},
			shadowRadius : 3,
		};

		_self.headerlabelView = {
			height : rowHeight,
			font : {
				fontFamily : Yaast.FontAwesome.getFontFamily(),
				fontSize : rowFontSize
			},
			color : '#FFFFFF',
		};

		_self.ownWorkspaceHeader = {
			text : "My Dashboards",
			width : '100%',
			backgroundColor : '#C3D7F8',
			top : 0,
			color : '#00286B',
			height : rowHeight,
			font : {
				fontFamily : 'Default',
				fontSize : rowFontSize * 1.5
			},
			left : 0,
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER
		};

		_self.publicWorkspaceHeader = {
			text : "Public Dashboards",
			width : '100%',
			backgroundColor : '#C3D7F8',
			color : '#00286B',
			height : rowHeight,
			font : {
				fontFamily : 'Default',
				fontSize : rowFontSize * 1.5
			},
			left : 0,
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER
		};

		_self.ownWorkspacesViewTemplate = {
			childTemplates : [{
				type : 'Ti.UI.Label',
				bindId : 'icon',
				properties : {
					layout : 'horizontal',
					height : rowHeight*1.75,
					color : '#5679a4',
					left : parseInt(_self.view.width) * 0.02,
					font : {
						fontFamily : Yaast.FontAwesome.getFontFamily(),
						fontSize : rowFontSize*2
					},
					textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER
				}
			}, {
				type : 'Ti.UI.Label',
				bindId : 'title',
				properties : {
					width : '100%',
					layout : 'horizontal',
					color : '#FFFFFF',
					font : {
						fontFamily : 'Default',
						fontSize : rowFontSize
					},
					top : 0,
					left : 0,
					height : rowHeight*0.875,
					textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER
				}
			}, {
				type : 'Ti.UI.Label',
				bindId : 'description',
				
				properties : {
					width : '100%',
					layout : 'horizontal',
					color : '#DDDDDD',
					font : {
						fontFamily : 'Default',
						fontSize : rowFontSize * 0.8
					},
					top : rowHeight*0.875,
					right : 0,
					height : rowHeight*0.875, 
					textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER
				}
			}, {
				type : 'Ti.UI.Label',
				bindId : 'id',
				properties : {
					visible : false
				}
			}],
			properties : {
				backgroundColor : '#2B3E50',
				selectedBackgroundColor : 858585,
			},
			events : {}
		};

		/*_self.leftListViewNoWorkspaces = {
		 left: 0,
		 top: 0,
		 height: '200dp',
		 width: '200dp',
		 backgroundColor: '#2a2a2a',
		 opacity: 0.5,
		 color: '#FFFFFF',
		 font: {
		 fontFamily:'Default',
		 fontSize: rowFontSize
		 },
		 text: Ti.Locale.getString('LABEL_NOCOMPOSITION'),
		 textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
		 };

		 _self.leftShadowView = {
		 left: _self.leftView.width,
		 height: _self.leftView.height,
		 width: 15,
		 top: _self.leftView.top,
		 backgroundGradient: {
		 type: 'linear',
		 startPoint: { x: 0, y: 0 },
		 endPoint: { x: 15, y: 0 },
		 colors: [
		 { color: '#3F566D', offset: 0.0 },
		 { color: '#4F6C88', offset: 1.0 }
		 ]
		 },
		 opacity: 1
		 };*/

		_self.leftHeaderListView = {
			left : 0,
			backgroundColor : '#3F566D',
			width : _self.leftView.width,
			height : rowHeight,
			font : {
				fontSize : rowFontSize,
				fontFamily : 'Default'
			},
			color : (_isApple) ? '#34AADC' : '#C1C1C1',
			shadowColor : '#aaa',
			shadowOffset : {
				x : 0,
				y : 0
			},
			shadowRadius : 3,
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			text : Ti.Locale.getString('LABEL_COMPOSITION')
		};

		if (Yaast.API.HW.System.isRetina()) {
			_self.topBar.height *= 2;
			_self.button.height *= 2;
			_self.button.width *= 2;
			_self.button.left *= 2;
			_self.button.top *= 2;
			_self.labelButton.height *= 2;
			_self.labelButton.left *= 2;
			_self.labelButton.top *= 2;
			_self.leftHeaderListView.height *= 2;
		}

		return _self;

	}());

module.exports = mainViewStyle;
