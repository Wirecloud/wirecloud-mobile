/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.3.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 */

"use strict";

var loginViewStyle = ( function() {

		var _os = (Yaast.API.HW.System.isApple()) ? "iPad" : "Android",
		    _version = (_os === 'Android') ? " ~ " + Yaast.API.HW.System.getVersionString() : "",
		    _self = {},
		    _font = 'Comfortaa',
		    _background = '#2B3E50',
		    _background2 = '#456082',
		    _background3 = '#D5E4F1',
		    _backgroundRed = '#FF8888',
		    _backgroundGreen = '#99FF99',
		    _backgroundGreen2 = '#187D1B',
		    _editColor = "#FFA500",
		    _editColor2 = "#CA7000",
		    _deleteColor = "#FF5555",
		    _deleteColor2 = "#AA0000",
		    _fontColorGreen = "#00AA00",
		    _fontColor = '#EBEBEB',
		    _fontColorButton = '#354B5D';
		// 1F3346

		/* Main View Settings */
		_self.view = {
			top : 0,
			left : 0,
			backgroundColor : _background,
			width : Yaast.API.UI.getPlatformWidth(),
			height : Yaast.API.UI.getPlatformHeight() - Yaast.API.UI.getDefaultStatusBar(),
			/* Size test */
			borderWidth : 1,
			borderColor : _background3,
		};
		/* Update height in case there is a top height */
		_self.view.height = Yaast.API.UI.getPlatformHeight() - _self.view.top;

		/*
		 *
		 *  Generales
		 *
		 */
		/* Container View Settings */
		_self.containerView = {
			width : parseInt(_self.view.width * 0.46, 10),
			/* width: parseInt(((_self.view.width)/2) - (_self.view.width*0.04), 10), */
			height : parseInt(((_self.view.height) / 2), 10),
			borderRadius : 15,
			borderWidth : 1,
			borderColor : _background3,
			backgroundColor : _background2
		};
		/* Input Text Field Settings */
		_self.inputTextField = {
			width : '90%',
			left : '5%',
			height : '20%',
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
		/* Button Settings */
		_self.button = {
			backgroundColor : _background3,
			color : _fontColorButton,
			borderRadius : 10,
			borderWidth : 1,
			paddingLeft : 5,
			borderColor : _background,
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			height : parseInt((Ti.Platform.displayCaps.platformHeight * 6) / 100, 10) + 15,
			font : {
				fontSize : parseInt(Yaast.API.UI.getDefaultFontSize()),
				/* fontSize: parseInt((Ti.Platform.displayCaps.platformHeight*2.5)/100, 10),*/
				fontFamily : _font
			}
		};

		/*
		 *
		 * Configuration Form
		 *
		 */

		_self.configurationFormTitle = {
			top : parseInt((_self.containerView.height * 2) / 100),
			color : _fontColor,
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			font : {
				fontSize : parseInt((Ti.Platform.displayCaps.platformHeight * 9) / 100, 10), // 32
				fontFamily : _font
			},
			text : 'Configuration'
		};

		// Configuration Form Instances

		_self.connectionView = {
			bottom : parseInt((_self.containerView.height * 3.75) / 100), // 60 -> 7.5 %
			width : '94%',
			left : '3%',
			height : parseInt(_self.containerView.height * 0.80, 10),
		};

		_self.instanceTitle = {
			top : 10,
			left : '5%',
			text : 'Instances',
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			color : _fontColor,
			font : {
				fontSize : parseInt(Yaast.API.UI.getDefaultFontSize()) * 2,
				/* fontSize:  parseInt((Ti.Platform.displayCaps.platformHeight*8)/100, 10), // 32 -> 40% */
				fontFamily : _font
			}
		};

		_self.headerView = {
			backgroundColor : _background3,
			width : '100%',
			height : parseInt((Ti.Platform.displayCaps.platformHeight * 8) / 100, 10) // 32 -> 40%
		};
		
		/* Style for the title */
		_self.headerViewLabel = {
			color : _background,
			left: '0',
			width: '100%',
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
			height : _self.headerView.height - 2,
			right: '1',
			width: '6%',
			title: Yaast.FontAwesome.getCharCode('fa-plus-circle'),
			font : {
				fontFamily : Yaast.FontAwesome.getFontFamily(),
				fontSize : parseInt((Ti.Platform.displayCaps.platformHeight * 6) / 100, 10)
			}
		};
		
		 /* Template for Private Items in Private Section with Edit-Button */
		_self.connectionListPrivateViewTemplate = {
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
					left : '5%',
					textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT
				}
			}, {
				type: 'Ti.UI.Button',
				bindId: 'edit-button',
				properties: {
					backgroundColor: 'transparent ',
					color: _backgroundGreen2,
					font: {
						fontFamily: Yaast.FontAwesome.getFontFamily(),
						fontSize: parseInt((Ti.Platform.displayCaps.platformHeight * 5) / 100, 10)
					},
					right: 1,
					widht: '4%',
					title: Yaast.FontAwesome.getCharCode('fa-edit'),
					textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER
				}
			}, {
				type : 'Ti.UI.Label',
				bindId : 'url',
				properties : {
					visible : false
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
		
		 /* Template for Public Items in Public Section without Edit-Button */
		_self.connectionListPublicViewTemplate = {
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
					left : '5%',
					textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT
				}
			}, {
				type : 'Ti.UI.Label',
				bindId : 'url',
				properties : {
					visible : false
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

		_self.connectionListViewTemplateConected = {
			childTemplates : [{
				type : 'Ti.UI.Label',
				bindId : 'connection',
				properties : {
					layout : 'horizontal',
					color : _background,
					font : {
						fontFamily : _font,
						fontSize : parseInt((Ti.Platform.displayCaps.platformHeight * 6) / 100, 10)
					},
					left : '5%',
					textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT
				}
			}, {
				type : 'Ti.UI.Label',
				bindId : 'conected_icon',
				properties : {
					layout : 'horizontal',
					color : _fontColorGreen,
					right : '2%',
					font : {
						fontFamily : Yaast.FontAwesome.getFontFamily(),
						fontSize : parseInt((Ti.Platform.displayCaps.platformHeight * 9) / 100, 10)
					},
					text : Yaast.FontAwesome.getCharCode('fa-check'),
					textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER
				}
			}, {
				type : 'Ti.UI.Label',
				bindId : 'url',
				properties : {
					visible : false
				}
			}, {
				type : 'Ti.UI.Label',
				bindId : 'id',
				properties : {
					visible : false
				}
			}],
			properties : {
				backgroundColor : _backgroundGreen,
				selectedBackgroundColor : _background3
			},
			events : {}
		};

		_self.connectionListViewTemplateChoosed = {
			childTemplates : [{
				type : 'Ti.UI.Label',
				bindId : 'connection',
				properties : {
					layout : 'horizontal',
					color : _fontColor,
					font : {
						fontFamily : _font,
						fontSize : parseInt((Ti.Platform.displayCaps.platformHeight * 6) / 100, 10)
					},
					left : '4%',
					top : 15,
					textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT
				}
			}, {
				type : 'Ti.UI.Label',
				bindId : 'url',
				properties : {
					visible : true,
					layout : 'horizontal',
					color : _fontColor,
					bottom : 10,
					left : '2%',
					font : {
						fontFamily : _font,
						fontSize : parseInt((Ti.Platform.displayCaps.platformHeight * 4) / 100, 10)
					},
					textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT
				}
			}, {
				type : 'Ti.UI.Label',
				bindId : 'edit_connection',
				properties : {
					layout : 'horizontal',
					color : _editColor,
					right : '15%',
					font : {
						fontFamily : Yaast.FontAwesome.getFontFamily(),
						fontSize : parseInt((Ti.Platform.displayCaps.platformHeight * 9) / 100, 10)
					},
					text : ' ' + Yaast.FontAwesome.getCharCode('fa-pencil-square-o') + ' ',
					textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER
				}
			}, {
				type : 'Ti.UI.Label',
				bindId : 'delete_connection',
				properties : {
					layout : 'horizontal',
					color : _deleteColor,
					right : '2%',
					font : {
						fontFamily : Yaast.FontAwesome.getFontFamily(),
						fontSize : parseInt((Ti.Platform.displayCaps.platformHeight * 9) / 100, 10)
					},
					text : ' ' + Yaast.FontAwesome.getCharCode('fa-minus-circle') + ' ',
					textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER
				}
			}, {
				type : 'Ti.UI.Label',
				bindId : 'conect_button_icon',
				properties : {
					layout : 'horizontal',
					color : _background,
					backgroundColor : _backgroundGreen,
					left : '1%',
					font : {
						fontFamily : Yaast.FontAwesome.getFontFamily(),
						fontSize : parseInt((Ti.Platform.displayCaps.platformHeight * 6) / 100, 10)
					},
					text : ' ' + Yaast.FontAwesome.getCharCode('fa-power-off') + '      ',
					textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER
				}
			}, {
				type : 'Ti.UI.Label',
				bindId : 'conect_button',
				properties : {
					layout : 'horizontal',
					color : _background,
					backgroundColor : _backgroundGreen,
					left : '10%',
					font : {
						fontFamily : Yaast.FontAwesome.getFontFamily(),
						fontSize : parseInt((Ti.Platform.displayCaps.platformHeight * 6) / 100, 10)
					},
					text : ' Conectar ',
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
				backgroundColor : _background,
				height : parseInt((Ti.Platform.displayCaps.platformHeight * 40) / 100, 10)
			},
			events : {}
		};

		_self.connectionListViewTemplateChoosedConected = {
			childTemplates : [{
				type : 'Ti.UI.Label',
				bindId : 'connection',
				properties : {
					layout : 'horizontal',
					color : _background,
					font : {
						fontFamily : _font,
						fontSize : parseInt((Ti.Platform.displayCaps.platformHeight * 6) / 100, 10)
					},
					left : '4%',
					top : 15,
					textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT
				}
			}, {
				type : 'Ti.UI.Label',
				bindId : 'url',
				properties : {
					visible : true,
					layout : 'horizontal',
					color : _background,
					bottom : 10,
					left : '2%',
					font : {
						fontFamily : _font,
						fontSize : parseInt((Ti.Platform.displayCaps.platformHeight * 4) / 100, 10)
					},
					textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT
				}
			}, {
				type : 'Ti.UI.Label',
				bindId : 'edit_connection',
				properties : {
					layout : 'horizontal',
					color : _editColor2,
					right : '15%',
					font : {
						fontFamily : Yaast.FontAwesome.getFontFamily(),
						fontSize : parseInt((Ti.Platform.displayCaps.platformHeight * 9) / 100, 10)
					},
					text : ' ' + Yaast.FontAwesome.getCharCode('fa-pencil-square-o') + ' ',
					textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER
				}
			}, {
				type : 'Ti.UI.Label',
				bindId : 'delete_connection',
				properties : {
					layout : 'horizontal',
					color : _deleteColor2,
					right : '2%',
					font : {
						fontFamily : Yaast.FontAwesome.getFontFamily(),
						fontSize : parseInt((Ti.Platform.displayCaps.platformHeight * 9) / 100, 10)
					},
					text : ' ' + Yaast.FontAwesome.getCharCode('fa-minus-circle') + ' ',
					textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER
				}
			}, {
				type : 'Ti.UI.Label',
				bindId : 'disconect_button_icon',
				properties : {
					layout : 'horizontal',
					color : _background,
					backgroundColor : _backgroundRed,
					left : '1%',
					font : {
						fontFamily : Yaast.FontAwesome.getFontFamily(),
						fontSize : parseInt((Ti.Platform.displayCaps.platformHeight * 6) / 100, 10)
					},
					text : ' ' + Yaast.FontAwesome.getCharCode('fa-power-off') + '      ',
					textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER
				}
			}, {
				type : 'Ti.UI.Label',
				bindId : 'disconect_button',
				properties : {
					layout : 'horizontal',
					color : _background,
					backgroundColor : _backgroundRed,
					left : '10%',
					font : {
						fontFamily : Yaast.FontAwesome.getFontFamily(),
						fontSize : parseInt((Ti.Platform.displayCaps.platformHeight * 6) / 100, 10)
					},
					text : ' Desconectar ',
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
				backgroundColor : _backgroundGreen,
				height : parseInt((Ti.Platform.displayCaps.platformHeight * 40) / 100, 10)
			},
			events : {}
		};

		_self.connectionListViewTemplatePublicChoosed = {
			childTemplates : [{
				type : 'Ti.UI.Label',
				bindId : 'connection',
				properties : {
					layout : 'horizontal',
					color : _fontColor,
					font : {
						fontFamily : _font,
						fontSize : parseInt((Ti.Platform.displayCaps.platformHeight * 6) / 100, 10)
					},
					left : '4%',
					top : 15,
					textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT
				}
			}, {
				type : 'Ti.UI.Label',
				bindId : 'url',
				properties : {
					visible : true,
					layout : 'horizontal',
					color : _fontColor,
					bottom : 10,
					left : '2%',
					font : {
						fontFamily : _font,
						fontSize : parseInt((Ti.Platform.displayCaps.platformHeight * 4) / 100, 10)
					},
					textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT
				}
			}, {
				type : 'Ti.UI.Label',
				bindId : 'conect_button_icon',
				properties : {
					layout : 'horizontal',
					color : _background,
					backgroundColor : _backgroundGreen,
					left : '1%',
					font : {
						fontFamily : Yaast.FontAwesome.getFontFamily(),
						fontSize : parseInt((Ti.Platform.displayCaps.platformHeight * 6) / 100, 10)
					},
					text : ' ' + Yaast.FontAwesome.getCharCode('fa-power-off') + '      ',
					textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER
				}
			}, {
				type : 'Ti.UI.Label',
				bindId : 'conect_button',
				properties : {
					layout : 'horizontal',
					color : _background,
					backgroundColor : _backgroundGreen,
					left : '10%',
					font : {
						fontFamily : Yaast.FontAwesome.getFontFamily(),
						fontSize : parseInt((Ti.Platform.displayCaps.platformHeight * 6) / 100, 10)
					},
					text : ' Conectar ',
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
				backgroundColor : _background,
				height : parseInt((Ti.Platform.displayCaps.platformHeight * 30) / 100, 10)
			},
			events : {}
		};

		_self.connectionListViewTemplateChoosedPublicConected = {
			childTemplates : [{
				type : 'Ti.UI.Label',
				bindId : 'connection',
				properties : {
					layout : 'horizontal',
					color : _background,
					font : {
						fontFamily : _font,
						fontSize : parseInt((Ti.Platform.displayCaps.platformHeight * 6) / 100, 10)
					},
					left : '4%',
					top : 15,
					textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT
				}
			}, {
				type : 'Ti.UI.Label',
				bindId : 'url',
				properties : {
					visible : true,
					layout : 'horizontal',
					color : _background,
					bottom : 10,
					left : '2%',
					font : {
						fontFamily : _font,
						fontSize : parseInt((Ti.Platform.displayCaps.platformHeight * 4) / 100, 10)
					},
					textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT
				}
			}, {
				type : 'Ti.UI.Label',
				bindId : 'disconect_button_icon',
				properties : {
					layout : 'horizontal',
					color : _background,
					backgroundColor : _backgroundRed,
					left : '1%',
					font : {
						fontFamily : Yaast.FontAwesome.getFontFamily(),
						fontSize : parseInt((Ti.Platform.displayCaps.platformHeight * 6) / 100, 10)
					},
					text : ' ' + Yaast.FontAwesome.getCharCode('fa-power-off') + '      ',
					textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER
				}
			}, {
				type : 'Ti.UI.Label',
				bindId : 'disconect_button',
				properties : {
					layout : 'horizontal',
					color : _background,
					backgroundColor : _backgroundRed,
					left : '10%',
					font : {
						fontFamily : Yaast.FontAwesome.getFontFamily(),
						fontSize : parseInt((Ti.Platform.displayCaps.platformHeight * 6) / 100, 10)
					},
					text : ' Desconectar ',
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
				backgroundColor : _backgroundGreen,
				height : parseInt((Ti.Platform.displayCaps.platformHeight * 30) / 100, 10)
			},
			events : {}
		};

		return _self;

	}());

module.exports = loginViewStyle; 