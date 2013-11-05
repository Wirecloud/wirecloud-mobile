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
	_self.onSuccessWirecloud = function onSuccessWirecloud(data){
		var _conObject = require('/connections/appConnection');
		var _conA = _conObject.getWirecloud(function(values) {
			if (values == "Error") {
				var _stringSearch;
				if (Ti.Network.online) _stringSearch = (_isApple) ? "error_connection_login_ios" : "error_connection_login_android";
				else _stringSearch = "error_connection_inet";
				var _alertError = Ti.UI.createAlertDialog({
					title: "Wirecloud",
					message: L(_stringSearch),
					buttonNames: [L("alert_button_accept")],
				});
				_alertError.show();
				_stringSearch = null;
				_alertError = null;
				Ti.App.fireEvent('connectToWirecloudError');
			} 
			else {
				_self.backgroundColor = '#E0F2F7';
				
				// Remove Login View
				_loginA.clearObject();
				_self.remove(_loginA);
				_loginA = null;
				_loginObject = null;
				
				// Create and add Main View
				var _mainObject = require('ui/mainView/mainView');
				_self.add(_mainObject([data, values]));
				_mainObject = null;
			
				// Remove Listener
				Ti.App.removeEventListener('connectToWirecloud', _self.onSuccessWirecloud);
			}
		});
		_conObject = null;
		_conA = null;
	};
	Ti.App.addEventListener('connectToWirecloud', _self.onSuccessWirecloud);
	return _self;
}

module.exports = appWindow;

