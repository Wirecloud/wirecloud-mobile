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
    if (data.type == 'widget') {
	    for (var i = 0; i < data.altcontents.length; i ++) {
	    	if (data.altcontents[i].scope === "yaast") {
	    		_self.contents = data.altcontents[i];
	    	}
	    }
	    // TODO remove code_content_type and use contents.contenttype directly
    	_self.code_content_type = data.contents.contenttype;
    	_self.default_width = data.widget_width;
   		_self.default_height = data.widget_height;
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
	
	// Preferences
	_self.preferences = {};
	for (var i = 0; i < data.preferences.length; i++){
		_self.preferences[data.preferences[i].name] = data.preferences[i].default_value;
	}
    return _self;
    
};

module.exports = widgetPrototype;
