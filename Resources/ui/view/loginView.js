/*
 * Copyright (c) 2014 CoNWeT Lab., Universidad Politecnica de Madrid.
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.3.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

"use strict";

var loginView = function(parentWindow) {

	// Variables
	var theme = require('ui/style/loginViewStyle'),
	    activitySession,
	    logo = Ti.UI.createImageView(theme.logo),
	    systemLabel = Ti.UI.createLabel(theme.systemLabel),
	    _self = {
		view : Ti.UI.createView(theme.view)
	},
	    lastItemChoosed = null,
	    itemConected = null,
	    currentURL;

	// Handlers
	var focusPassTField,
	    blurPassTField,
	    returnUserTField,
	    returnPassTField;

	// Variables para la configuración
	var configurationView;

	// Login Form variables
	var loginFormContainer,
	    loginFormUserTextField,
	    loginFormPasswordTextField,
	    loginFormSubmitButton,
	    loginFormConfigButton,
	    loginFormInstanceName,
	    loginFormInstanceURL,
	    loginFormCheckbox,
	    loginConfigButton;

	// Enterprise Logo
	_self.view.add(logo);

	// System Version
	_self.view.add(systemLabel);

	// Handler change Connection
	/*_self.onChangeConnection = function onChangeConnection(){

	if(Yaast.API.HW.Network.isOnline()){
	//internetLabel.text = 'Conectado';
	//internetIcon.color = '#00FF00';
	}
	else{
	//internetLabel.text = 'Desconectado';
	//internetIcon.color = '#FF0000';
	}

	};*/
	//Ti.Network.addEventListener('change', _self.onChangeConnection);

	// Handler show Connection Error
	var showMessageError = function showMessageError(string) {
		var dialog = Ti.UI.createAlertDialog({
			cancel : 0,
			buttonNames : [L('button_ok')],
			message : string,
			title : '-- W4T --'
		});
		dialog.addEventListener('click', function(e) {
			dialog.hide();
			dialog = null;
		});
		dialog.show();

		if (activitySession != null || activitySession != undefined) {
			activitySession.hide();
			_self.view.remove(activitySession);
			activitySession = null;

			if (loginFormContainer != null) {
				loginFormContainer.setOpacity(1);
			}
		}
	};

	// Check Authentication Login
	var checkAuthentication = function checkAuthentication() {
		if (loginFormUserTextField.value.length === 0)
			showMessageError(L("error_login_username"));
		else if (loginFormPasswordTextField.value.length === 0)
			showMessageError(L("error_login_password"));
		else {
			loginFormContainer.animate({
				duration : 1000,
				delay : 0,
				opacity : 0
			}, function() {
				activitySession = Ti.UI.createActivityIndicator(theme.spinner);
				_self.view.add(activitySession);
				activitySession.show();
				// Could this really happend now?
				if (currentURL == null) {
					showMessageError(L("error_instance_not_selected"));
					return;
				}
				if (currentURL[currentURL.length - 1] !== '/') {
					currentURL += '/';
				}
				Yaast.API.HW.Network.setMainUrl(currentURL);
				Yaast.API.HW.Network.setLoginUrl(currentURL + 'login');
				Yaast.API.HW.Network.login(loginFormUserTextField.value, loginFormPasswordTextField.value, function(response) {
					var status;
					if (response === 'Error Credential') {
						status = 'Credential Error';
					} else if (response === 'Error Server') {
						status = 'Server Error';
					} else {
						status = 'Success';
					}

					var timestamp = new Date().getTime();

					// Login log
					var fullLoginlog = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'log/' + 'loginlog');
					var loginLog = {
						'timestamp' : timestamp,
						'user' : loginFormUserTextField.value,
						'url' : currentURL,
						'mode' : Yaast.API.HW.Network.getNetwork(),
						'mac' : Yaast.API.HW.System.getMacAddress(),
						'ip' : Yaast.API.HW.Network.getIpAddress(),
						'SO' : Yaast.API.HW.System.getDeviceOs() + ' ' + Yaast.API.HW.System.getVersion(),
						'status' : status
					};
					if (!fullLoginlog.exists()) {
						Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'log').createDirectory();
					}
					fullLoginlog.write(new Date().getTime() + '\n' + JSON.stringify(loginLog) + '\n\n', true);

					// Wirecloud Instance Directory
					//Yaast.Sandbox.currentURL = currentURL;
					var dirInstance = Yaast.Sandbox.appConfig.wcDirByURL[currentURL];
					if (dirInstance === undefined) {
						dirInstance = (Yaast.Sandbox.appConfig.lastId + 1) + '/';
						Yaast.Sandbox.appConfig.lastId++;
						Yaast.Sandbox.appConfig.wcDirByURL[Yaast.Sandbox.currentURL] = dirInstance;
					}
					Yaast.Sandbox.instanceDir = dirInstance;

					if (status === 'Credential Error')
						showMessageError(L("error_wrong_credentials"));
					else if (status === 'Server Error') {
						if (Yaast.API.HW.Network.isOnline())
							showMessageError(L("error_server_timeout"));
						else
							showMessageError(L("error_offline"));
					} else {
						var userName = loginFormUserTextField.value;
						// Save userName if checkbox is enable
						if (loginFormCheckbox.value)
							Yaast.Sandbox.appConfig.config.lastUser = userName;
						else
							Yaast.Sandbox.appConfig.config.lastUser = null;
						// Clean Login View
						parentWindow.cleanCurrentView();
						// Show Main View
						parentWindow.showMainView(userName);
					}
				});
			});
		}
	};

	var configButtonHandler = function configButtonHandler() {
		// Animación para el Logo
		logo.animate({
			duration : 500,
			delay : 0,
			opacity : 0
		});
		// System Label
		systemLabel.animate({
			duration : 500,
			delay : 0,
			opacity : 0
		});
		// Animación para el formulario de Login
		loginFormContainer.animate({
			duration : 500,
			delay : 0,
			opacity : 0
		}, function() {
			openConfiguration();
			destroyForm();
		});
	};

	/** Private Function to create Form Login */
	var createForm = function createForm() {
		var instanceURL,
		    instanceName;
		loginFormContainer = Ti.UI.createView(Yaast.MergeObject(theme.containerView, {
			right : parseInt(_self.view.width * 0.02, 10)
		}));

		if (Yaast.Sandbox.appConfig.config.lastInstanceName == null) {
			instanceName = Yaast.Sandbox.defaultInstanceName;
			instanceURL = Yaast.Sandbox.defaultURL;
		} else {
			instanceName = Yaast.Sandbox.appConfig.config.lastInstanceName;
			instanceURL = Yaast.Sandbox.appConfig.config.lastInstanceURL;
		}
		loginFormInstanceName = Ti.UI.createLabel(Yaast.MergeObject(theme.instanceName, {
			text : instanceName
		}));
		currentURL = Yaast.Sandbox.currentURL;
		loginFormContainer.add(loginFormInstanceName);

		loginFormInstanceURL = Ti.UI.createLabel(Yaast.MergeObject(theme.instanceURL, {
			text : '(' + instanceURL + ')'
		}));
		loginFormContainer.add(loginFormInstanceURL);
		loginFormCheckbox = Titanium.UI.createSwitch(theme.checkboxUser);	
		loginFormContainer.add(loginFormCheckbox);
		loginConfigButton = Ti.UI.createLabel(theme.configButtonIcon);
		loginFormContainer.add(loginConfigButton);
		
		loginFormUserTextField = Ti.UI.createTextField(Yaast.MergeObject(theme.inputTextField, {
			top : parseInt(loginFormContainer.getHeight() * 0.25, 10),
			keyboardType : Ti.UI.KEYBOARD_DEFAULT,
			returnKeyType : Ti.UI.RETURNKEY_DEFAULT,
			hintText : L("label_username")
		}));
		// Load username if it was save
		if (Yaast.Sandbox.appConfig.config.lastUser != null)
			loginFormUserTextField.text(Yaast.Sandbox.appConfig.config.lastUser);
		loginFormContainer.add(loginFormUserTextField);

		loginFormPasswordTextField = Ti.UI.createTextField(Yaast.MergeObject(theme.inputTextField, {
			top : parseInt(loginFormContainer.getHeight() * 0.5, 10),
			passwordMask : true,
			keyboardType : Ti.UI.KEYBOARD_DEFAULT,
			returnKeyType : Ti.UI.RETURNKEY_DONE,
			hintText : L("label_password")
		}));
		returnPassTField = function returnPassTField() {
			loginFormPasswordTextField.blur();
			checkAuthentication();
		};

		if (Yaast.API.HW.System.isApple()) {
			focusPassTField = function focusPassTField() {
				_self.top = _self.view.getTop();
				_self.height = _self.view.getHeight();
				_self.view.setHeight(_self.view.getHeight() + (loginFormContainer.height / 2));
				_self.view.setTop(-(loginFormContainer.height / 2));
			};
			blurPassTField = function blurPassTField() {
				if (_self.top && _self.height) {
					_self.view.setTop(_self.top);
					_self.view.setHeight(_self.height);
					delete _self.top;
					delete _self.height;
				}
			};
			returnUserTField = function returnUserTField() {
				loginFormUserTextField.blur();
			};
			loginFormUserTextField.addEventListener('return', returnUserTField);
			loginFormPasswordTextField.addEventListener('focus', focusPassTField);
			loginFormPasswordTextField.addEventListener('blur', blurPassTField);
		}
		loginFormPasswordTextField.addEventListener('return', returnPassTField);
		loginFormContainer.add(loginFormPasswordTextField);

		// Botón de enviar
		loginFormSubmitButton = Ti.UI.createButton(Yaast.MergeObject(theme.button, {
			title : L('button_login'),
			width : parseInt(loginFormContainer.width * 0.4, 10), //'30%',
			bottom : parseInt((loginFormContainer.getHeight() * 5) / 100)
		}));
		loginFormSubmitButton.submit = function submit() {
			checkAuthentication();
		};
		loginFormSubmitButton.addEventListener('click', loginFormSubmitButton.submit);
		loginFormContainer.add(loginFormSubmitButton);

		loginConfigButton.addEventListener('click', configButtonHandler);
		loginFormContainer.add(loginConfigButton);

		_self.view.add(loginFormContainer);
	};

	var openConfiguration = function openConfiguration() {
		configurationView = require('ui/view/instanceManagerView')(_self.view, logo, systemLabel, createForm);
	};

	/** Private Function to destroy Form Login */
	var destroyForm = function destroyForm() {

		if (loginFormContainer != null) {
			_self.view.remove(loginFormContainer);

			if (loginFormInstanceName != null) {
				loginFormContainer.remove(loginFormInstanceName);
				loginFormInstanceName = null;
			}

			if (loginFormInstanceURL != null) {
				loginFormContainer.remove(loginFormInstanceURL);
				loginFormInstanceURL = null;
			}

			if (loginFormUserTextField != null) {
				if (Yaast.API.HW.System.isApple()) {
					loginFormUserTextField.removeEventListener('return', returnUserTField);
				}
				returnUserTField = null;
				loginFormContainer.remove(loginFormUserTextField);
				loginFormUserTextField = null;
			}

			if (loginFormPasswordTextField != null) {
				if (Yaast.API.HW.System.isApple()) {
					loginFormPasswordTextField.removeEventListener('focus', focusPassTField);
					loginFormPasswordTextField.removeEventListener('blur', blurPassTField);
					focusPassTField = null;
					blurPassTField = null;
				}
				loginFormPasswordTextField.removeEventListener('return', returnPassTField);
				delete loginFormPasswordTextField.returnPassTField;
				loginFormContainer.remove(loginFormPasswordTextField);
				loginFormPasswordTextField = null;
			}

			if (loginFormSubmitButton != null) {
				loginFormSubmitButton.removeEventListener('click', loginFormSubmitButton.submit);
				delete loginFormSubmitButton.submit;
				loginFormContainer.remove(loginFormSubmitButton);
				loginFormSubmitButton = null;
			}

			if (loginConfigButton != null) {
				loginConfigButton.removeEventListener('click', configButtonHandler);
				loginFormContainer.remove(loginConfigButton);
				loginConfigButton = null;
			}

			loginFormContainer = null;
		}

	};

	createForm();

	/** Destroy LoginView and Objects inside */
	_self.destroy = function destroy() {
		if (activitySession != null) {
			activitySession.hide();
			_self.view.remove(activitySession);
			activitySession = null;
		}

		// Config panel
		//if (configurationView) {
		//Ti.API.warn(configurationView);
		//configurationView.destroy();
		//}

		// Formulario de Login
		destroyForm();

		// Otros
		//Ti.Network.removeEventListener('change', _self.onChangeConnection);
		delete _self.view;
		theme = null;
	};

	return _self;

};

module.exports = loginView;
