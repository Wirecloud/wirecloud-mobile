/*
 * Copyright (c) 2014-2015 CoNWeT Lab., Universidad Politecnica de Madrid.
 * Copyright (c) 2014-2015 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.3.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

//Operator Generic Component Constructor

function operatorGeneric(parameters, idOperator, userName, mashupData) {

	var _isApple = (Ti.Platform.osname == 'ipad');
	var _self;

	var mac_path = Yaast.Sandbox.instanceDir + userName + '/operators/' + parameters.meta.uri + '/';
	var instanceHTML = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, mac_path + "index." + idOperator + ".html");
	var payloadFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, mac_path + "index.html." + idOperator + ".payload.js");
	var payload = {
		type: "operator",
		id: idOperator,
		meta: parameters.meta,
		preferences: parameters.preferences,
		platform_context_description: build_platform_context_description(),
		platform_context_values: build_platform_context_values(userName),
		mashup_context_description: build_mashup_context_description(),
		mashup_context_values: build_mashup_context(mashupData),
		mac_context_description: build_operator_context_description(parameters.meta),
		mac_context_values: build_operator_context(parameters),
		appleOS: _isApple
	};
	payloadFile.write("window._payload = " + JSON.stringify(payload), false);

	if (!instanceHTML.exists()) {
	    var MashupPlatformFile = Ti.Filesystem.getFile(Ti.Filesystem.getApplicationDataDirectory(), mac_path + '/wiringPlatform.js');
        var originalMashupPlatformFile = Ti.Filesystem.getFile(Ti.Filesystem.getResourcesDirectory(), 'workspace/wiring/wiringPlatformJS.lib').read().toString();
        var _fileBridge = Ti.Filesystem.getFile(Ti.Filesystem.getApplicationDataDirectory(), mac_path + '/APIBridge.js');
        var _textBridgeOriginal = Ti.Filesystem.getFile(Ti.Filesystem.getResourcesDirectory(), 'workspace/APIBridge/APIBridgeJS.lib').read().toString();

        MashupPlatformFile.write(originalMashupPlatformFile, false);
        _fileBridge.write(_textBridgeOriginal, false);
        originalMashupPlatformFile = null;
        MashupPlatformFile = null;
        _fileBridge = null;

        var operatorHTML = '<!DOCTYPE html>\n<html>\n\t<head>\n';
        operatorHTML += '\t\t<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">\n';
        operatorHTML += '\t\t<script type="text/javascript" src="index.html.' + idOperator + ".payload.js" + '"></script>\n';
        operatorHTML += '\t\t<script type="text/javascript" src="wiringPlatform.js"></script>\n';
        operatorHTML += '\t\t<script type="text/javascript" src="APIBridge.js"></script>\n';
        for (var j in parameters.meta.js_files) {
            operatorHTML += '\t\t<script type="text/javascript" src="' + parameters.meta.js_files[j] + '"></script>\n';
        }
        operatorHTML += '\t</head>\n\t<body>\n\t</body>\n</html>';
        instanceHTML.write(operatorHTML, false);
        operatorHTML = null;
        _configOperator = null;
    }

	_self = Ti.UI.createWebView({
		url : instanceHTML.nativePath,
		width : 0,
		height : 0,
		top : 0,
		left : 0,
		flag : true,
		visible : false
	});
	_self.clearObject = function clearObject() {
		// Nothing to do
	};

	_isApple = null;
	mac_path = null;
	instanceHTML = null;
	payloadFile = null;
	payload = null;

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

function build_operator_context_description() {
    return {
    };
}


function build_operator_context(widgetData) {
    return {
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

module.exports = operatorGeneric;
