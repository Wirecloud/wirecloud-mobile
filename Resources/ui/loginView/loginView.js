
//Login View Component Constructor

function loginView() {
	
	var _isApple = (Ti.Platform.osname == 'ipad');
	var _containerForm;
	var _userTextField;
	var _passTextField;
	var _activitySession;

	// Visualization _self
	var _self = Ti.UI.createView({
		top: 10,
		left : 0,
		backgroundColor : '#FFFFFF',
		width : Ti.Platform.displayCaps.platformWidth,
		height : Ti.Platform.displayCaps.platformHeight
	});
	
	// Logo View (SVG <-> WebView)
	var _heightLogo = (_self.width / 2 != 800) ? parseInt((500 * ((_self.width / 2) / 800)),10) : 500;
	_self.add(Ti.UI.createWebView({
		url : (_isApple) ? Ti.Filesystem.resourcesDirectory + '/ui/loginView/logo_tab.svg' : 'logo_tab.svg',
		height : _heightLogo,
		width : _self.width / 2,
		left : parseInt(((_self.width / 2) * 0.05),10),
		top : parseInt((Ti.Platform.displayCaps.platformHeight - _heightLogo) / 2,10),
		enableZoomControls : false,
		showScrollbars : false,
		touchEnabled : false
	}));
	
	// Label System Information
	var os = (_isApple) ? "iPad" : "Android";
	var version;
	if(!_isApple){
		var splited = Ti.Platform.version.split('.');
		if(splited[0] === '2'){
			if(splited[1] === '2') version = " ~ Froyo";
			else version = " ~ Gingerbread";
		}
		else if(splited[0] === '3') version = " ~ Honeycomb";
		else if(splited[0] === '4') {
			if(splited[1] === '0') version = " ~ Ice Cream Sandwich";
			else version = " ~ Jelly Bean";
		}
		splited = null;
	}
	else version = "";
	_self.add(Ti.UI.createLabel({
		text : L('label_system') + ': ' + os + ' ' + Ti.Platform.version + version,
		textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
		font: {
			fontSize: (_isApple) ? 38 : '30sp',
			fontFamily: 'Comfortaa'
		},
		color : '#777',
		top : parseInt(_self.height * 0.075,10),
		right : parseInt((_self.width / 2 * 0.15),10),
	}));
	os = null;
	version = null;

	// Function declaration (addEventListener | RemoveEventListener)
	_self.onClickSelf = function onClickSelf(e){
		if(e.source == _self){
			if(!_isApple) Ti.UI.Android.hideSoftKeyboard();
			setTimeout(function() {
				_userTextField.blur();
			}, 250);
			setTimeout(function() {
				_passTextField.blur();
			}, 250); 
		}
	};
	_self.onChangeConnection = function onChangeConnection(){
		_internetLabel.text = (Ti.Network.online) ? L('label_inet_connected') : L('label_inet_noconnected');
		_internetLabelIcon.color = (Ti.Network.online) ? "#00FF00" : "#FF0000";
	};
	
	// Create Container Form
	createForm();
	
	// Remove Auto Focus (Apple | Android)
	_self.addEventListener('click', _self.onClickSelf);	
		
	// Label Internet Information
	var _internetLabel = Ti.UI.createLabel({
		text : (Ti.Network.online) ? L('label_inet_connected') : L('label_inet_noconnected'),
		textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
		font: {
			fontSize: (_isApple) ? 28 : '22sp' ,
			fontFamily: 'Comfortaa'
		},
		color : '#777',
		top : parseInt(_self.height * 0.17,10),
		right : parseInt((_self.width / 2 * 0.22),10),
	});
	_self.add(_internetLabel);
	var _fontObject = require('fonts/FontAwesome');
	var _fontA = new _fontObject();
	var _internetLabelIcon = Ti.UI.createLabel({
		text : _fontA.getCharCode('icon-signal'),
		textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
		font: {
			fontSize: (_isApple) ? 26 : '21sp' ,
			fontFamily: _fontA.getFontFamily()
		},
		color : (Ti.Network.online) ? "#00FF00" : "#FF0000",
		top : parseInt(_self.height * 0.175,10),
		right : parseInt((_self.width / 2 * 0.15),10),
	});
	_self.add(_internetLabelIcon);
	Ti.Network.addEventListener('change', _self.onChangeConnection);
	_fontObject = null;
	_fontA = null;

	/** @title: checkAuthentication (Function)
	 *  @usage: check passTextField value
	 *  @extras: launch HTTPAuth for login in wirecloud server */
	function checkAuthentication() {
		var _userText = _userTextField.value;
		var _passText = _passTextField.value;
		if (_userText.length == 0) alert(L("error_login_username"));
		else if (_passText.length == 0) alert(L("error_login_password"));
		else {
			_containerForm.borderWidth = 0;
			if(_isApple){
				_containerForm.animate({duration : 1000, delay : 0, opacity : 0},function(){
					destroyForm();
				});
			}
			else{
				_containerForm.animate({
					duration : 1000,
					delay : 0,
					opacity : 0
				});
				setTimeout(function() {
					destroyForm();
				}, 1000);
			}
			setTimeout(function() {
				var _conObject = require('/connections/appConnection');
				var _logObject = require('/ui/loginView/loginLocal');
				if(_logObject().checkLoginSaved([_userText, _passText])){
					Ti.App.fireEvent('showMainView');
				}
				else{
					var _conCredentials = _conObject.checkCredentials([_userText, _passText], function(credentials) {
						if(values === 'Credential Error') showError('login');
						else if(values === 'Wirecloud Error') showError('wirecloud');
						else{
							Ti.App.Properties.setString('cookie_csrftoken',credentials[2]);
							Ti.App.Properties.setString('cookie_sessionid',credentials[3]);
							_logObject().saveCredentials(credentials);
							Ti.App.fireEvent('showMainView');
						}
					});
				}
			}, 2000);
		}
		
		function showError(string){
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
			_self.remove(_activitySession);
			_activitySession = null;
			createForm();
		}
		
	}

	/** @title: createForm (Function)
	 *  @usage: create Container and TextFields
	 *  @extras: assign events (Apple & Android to TextFields) */
	function createForm() {
		_containerForm = Ti.UI.createView({
			height : _heightLogo / 2,
			width : parseInt(_self.width / 2 * 0.7,10),
			borderRadius : 15,
			borderWidth : 1,
			borderColor: "#66CCFF",
			left : parseInt(_self.width / 2 + (_self.width / 2 * 0.15),10),
			top : parseInt(((Ti.Platform.displayCaps.platformHeight - _heightLogo) / 2) + (_heightLogo / 4),10),
			backgroundColor : "#D5E4F1"
		});
		_self.add(_containerForm);

		// Input Field Username
		_userTextField = Ti.UI.createTextField({
			width : "90%",
			left : "5%",
			top : "15%",
			color : "#354B5D",
			backgroundColor : '#FFFFFF',
			borderColor : "#6890B2",
			borderWidth : 1,
			borderRadius : 5,
			borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
			autocapitalization : false,
			autocorrect: false,
			clearOnEdit : true,
			enableReturnKey : false,
			keyboardType : Ti.UI.KEYBOARD_EMAIL,
			returnKeyType : Ti.UI.RETURNKEY_DONE,
			font: {
				fontSize: (_isApple) ? 20 : '18sp',
				fontFamily: 'Comfortaa'
			},
			paddingLeft : 10,
			softKeyboardOnFocus : (_isApple) ? null : Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS,
			hintText : L('label_username')
		});
		_self.returnUserTField = function returnUserTField(e){
			setTimeout(function() {
				_userTextField.blur();
			}, 250);
		};
		_userTextField.addEventListener('return', _self.returnUserTField);
		_containerForm.add(_userTextField);

		// Input Field Password
		_passTextField = Ti.UI.createTextField({
			width : "90%",
			left : "5%",
			bottom : "15%",
			color : "#354B5D",
			backgroundColor : '#FFFFFF',
			borderColor : "#6890B2",
			borderWidth : 1,
			borderRadius : 5,
			borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
			autocapitalization : false,
			autocorrect: false,
			passwordMask : true,
			clearOnEdit : true,
			enableReturnKey : false,
			keyboardType : Ti.UI.KEYBOARD_DEFAULT,
			returnKeyType : Ti.UI.RETURNKEY_GO,
			font: {
				fontSize: (_isApple) ? 20 : '18sp',
				fontFamily: 'Comfortaa'
			},
			paddingLeft : 10,
			softKeyboardOnFocus : (_isApple) ? null : Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS,
			hintText : L('label_password')
		});
		if (_isApple){ // Events Apple
			_self.focusPassTField = function focusPassTField(e){
				_self.setTop(-(_containerForm.height / 2));
			};
			_self.blurPassTField = function blurPassTField(e){
				_self.setTop(0);
			};
			_self.returnPassTField = function returnPassTField(e){
				checkAuthentication();
			};
			_passTextField.addEventListener('focus', _self.focusPassTField);
			_passTextField.addEventListener('blur', _self.blurPassTField);
			_passTextField.addEventListener('return', _self.returnPassTField); 
		}
		else{ // Events Android
			_self.returnPassTField = function returnPassTField(e){
				setTimeout(function() {
					_passTextField.blur();
				}, 250);
				checkAuthentication();
			};
			_passTextField.addEventListener('return', _self.returnPassTField);
		}
		_containerForm.add(_passTextField);
	}

	/** @title: destroyForm (Function)
	 *  @usage: destroy Container and TextFields
	 *  @extras: memory management (null) */
	function destroyForm(){
        for (var i = _containerForm.children.length; i > 0; i--){
        	_containerForm.remove(_containerForm.children[i-1]);
        	_containerForm.children[i-1] = null;
		}
		_self.remove(_containerForm);
		_containerForm = null;
		_activitySession = Ti.UI.createLabel({
			color : '#777',
			text : L("label_login_wait"),
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			font: {
				fontSize: (_isApple) ? 25 : '20sp',
				fontFamily: 'Comfortaa'
			},
			left : parseInt(_self.width / 2 + (_self.width / 2 * 0.15),10),
			width : parseInt((_self.width / 2 * 0.7),10),
			top : parseInt(((_self.height - _heightLogo) / 2) + (_heightLogo / 2),10),
		});
		_self.add(_activitySession);
	};
	
	/** @title: clearObject (Function)
	 *  @usage: destroy all variables of LoginView
	 *  @extras: memory management (null) */
	_self.clearObject = function clearObject(){
		_self.remove(_activitySession);
		_self.remove(_internetLabel);
		_self.remove(_internetLabelIcon);
		_self.removeEventListener('click', _self.onClickSelf);
		Ti.App.removeEventListener('connectToWirecloudError', _self.onErrorWirecloud);
		Ti.Network.removeEventListener('change', _self.onChangeConnection);
		_userTextField.removeEventListener('return', _self.returnUserTField);
		if(_isApple){
			_passTextField.removeEventListener('focus', _self.focusPassTField);
			_passTextField.removeEventListener('blur', _self.blurPassTField);
			_passTextField.removeEventListener('return', _self.returnPassTField);
		}
		else _passTextField.removeEventListener('return', _self.returnPassTField);
		_heightLogo = null;
		_internetLabel = null;
		_internetLabelIcon = null;
		_isApple = null;
		_containerForm = null;
		_userTextField = null;
		_passTextField = null;
		_activitySession = null;
	};
	
	return _self;

}

module.exports = loginView; 
