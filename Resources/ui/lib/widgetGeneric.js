
//Widget Generic Component Constructor

function widgetGeneric(dim, parameters, idWidget) {
	
	var _isApple = (Ti.Platform.osname == 'ipad');
	var _self;
	if(parameters.name.indexOf("map-viewer") !== -1){
		var _widgetMapClass = require("ui/widgets/widgetMap");
		_self = _widgetMapClass({height: dim.height, width: dim.width}, idWidget);
		_widgetMapClass = null;
	}
	else{
		var _routeHTML = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'widgets/'+parameters.uri+'/index.html');
		var _textHTML = _routeHTML.read().toString();
		if(_textHTML.search('mashupPlatform.js') < 0){
			var _fileMashupPlatform = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'widgets/'+parameters.uri+'/mashupPlatform.js');
			var _textMashupOriginal = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'ui/lib/mashupPlatform.js').read().toString();
			_fileMashupPlatform.write(_textMashupOriginal, false);
			_textMashupOriginal = null;
			_fileMashupPlatform = null;
			var _routeMashup = '\t\t<script type="text/javascript" src="mashupPlatform.js"></script>';
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
			delete _self['funPlatformInfo'];
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

