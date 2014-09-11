/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.3.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 */

"use strict";

var loginView = function (parentWindow) {

    var theme = require('ui/style/loginViewStyle'), containerForm, userTextField,
    passTextField, activitySession, internetLabel, internetIcon, _self = {
       view : Ti.UI.createView(theme.view)
    };

    // Enterprise Logo
    _self.view.add(Ti.UI.createWebView(theme.logo));

    // System Version
    _self.view.add(Ti.UI.createLabel(theme.systemLabel));

    // Internet Label
    internetLabel = Ti.UI.createLabel(theme.internetLabel);
    _self.view.add(internetLabel);

    // Internet Icon
    internetIcon = Ti.UI.createLabel(theme.internetIcon);
    _self.view.add(internetIcon);

    // Handler change Connection
    _self.onChangeConnection = function onChangeConnection(){
        if(Yaast.API.HW.Network.isOnline()){
            internetLabel.text = 'Conectado';
            internetIcon.color = '#00FF00';
        }
        else {
            internetLabel.text = 'Desconectado';
            internetIcon.color = '#FF0000';
        }
    };
    Ti.Network.addEventListener('change', _self.onChangeConnection);

    // Handler show Connection Error
    var showMessageError = function showMessageError(string) {
        var dialog = Ti.UI.createAlertDialog({
            cancel : 0,
            buttonNames : ['Aceptar'],
            message : string,
            title : '-- W4T --'
        });
        dialog.addEventListener('click', function(e) {
            dialog.hide();
            dialog = null;
        });
        dialog.show();
        if(activitySession !== null){
            activitySession.hide();
            _self.view.remove(activitySession);
            activitySession = null;
            containerForm.setOpacity(1);
        }
    };

	// Check Authentication Login
	var checkAuthentication = function checkAuthentication() {
        if(userTextField.value.length === 0) showMessageError('El usuario no puede estar vacío');
        else if(passTextField.value.length === 0) showMessageError('La contraseña no puede estar vacía');
        else{
            containerForm.borderWidth = 0;
            containerForm.animate({duration : 1000, delay : 0, opacity : 0}, function() {
                activitySession = Ti.UI.createLabel(theme.activityLabel);
                _self.view.add(activitySession);
                activitySession.show();
                Yaast.API.HW.Network.login(userTextField.value, passTextField.value, function(response){
                    if(response === 'Error Credential') showMessageError('Se ha producido un error con sus credenciales');
                    else if(response === 'Error Server') {
                        if(Yaast.API.HW.Network.isOnline())
                            showMessageError('Se ha producido un error con el servidor. Inténtelo más tarde');
                        else showMessageError('Verifique su conexión a Internet');
                    }
                    else {
                    	var userName = userTextField.value;
                    	// Clean Login View
                    	parentWindow.cleanCurrentView();
                    	// Show Main View
                    	parentWindow.showMainView(userName);
                    }
                });
            });
		}
	};

    /** Private Function to create Form Login */
    var createForm = function createForm() {

        containerForm = Ti.UI.createView(theme.containerView);

        userTextField = Ti.UI.createTextField(Yaast.MergeObject(
            theme.inputTextField, {
                top: parseInt(containerForm.getHeight() * 0.15, 10),
                keyboardType: Ti.UI.KEYBOARD_EMAIL,
                returnKeyType: Ti.UI.RETURNKEY_DONE,
                hintText: "Nombre de usuario"
            }
        ));
        userTextField.returnUserTField = function returnUserTField() {
            userTextField.blur();
        };
        userTextField.addEventListener('return', userTextField.returnUserTField);
        containerForm.add(userTextField);

        passTextField = Ti.UI.createTextField(Yaast.MergeObject(
            theme.inputTextField, {
                top: parseInt(containerForm.getHeight() * 0.6, 10),
                passwordMask: true,
                keyboardType: Ti.UI.KEYBOARD_DEFAULT,
                returnKeyType: Ti.UI.RETURNKEY_GO,
                hintText: "Contraseña"
            }
        ));
        passTextField.returnPassTField = function returnPassTField() {
            passTextField.blur();
            checkAuthentication();
        };

        if(Yaast.API.HW.System.isApple()) {
            passTextField.focusPassTField = function focusPassTField() {
                _self.top = _self.view.getTop();
                _self.height = _self.view.getHeight();
                _self.view.setHeight(_self.view.getHeight() + (containerForm.height/2));
                _self.view.setTop(-(containerForm.height/2));
            };
            passTextField.blurPassTField = function blurPassTField() {
                if(_self.top && _self.height){
                    _self.view.setTop(_self.top);
                    _self.view.setHeight(_self.height);
                    delete _self.top;
                    delete _self.height;
                }
            };
            passTextField.addEventListener('focus', passTextField.focusPassTField);
            passTextField.addEventListener('blur', passTextField.blurPassTField);
        }
        passTextField.addEventListener('return', passTextField.returnPassTField);
		containerForm.add(passTextField);
		_self.view.add(containerForm);
	};

    createForm();

	/** Destroy LoginView and Objects inside */
	_self.destroy = function destroy() {
	    if(activitySession !== null){
	        activitySession.hide();
            _self.view.remove(activitySession);
            activitySession = null;
	    }
        userTextField.removeEventListener('return', userTextField.returnUserTField);
        delete userTextField.returnUserTField;
        containerForm.remove(userTextField);
        userTextField = null;
        if(Yaast.API.HW.System.isApple()) {
            passTextField.removeEventListener('focus', passTextField.focusPassTField);
            passTextField.removeEventListener('blur', passTextField.blurPassTField);
            delete passTextField.focusPassTField;
            delete passTextField.blurPassTField;
        }
        passTextField.removeEventListener('return', passTextField.returnPassTField);
        delete passTextField.returnPassTField;
        containerForm.remove(passTextField);
        passTextField = null;
        _self.view.remove(containerForm);
        containerForm = null;
		_self.view.remove(internetLabel);
		internetLabel = null;
		_self.view.remove(internetIcon);
        internetIcon = null;
		Ti.Network.removeEventListener('change', _self.onChangeConnection);
		delete _self.view;
		theme = null;
	};

	return _self;

};

module.exports = loginView;
