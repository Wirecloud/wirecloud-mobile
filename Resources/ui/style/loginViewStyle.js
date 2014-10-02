/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.3.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 */

"use strict";

var loginViewStyle = (function() {

    var _os = (Yaast.API.HW.System.isApple()) ? "iPad" : "Android",
    _version = (_os === 'Android') ? " ~ " + Yaast.API.HW.System.getVersionString() : "",
    _self = {},
    _font = 'Comfortaa',
    _background = '#2B3E50',
    _background2 = '#456082',
    _background3 = '#D5E4F1',
    _backgroundRed = '#FF8888',
    _backgroundGreen = '#99FF99',
    _editColor = "#FFA500",
    _editColor2 = "#CA7000",
    _deleteColor = "#FF5555",
    _deleteColor2 = "#AA0000",
    _fontColorGreen = "#00AA00",
    _fontColor = '#EBEBEB',
    _fontColorButton = '#354B5D'; // 1F3346
    
    

    _self.view = {
        top: Yaast.API.UI.getDefaultStatusBar(),
        left: 0,
        backgroundColor: _background,
        width: Yaast.API.UI.getPlatformWidth()
    };
    _self.view.height = Yaast.API.UI.getPlatformHeight() - _self.view.top;

	// General View

    _self.logo = {
        image: (Yaast.API.HW.System.isApple()) ? Ti.Filesystem.getResourcesDirectory()  + 'images/logo_tab.png' : '../../images/logo_tab.png',
        width: parseInt(((_self.view.width / 3) - ((_self.view.width * 4) / 100)), 10),
        left: '2%',
        enableZoomControls: false, 
        touchEnabled: false
    };

    _self.systemLabel = {
        top: '1%',
        left: '2%',
        height: Yaast.API.UI.getDefaultRowHeight(),
        text: _os + ' ' + Yaast.API.HW.System.getVersion() + _version,
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        color: _fontColor,
        font: {
            fontSize: parseInt((Ti.Platform.displayCaps.platformHeight*3.5)/100, 10), // 30
            fontFamily: _font
        }
    };

    _self.activityLabel = {
        top: parseInt((_self.view.height/2)-(Yaast.API.UI.getDefaultRowHeight()/2), 10),
        text: 'Conectando, espere por favor',
        right:'5%',
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        color: _fontColor,
        font: {
            fontSize: parseInt((Ti.Platform.displayCaps.platformHeight*7)/100, 10), // 40
            fontFamily: _font
        }
    };
    
    
    /*
     * 
     *  Generales
     * 
     */
    
    _self.containerView = {
        width: parseInt(((_self.view.width*2)/3) - (_self.view.width*0.04), 10),
        height: parseInt(((_self.view.height*2)/3), 10),
        borderRadius: 15,
        borderWidth: 1,
        borderColor: _background3,
        backgroundColor: _background2
    };

    _self.inputTextField = {
        width: '90%',
        left: '5%',
        height: '20%',
        color: '#354B5D',
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: _background3,
        paddingLeft: 5,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        autocapitalization: false,
        enableReturnKey: false,
        softKeyboardOnFocus: (Yaast.API.HW.System.isApple()) ? null :
            Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS,
        autocorrect: false,
        font: {
            fontSize: parseInt((Ti.Platform.displayCaps.platformHeight*5.5)/100, 10),
            fontFamily: _font
        }
    };
    
    _self.button = {
    	backgroundColor: _background3,
    	color: _fontColorButton,
    	borderRadius: 10,
        borderWidth: 1,
        paddingLeft: 5,
        borderColor: _background,
		height: parseInt((Ti.Platform.displayCaps.platformHeight*7)/100, 10)+15,
    	font: {
            fontSize: parseInt((Ti.Platform.displayCaps.platformHeight*7)/100, 10),
            fontFamily: _font
        }
    };
    
    
   	/*
   	 *
   	 * Login Page 
   	 *  
   	 */
	
    
    _self.instanceLabel = {
        top: '2%',
        text: 'Instancia: ',
        left:'2%',
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        color: _fontColor,
        font: {
            fontSize: parseInt((Ti.Platform.displayCaps.platformHeight*7)/100, 10), // 40
            fontFamily: _font
        }
    };
    
    _self.instanceName = {
        top: '4%',
        right:'2%',
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        color: _fontColor,
        font: {
            fontSize: parseInt((Ti.Platform.displayCaps.platformHeight*5)/100, 10), // 40
            fontFamily: _font
        }
    };
    
    
    /*
     * 
     * Configuration Form
     * 
     */
    
	_self.configurationFormTitle = {
   		top: parseInt((_self.containerView.height*2)/100),
   		color: _fontColor,
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
   		font: {
            fontSize:  parseInt((Ti.Platform.displayCaps.platformHeight*9)/100, 10), // 32
            fontFamily: _font
       }, 
        text: 'Configuración'
    };
    
    
	// Configuration Form Instances
    
    _self.conectionView = {
    	bottom: parseInt((_self.containerView.height*3.75)/100), // 60 -> 7.5 %
    	width: '94%',
        left: '3%',
        height: parseInt(_self.containerView.height*0.80, 10),
    };
    
    _self.instanceTitle = {
    	top: 10,
        left: '5%',
        text: 'Instancias',
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        color: _fontColor,
        font: {
            fontSize:  parseInt((Ti.Platform.displayCaps.platformHeight*8)/100, 10), // 32 -> 40%
            fontFamily: _font
        }
    };
    
    _self.headerView = {
    	backgroundColor: _background3,
    	width: '100%',
    	height: parseInt((Ti.Platform.displayCaps.platformHeight*8)/100, 10) // 32 -> 40%
    };
    
    _self.headerViewLabel = {
    	color: _background,
        font: {
            fontSize:  parseInt((Ti.Platform.displayCaps.platformHeight*5)/100, 10), // 32 -> 40%
            fontFamily: _font
        }
    };
    
    _self.conectionListViewTemplate = {
        childTemplates: [
            {
                type: 'Ti.UI.Label',
                bindId: 'conection',
                properties: {
                    layout: 'horizontal',
                    color: _background,
                    font: {
                        fontFamily:_font,
                        fontSize: parseInt((Ti.Platform.displayCaps.platformHeight*5.5)/100, 10)
                    },
                    left: '5%',
                    textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
                }
            },
            {
                type: 'Ti.UI.Label',
                bindId: 'url',
                properties: {
                	visible: false
                }
            },
            {
                type: 'Ti.UI.Label',
                bindId: 'id',
                properties: {
                	visible: false
                }
            }
        ],
        properties: {
        	backgroundColor: '#FFFFFF',
        	selectedBackgroundColor: _background3
        },
        events: {}
    };
    
    _self.conectionListViewTemplateConected = {
        childTemplates: [
            {
                type: 'Ti.UI.Label',
                bindId: 'conection',
                properties: {
                    layout: 'horizontal',
                    color: _background,
                    font: {
                        fontFamily:_font,
                        fontSize: parseInt((Ti.Platform.displayCaps.platformHeight*6)/100, 10)
                    },
                    left: '5%',
                    textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
                }
            }, 
            {
                type: 'Ti.UI.Label',
                bindId: 'conected_icon',
                properties: {
                    layout: 'horizontal',
                    color: _fontColorGreen,
                    right: '2%',
                    font: {
                        fontFamily: Yaast.FontAwesome.getFontFamily(),
                        fontSize: parseInt((Ti.Platform.displayCaps.platformHeight*9)/100, 10)
                    },
                    text: Yaast.FontAwesome.getCharCode('fa-check'),
                    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
                }
            },
            {
                type: 'Ti.UI.Label',
                bindId: 'url',
                properties: {
                	visible: false
                }
            },
            {
                type: 'Ti.UI.Label',
                bindId: 'id',
                properties: {
                	visible: false
                }
            }
        ],
        properties: {
        	backgroundColor: _backgroundGreen,
        	selectedBackgroundColor: _background3
        },
        events: {}
    };
    
    _self.conectionListViewTemplateChoosed = {
        childTemplates: [
            {
                type: 'Ti.UI.Label',
                bindId: 'conection',
                properties: {
                    layout: 'horizontal',
                    color: _fontColor,
                    font: {
                        fontFamily:_font,
                        fontSize: parseInt((Ti.Platform.displayCaps.platformHeight*6)/100, 10)
                    },
                    left: '4%',
                    top:15,
                    textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
                }
            },
            {
                type: 'Ti.UI.Label',
                bindId: 'url',
                properties: {
                	visible: true,
                	layout: 'horizontal',
                    color: _fontColor,
                    bottom:10,
                    left: '2%',
                    font: {
                        fontFamily:_font,
                        fontSize: parseInt((Ti.Platform.displayCaps.platformHeight*4)/100, 10)
                    },
                    textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
                }
            },  
            {
                type: 'Ti.UI.Label',
                bindId: 'edit_conection',
                properties: {
                    layout: 'horizontal',
                    color: _editColor,
                    right: '15%',
                    font: {
                        fontFamily: Yaast.FontAwesome.getFontFamily(),
                        fontSize: parseInt((Ti.Platform.displayCaps.platformHeight*9)/100, 10)
                    },
                    text: ' ' + Yaast.FontAwesome.getCharCode('fa-pencil-square-o') + ' ',
                    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
                }
            }, 
            {
                type: 'Ti.UI.Label',
                bindId: 'delete_conection',
                properties: {
                    layout: 'horizontal',
                    color: _deleteColor,
                    right: '2%',
                    font: {
                        fontFamily: Yaast.FontAwesome.getFontFamily(),
                        fontSize: parseInt((Ti.Platform.displayCaps.platformHeight*9)/100, 10)
                    },
                    text: ' ' + Yaast.FontAwesome.getCharCode('fa-minus-circle') + ' ',
                    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
                }
            },
            {
                type: 'Ti.UI.Label',
                bindId: 'conect_button_icon',
                properties: {
                    layout: 'horizontal',
                    color: _background,
                    backgroundColor: _backgroundGreen,
                    left: '1%',
                    font: {
                        fontFamily: Yaast.FontAwesome.getFontFamily(),
                        fontSize: parseInt((Ti.Platform.displayCaps.platformHeight*6)/100, 10)
                    },
                    text: ' ' + Yaast.FontAwesome.getCharCode('fa-power-off') + '      ',
                    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
                }
            }, 
            {
                type: 'Ti.UI.Label',
                bindId: 'conect_button',
                properties: {
                    layout: 'horizontal',
                    color: _background,
                    backgroundColor: _backgroundGreen,
                    left: '10%',
                    font: {
                        fontFamily: Yaast.FontAwesome.getFontFamily(),
                        fontSize: parseInt((Ti.Platform.displayCaps.platformHeight*6)/100, 10)
                    },
                    text: ' Conectar ',
                    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
                }
            }, 
            {
                type: 'Ti.UI.Label',
                bindId: 'id',
                properties: {
                	visible: false
                }
            }
        ],
        properties: {
        	backgroundColor: _background,
        	height:parseInt((Ti.Platform.displayCaps.platformHeight*40)/100, 10)
        },
        events: {}
    };
    
    _self.conectionListViewTemplateChoosedConected = {
        childTemplates: [
            {
                type: 'Ti.UI.Label',
                bindId: 'conection',
                properties: {
                    layout: 'horizontal',
                    color: _background,
                    font: {
                        fontFamily:_font,
                        fontSize: parseInt((Ti.Platform.displayCaps.platformHeight*6)/100, 10)
                    },
                    left: '4%',
                    top:15,
                    textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
                }
            },
            {
                type: 'Ti.UI.Label',
                bindId: 'url',
                properties: {
                	visible: true,
                	layout: 'horizontal',
                    color: _background,
                    bottom:10,
                    left: '2%',
                    font: {
                        fontFamily:_font,
                        fontSize: parseInt((Ti.Platform.displayCaps.platformHeight*4)/100, 10)
                    },
                    textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
                }
            },  
            {
                type: 'Ti.UI.Label',
                bindId: 'edit_conection',
                properties: {
                    layout: 'horizontal',
                    color: _editColor2,
                    right: '15%',
                    font: {
                        fontFamily: Yaast.FontAwesome.getFontFamily(),
                        fontSize: parseInt((Ti.Platform.displayCaps.platformHeight*9)/100, 10)
                    },
                    text: ' ' + Yaast.FontAwesome.getCharCode('fa-pencil-square-o') + ' ',
                    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
                }
            }, 
            {
                type: 'Ti.UI.Label',
                bindId: 'delete_conection',
                properties: {
                    layout: 'horizontal',
                    color: _deleteColor2,
                    right: '2%',
                    font: {
                        fontFamily: Yaast.FontAwesome.getFontFamily(),
                        fontSize: parseInt((Ti.Platform.displayCaps.platformHeight*9)/100, 10)
                    },
                    text: ' ' + Yaast.FontAwesome.getCharCode('fa-minus-circle') + ' ',
                    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
                }
            }, 
            {
                type: 'Ti.UI.Label',
                bindId: 'disconect_button_icon',
                properties: {
                    layout: 'horizontal',
                    color: _background,
                    backgroundColor: _backgroundRed,
                    left: '1%',
                    font: {
                        fontFamily: Yaast.FontAwesome.getFontFamily(),
                        fontSize: parseInt((Ti.Platform.displayCaps.platformHeight*6)/100, 10)
                    },
                    text: ' ' + Yaast.FontAwesome.getCharCode('fa-power-off') + '      ',
                    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
                }
            }, 
            {
                type: 'Ti.UI.Label',
                bindId: 'disconect_button',
                properties: {
                    layout: 'horizontal',
                    color: _background,
                    backgroundColor: _backgroundRed,
                    left: '10%',
                    font: {
                        fontFamily: Yaast.FontAwesome.getFontFamily(),
                        fontSize: parseInt((Ti.Platform.displayCaps.platformHeight*6)/100, 10)
                    },
                    text: ' Desconectar ',
                    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
                }
            }, 
            {
                type: 'Ti.UI.Label',
                bindId: 'id',
                properties: {
                	visible: false
                }
            }
        ],
        properties: {
        	backgroundColor: _backgroundGreen,
        	height:parseInt((Ti.Platform.displayCaps.platformHeight*40)/100, 10)
        },
        events: {}
    };
    
    _self.conectionListViewTemplatePublicChoosed = {
        childTemplates: [
            {
                type: 'Ti.UI.Label',
                bindId: 'conection',
                properties: {
                    layout: 'horizontal',
                    color: _fontColor,
                    font: {
                        fontFamily:_font,
                        fontSize: parseInt((Ti.Platform.displayCaps.platformHeight*6)/100, 10)
                    },
                    left: '4%',
                    top:15,
                    textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
                }
            },
            {
                type: 'Ti.UI.Label',
                bindId: 'url',
                properties: {
                	visible: true,
                	layout: 'horizontal',
                    color: _fontColor,
                    bottom:10,
                    left: '2%',
                    font: {
                        fontFamily:_font,
                        fontSize: parseInt((Ti.Platform.displayCaps.platformHeight*4)/100, 10)
                    },
                    textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
                }
            },  
            {
                type: 'Ti.UI.Label',
                bindId: 'conect_button_icon',
                properties: {
                    layout: 'horizontal',
                    color: _background,
                    backgroundColor: _backgroundGreen,
                    left: '1%',
                    font: {
                        fontFamily: Yaast.FontAwesome.getFontFamily(),
                        fontSize: parseInt((Ti.Platform.displayCaps.platformHeight*6)/100, 10)
                    },
                    text: ' ' + Yaast.FontAwesome.getCharCode('fa-power-off') + '      ',
                    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
                }
            }, 
            {
                type: 'Ti.UI.Label',
                bindId: 'conect_button',
                properties: {
                    layout: 'horizontal',
                    color: _background,
                    backgroundColor: _backgroundGreen,
                    left: '10%',
                    font: {
                        fontFamily: Yaast.FontAwesome.getFontFamily(),
                        fontSize: parseInt((Ti.Platform.displayCaps.platformHeight*6)/100, 10)
                    },
                    text: ' Conectar ',
                    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
                }
            }, 
            {
                type: 'Ti.UI.Label',
                bindId: 'id',
                properties: {
                	visible: false
                }
            }
        ],
        properties: {
        	backgroundColor: _background,
        	height:parseInt((Ti.Platform.displayCaps.platformHeight*30)/100, 10)
        },
        events: {}
    };
    
    _self.conectionListViewTemplateChoosedPublicConected = {
        childTemplates: [
            {
                type: 'Ti.UI.Label',
                bindId: 'conection',
                properties: {
                    layout: 'horizontal',
                    color: _background,
                    font: {
                        fontFamily:_font,
                        fontSize: parseInt((Ti.Platform.displayCaps.platformHeight*6)/100, 10)
                    },
                    left: '4%',
                    top:15,
                    textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
                }
            },
            {
                type: 'Ti.UI.Label',
                bindId: 'url',
                properties: {
                	visible: true,
                	layout: 'horizontal',
                    color: _background,
                    bottom:10,
                    left: '2%',
                    font: {
                        fontFamily:_font,
                        fontSize: parseInt((Ti.Platform.displayCaps.platformHeight*4)/100, 10)
                    },
                    textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT
                }
            },
            {
                type: 'Ti.UI.Label',
                bindId: 'disconect_button_icon',
                properties: {
                    layout: 'horizontal',
                    color: _background,
                    backgroundColor: _backgroundRed,
                    left: '1%',
                    font: {
                        fontFamily: Yaast.FontAwesome.getFontFamily(),
                        fontSize: parseInt((Ti.Platform.displayCaps.platformHeight*6)/100, 10)
                    },
                    text: ' ' + Yaast.FontAwesome.getCharCode('fa-power-off') + '      ',
                    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
                }
            }, 
            {
                type: 'Ti.UI.Label',
                bindId: 'disconect_button',
                properties: {
                    layout: 'horizontal',
                    color: _background,
                    backgroundColor: _backgroundRed,
                    left: '10%',
                    font: {
                        fontFamily: Yaast.FontAwesome.getFontFamily(),
                        fontSize: parseInt((Ti.Platform.displayCaps.platformHeight*6)/100, 10)
                    },
                    text: ' Desconectar ',
                    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
                }
            }, 
            {
                type: 'Ti.UI.Label',
                bindId: 'id',
                properties: {
                	visible: false
                }
            }
        ],
        properties: {
        	backgroundColor: _backgroundGreen,
        	height:parseInt((Ti.Platform.displayCaps.platformHeight*30)/100, 10)
        },
        events: {}
    };
    

    return _self;

}());

module.exports = loginViewStyle;
