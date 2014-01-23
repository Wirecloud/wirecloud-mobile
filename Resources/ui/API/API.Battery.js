/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.2.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 */
'use strict';

var Battery = function() {

    var _device = (Ti.Platform.getOsname() === 'ipad' ||
                   Ti.Platform.getOsname() === 'iphone') ? 'ios' : 'android';
    var _version = parseInt(Ti.Platform.getVersion().split('.')[0], 10);

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
      * @return : Int (percent) or String (error message)*/
    _self.getBatteryLevel = function getBatteryLevel() {
        var level;

        if (Ti.Platform.getBatteryMonitoring()) {
            level = Ti.Platform.getBatteryLevel();
        } else {
            level = 'Error. Need to activate Batrery Monitoring';
        }
        return level;
    };

    /** Private Function to get Battery level
      * @return : Int or String (error message)*/
    _self.getBatteryState = function getBatteryState() {
        var state;

        if (Ti.Platform.getBatteryMonitoring()) {
            state = Ti.Platform.getBatteryLevel();
            // TODO establecer nuestro propio código de estado de la bateria
        } else {
            state = 'Error. Need to activate Batrery Monitoring';
        }
        return state;
    };

    _self.events = {
                    'batterychange': {
                        event: 'battery',
                        listener: Ti.Platform
                    }
    };

    return _self;

}();

module.exports = Battery;