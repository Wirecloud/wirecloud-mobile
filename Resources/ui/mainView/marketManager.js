
//MarketPlace ScrollView Component Constructor
function marketManager(dataConstructor) {

	var _isApple = (Ti.Platform.osname == 'ipad');
	var _dataSession = dataConstructor;
	var _currentPage = 0;
	var _mashupDimensions;
	var _circlePageView;
	var _scrollView;
	
	// Visualization _self
	var _self = Ti.UI.createView({
		top : 51,
		left : 0,
		height : _dataSession.heightView - 51,
		width : Ti.Platform.displayCaps.platformWidth,
		error: false,
		fontAw : require('ui/fonts/FontAwesome')()
	});

	var _conObject = require('/connections/appConnection');
	var _conA = _conObject.getWidgetsMarket(_dataSession.csrftoken, _dataSession.sessionid, {
			orderby : _dataSession.orderby, search_criteria : _dataSession.search
		}, 
		function(values) {
			if (values === 'Error'){
				_self.error = true;
			}
			_circlePageView = Ti.UI.createLabel({
				bottom : 30,
				width : _self.width,
				height : 30,
				left : 0,
				color : "#147A87",
				font : {
					fontSize : (_isApple) ? 20 : '18sp',
					fontFamily : _self.fontAw.getFontFamily()
				},
				touchEnabled : false,
				text : "  " + _self.fontAw.getCharCode("icon-circle"),
				textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
				verticalAlign : Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER
			});
			_self.add(_circlePageView);
			_scrollView = Ti.UI.createScrollableView({
				top : 0,
				left : 0,
				height : _self.height - 30,
				width : _self.width
			});
			_self.funEndScrollView = function funEndScrollView(e){
				if (_currentPage != e.currentPage) {
					_circlePageView.text = "";
					for (var i = 0; i < _scrollView.views.length; i++) {
						if (i == e.currentPage)
							_circlePageView.text = _circlePageView.text + "  " + _self.fontAw.getCharCode("icon-circle");
						else
							_circlePageView.text = _circlePageView.text + "  " + _self.fontAw.getCharCode("icon-circle-blank");
					}
					_currentPage = e.currentPage;
				}
			};
			_scrollView.addEventListener('scrollend', _self.funEndScrollView);
			_mashupDimensions = {
				topBottom : parseInt((_scrollView.height - 30) * 0.05, 10),
				leftRight : parseInt(_scrollView.width * 0.02, 10),
				height : parseInt(((_scrollView.height - 30) - ((parseInt((_scrollView.height - 30) * 0.05)) * 3)) / 2, 10),
				width : parseInt((_scrollView.width - ((parseInt(_scrollView.width * 0.02)) * 4)) / 3, 10)
			};
			if (_self.error === true)
				_scrollView.setViews(createViewError({
					height : _scrollView.height,
					width : _scrollView.width
				}, "market"));
			else
				_scrollView.setViews(createGlobalView(values, {
					height : _scrollView.height,
					width : _scrollView.width
				}));
			_self.add(_scrollView);
	});
	_conA = null;
	_conObject = null;

	/** @title: createGlobalView (Function)
	 *  @parameters: data (JSON Wirecloud) , dim (_scrollView dimensions)
	 *  @usage: create view for ScrollableView
	 *  @extras: performance */
	function createGlobalView(data, dim){
		var _nMashups = parseInt(JSON.parse(data).items, 10);
		var _nViews = (_nMashups % 6 == 0) ? _nMashups / 6 : parseInt(_nMashups / 6, 10) + 1;
		var _aViews = new Array();
		var _mashupIntroduced = 0;
		if(_nViews == 0) {
			_self.error = true;
			_aViews.push(createViewError(dim, "Mashup"));
		}
		else{
			_self.error = false;
			for (var i = 0; i < _nViews; i++) {
				var _view = Ti.UI.createView({
					height : dim.height,
					width : dim.width,
					top : 0,
					left : 0,
				});
				for (var j = 0; j < 6; j++) {
					var _mashupData = (JSON.parse(data).resources[_mashupIntroduced + j] == null) ? null : JSON.parse(data).resources[_mashupIntroduced + j];
					_view.add(createMashupView(j % 6, _mashupData));
					_mashupData = null;
				}
				j = null;
				_mashupIntroduced = _mashupIntroduced + 6;
				_aViews.push(_view);
				if (i >= 1) _circlePageView.text = _circlePageView.text + "  " + _self.fontAw.getCharCode("icon-circle-blank");
				_view = null;
			}
			i = null;
		}
		return _aViews;
	};
	
	/** @title: createViewError (Function)
	 *  @parameters: dimensions
	 *  @usage: create view for a GlobalView with error message */
	function createViewError(dimensions, mode){
		var _text;
		if(mode === "market"){
			if (Ti.Network.online)
				_text = (_isApple) ? "error_connection_getMarketplace_ios" : "error_connection_getMarketplace_android";
			else
				_text = "error_connection_inet";
		}
		else _text = (_dataSession.search) ? L("error_market_filter") : L("error_market_empty");
		return Ti.UI.createLabel({
			top: 0,
			left: 0,
			width: dimensions.width,
			height: dimensions.height,
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
			touchEnabled : false,
			font : {
				fontSize : (_isApple) ? 20 : '18sp',
				fontFamily : 'Comfortaa'
			},
			color : "#0D5861",
			text: _text
		});
	}
	
	/** @title: createMashupView (Function) 
	 *  @parameters: numberView [0 .. 5] , data (values View)
	 *  @usage: create view for a GlobalView
	 *  @extras: add events to Mashup View */
	function createMashupView(numberView, data) {
		var _viewMashup = Ti.UI.createView({
			borderRadius : 15,
			borderWidth : 1,
			borderColor : "#1BA7BA",
			width : _mashupDimensions.width,
			height : _mashupDimensions.height,
			flag : false
		});
		switch(numberView) {
			case 0:
				_viewMashup.setLeft(_mashupDimensions.leftRight);
				_viewMashup.setTop(_mashupDimensions.topBottom);
				break;
			case 1:
				_viewMashup.setLeft(_mashupDimensions.leftRight * 2 + _viewMashup.width);
				_viewMashup.setTop(_mashupDimensions.topBottom);
				break;
			case 2:
				_viewMashup.setRight(_mashupDimensions.leftRight);
				_viewMashup.setTop(_mashupDimensions.topBottom);
				break;
			case 3:
				_viewMashup.setLeft(_mashupDimensions.leftRight);
				_viewMashup.setBottom(_mashupDimensions.topBottom + 30);
				break;
			case 4:
				_viewMashup.setLeft(_mashupDimensions.leftRight * 2 + _viewMashup.width);
				_viewMashup.setBottom(_mashupDimensions.topBottom + 30);
				break;
			case 5:
				_viewMashup.setRight(_mashupDimensions.leftRight);
				_viewMashup.setBottom(_mashupDimensions.topBottom + 30);
				break;
		}
		if (data !== null) {
			
			_viewMashup.flag = true;
			
			// Name Label
			_viewMashup.add(Ti.UI.createLabel({
				top : _viewMashup.height * 0.08,
				left : _viewMashup.width * 0.05,
				height : 30,
				width : _viewMashup.width - (_viewMashup.width * 0.1),
				text : data.name,
				textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
				verticalAlign : Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
				touchEnabled : false,
				font : {
					fontSize : (_isApple) ? 20 : '18sp',
					fontFamily : 'Comfortaa'
				},
				color : "#0D5861",
			}));
			
			// Icon View
			_viewMashup.add(Ti.UI.createView({
				top : 30 + (_viewMashup.height * 0.16),
				left : _viewMashup.width * 0.05,
				width : _viewMashup.width * 0.3,
				height : _viewMashup.width * 0.3,
				borderColor : "#116873",
				borderRadius : 10,
				borderWidth : 1,
			}));
			
			// Vendor Label
			var _vendorText = L("label_vendor_marketplace");
			var _len = 21 - (_vendorText.length + 2);
			_vendorText = (data.vendor.length > _len) ? _vendorText + ": " + data.vendor.substr(0, _len) + "..." : _vendorText + ": " + data.vendor;
			_viewMashup.add(Ti.UI.createLabel({
				top : (30 + (_viewMashup.height * 0.16)) + (_viewMashup.width * 0.03),
				left : (_viewMashup.width * 0.3) + (_viewMashup.width * 0.1),
				height : _viewMashup.width * 0.1,
				width : _viewMashup.width - ((_viewMashup.width * 0.3) + (_viewMashup.width * 0.1)),
				text : _vendorText,
				textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
				verticalAlign : Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
				touchEnabled : false,
				horizontalWrap : true,
				font : {
					fontSize : (_isApple) ? 18 : '15sp',
					fontFamily : 'Comfortaa'
				},
				color : "#116873",
			}));
			_vendorText = null;
			_len = null;
			
			// Version Label
			_viewMashup.add(Ti.UI.createLabel({
				top : (_viewMashup.width * 0.1) + ((30 + (_viewMashup.height * 0.16)) + (_viewMashup.width * 0.03)) + (_viewMashup.width * 0.03),
				left : (_viewMashup.width * 0.3) + (_viewMashup.width * 0.1),
				height : _viewMashup.width * 0.1,
				width : _viewMashup.width - ((_viewMashup.width * 0.3) + (_viewMashup.width * 0.1)),
				text : L("label_version_marketplace") + ": " + data.versions[0].version,
				textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
				verticalAlign : Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
				touchEnabled : false,
				font : {
					fontSize : (_isApple) ? 18 : '15sp',
					fontFamily : 'Comfortaa'
				},
				color : "#116873",
			}));
			
			// Email Label
			var _emailText = (data.versions[0].mail.length > 22) ? "Email: " + data.versions[0].mail.substr(0, 22) + "..." : "Email: " + data.versions[0].mail;
			_viewMashup.add(Ti.UI.createLabel({
				top : (30 + (_viewMashup.height * 0.16)) + (_viewMashup.width * 0.3) + (_viewMashup.height * 0.08),
				left : _viewMashup.width * 0.05,
				width : (_viewMashup.width - (_viewMashup.width * 0.1)) - (_viewMashup.width * 0.1),
				text : _emailText,
				textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
				verticalAlign : Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
				touchEnabled : false,
				font : {
					fontSize : (_isApple) ? 18 : '15sp',
					fontFamily : 'Comfortaa'
				},
				color : "#116873",
			}));
			_emailText = null;
			
			// Show Alert when click Mashup View
			_viewMashup.funClickView = function funClickView(e){
				e.cancelBubble = true;
				var _alertMashup = Ti.UI.createAlertDialog({
					title : data.name,
					message : L("alert_label_description")+": " + data.versions[0].description,
					cancel : 0,
					buttonNames : [L("alert_button_cancel"), L("alert_button_addMashup")]
				});
				_alertMashup.clickAlert = function clickAlert(e){
					e.cancelBubble = true;
					if (e.cancel === e.index || e.cancel === true) return;
					var _conObject = require('/connections/appConnection');
					var _conA = _conObject.putWorkspaceMashup(_dataSession.csrftoken, _dataSession.sessionid, data, function(values) {
						var _stringSearch;
						if (values == "Error") {
							if (Ti.Network.online)
								_stringSearch = (_isApple) ? "error_connection_getMashup_ios" : "error_connection_getMashup_android";
							else
								_stringSearch = "error_connection_inet";
						}
						else _stringSearch = "label_market_getMashup";
						var _alertNewMashup = Ti.UI.createAlertDialog({
							title : "Marketplace",
							message : L(_stringSearch),
							buttonNames : [L("alert_button_accept")],
						});
						_alertNewMashup.show();
					});
					_conA = null;
					_conObject = null;
					_alertMashup.removeEventListener('click',_alertMashup.clickAlert);
					_alertMashup.hide();
					_alertMashup = null;
				};
				_alertMashup.addEventListener('click', _alertMashup.clickAlert);
				_alertMashup.show();
			};
			_viewMashup.addEventListener('click', _viewMashup.funClickView);
			_viewMashup.clearObject = function clearObject(){
				_viewMashup.removeEventListener('click', _viewMashup.funClickView);
			};
		}
		return _viewMashup;
	};
	
	/** @title: clearObject (Function)
	 *  @usage: destroy variables and eventListener */
	_self.clearObject = function clearObject(){
		var _scrollViews = _scrollView.views;
		for (var i in _scrollViews){
			var _childrenView = _scrollView.views[i].children;
			for (var j in _childrenView){
				if(_childrenView[j].flag === true) _childrenView[j].clearObject();
				_scrollView.views[i].remove(_childrenView[j]);
			}
			_childrenView = null;
			j = null;
			_scrollView.removeView(_scrollViews[i]);
		}
		_scrollViews = null;
		i = null;
		_scrollView.removeEventListener('scrollend', _self.funEndScrollView);
		_self.remove(_scrollView);
		_scrollView = null;
		_self.remove(_circlePageView);
		_circlePageView = null;
		_isApple = null;
		_mashupDimensions = null;
		_currentPage = null;
		_dataSession = null;
		delete _self['funEndScrollView'];
		delete _self['fontAw'];
	};
	
	return _self;
	
}

module.exports = marketManager;
