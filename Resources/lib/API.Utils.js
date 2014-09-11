/*
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.3.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

'use strict';

var Utils = function (APIReferences) {

    var Yaast = {
        "API" : APIReferences
    };

    /** It provides several generic useful methods
     * @alias API.Utils
     * @namespace */
    var _self = {};

    /** 1 level merge object. (Priority obj2)
     * @method
     * @return {object} */
    _self.mergeObject_old = function mergeObject_old(obj1, obj2) {
        var result = null;
        var key;
        if (obj1 !== null && obj2 !== null) {
	        // Clone obj1 in result
	        result = {};
	        for (key in obj1) {
	            result[key] = obj1[key];
	        }
	        // Merge result with obj2
            for (key in obj2) {
                result[key] = obj2[key];
            }
        }
        return result;
    };

    /** Deep fusion object . Without modifying the parameters. (Priority obj2)
     * @method
     * @return {object} */
    _self.mergeObject= function mergeObject(obj1, obj2) {
    	if(typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || typeof obj2 == null || (Array.isArray(obj1) && !Array.isArray(obj2)) || (!Array.isArray(obj2) && Array.isArray(obj1))) {
    		Ti.API.warn('Impossible to merge this params');
    		return null;
    	}
		var clon = _self.clone(obj1);
		var result = _self.recMerge(clon, obj2);
		return result;
    };

	/** Clone the object
     * @method
     * @return {object} */
	_self.clone = function clone(obj1) {
		var result;
        if (obj1 == null) {
            return obj1;
        } else if (Array.isArray(obj1)) {
            result = [];
        } else {
            result = {};
        }
        for (var key in obj1) {
            result[key] = obj1[key];
        }
        return result;
	};

	/** Deep merge in obj1 object. (Priority obj2)
     * @method
     * @return {object} */
	_self.recMerge = function recMerge(obj1, obj2) {
		if (Array.isArray(obj2) && Array.isArray(obj1)) {
			// Merge Arrays
			var i;
			for (i = 0; i < obj2.length; i ++) {
	        	if (typeof obj2[i] === 'object' && typeof obj1[i] === 'object') {
	        		obj1[i] = _self.recMerge(obj1[i], obj2[i]);
	        	} else {
	        		obj1[i] = obj2[i];
	        	}
			}
		} else if (Array.isArray(obj2)) {
			// Priority obj2
			obj1 = obj2;
		} else {
			// object casej
		    for (var p in obj2) {
		        if(obj1.hasOwnProperty(p)){
		        	if (typeof obj2[p] === 'object' && typeof obj1[p] === 'object') {
		        		obj1[p] = _self.recMerge(obj1[p], obj2[p]);
		        	} else {
		        		obj1[p] = obj2[p];
		        	}
		        } else {
		        	obj1[p] = obj2[p];
		        }
		    }
		}
	    return obj1;
	};


    return _self;

};

module.exports = Utils;