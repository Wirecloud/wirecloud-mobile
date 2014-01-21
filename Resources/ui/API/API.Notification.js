/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.2.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *   
 */

var Notification = function() {
	
	var _device = (Ti.Platform.getOsname() == 'ipad' || 
		           Ti.Platform.getOsname() == 'iphone') ? 'ios' : 'android';
	var _version = parseInt(Ti.Platform.getVersion().split('.')[0]);
	
	var _self = {
		'notification' : null
	};

	/** Create Notification
	  *  @param: {Object} parameter with notification info 
	  *  @return : Object Notification */
	_self.createNotification = function createNotification(parameter) {
		parameter = _validateNotification(parameter);
		if(parameter['validate'] != false){
			delete parameter['validate'];
			if(_device == 'ios'){
				_self.notification = Ti.App.iOS.createLocalNotification(parameter);
			}
			else{
				_self.notification = Ti.UI.createNotification(parameter);
			}
		}
		return parameter;
	};

	return _self;

}();

module.exports = Notification;