/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.    
 */

var API = function() {
	
	var _self = {
		SW : {
			Contacts : require('API.Contacts'),
			Calendar : '',
			FileSystem : '',
			DataBase : '',
			Log : '',
			Map : '',
			Notification : '',
			Social : '',
		},
		HW : {
			Acceloremeter : '',
			Battery : require('API.Battery'),
			Camera : '',
			GeoLocation : '',
			Gesture : '',
			Media : '',
			Network : '',
			System : require('API.System'),
		}		
	};
			
	return _self;
	
}();

module.exports = API;