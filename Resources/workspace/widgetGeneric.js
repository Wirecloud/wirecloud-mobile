
//Widget Generic Component Constructor

function widgetGeneric(dim, parameters, idWidget, userName) {

	var _isApple = (Ti.Platform.osname == 'ipad');
	var _self;
	var _routeHTML = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, userName + '/widgets/'+parameters.uri+'/index.html');
	var _textHTML = _routeHTML.read().toString();
	if(_textHTML.indexOf('wiringPlatform.js') < 0){
		var _fileMashupPlatform = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, userName + '/widgets/'+parameters.uri+'/wiringPlatform.js');
		var _textMashupOriginal = Ti.Filesystem.getFile(Ti.Filesystem.getResourcesDirectory(), 'workspace/wiring/wiringPlatformJS.lib').read().toString();
		var _fileBridge = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, userName + '/widgets/'+parameters.uri+'/APIBridge.js');
        var _textBridgeOriginal = Ti.Filesystem.getFile(Ti.Filesystem.getResourcesDirectory(), 'workspace/APIBridge/APIBridgeJS.lib').read().toString();
		_fileMashupPlatform.write(_textMashupOriginal, false);

        // Set Android/iOS var in the bridge. appleOS
        var res = _textBridgeOriginal.split("// ChangeMeYaaST!! appleOS bool");
        _textBridgeOriginal = res[0] + "var appleOS = " + _isApple + ";" + res[1];
        Ti.API.info(" (widget) --> var appleOS = " + _isApple + ";");
		res = null;

        // Set id var in the bridge.
        var res2 = _textBridgeOriginal.split("// ChangeMeYaaST!! MagicID");
        _textBridgeOriginal = res2[0] + "var id = " + idWidget + ";" + res2[1];
        Ti.API.info(" (widget) --> var id = " + idWidget + ";");
        res2 = null;

		_fileBridge.write(_textBridgeOriginal, false);
		_textMashupOriginal = null;
		_fileMashupPlatform = null;
		_fileBridge = null;
		_fileMashupPlatform = null;
		var _routeMashup = '\t\t<script type="text/javascript" src="wiringPlatform.js"></script>\n';
		_routeMashup = _routeMashup + '\t\t<script type="text/javascript" src="APIBridge.js"></script>\n';
		_routeMashup = '<head>\n' + _routeMashup;
		_textHTML = _textHTML.replace('<head>',_routeMashup);
		_routeHTML.write(_textHTML,false);
		_routeMashup = null;
	}
	_textHTML = null;
	_self = Ti.UI.createWebView({
		url:_routeHTML.nativePath,
		width: dim.width,
		height: dim.height,
		touchEnabled : true,
		flag : true
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

	if(_isApple){
	    _self.setDisableBounce(true);
	}
	else {
	    _self.setOverScrollMode(Ti.UI.Android.OVER_SCROLL_NEVER);
	    _self.setEnableZoomControls(false);
	}
	_isApple = null;
	_self.setTop(dim.top);
	_self.setLeft(dim.left);
	_self.setBorderColor("#E3DEDD");
	_self.setBorderWidth(1);
	return _self;
}

module.exports = widgetGeneric;

