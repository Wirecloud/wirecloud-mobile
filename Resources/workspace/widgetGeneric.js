/*
 * Copyright (c) 2014 CoNWeT Lab., Universidad Politecnica de Madrid.
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.3.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */


//Widget Generic Component Constructor

function widgetGeneric(dim, parameters, idWidget, userName, mashupData) {

	var _isApple = (Ti.Platform.osname == 'ipad');
	var _self;
	var mainhtmlName = parameters.meta.contents.src;
	var mac_path = Yaast.Sandbox.instanceDir + userName + '/widgets/' + parameters.meta.uri + '/';
	var mainHTML = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, mac_path + mainhtmlName);
	var instanceHTML = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, mac_path + mainhtmlName + "." + idWidget + ".html");
	var payloadFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, mac_path + mainhtmlName + "." + idWidget + ".payload.js");
	var payload = {
		type: "widget",
		id: idWidget,
		meta: parameters.meta,
		preferences: parameters.preferences,
		properties: parameters.properties,
		platform_context_description: build_platform_context_description(),
		platform_context_values: build_platform_context_values(userName),
		mashup_context_description: build_mashup_context_description(),
		mashup_context_values: build_mashup_context(mashupData),
		mac_context_description: build_widget_context_description(parameters.meta),
		mac_context_values: build_widget_context(parameters),
		appleOS: _isApple
	};
	payloadFile.write("window._payload = " + JSON.stringify(payload), false);

	if (!instanceHTML.exists()) {
		var _fileMashupPlatform = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, mac_path + 'wiringPlatform.js');
		var _textMashupOriginal = Ti.Filesystem.getFile(Ti.Filesystem.getResourcesDirectory(), 'workspace/wiring/wiringPlatformJS.lib').read().toString();
		var _fileBridge = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, mac_path + 'APIBridge.js');
        var _textBridgeOriginal = Ti.Filesystem.getFile(Ti.Filesystem.getResourcesDirectory(), 'workspace/APIBridge/APIBridgeJS.lib').read().toString();
		_fileMashupPlatform.write(_textMashupOriginal, false);
		_fileBridge.write(_textBridgeOriginal, false);
		_textMashupOriginal = null;
		_fileMashupPlatform = null;
		_fileBridge = null;
		_fileMashupPlatform = null;

		var widgetHTML = mainHTML.read().toString();
		var extensionHTML = '<head>\n';
		extensionHTML += '\t\t<script type="text/javascript" src="' + mainhtmlName + "." + idWidget + ".payload.js" + '"></script>\n';
		extensionHTML += '\t\t<script type="text/javascript" src="wiringPlatform.js"></script>\n';
		extensionHTML += '\t\t<script type="text/javascript" src="APIBridge.js"></script>\n';
		extensionHTML = apply_extensions(parameters.meta, extensionHTML);
		widgetHTML = widgetHTML.replace('<head>', extensionHTML);
		instanceHTML.write(widgetHTML, false);
		extensionHTML = null;
		widgetHTML = null;
	}
	_self = Ti.UI.createWebView({
		url: instanceHTML.nativePath,
		width: dim.width,
		height: dim.height,
		touchEnabled : true,
		flag : true
	});

	_self.clearObject = function clearObject() {
		// Nothing to do
	};

	if (_isApple) {
	    _self.setDisableBounce(true);
	} else {
	    _self.setOverScrollMode(Ti.UI.Android.OVER_SCROLL_NEVER);
	    _self.setEnableZoomControls(false);
	}
	_isApple = null;
	mainhtmlName = null;
	mac_path = null;
	mainHTML = null;
	instanceHTML = null;
	payloadFile = null;
	payload = null;

	_self.setTop(dim.top);
	_self.setLeft(dim.left);
	_self.setBorderColor("#E3DEDD");
	_self.setBorderWidth(1);
	return _self;
}

function build_platform_context_description() {
    return {
        "language" : {
           "name": "language",
            "description" : "",
            "label" : "Language"
        },
        "username" : {
           "name": "username",
            "description" : "",
            "label" : "Username"
        }
    };
}

function build_platform_context_values(userName) {
    return {
        "language" : Titanium.Locale.getCurrentLanguage(),
        "username" : userName
    };
}

function build_widget_context_description() {
    return {
        "widthInPixels" : {
           "name": "widthInPixels",
            "description" : "",
            "label" : "Width in Pixels"
        },
        "heightInPixels" : {
           "name": "heightInPixels",
            "description" : "",
            "label" : "Height in Pixels"
        },
        "title" : {
           "name": "title",
            "description" : "",
            "label" : "Title"
        }
    };
}

function build_widget_context(widgetData) {
    return {
        widthInPixels : widgetData.dimensions.width,
        heightInPixels : widgetData.dimensions.height,
        title : widgetData.name
    };
}

function build_mashup_context_description() {
    return {
        "name" : {
           "name": "name",
            "description" : "",
            "label" : "Name"
        },
        "owner" : {
           "name": "owner",
            "description" : "",
            "label" : "Owner"
        }
    };
}

function build_mashup_context(mashupData) {
    return {
        "name" : mashupData.name,
        "owner" : mashupData.owner
    };
}

function add_script(file, extensionHTML) {
	return extensionHTML + '\t\t<script type="text/javascript" src="' + file + '"></script>\n';
}

var STYLED_ELEMENTS_FILES = [
    'Utils.lib',
    'Event.lib',
    'ObjectWithEvents.lib',
    'StyledElements.lib',
    'InputElement.lib',
    'CommandQueue.lib',
    'Container.lib',
    'Addon.lib',
    'Accordion.lib',
    'Expander.lib',
    'Fragment.lib',
    'Button.lib',
    'Alternative.lib',
    'Alternatives.lib',
    'HorizontalLayout.lib',
    'BorderLayout.lib',
    'ModelTable.lib',
    'Select.lib',
    'ToggleButton.lib',
    'Pills.lib',
    'Tab.lib',
    'StyledNotebook.lib',
];

function apply_extensions(meta, extensionHTML) {
	if (meta.contents.useplatformstyle) {
		extensionHTML += '\t\t<link href="' + Ti.Filesystem.getFile(Ti.Filesystem.getResourcesDirectory(), 'css/platform_gadget_style.css').nativePath + '" rel="stylesheet" type="text/css" />\n';
	}

	//for (var i = 0; i < meta.requirements.length; i++) {
	//	if (meta.requirements[i].name == 'STYLED_ELEMENTS')
		for (var j = 0; j < STYLED_ELEMENTS_FILES.length; j++) {
			extensionHTML = add_script(Ti.Filesystem.getFile(Ti.Filesystem.getResourcesDirectory(), 'workspace/StyledElements/' + STYLED_ELEMENTS_FILES[j]).nativePath, extensionHTML);
		}
	//}

	return extensionHTML;
}

module.exports = widgetGeneric;