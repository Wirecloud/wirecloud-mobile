/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.2.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 */

function mainView(data) {

	var _isApple = (Ti.Platform.osname == 'ipad');
	var _isIOS7 = (_isApple && Ti.Platform.version.split('.')[0] === '7') ? true : false;
	var _dataWirecloud = data;
	var _actualWorkspace = JSON.parse(_dataWirecloud).name;
	var _actualTab = JSON.parse(_dataWirecloud).tabs[0].name;
	var _actualMode = "workspace";
	var _contentView = null;
	var _contentViewDisabled = null;
	var _sliderView = null;
	var _marketOptions = null;

	// Visualization Self
	var _heightSelf;
	if (_isApple && _isIOS7) _heightSelf = Ti.Platform.displayCaps.platformHeight;
	else if (_isApple && !_isIOS7) _heightSelf = Ti.Platform.displayCaps.platformHeight - 20;
	else _heightSelf = Ti.Platform.displayCaps.platformHeight;
	var _self = Ti.UI.createView({
		top : (_isApple && !_isIOS7) || !_isApple ? 10 : 0,
		left : 0,
		height : _heightSelf,
		width : Ti.Platform.displayCaps.platformWidth,
		fontAw : require('ui/fonts/FontAwesome')()
	});
	_heightSelf = null;

	// Visualization Top Bar
	var _menuBar = Ti.UI.createView({
		left : 0,
		top : 0,
		width : _self.width,
		height : 50,
		backgroundColor : "#DCE5EB",
		layout : 'horizontal'
	});

	// MenuBar (Actual Workspace)
	_menuBar.add(Ti.UI.createLabel({
		left : 0,
		top : 0,
		height : _menuBar.height,
		font : {
			fontSize : (_isApple) ? 20 : '18sp',
			fontFamily : 'Comfortaa'
		},
		text: '  / ' + _actualWorkspace,
		textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
		color : "#35576E"
	}));

	// MenuBar (Actual Tab)
	var _menuBarLabelTab = Ti.UI.createLabel({
		left : 0,
		top : 0,
		height : _menuBar.height,
		font : {
			fontSize : (_isApple) ? 20 : '18sp',
			fontFamily : 'Comfortaa'
		},
		textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
		color : "#49677C"
	});
	_menuBar.add(_menuBarLabelTab);
	_self.add(_menuBar);

	// Navigation Bar iOS 7
	if (_isApple && _isIOS7) {
		_menuBar.setTop(20);
		_self.add(Ti.UI.createView({
			top : 0,
			left : 0,
			width : _self.width,
			height : 20,
			backgroundColor : _menuBar.backgroundColor
		}));
	}

	// Separator Line between Header and View
	_self.add(Ti.UI.createView({
		left : 0,
		top : _menuBar.top + _menuBar.height,
		width : _self.width,
		height : 1,
		backgroundColor : "#83A3B8"
	}));

	// Call Function loadWorkspace
	loadWorkspace();

	/** @title: loadWorkspace (Function)
	 *  @usage: add Widgets and operators to ScrollView
	 *  @extras: require workspaceManager */
	function loadWorkspace() {
		_marketOptions = null;
		var _heightV = (_isApple && _isIOS7) ? _self.height - _menuBar.height - 20 : _self.height - _menuBar.height;
		var _worksClass = require('ui/mainView/workspaceManager');
		var _worksObject = _worksClass({
			tabView : _menuBarLabelTab,
			heightView : _heightV,
			data : _dataWirecloud,
		});
		_worksClass = null;
		_heightV = null;
		changeLayout("workspace", _worksObject);
	};

	/** @title: loadMarketplace (Function)
	 *  @usage: add Mashups to ScrollView (local marketplace)
	 *  @extras: require marketManager */
	function loadMarketplace() {

		_marketOptions = {
			searched : false,
			orderMode : "-popularity",
			searchText : null
		};

		var _searchView = null;
		var _menuBarSearchButton = null;
		var _menuBarSortButton = null;
		var _searchViewTField = null;

		createMarketPlaceView();
		createSortButton();
		createSearchButton();

		// Back Button MarketPlace
		_sliderOverButton.removeEventListener('click', _self.funShowSlider);
		_sliderOverButton.setText(_self.fontAw.getCharCode("icon-reply"));
		_self.funUnloadMarket = function funUnloadMarket(){
			unLoadMarketplace();
			loadWorkspace();
		};
		_sliderOverButton.addEventListener('click', _self.funUnloadMarket);

		/** @title: createMarketPlaceView (Function)
		 *  @usage: create instance marketManager */
		function createMarketPlaceView(){
			var _marketClass = require('ui/mainView/marketManager');
			var _marketView = _marketClass({
				heightView : _self.height,
				csrftoken : _dataSession.csrftoken,
				sessionid : _dataSession.sessionid,
				orderby : _marketOptions.orderMode,
				search : _marketOptions.searchText
			});
			_marketClass = null;
			changeLayout("marketplace", _marketView);
		};

		/** @title: createCancelSearchButton (Function)
		 *  @usage: create Button and events */
		function createCancelSearchButton() {
			_menuBarSearchButton.removeEventListener('click', _self.funShowsearchMarket);
			_menuBarSearchButton.setText(_self.fontAw.getCharCode("icon-remove"));
			_self.funCancelsearchMarket = function funCancelsearchMarket(){
				 _marketOptions = {
				 	orderMode : "-popularity",
				 	searchText : null,
				 	searched : false
				 };
				 if (_searchView != null) {
				 	 var _textSearched = _searchViewTField.value;
				 	 _searchViewTField.removeEventListener('return', _self.funReturnsearchMarket);
					 _searchView.remove(_searchViewTField);
					 _searchViewTField = null;
					 _self.remove(_searchView);
					 _searchView = null;
					 if(_textSearched !== '') createMarketPlaceView();
				 	 createSortButton();
				 	_textSearched = null;
				 }
				 else createMarketPlaceView();
				 _menuBarSearchButton.removeEventListener('click', _self.funCancelsearchMarket);
				 _menuBarSearchButton.setText(_self.fontAw.getCharCode("icon-search"));
				 _menuBarSearchButton.addEventListener('click', _self.funShowsearchMarket);
			};
			_menuBarSearchButton.addEventListener('click', _self.funCancelsearchMarket);
		};

		/** @title: createSortButton (Function)
		 *  @usage: create Button and events */
		function createSearchButton(){
			_menuBarSearchButton = createMenuBarButton("right", 0, "icon-search");
			_self.funShowsearchMarket = function funShowsearchMarket(){
				_self.remove(_menuBarSortButton);
				_menuBarSortButton = null;
				createCancelSearchButton();
				createSearchView();
			};
			_menuBarSearchButton.addEventListener('click', _self.funShowsearchMarket);
			_self.add(_menuBarSearchButton);
		};

		/** @title: createSortButton (Function)
		 *  @usage: create Button and events */
		function createSortButton() {
			_menuBarSortButton = createMenuBarButton("right", 51, "icon-sort-by-attributes");
			_self.funShowsortMarket = function funShowsortMarket(){
				var _sortView = Ti.UI.createOptionDialog({
					options : [L("alert_button_popularity"), L("alert_button_creation"),
					           L("alert_button_name"), L("alert_button_vendor"), L("alert_button_author"),
					           L("alert_button_cancel")],
					title : L("alert_label_ordermarket"),
				});
				_self.funClickSortMarket = function funClickSortMarket(e){
					e.cancelBubble = true;
					switch(e.index) {
						case 0:
							_marketOptions.orderMode = "-popularity";
							break;
						case 1:
							_marketOptions.orderMode = "-creation_date";
							break;
						case 2:
							_marketOptions.orderMode = "short_name";
							break;
						case 3:
							_marketOptions.orderMode = "vendor";
							break;
						case 4:
							_marketOptions.orderMode = "author";
							break;
						default:
							break;
					}
					if(e.index >= 0 && e.index < 5) createMarketPlaceView();
					_sortView.removeEventListener('click', _self.funClickSortMarket);
					_sortView.hide();
					_sortView = null;
				};
				_sortView.addEventListener('click', _self.funClickSortMarket);
				_sortView.show();
			};
			_menuBarSortButton.addEventListener('click', _self.funShowsortMarket);
			_self.add(_menuBarSortButton);
		};

		/** @title: createSearchView (Function)
		 *  @usage: create Search View and TextField */
		function createSearchView() {
			_searchView = Ti.UI.createView({
				right : 62,
				width : parseInt(_menuBar.width / 3, 10),
				height : _menuBar.height,
				top : _menuBar.top,
				backgroundColor : "#DCE5EB",
			});
			_searchViewTField = Ti.UI.createTextField({
				top : 10,
				left : 0,
				height : 30,
				width : _searchView.width,
				font : {
					fontSize : (_isApple) ? 20 : '18sp',
					fontFamily : 'Comfortaa'
				},
				color : "#0D5861",
				paddingLeft : 5,
				returnKeyType : Ti.UI.RETURNKEY_SEARCH,
				borderColor : "#83A3B8",
				borderWidth : 1,
				borderRadius : 15,
				borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
				softKeyboardOnFocus : (_isApple) ? null : Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS,
				hintText : L('label_search_marketplace'),
				textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			});
			_searchViewTField.focus();
			_self.funReturnsearchMarket = function funReturnsearchMarket(){
				_searchViewTField.removeEventListener('return', _self.funReturnsearchMarket);
				_marketOptions = {
				 	searched : true,
				 	orderMode : "-popularity",
				 	searchText : _searchViewTField.value
				 };
				 _searchViewTField.removeEventListener('return', _self.funReturnsearchMarket);
				 _searchView.remove(_searchViewTField);
				 _searchViewTField = null;
				 _self.remove(_searchView);
				 _searchView = null;
				 createSortButton();
				 createMarketPlaceView();
			};
			_searchViewTField.addEventListener('return', _self.funReturnsearchMarket);
			_searchView.add(_searchViewTField);
			_self.add(_searchView);
		};

		/** @title: unLoadMarketplace (Function)
		 *  @usage: remove MarketPlace, variables and events
	 	 *  @extras: memory management */
		function unLoadMarketplace() {
			if (_menuBarSearchButton != null) {
				if(_marketOptions.searched == false) _menuBarSearchButton.removeEventListener('click', _self.funShowsearchMarket);
				else _menuBarSearchButton.removeEventListener('click', _self.funCancelsearchMarket);
				_menuBarSearchButton.clearObject();
				_self.remove(_menuBarSearchButton);
				_menuBarSearchButton = null;
			}
			if (_menuBarSortButton != null) {
				_menuBarSortButton.removeEventListener('click', _self.funShowsortMarket);
				_menuBarSortButton.clearObject();
				_self.remove(_menuBarSortButton);
				_menuBarSortButton = null;
			}
			if (_searchView != null) {
				_searchViewTField.removeEventListener('return', _self.funReturnsearchMarket);
				_searchView.remove(_searchViewTField);
				_searchViewTField = null;
				_self.remove(_searchView);
				_searchView = null;
			}
			_marketOptions = null;
			_sliderOverButton.removeEventListener('click', _self.funUnloadMarket);
			_sliderOverButton.setText(_self.fontAw.getCharCode("icon-reorder"));
			_sliderOverButton.addEventListener('click', _self.funShowSlider);
		}

	};

	/** @title: changeLayout (Function)
	 *  @parameters: layout (Control Parameter) , content (View -> contentView)
	 *  @usage: clean and destroy ContentView and change _menuBar
	 *  @extras: change _actualMode */
	function changeLayout(layout, content) {
		if (layout == "workspace") {
			_menuBarLabelTab.text = ' / ' + _actualTab;
			if(_actualMode === 'marketplace'){
				delete _self['funShowsearchMarket'];
				delete _self['funUnloadMarket'];
				delete _self['funShowsortMarket'];
			}
			_self.funShowTab = function funShowTab(){
				_contentView.tabFunction(null);
			};
			_menuBarLabelTab.addEventListener('click',_self.funShowTab);
		}
		else {
			_menuBarLabelTab.text = "";
			_menuBarLabelTab.removeEventListener('click',_self.funShowTab);
			delete _self['funShowTab'];
		}
		if(_contentView !== null){
			_contentView.clearObject();
			_self.remove(_contentView);
			_contentView = null;
		}
		_contentView = content;
		_contentView.setTop(_menuBar.top + _menuBar.height);
		_self.add(_contentView);
		_actualMode = layout;
	};

	/** @title: createMenuBarButton (Function)
	 *  @parameters: typePos (CSS Position), pos (Position Value), icon (FontAwesome name)
	 *  @usage: create button with style
	 *  @extras: assign common events (touchstart & touchend) */
	function createMenuBarButton(typePos, pos, icon) {
		var _button = Ti.UI.createLabel({
			top : _menuBar.top,
			height : 50,
			width : 50,
			backgroundColor : "#DCE5EB",
			font : {
				fontSize : (Ti.Platform.osname == 'ipad') ? 26 : '28sp',
				fontFamily : _self.fontAw.getFontFamily()
			},
			text : _self.fontAw.getCharCode(icon),
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			color : "#35576E"
		});
		if (typePos == 'right') _button.setRight(pos);
		else _button.setLeft(pos);
		_button.funTouchStart = function funTouchStart(){
			_button.color = "#9BACB7";
		};
		_button.addEventListener('touchstart', _button.funTouchStart);
		_button.funTouchEnd = function funTouchEnd(){
			_button.color = "#35576E";
		};
		_button.addEventListener('touchend', _button.funTouchEnd);
		_button.clearObject = function clearObject(){
			_button.removeEventListener('touchstart', _button.funTouchStart);
			_button.removeEventListener('touchend', _button.funTouchEnd);
		};
		return _button;
	};

	return _self;

}

module.exports = mainView;
