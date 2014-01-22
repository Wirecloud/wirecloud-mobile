/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.2.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 */

"use strict";

var Notification = function() {

	var _device = (Ti.Platform.getOsname() === 'ipad' ||
                   Ti.Platform.getOsname() === 'iphone') ? 'ios' : 'android',
    _version = parseInt(Ti.Platform.getVersion().split('.')[0], 10),
    _self = {
        'toastnotification' : null
    };

    /** Private Function to Validate Toast Notification info
      *  @param: {Object} parameter with notification info
      *  @return : {Object} Notification info validated */
    var _validateToastNotification = function _validateToastNotification(parameter) {
        var keys = {'backgroundColor' : '', 'borderColor' : '', 'borderRadius' : '',
        'borderWidth' : '', 'message' : '', 'opacity' : '' }, key;
        if(typeof parameter.message === 'undefined'){
            parameter.message = '[WARN] Key message should be defined';
            parameter.validate = false;
        }
        else{
            for(key in parameter){
                if(!keys.hasOwnProperty(key)){
                    parameter.key = '[WARN] Key '+key+' is not valid';
                    parameter.validate = false;
                }
                else if((key === 'backgroundColor' || key === 'borderColor' ||
                key === 'message' || key === 'opacity') && typeof key !== 'string'){
                    parameter.key = '[WARN] Key '+key+' should be String';
                    parameter.validate = false;
                }
                else if((key === 'borderWidth' || key === 'borderRadius') &&
                typeof key !== 'number'){
                    parameter.key = '[WARN] Key '+key+' should be Number';
                    parameter.validate = false;
                }
            }
        }
        return parameter;
    };

    /** Private Function to Create Custom Toast Notification (iOS)
      *  @param: {Object} parameter with notification info
      *  @return : {TiProxyView} Notification */
    var _createToastNotification = function _createToastNotification(parameter) {
        var window = Ti.UI.createWindow();
        var notification = Ti.UI.createView({
            height: 100,
            width: Ti.Platform.displayCaps.getPlatformWidth() - 100,
            borderColor: parameter.borderColor,
            borderWidth: parameter.borderWidth,
            borderRadius: parameter.borderRadius,
            backgroundColor: parameter.backgroundColor,
            opacity: parameter.opacity
        });
        notification.add(Ti.UI.createLabel({
            text: parameter.message,
            color: '#fff',
            width: 'auto',
            height: 'auto',
            textAlign: 'center',
            font:{
                fontFamily:'Helvetica Neue',
                fontSize:12,
                fontWeight:'bold'
            }
        }));
        window.add(notification);
        notification = null;
        return window;
    };

	/** Create Toast Notification
	  *  @param: {Object} parameter notification info
	  *  @return : Object Notification */
	_self.createNotification = function createNotification(parameter) {
		parameter = _validateToastNotification(parameter);
		if(parameter.validate !== false){
			delete parameter.validate;
			_self.toastnotification = _createToastNotification(parameter);
		}
		return parameter;
	};

    /** Show Toast Notification
      *  @param: {String | Number} duration info
      *  @return : Object Notification */
    _self.showNotification = function showNotification(duration) {
        var interval = 2000;
        if(duration === 'DURATION_SHORT'){
            interval = 1500;
        }
        else if(duration === 'DURATION_LONG'){
            interval = 5000;
        }
        _self.toastnotification.open();
        setTimeout(function(){
            _self.toastnotification.close({
                opacity: 0,
                duration: 1000
            });
            _self.toastnotification = null;
        }, interval);
    };

	return _self;

}();

module.exports = Notification;