
//Application Window Component Constructor

function appWindow() {

	var _isApple = (Ti.Platform.osname == 'ipad');

	// Visualization _self
	var _self = Ti.UI.createWindow({
		exitOnClose : true,
		navBarHidden : true,
		backgroundColor : '#FFFFFF',
		width : Ti.Platform.displayCaps.platformWidth,
		height : Ti.Platform.displayCaps.platformHeight,
		orientationModes : [Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT]
	});
	
	var _loginObject = require('ui/loginView/loginView');
	var _loginA = _loginObject();
	_self.add(_loginA);

	// Create Directories for Download (first installation)
	var _fileDirWidget = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'widgets');
	if (!_fileDirWidget.exists()) _fileDirWidget.createDirectory();
	_fileDirWidget = null;
	var _fileDirOperator = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'operators');
	if (!_fileDirOperator.exists()) _fileDirOperator.createDirectory();
	_fileDirOperator = null;
	
	// Remove Cookies of Login
	Ti.App.Properties.removeProperty('cookie_oilsid');
	Ti.App.Properties.removeProperty('cookie_csrftoken');
	Ti.App.Properties.removeProperty('cookie_sessionid');
	
	// Login Event and creation of MainView
	_self.showMainView = function showMainView(data){
		_self.backgroundColor = '#E0F2F7';
				
		// Remove Login View
		_loginA.clearObject();
		_self.remove(_loginA);
		_loginA = null;
		_loginObject = null;
				
		// Create and add Main View
		var _mainObject = require('ui/mainView/mainView');
		_self.add(_mainObject(data));
		_mainObject = null;
			
		// Remove Listener
		Ti.App.removeEventListener('showMainView', _self.showMainView);
		delete _self['showMainView'];
			
	};
	Ti.App.addEventListener('showMainView', _self.showMainView);
	
	return _self;
}

module.exports = appWindow;

