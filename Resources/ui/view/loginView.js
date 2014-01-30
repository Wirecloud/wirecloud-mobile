/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.2.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 */

"use strict";

var loginView = function (parentWindow) {

    var theme = require('ui/style/loginViewStyle'), containerForm, userTextField, passTextField,
    activitySession, os = (Ti.App.isApple) ? "iPad" : "Android", version = "", internetLabel, internetIcon,
    _self = {
       view : Ti.UI.createView({
            top: 10,
            left: 0,
            backgroundColor: '#FFFFFF',
            width: Ti.Platform.displayCaps.platformWidth,
            height: Ti.Platform.displayCaps.platformHeight
        })
    },
    heightLogo = (_self.view.getWidth()/2 !== 800) ? parseInt((500 * ((_self.view.getWidth()/2)/800)), 10) : 500;

    // Enterprise Logo
    _self.view.add(Ti.UI.createWebView(Ti.App.mergeObject(
        theme.logo, {
            height: heightLogo,
            width: _self.view.getWidth() / 2,
            left: parseInt(((_self.view.getWidth()/2) * 0.05), 10),
            top: parseInt((_self.view.getHeight()-heightLogo)/2, 10)
        }
    )));

    // Label OS , Version and Internet
    if(!Ti.App.isApple){
        var splited = Ti.Platform.version.split('.');
        if(splited[0] === '2'){
            if(splited[1] === '2'){
                version = " ~ Froyo";
            }
            else{
                version = " ~ Gingerbread";
            }
        }
        else if(splited[0] === '3'){
            version = " ~ Honeycomb";
        }
        else if(splited[0] === '4'){
            if(splited[1] === '0'){
                version = " ~ Ice Cream Sandwich";
            }
            else{
                version = " ~ Jelly Bean";
            }
        }
        splited = null;
    }
    _self.view.add(Ti.UI.createLabel(Ti.App.mergeObject(
        theme.systemLabel, {
            text: Ti.Locale.getString('label_system') + ': ' + os + ' ' + Ti.Platform.version + version,
            top: parseInt(_self.view.getHeight() * 0.075, 10),
            right: parseInt((_self.view.getWidth()/2 * 0.15), 10)
        }
    )));
    os = null;
    version = null;
    internetLabel = Ti.UI.createLabel(Ti.App.mergeObject(
        theme.internetLabel, {
            text: (Ti.Network.online) ? Ti.Locale.getString('label_inet_connected') :
                                         Ti.Locale.getString('label_inet_noconnected'),
            top: parseInt(_self.view.getHeight() * 0.17, 10),
            right: parseInt((_self.view.getWidth()/2 * 0.22), 10)
        }
    ));
    _self.view.add(internetLabel);
    internetIcon = Ti.UI.createLabel(Ti.App.mergeObject(
        theme.internetIcon, {
            color: (Ti.Network.online) ? "#00FF00" : "#FF0000",
            top: parseInt(_self.view.getHeight() * 0.175, 10),
            right: parseInt((_self.view.getWidth()/2 * 0.15), 10)
        }
    ));
    _self.view.add(internetIcon);
    _self.onChangeConnection = function onChangeConnection(){
        internetLabel.text = (Ti.Network.online) ? Ti.Locale.getString('label_inet_connected') :
                              Ti.Locale.getString('label_inet_noconnected');
        internetIcon.color = (Ti.Network.online) ? "#00FF00" : "#FF0000";
    };
    Ti.Network.addEventListener('change', _self.onChangeConnection);

    /** Private function to show connection errors
     *  @param {String} identifier */
    var connectionError = function connectionError(string) {
        var stringSearch;
        if (Ti.Network.online){
            stringSearch = (Ti.App.isApple) ? "error_connection_login_ios" : "error_connection_login_android";
        }
        else{
            stringSearch = "error_connection_inet";
        }
        var alertError = Ti.UI.createAlertDialog({
            title: "AppBase",
            message: Ti.Locale.getString(stringSearch),
            buttonNames: [Ti.Locale.getString("alert_button_accept")]
        });
        alertError.show();
        stringSearch = null;
        alertError = null;
        _self.view.remove(activitySession);
        activitySession = null;
        containerForm.setOpacity(1);
    };

	/** Private function to do HTTP Basic Auth */
	var checkAuthentication = function checkAuthentication() {
        if(userTextField.value.length === 0){
            alert(Ti.Locale.getString('error_login_username'));
        }
        else if(passTextField.value.length === 0){
            alert(Ti.Locale.getString('error_login_password'));
        }
        else{
            containerForm.borderWidth = 0;
            containerForm.animate({duration : 1000, delay : 0, opacity : 0},function(){
                activitySession = Ti.UI.createLabel(Ti.App.mergeObject(
                    theme.activityLabel, {
                        text: Ti.Locale.getString("label_login_wait"),
                        left: parseInt(_self.view.getWidth()/2+(_self.view.getWidth()/2 * 0.15), 10),
                        width: parseInt((_self.view.getWidth()/2 * 0.7), 10),
                        top: parseInt(((_self.view.getHeight()-heightLogo)/2)+(heightLogo/2),10)
                    }
                ));
                _self.view.add(activitySession);
                Ti.App.API.HW.Network.login(userTextField.value, passTextField.value, function(response){
                    if(response === 'Error Credential'){
                        connectionError('login');
                    }
                    else if(response === 'Error Server'){
                        connectionError('server');
                    }
                    else if(response === 'Success Credential'){
                        parentWindow.showMainView();
                    }
                });
            });
		}
	};

    /** Private Function to create Form Login */
    var createForm = function createForm() {
        containerForm = Ti.UI.createView(Ti.App.mergeObject(
            theme.containerView, {
                height : heightLogo / 2,
                width : parseInt(_self.view.getWidth()/2 * 0.7,10),
                left : parseInt(_self.view.getWidth()/2+(_self.view.getWidth()/2 * 0.15), 10),
                top : parseInt(((_self.view.getHeight()-heightLogo)/2)+(heightLogo/4), 10)
            }
        ));

        userTextField = Ti.UI.createTextField(Ti.App.mergeObject(
            theme.inputTextField, {
                top: '15%',
                clearOnEdit: false,
                keyboardType : Ti.UI.KEYBOARD_EMAIL,
                returnKeyType : Ti.UI.RETURNKEY_DONE,
                hintText : Ti.Locale.getString('label_username')
            }
        ));
        userTextField.returnUserTField = function (e){
            userTextField.blur();
        };
        userTextField.addEventListener('return', userTextField.returnUserTField);
        containerForm.add(userTextField);

        passTextField = Ti.UI.createTextField(Ti.App.mergeObject(
            theme.inputTextField, {
                top: '60%',
                passwordMask: true,
                clearOnEdit: true,
                keyboardType: Ti.UI.KEYBOARD_DEFAULT,
                returnKeyType: Ti.UI.RETURNKEY_GO,
                hintText: Ti.Locale.getString('label_password')
            }
        ));
        passTextField.returnPassTField = function (e){
            checkAuthentication();
        };
        passTextField.focusPassTField = function focusPassTField(e){
            _self.view.setTop(-(containerForm.height/2));
        };
        passTextField.blurPassTField = function blurPassTField(e){
            _self.view.setTop(0);
        };
        passTextField.addEventListener('return', passTextField.returnPassTField);
        passTextField.addEventListener('focus', passTextField.focusPassTField);
        passTextField.addEventListener('blur', passTextField.blurPassTField);
		containerForm.add(passTextField);
		_self.view.add(containerForm);
	};

    createForm();

	/** Destroy LoginView and Objects inside */
	_self.destroy = function destroy() {
        userTextField.removeEventListener('return', userTextField.returnUserTField);
        delete userTextField.returnUserTField;
        containerForm.remove(userTextField);
        userTextField = null;
        passTextField.removeEventListener('return', passTextField.returnPassTField);
        passTextField.removeEventListener('focus', passTextField.focusPassTField);
        passTextField.removeEventListener('blur', passTextField.blurPassTField);
        delete passTextField.returnPassTField;
        delete passTextField.focusPassTField;
        delete passTextField.blurPassTField;
        containerForm.remove(passTextField);
        passTextField = null;
        _self.view.remove(containerForm);
        containerForm = null;
		_self.view.remove(activitySession);
		activitySession = null;
		_self.view.remove(internetLabel);
		internetLabel = null;
		_self.view.remove(internetIcon);
        internetIcon = null;
		Ti.Network.removeEventListener('change', _self.onChangeConnection);
		delete _self.view;
	};

	return _self;

};

module.exports = loginView;
