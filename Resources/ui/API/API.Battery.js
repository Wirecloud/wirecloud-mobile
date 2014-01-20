/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.2.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *   
 */

var Battery = function() {
	
	var _device = (Ti.Platform.getOsname() == 'ipad' || 
		           Ti.Platform.getOsname() == 'iphone') ? 'ios' : 'android';
	var _version = parseInt(Ti.Platform.getVersion().split('.')[0]);
	
	var _self = {};

	/** Private Function to check if battery monitoring is enabled.
      * @return : Bool */
	_self.batteryMonitoring = function batteryMonitoring() {
		return Ti.Platform.getBatteryMonitoring();
	};

	/** Set battery monitoring.
	  * @param: {Bool} true to activate monitoring and false to disable monitoring
      * @return : Bool */
	_self.setBatteryMonitoring = function setBatteryMonitoring(activate) {
		return Ti.Platform.setBatteryMonitoring(activate);
	};

	/** Private Function to get Battery level 
      * @return : Int (percent)*/
	_self.getBatteryLevel = function getBatteryLevel() {
		if (Ti.Platform.getBatteryMonitoring()) {
			return Ti.Platform.getBatteryLevel();
		} else {
			// Error
		}
	};

	/** Private Function to get Battery level 
      * @return : Int */
	_self.getBatteryState = function getBatteryState() {
		if (Ti.Platform.getBatteryMonitoring()) {
			return Ti.Platform.getBatteryLevel();
			// TODO establecer nuestro propio código de estado de la bateria
		} else {
			// Error
		}
	};

	return _self;

}();

module.exports = Battery;