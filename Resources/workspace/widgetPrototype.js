/*
 * Copyright (c) 2014 CoNWeT Lab., Universidad Politecnica de Madrid.
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.3.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

/*global gettext, interpolate, WidgetTemplate, Wirecloud*/

function widgetPrototype(data) {

	var _self = {};
    _self.vendor = data.vendor;
    _self.name = data.name;
    _self.version = data.version;
    _self.uri = data.vendor + '/' + data.name + '/' + data.version;
    _self.id = data.uri;
    _self.display_name = data.title;
    _self.contents = data.contents;
    if (data.type === 'widget') {
	    for (var i = 0; i < data.altcontents.length; i ++) {
	    	if (data.altcontents[i].scope === "yaast") {
	    		_self.contents = data.altcontents[i];
	    	}
	    }
    	_self.default_width = data.widget_width;
   		_self.default_height = data.widget_height;
	} else if (data.type === "operator") {
		_self.js_files = data.js_files;
    }

	// Inputs
    _self.inputs = {};
    for (var i = 0; i < data.wiring.inputs.length; i++) {
        _self.inputs[data.wiring.inputs[i].name] = data.wiring.inputs[i];
    }

    // Outputs
    _self.outputs = {};
    for (var i = 0; i < data.wiring.outputs.length; i++) {
        _self.outputs[data.wiring.outputs[i].name] = data.wiring.outputs[i];
    }
	i = null;

	// Properties
	_self.properties = {};
	_self.propertiesList = data.properties;
	for (i = 0; i < data.properties.length; i++) {
		_self.properties[data.properties[i].name] = data.properties[i];
	}
	
	// Preferences
	_self.preferences = {};
    _self.preferenceList = data.preferences;
    for (i = 0; i < data.preferences.length; i++) {
        _self.preferences[data.preferences[i].name] = data.preferences[i];
    }

    return _self;
    
};

module.exports = widgetPrototype;
