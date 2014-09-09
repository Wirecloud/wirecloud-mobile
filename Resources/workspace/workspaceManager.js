
//workspaceManager ScrollView Component Constructor
function workspaceManager(parameters, userName) {

	var _isApple = (Ti.Platform.osname == 'ipad');
	var _isIOS7 = (_isApple && Ti.Platform.version.split('.')[0] === '7') ? true : false;
	var _platformObject = require('workspace/platform')(parameters.data);
	var _currentPage = 0;
	var _scrollView;
	var _downloadObject = null;
	var _widgetsViewById = {};
	var _operatorsViewById = {};

	// Visualization Self
	var _self = Ti.UI.createView({
		top : parameters.topView,
		left : 0,
		height : parameters.heightView,
		width : Ti.Platform.displayCaps.platformWidth,
		tabFunction: showShortcutTab,
		platform: _platformObject,
		columnRatio: (_platformObject.preferences.columns) ? _platformObject.preferences.columns.value : 20,
		rowRatio: (_platformObject.preferences["cell-height"]) ? _platformObject.preferences["cell-height"].value : 12
	});

	// Visualization ScrollView Workspace Function
	_self.funShowWorkspace = function funShowWorkspace(){
		Ti.App.removeEventListener('showWorkspace', _self.funShowWorkspace);
		if(_downloadObject != null) {
			_self.remove(_downloadObject);
			_downloadObject = null;
		}
		_scrollView = Ti.UI.createScrollableView({
			top: 0,
			left: 0,
			height: _self.height,
			width: _self.width
		});
		_self.add(_scrollView);
		_scrollView.setViews(createGlobalView());
		delete _self['funShowWorkspace'];
	};

	// Check Dependencies
	var _widgets = new Array();
	for (var i in _self.platform.widgetsInUseById){
		if(_widgets.indexOf(_self.platform.widgetsInUseById[i].uri) === -1 && _self.platform.widgetsInUseById[i].name !== 'map-viewer'){
			_widgets.push(_self.platform.widgetsInUseById[i].uri);
		}
	}
	var _operators = new Array();
	for (var i in _self.platform.operatorsInUseById){
		if(_operators.indexOf(_self.platform.operatorsInUseById[i].uri) === -1){
			_operators.push(_self.platform.operatorsInUseById[i].uri);
		}
	}
	var _widgetsToDownload = new Array();
	var _operatorsToDownload = new Array();
	var _directory = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, userName);
	if(!_directory.exists()){
		_directory.createDirectory();
		if (!Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, userName + '/widgets/').exists()) {
    		Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, userName + '/widgets/').createDirectory();
		}
		if (!Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, userName + '/operators/').exists()) {
    		Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, userName + '/operators/').createDirectory();
		}
	}
	for (var i in _widgets){
		if(!Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, userName + '/widgets/'+_widgets[i]).exists()){
			_widgetsToDownload.push(_widgets[i]);
		}
	}
	_widgets = null;
	for (var i in _operators){
		if(!Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, userName + '/operators/'+_operators[i]).exists()){
			_operatorsToDownload.push(_operators[i]);
		}
	}
	_operators = null;
	Ti.App.addEventListener('showWorkspace', _self.funShowWorkspace);
	if(_widgetsToDownload.length == 0 && _operatorsToDownload.length == 0){
		_self.funShowWorkspace();
	}
	else{
		var _downloadObject = require('ui/view/downloadView')(parameters.heightView, _widgetsToDownload, _operatorsToDownload, _self.platform.name, userName);
		_self.add(_downloadObject);
	}

	/** @title: createGlobalView (Function)
	 *  @usage: create view for ScrollableView
	 *  @extras: performance */
	function createGlobalView(){
		var _aViews = new Array();
		for (var i = 0; i < _self.platform.tabs.length; i++) {
			_aViews.push(createTabView(_self.platform.tabs[i].widgets));
		}
		for (var i in _self.platform.operatorsInUseById){
			var _operatorClass = require("workspace/operatorGeneric");
			var _operatorO = _operatorClass(_self.platform.operatorsInUseById[i], i, userName);
			_operatorsViewById[i] = _operatorO;
			_self.add(_operatorO);
			_operatorClass = null;
			_operatorO = null;
		}
		i = null;
		return _aViews;
	};

	/** @title: createTabView (Function)
	 *  @parameters: data (Tab Information (Widgets))
	 *  @usage: create Tab
	 *  @extras: performance */
	function createTabView(dataTab){
		var _tabView = Ti.UI.createView({
			height: _self.height - 20,
			width: _self.width - 20,
			top: 10,
			left: 10,
		});
		var componentPos = {};
		for(var i in dataTab){
			var _dimWidgetO = getDimensionWidget({h: _tabView.height, w: _tabView.width}, dataTab[i]);
			componentPos[i] = _dimWidgetO;
			var _widgetClass = require("workspace/widgetGeneric");
			var _widgetO = _widgetClass(_dimWidgetO, dataTab[i].meta, i, userName);
			_widgetsViewById[i] = _widgetO;
			_tabView.add(_widgetO);
			_tabView.add(Ti.UI.createLabel({ // Widget Label
				top: _widgetO.top - 30,
				left: _widgetO.left + 20,
				text: dataTab[i].meta.display_name,
				width: _widgetO.width - 20,
				height: 30,
				verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
				color: "#E3DEDD"
			}));
			_widgetClass = null;
			_widgetO = null;
			_dimWidgetO = null;
		}
		i = null;
		Ti.App.tabView = _tabView;
		Ti.App.componentPos = componentPos;
		return _tabView;
	};

	/** @title: getDimensionWidget (Function)
	 *  @parameters: dim (tabView size) data (JSON iWidget)
	 *  @usage: return dimensions and position of Widget */
	function getDimensionWidget(dim, data){
		var _w = parseInt(((data.dimensions.width * 8) / _self.columnRatio) * (dim.w/8), 10);
		var _l = parseInt(((data.dimensions.left * 8) / _self.columnRatio) * (dim.w/8), 10);
		var _t;
		//if(_l > 0) {
			_l = _l + 17;
			_w = _w - 15;
		//}
		//var _h;
		switch(data.meta.name){
			case "cupon-updater":
			case "open-updater":
			case "user-info":
			case "card-info":
			case "carousel":
			case "category-filter-demo":
			case "order":
			case "reserve":
			case "media-searcher":
			case "media-favorite":
				_h = parseInt(((dim.h/10) * 4),10) - 30;
			break;
			case "AudioVideo-player":
			    _h = parseInt(((dim.h/10) * 6),10) - 30;
			break;
			default:
				_h = dim.h - 30; // FullScreen Height
			break;
		}
		if(data.meta.name === 'open-updater' || data.meta.name === 'card-info' || data.meta.name === 'carousel'){
			_t = (dim.h/2) + 30;
		}
		else if(data.meta.name === 'AudioVideo-player'){
		    _t = parseInt(((dim.h/10) * 4), 10) + 30;
		}
		else{
			_t = 30;
		}

		return{
			width: _w,
			height: _h,
			left: _l,
			top: _t
		};
	};

	// Handler that take each event launched by any widget or operator
	_self.funPushEvent = function funPushEvent(data){
		var _theEntity, _target;
		var _outputname = data.name;
		var _eventData = data.dataEvent;
		for (var i = 0; i < _self.platform.wiring.length; i++) {
			if (_self.platform.wiring[i].source.endpoint == _outputname && _self.platform.wiring[i].source.id == data.id) {
				_target = _self.platform.wiring[i].target;
				if(_target.endpoint === 'menuInput'){
					var _a = 0;
				}
				if (_target.type == 'iwidget') {
					_theEntity = _widgetsViewById[_target.id];
				} else { //operator
					_theEntity = _operatorsViewById[_target.id];
				}
				Ti.API.info('activateCallback from id: '+data.id+' to id: '+_target.id+' using endpoint: '+_target.endpoint);
				if(_theEntity.apiName === 'Ti.UI.WebView') {
					_theEntity.evalJS("MashupPlatform.activateCallback(" + "'" + _target.endpoint + "'" + "," + JSON.stringify(_eventData) + ");");
				}
				else {
					_theEntity.activateCallback(_target.endpoint, _eventData);
				}
			}
		}
		_target = null;
		_theEntity = null;
		_outputname = null;
		_eventData = null;
	};
	Ti.App.addEventListener('pushEvent', _self.funPushEvent);

	// Handler that take each make request HTTP launched by any widget or operator
	_self.funMakeRequest = function funMakeRequest(data){
		Ti.API.info('makeRequest from id: '+data.id+' with url: '+data.url);
		var _conObject = require('/connections/appConnection');
		var _conA = _conObject.makeExternRequest(data, function(values) {
			var _theEntity;
			if(data.typeView === 'widget'){
				_theEntity = _widgetsViewById[data.id];
			}
			else{
				_theEntity = _operatorsViewById[data.id];
			}
			var _result;
			Ti.API.info(JSON.stringify(values));
			if(values.status != 200) _result = "'" + 'Error' + "'";
			else{
				_result = JSON.stringify({
					responseText: values.responseText,
					status: values.status
				});
			}
			Ti.API.info('activateRequestCallback from id: '+data.id+' with url: '+data.url+' and idRequest: '+data.idRequest);
			_theEntity.evalJS("MashupPlatform.activateRequestCallback(" + "'" + data.idRequest + "'" + "," + _result + ");");
			_result = null;
			_theEntity = null;
		});
		_conA = null;
		_conObject = null;
	};
	Ti.App.addEventListener('makeRequest', _self.funMakeRequest);

	// Handler that take each petition of preferences value
	_self.funGetPreferences = function funGetPreferences(data){
		Ti.API.info('getPreferences from id: '+data.id);
		var _theEntity;
		var _preferences;
		if(data.typeView === 'widget'){
			_theEntity = _widgetsViewById[data.id];
			_preferences = _self.platform.widgetsInUseById[data.id].preferences;
		}
		else{
			_theEntity = _operatorsViewById[data.id];
			_preferences = _self.platform.operatorsInUseById[data.id].preferences;
		}
		Ti.API.info('activatePreferenceCallback to id: '+data.id+' with preferences: '+ JSON.stringify(_preferences));
		_theEntity.evalJS("MashupPlatform.activatePreferenceCallback(" + JSON.stringify(_preferences) + ");");
		_result = null;
		_theEntity = null;
		_preferences = null;
	};
	Ti.App.addEventListener('getPrefs', _self.funGetPreferences);

	/** @title: showShortcutTab (Function)
	 *  @parameters: mode (scrollable or not) and start index
	 *  @usage: create view with buttons
	 *  @extras: assign events */
	function showShortcutTab(index) {
		var _optArray = new Array();
		var _start = 0;
		var _len = 0;
		if(_self.platform.tabs.length < 7){
			for(var n in _self.platform.tabs){
				_optArray.push(_self.platform.tabs[n].name);
			}
		}
		else{
			if(index === null){
				_start = 0;
				_len = 7;
				for(var i = 0; i < 7; i++){
					_optArray.push(_self.platform.tabs[i].name);
				}
				_optArray.push('...');
			}
			else{
				_start = index;
				_len = (_start + _len <= _self.platform.tabs.length) ? 6 : _self.platform.tabs.length - _start;
				_optArray.push('...');
				for(var i = _start; i < _start + _len; i++){
					if(_self.platform.tabs[i]) _optArray.push(_self.platform.tabs[i].name);
				}
				if(_start + _len < _self.platform.tabs.length) _optArray.push('...');
			}
		}
		_optArray.push(L('alert_button_deleteTab'));
		var _optionDialogTab = Ti.UI.createOptionDialog({
			title: 'Go to the tab',
			options: _optArray,
		});
		_self.funClickDialog = function funClickDialog(e){
			_optionDialogTab.removeEventListener('click', _self.funClickDialog);
			e.cancelBubble = true;
			if(e.source.options[e.index] === L('alert_button_deleteTab')){
				var _workid;
				var _conObject = require('/connections/appConnection');
				var _conA = _conObject.deleteWorkspaceTab(_self.platform.id, _scrollView.getCurrentPage(), function(values) {
					if (values == "Error") {
						var _stringSearch;
						if (Ti.Network.online) _stringSearch = (_isApple) ? "error_connection_login_ios" : "error_connection_login_android";
						else _stringSearch = "error_connection_inet";
						var _alertError = Ti.UI.createAlertDialog({
							title: "Wirecloud",
							message: L(_stringSearch),
							buttonNames: [L("alert_button_accept")],
						});
						_alertError.show();
						_stringSearch = null;
						_alertError = null;
					}
					else _self.clearObjectTab();
				});
			}
			else{
				switch(e.index) {
					case 0:
						if(e.source.options[0] === '...'){
							if(_start - _len < 7) showShortcutTab(null);
							else showShortcutTab(_start - _len);
						}
						else _scrollView.scrollToView(0);
						break;
					case 1:
					case 2:
					case 3:
					case 4:
					case 5:
					case 6:
						_scrollView.scrollToView(e.index);
						break;
					case 7:
						if(e.source.options[7] === '...'){
							showShortcutTab(_start + _len);
						}
						break;
					default:
						break;
				}
			}
			_optionDialogTab.hide();
			_optionDialogTab = null;
		};
		_optionDialogTab.addEventListener('click', _self.funClickDialog);
		_optionDialogTab.show();
		_optArray = null;
		_start = null;
		_len = null;
	};

	/** @title: clearObjectTab (Function)
	 *  @usage: destroy all variables of Tab
	 *  @extras: memory management (null) */
	_self.clearObjectTab = function clearObjectTab(positionView){
		for (var i in _self.platform._widgetsViewById){
			_widgetsViewById[i] = null;
		}
		_widgetsViewById = null;
		for (var i in _operatorsViewById){
			_operatorsViewById[i].clearObject();
			_self.remove(_operatorsViewById[i]);
			_operatorsViewById[i] = null;
		}
		_operatorsViewById = null;
		var i = 0;
		while(_scrollView.views.length > 0){
			var _childrenView = _scrollView.views[0].children;
			for (var j in _childrenView){
				if(_childrenView[j].flag === true) {
					_childrenView[j].clearObject();
				}
				_scrollView.views[0].remove(_childrenView[j]);
				_childrenView[j] = null;
			}
			_childrenView = null;
			j = null;
			_scrollView.removeView(_scrollView.views[0]);
		}
	};

	/** @title: clearObject (Function)
	 *  @usage: destroy all variables of WorkspaceManager
	 *  @extras: memory management (null) */
	_self.clearObject = function clearObject(){
		for (var i in _widgetsViewById){
			_widgetsViewById[i] = null;
		}
		_widgetsViewById = null;
		for (var i in _operatorsViewById){
			_operatorsViewById[i].clearObject();
			_self.remove(_operatorsViewById[i]);
			_operatorsViewById[i] = null;
		}
		_operatorsViewById = null;
		var i = 0;
		while(_scrollView.views.length > 0){
			var _childrenView = _scrollView.views[0].children;
			for (var j in _childrenView){
				if(_childrenView[j].flag === true) {
					_childrenView[j].clearObject();
				}
				_scrollView.views[0].remove(_childrenView[j]);
				_childrenView[j] = null;
			}
			_childrenView = null;
			j = null;
			_scrollView.removeView(_scrollView.views[0]);
		}
		_scrollView.removeEventListener('scrollend', _self.funEndScrollView);
		_self.remove(_scrollView);
		_scrollView = null;
		delete _self['tabFunction'];
		delete _self['platform'];
		delete _self['columnRatio'];
		delete _self['rowRatio'];
		delete _self['funEndScrollView'];
		Ti.App.removeEventListener('pushEvent', _self.funPushEvent);
		delete _self['funPushEvent'];
		Ti.App.removeEventListener('makeRequest', _self.funMakeRequest);
		delete _self['funGetPreferences'];
		Ti.App.removeEventListener('getPrefs', _self.funGetPreferences);
		if (_self['funClickDialog']) delete _self['funClickDialog'];
		_isApple = null;
		_platformObject = null;
		_currentPage = null;
	};

	// TODO REMOVE AFTER DEMO
	Ti.App.addEventListener('goToRestaurant', function(){
		_scrollView.scrollToView(1);
	});

	return _self;

}

module.exports = workspaceManager;
