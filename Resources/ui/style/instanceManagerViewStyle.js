/*
 * Copyright (c) 2014 CoNWeT Lab., Universidad Politecnica de Madrid.
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.3.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

"use strict";

var loginViewStyle = ( function() {

		var _os = (Yaast.API.HW.System.isApple()) ? "iPad" : "Android",
		    _version = (_os === 'Android') ? " ~ " + Yaast.API.HW.System.getVersionString() : "",
		    _self = {},
		    _font = 'Comfortaa',
		    _fontSize = Yaast.API.UI.getDefaultFontSize(),
		    _background = '#2B3E50',
		    _background2 = '#456082',
		    _background3 = '#D5E4F1',
		    _backgroundRed = '#FF8888',
		    _backgroundRed2 = '#DF0101',
		    _backgroundGreen = '#99FF99',
		    _backgroundGreen2 = '#187D1B',
		    _editColor = "#FFA500",
		    _editColor2 = "#CA7000",
		    _deleteColor = "#FF5555",
		    _deleteColor2 = "#AA0000",
		    _fontColorGreen = "#00AA00",
		    _fontColor = '#EBEBEB',
		    _fontColorButton = '#354B5D';
		
		/* Main Instance Manager View */
		_self.view = {
			top : 0,
			left : 0,
			backgroundColor : _background,
			width : Yaast.API.UI.getPlatformWidth(),
			height : Yaast.API.UI.getPlatformHeight() - Yaast.API.UI.getDefaultStatusBar(),
			// Size test
			borderWidth : 1,
			borderColor : _background3,
		};
		/* Update height in case there is a top height */
		_self.view.height = Yaast.API.UI.getPlatformHeight() - _self.view.top;
		
		/* Main Instance Manager View Title */
		_self.viewTitle = {
			top : parseInt((_self.view.height * 2) / 100),
			color : _fontColor,
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			font : {
				fontSize : parseInt((Ti.Platform.displayCaps.platformHeight * 9) / 100, 10), // 32
				fontFamily : _font
			},
			text : L('configuration')
		};
		
		/* Instance Container View Settings */
		_self.instanceContainerView = {
			width : parseInt(_self.view.width * 0.9, 10), 
			left : parseInt(_self.view.width * 0.05, 10),
			height : parseInt(_self.view.height * 0.7, 10) ,
			bottom : parseInt(_self.view.height * 0.1, 10),
			borderRadius : 15,
			borderWidth	: 2,
			borderColor : _background3,
			backgroundColor	: _background2
		};
		
		/* Container View Title */
		_self.instanceContainerViewTitle = {
			top : 10,
			left : parseInt(_self.instanceContainerView.width * 0.05, 10),
			text : L('instances'),
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			color : _fontColor,
			font : {
				fontSize : parseInt(Yaast.API.UI.getDefaultFontSize() * 2) ,
				/* fontSize:  parseInt((Ti.Platform.displayCaps.platformHeight*8)/100, 10), // 32 -> 40% */
				fontFamily : _font
			}
		};
		
		/* Edit/Create instance view Settings */
		_self.editCreateInstanceView = {
			left : parseInt(_self.view.width * 0.2, 10),
			width : parseInt(_self.view.width * 0.6, 10),
			height : parseInt(_self.view.height * 0.68, 10) ,
			bottom : parseInt(_self.view.height * 0.07, 10),
			borderRadius : 15,
			borderWidth	: 2,
			borderColor : _background3,
			backgroundColor	: _background2
		};
		
		/* Instance List Main View */
		_self.instanceMainView = {
			bottom : parseInt(_self.instanceContainerView.height * 0.1, 10),
			height : parseInt(_self.instanceContainerView.height * 0.80, 10),
			left : parseInt(_self.instanceContainerView.width * 0.03, 10),
			width : parseInt(_self.instanceContainerView.width * 0.94, 10)
		};
		
		/* Header view label */
		_self.headerView = {
			backgroundColor : _background3,
			width : _self.instanceMainView.width,
			height : parseInt((Ti.Platform.displayCaps.platformHeight * 8) / 100, 10) // 32 -> 40%
		};
		
		/* Style for the title */
		_self.headerViewLabel = {
			color : _background,
			backgroundColor : _background3,
			left: 0,
			width:_self.instanceMainView.width,
			height : parseInt((Ti.Platform.displayCaps.platformHeight * 8) / 100, 10),
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			font : {
				fontSize : parseInt((Ti.Platform.displayCaps.platformHeight * 5) / 100, 10), // 32 -> 40%
				fontFamily : _font
			}
		};
		
		/* Style for the button '+' in title's sections */
		_self.headerViewButton = {
			backgroundColor : _background3,
			color : _background,
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			top: 0,
			height : parseInt(parseInt((Ti.Platform.displayCaps.platformHeight * 8) / 100, 10) - 2),
			right: '1',
			width: parseInt(_self.instanceMainView.width * 0.06, 10),
			title: Yaast.FontAwesome.getCharCode('fa-plus-circle'),
			font : {
				fontFamily : Yaast.FontAwesome.getFontFamily(),
				fontSize : parseInt((Ti.Platform.displayCaps.platformHeight * 6) / 100, 10)
			},
			yesPublic: true
		};
		
		/*
		 * Templates for List View
		 */
		/* Template without Buttons */
		_self.instanceListViewTemplateWithoutButtons = {
			childTemplates : [{
				type : 'Ti.UI.Label',
				bindId : 'connection',
				properties : {
					layout : 'horizontal',
					color : _background,
					font : {
						fontFamily : _font,
						fontSize : parseInt((Ti.Platform.displayCaps.platformHeight * 5.5) / 100, 10)
					},
					left : parseInt(_self.instanceMainView.width * 0.05, 10),
					width: parseInt(_self.instanceMainView.width * 0.43, 10),
					textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT
				}
			}, {
				type : 'Ti.UI.Label',
				bindId : 'url',
				properties : {
					layout : 'horizontal',
					color : _background,
					font : {
						fontFamily : Yaast.FontAwesome.getFontFamily(),
						fontSize : parseInt((Ti.Platform.displayCaps.platformHeight * 3) / 100, 10)
					},
					right: parseInt(_self.instanceMainView.width * 0.1, 10), 
					width: parseInt(_self.instanceMainView.width * 0.44, 10),
					textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT
				}
			}, {
				type : 'Ti.UI.Label',
				bindId : 'id',
				properties : {
					visible : false
				}
			}],
			properties : {
				backgroundColor : '#FFFFFF',
				selectedBackgroundColor : _background3
			},
			events : {}
		};
		
		_self.instanceListViewTemplate = {
			childTemplates : [{
				type : 'Ti.UI.Label',
				bindId : 'connection',
				properties : {
					layout : 'horizontal',
					color : _background,
					font : {
						fontFamily : _font,
						fontSize : parseInt((Ti.Platform.displayCaps.platformHeight * 5.5) / 100, 10)
					},
					left : parseInt(_self.instanceMainView.width * 0.05, 10),
					width: parseInt(_self.instanceMainView.width * 0.43, 10),
					textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT
				}
			}, {
				type: 'Ti.UI.Button',
				bindId: 'edit_button',
				properties: {
					backgroundColor: 'transparent ',
					color: _backgroundGreen2,
					font: {
						fontFamily: Yaast.FontAwesome.getFontFamily(),
						fontSize: parseInt((Ti.Platform.displayCaps.platformHeight * 5) / 100, 10)
					},
					right: 1,
					widht: parseInt(_self.instanceMainView.width * 0.04, 10),
					title: Yaast.FontAwesome.getCharCode('fa-edit'),
					textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER
				}
			}, {
				type: 'Ti.UI.Button',
				bindId: 'delete_button',
				properties: {
					backgroundColor: 'transparent',
					color: _backgroundRed2,
					font: {
						fontFamily: Yaast.FontAwesome.getFontFamily(),
						fontSize: parseInt((Ti.Platform.displayCaps.platformHeight * 5) / 100, 10)
					},
					right: parseInt(_self.instanceMainView.width * 0.06, 10),
					widht: parseInt(_self.instanceMainView.width * 0.04, 10),
					title: Yaast.FontAwesome.getCharCode('fa-ban'),
					textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER
				}
			}, {
				type : 'Ti.UI.Label',
				bindId : 'url',
				properties : {
					layout : 'horizontal',
					color : _background,
					font : {
						fontFamily : Yaast.FontAwesome.getFontFamily(),
						fontSize : parseInt((Ti.Platform.displayCaps.platformHeight * 3) / 100, 10)
					},
					right: parseInt(_self.instanceMainView.width * 0.1, 10), 
					width: parseInt(_self.instanceMainView.width * 0.44, 10),
					textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT
				}
			}, {
				type : 'Ti.UI.Label',
				bindId : 'id',
				properties : {
					visible : false
				}
			}],
			properties : {
				backgroundColor : '#FFFFFF',
				selectedBackgroundColor : _background3
			},
			events : {}
		};
		
		/* Input Text Field Settings */
		_self.inputTextField = {
			color : '#354B5D',
			backgroundColor : '#FFFFFF',
			borderRadius : 5,
			borderWidth : 1,
			borderColor : _background3,
			paddingLeft : 5,
			borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
			autocapitalization : Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
			enableReturnKey : false,
			softKeyboardOnFocus : (Yaast.API.HW.System.isApple()) ? null : Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS,
			autocorrect : false,
			font : {
				fontSize : parseInt(Yaast.API.UI.getDefaultFontSize()) * 1.5,
				/* fontSize: parseInt((Ti.Platform.displayCaps.platformHeight*3.5)/100, 10),*/
				fontFamily : _font
			}
		};
		
		/* Input Text Field Settings */
		_self.inputTextField = {
			color : '#354B5D',
			backgroundColor : '#FFFFFF',
			borderRadius : 5,
			borderWidth : 1,
			borderColor : _background3,
			paddingLeft : 5,
			borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
			autocapitalization : Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
			enableReturnKey : false,
			softKeyboardOnFocus : (Yaast.API.HW.System.isApple()) ? null : Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS,
			autocorrect : false,
			font : {
				fontSize : parseInt(Yaast.API.UI.getDefaultFontSize()) * 1.5,
				fontFamily : _font
			}
		};
		
		/* Button Settings */
		_self.button = {
			width : parseInt(_self.editCreateInstanceView.width * 0.3, 10),
			bottom : parseInt(_self.editCreateInstanceView.height * 0.15, 10),
			backgroundColor : _background3,
			color : _fontColorButton,
			borderRadius : 10,
			borderWidth : 1,
			paddingLeft : 5,
			borderColor : _background,
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			height : parseInt((Ti.Platform.displayCaps.platformHeight * 6) / 100, 10) + 15,
			font : {
				fontSize : parseInt(Yaast.API.UI.getDefaultFontSize()) * 2,
				fontFamily : _font
			}
		};

		return _self;

	}());

module.exports = loginViewStyle; 