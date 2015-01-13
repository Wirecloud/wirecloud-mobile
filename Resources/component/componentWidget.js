/*
 * Copyright (c) 2014 CoNWeT Lab., Universidad Politecnica de Madrid.
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.3.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

//Widget Generic Component Constructor
'use strict';

function widgetGeneric(dim, parameters, idWidget) {
	var _isApple = Yaast.API.HW.System.isApple();
	var _self, res;
	if(parameters.name.indexOf("map-viewer") !== -1) {
		var _widgetMapClass = require("ui/widgets/widgetMap");
		_self = _widgetMapClass({height: dim.height, width: dim.width}, idWidget);
		_widgetMapClass = null;
	} else {
		var _routeHTML = Ti.Filesystem.getFile(Ti.Filesystem.getApplicationDataDirectory(), 'widgets/'+parameters.uri+'/TIWebView');
		_routeHTML = _routeHTML.read().toString();
		_routeHTML = Ti.Filesystem.getFile(Ti.Filesystem.getApplicationDataDirectory(), 'widgets/'+parameters.uri+'/'+_routeHTML);
		var _textHTML = _routeHTML.read().toString();

		var _fileBridge = Ti.Filesystem.getFile(Ti.Filesystem.getApplicationDataDirectory(), 'widgets/'+parameters.uri+'/APIBridge.js');
		var _textBridgeOriginal = Ti.Filesystem.getFile(Ti.Filesystem.getResourcesDirectory(), 'component/APIBridgeJS.lib').read().toString();
        var _fileMashupPlatform = Ti.Filesystem.getFile(Ti.Filesystem.getApplicationDataDirectory(), 'widgets/'+parameters.uri+'/mashupPlatform.js');
        var _textMashupOriginal = Ti.Filesystem.getFile(Ti.Filesystem.getResourcesDirectory(), 'component/mashupPlatform.lib').read().toString();

		if(_textHTML.search('APIBridge.js') < 0) {
            // Set Android/iOS var in the bridge. appleOS. ONLY first time for this widget
            var res = _textBridgeOriginal.split("// ChangeMeYaaST!! appleOS bool");
            _textBridgeOriginal = res[0] + "var appleOS = " + _isApple + ";" + res[1];

			var _routeMashup = '\t\t<script type="text/javascript" src="mashupPlatform.js"></script>';
			var _routeAPI = '\t\t<script type="text/javascript" src="APIBridge.js"></script>';
			_routeMashup = '<head>\n' + _routeMashup + '\n' + _routeAPI;
			_textHTML = _textHTML.replace('<head>',_routeMashup);
			_routeHTML.write(_textHTML,false);
			_routeMashup = null;
			_routeAPI = null;
		}

        // Set the new widget ID in all cases for the current version of Wirecloud4Tablet
        res = _textBridgeOriginal.split("// ChangeMeYaaST!! MagicID");
        _textBridgeOriginal = res[0] + "// ChangeMeYaaST!! MagicID\n" + "var id = " + idWidget + ";\n" + "// ChangeMeYaaST!! MagicID" + res[2];
        res = _textMashupOriginal.split("// ChangeMeYaaST!! MagicID");
        _textMashupOriginal = res[0] + "// ChangeMeYaaST!! MagicID\n" + "var id = " + idWidget + ";\n" + "// ChangeMeYaaST!! MagicID" + res[2];

        _fileMashupPlatform.write(_textMashupOriginal, false);
        _fileBridge.write(_textBridgeOriginal, false);

        _textBridgeOriginal = null;
        _fileBridge = null;
        _textMashupOriginal = null;
        _fileMashupPlatform = null;

		_textHTML = null;
		_self = Ti.UI.createWebView({
			url:_routeHTML.nativePath,
			width: dim.width,
			height: dim.height,
			enableZoomControls : false,
			showScrollbars : false,
			touchEnabled : true,
			flag : true,
			backgroundColor: 'transparent'
		});
		_self.funPlatformInfo = function funPlatformInfo(){
			_self.evalJS("MashupPlatform.setPlatformInfo(" + idWidget + "," + "'widget'" + ");");
		};
		_self.clearObject = function clearObject(){
			_self.removeEventListener('load', _self.funPlatformInfo);
			delete _self.funPlatformInfo;
			_isApple = null;
		};
		_self.addEventListener('load', _self.funPlatformInfo);
		_routeHTML = null;
	}
	_isApple = null;
	_self.setTop(dim.top);
	_self.setLeft(dim.left);
	_self.setBorderColor("#83A3B8");
	_self.setBorderWidth(1);
	return _self;
}

module.exports = widgetGeneric;

