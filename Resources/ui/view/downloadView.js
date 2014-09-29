//downloadsPlatform Window Component Constructor

function downloadView(h, listWidgets, listOperators, workspaceName, userName, operatorsIdsByName) {

	var _isApple = Yaast.API.HW.System.isApple();
	var _self = Ti.UI.createView({
		top : 0,
		left : 0,
		height : h,
		width : Yaast.API.UI.getPlatformWidth(),
		fontAw : Yaast.FontAwesome
	});

	var _widgetsToDownload = listWidgets;
	var _operatorsToDownload = listOperators;
    var _description;
    var _downloadIcon;
    var _removeIcon;
    var _checkURLIcon;
    var _downWidgetsIcon;
    var _buildWidgetsIcon;
    var _footer;

	/** @title: createDescriptionLabel (Function)
	 *  @param: height and text
	 *  @usage: create Label for Description View */
	function createDescriptionLabel(h, textString) {
		return Ti.UI.createLabel({
			top : 0,
			left : 0,
			width : _self.width,
			height : h,
			touchEnabled : false,
			font : {
				fontSize : (_isApple) ? 20 : '20dp',
				fontFamily : 'Comfortaa'
			},
			color : "#FFFFFF",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			verticalAlign : Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
			text : textString
		});
	};

	/** @title: createRowLabel (Function)
	 *  @param: top and text
	 *  @usage: create Row Label with state */
	function createRowLabel(t, textString) {
		return Ti.UI.createLabel({
			top : t,
			left : parseInt(_self.width / 6, 10),
			width : 650,
			height : 50,
			touchEnabled : false,
			font : {
				fontSize : (_isApple) ? 20 : '20dp',
				fontFamily : 'Comfortaa'
			},
			color : "#FFFFFF",
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			verticalAlign : Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
			text : textString
		});
	};

	/** @title: createOkIcon (Function)
	 *  @param: top, left, width of layout
	 *  @usage: create Label with Ok FontAwesome Icon */
	function createOkIcon(t, l, w) {
		return Ti.UI.createLabel({
			top : t,
			left : l + w,
			width : 50,
			height : 50,
			touchEnabled : false,
			font : {
				fontSize : (_isApple) ? 25 : '20dp',
				fontFamily : _self.fontAw.getFontFamily()
			},
			color : "#68FF42",
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			verticalAlign : Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
			text : _self.fontAw.getCharCode("icon-ok")
		});
	};

	/** @title: createBigIcon (Function)
	 *  @usage: create Label with Icon and subLabel */
	function createBigIcon(icon, textString, left) {
		var _view = Ti.UI.createView({
			top : _description.top + _description.height,
			width : parseInt(_self.width / 2, 10) - parseInt(_self.width / 5, 10),
			height : 200
		});
		if (left === true)
			_view.setLeft(parseInt(_self.width / 5, 10));
		else
			_view.setRight(parseInt(_self.width / 5, 10));
		_view.add(Ti.UI.createLabel({
			top : 0,
			left : 0,
			width : _view.width,
			height : 150,
			touchEnabled : false,
			font : {
				fontSize : (_isApple) ? 200 : '20dp',
				fontFamily : _self.fontAw.getFontFamily()
			},
			color : "#FFFFFF",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			verticalAlign : Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
			text : _self.fontAw.getCharCode(icon)
		}));
		_view.add(Ti.UI.createLabel({
			top : 150,
			left : 0,
			width : _view.width,
			height : 50,
			touchEnabled : false,
			font : {
				fontSize : (_isApple) ? 20 : '20dp',
				fontFamily : 'Comfortaa'
			},
			color : "#FFFFFF",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			verticalAlign : Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
			text : textString
		}));
		return _view;
	};

    /** @title: createHTMLOperators (Function)
     *  @parameters: list of operators and files js
     *  @usage: create HTML view */
    function createHTMLOperators(operators){
        for(var i in operators){
            var _fileMashupPlatform = Ti.Filesystem.getFile(Ti.Filesystem.getApplicationDataDirectory(), userName + '/operators/' + i + '/wiringPlatform.js');
            var _textMashupOriginal = Ti.Filesystem.getFile(Ti.Filesystem.getResourcesDirectory(), 'workspace/wiring/wiringPlatformJS.lib').read().toString();
            var _fileBridge = Ti.Filesystem.getFile(Ti.Filesystem.getApplicationDataDirectory(), userName + '/operators/'+i+'/APIBridge.js');
            var _textBridgeOriginal = Ti.Filesystem.getFile(Ti.Filesystem.getResourcesDirectory(), 'workspace/APIBridge/APIBridgeJS.lib').read().toString();

            // Set Android/iOS var in the bridge. appleOS
            var res = _textBridgeOriginal.split("// ChangeMeYaaST!! appleOS bool");
            _textBridgeOriginal = res[0] + "var appleOS = " + _isApple + ";" + res[1];
            Ti.API.info("++++++ Adding in Bridge: (operator) --> var appleOS = " + _isApple + ";");
			res = null;

			var operatorId = operatorsIdsByName[i];
            // Set id var in the bridge.
            var res2 = _textBridgeOriginal.split("// ChangeMeYaaST!! MagicID");
            _textBridgeOriginal = res2[0] + "var id = " + operatorId + ";" + res2[1];
            Ti.API.info("+++++++ Adding in Bridge: (operator) --> var id = " + operatorId + ";");
            res2 = null;

            _fileMashupPlatform.write(_textMashupOriginal, false);
            _fileBridge.write(_textBridgeOriginal, false);
            _textMashupOriginal = null;
            _fileMashupPlatform = null;
            _fileBridge = null;
            _fileMashupPlatform = null;
            var _routeHTML = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, userName + '/operators/' + i + '/index.html');
            var _textHTML = '<!DOCTYPE html>\n<html>\n\t<head>\n';
            _textHTML = _textHTML + '\t\t<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">\n';
            _textHTML = _textHTML + '\t\t<script type="text/javascript" src="wiringPlatform.js"></script>\n';
            _textHTML = _textHTML + '\t\t<script type="text/javascript" src="APIBridge.js"></script>\n';
            var _files = JSON.parse(operators[i]);
            for(var j in _files){
                if(_files[j].indexOf('.js') != -1) _textHTML = _textHTML + '\t\t<script type="text/javascript" src="' + _files[j] + '"></script>\n';
            };
            _textHTML = _textHTML + '\t</head>\n\t<body>\n\t</body>\n</html>';
            //Ti.API.info('++++++++OPERATORS html: \n' + _textHTML);
            _routeHTML.write(_textHTML, false);
            _textHTML = null;
            _configOperator = null;
        }
    };

	/** @title: clearObject (Function)
	 *  @usage: destroy all variables of downloadsPlatform
	 *  @extras: memory management (null) */
	_self.clearObject = function clearObject() {
		_widgetsToDownload = null;
		_operatorsToDownload = null;
		_self.remove(_description);
		_description = null;
		_self.remove(_checkURLIcon);
		_checkURLIcon = null;
		_self.remove(_downWidgetsIcon);
		_downWidgetsIcon = null;
		_self.remove(_buildWidgetsIcon);
		_buildWidgetsIcon = null;
		_footer.removeEventListener('click', _self.funShowWorkspace);
		_self.remove(_footer);
		_footer = null;
		delete _self['downloadLaterHandler'];
		delete _self['funShowWorkspace'];
		delete _self['downloadHandler'];
	};

	/** @title: downloadLaterHandler (Function)
	 *  @usage: clean view and show workspace without widgets */
	_self.downloadLaterHandler = function downloadLaterHandler(){
		// Clean View
		_self.remove(_description);
		_downloadIcon.removeEventListener('click', _self.downloadHandler);
		_removeIcon.removeEventListener('click', _self.downloadLaterHandler);
		_self.remove(_downloadIcon);
		_downloadIcon = null;
		_self.remove(_removeIcon);
		_removeIcon = null;

	};

	/** @title: funShowWorkspace (Function)
	 *  @usage: fireEvent showWorkspace (workspaceView.js) */
	_self.funShowWorkspace = function funShowWorkspace(){
		Ti.App.fireEvent('showWorkspace');
	};

	/** @title: downloadHandler (Function)
	 *  @usage: call to download dependencies and verify files */
	_self.downloadHandler = function downloadHandler() {

		// Clean View
		_self.remove(_description);
		_downloadIcon.removeEventListener('click', _self.downloadHandler);
		_removeIcon.removeEventListener('click', _self.downloadLaterHandler);
		_self.remove(_downloadIcon);
		_downloadIcon = null;
		_self.remove(_removeIcon);
		_removeIcon = null;

		// Create Layout
		_description = createDescriptionLabel(200, L('label_downloader_desc_down'));
		_self.add(_description);
		_self.add(createRowLabel(200, L('label_downloader_row_url')));
		_checkURLIcon = createOkIcon(200, parseInt(_self.width / 6, 10), 650);
		_self.add(_checkURLIcon);
		_self.add(createRowLabel(300, L('label_downloader_row_wid')));
		_downWidgetsIcon = createOkIcon(300, parseInt(_self.width / 6, 10), 650);
		_self.add(_downWidgetsIcon);
		_self.add(createRowLabel(400, L('label_downloader_row_wid_build')));
		_buildWidgetsIcon = createOkIcon(400, parseInt(_self.width / 6, 10), 650);
		_self.add(_buildWidgetsIcon);
		_footer = createDescriptionLabel(100, L('label_downloader_row_wait'));
		_footer.setTop(525);
		_self.add(_footer);

		// Check List Resource from Wirecloud Desktop
		var _conObject = require('/connections/appConnection');
		var _conA = _conObject.checkListResource(_widgetsToDownload.concat(_operatorsToDownload), function(checkResult) {
			if (checkResult.value === true) {
				_footer.setText(L('label_downloader_footer_error') + ' ' +checkResult.uri);
				_footer.setColor("#610000");
				_checkURLIcon.setColor("#610000");
			} else {
				_checkURLIcon.setColor("#006100");
				_conA = _conObject.downloadListResource(_widgetsToDownload.concat(_operatorsToDownload), _widgetsToDownload.length,
				    function(downResult) {
					if (downResult.value == true) {
						_footer.setText(L('label_downloader_footer_error_down') + ' ' + downResult.uri);
						_footer.setColor("#610000");
						_downWidgetsIcon.setColor("#610000");
					} else {
						createHTMLOperators(downResult.files);
						_downWidgetsIcon.setColor("#006100");
						_buildWidgetsIcon.setColor("#006100");
						_footer.setText(L('label_downloader_footer_show'));
						_footer.setTouchEnabled(true);
						_footer.addEventListener('click', _self.funShowWorkspace);
					}
				}, userName);
			}
		});

	};

	_description = createDescriptionLabel(350, L('label_downloader_desc_main_fl') + ' ' + workspaceName + L('label_downloader_desc_main_ol'));
	_self.add(_description);

	_downloadIcon = createBigIcon("icon-download-alt", L('label_downloader_down'), true);
	_downloadIcon.addEventListener('click', _self.downloadHandler);
	_self.add(_downloadIcon);

	_removeIcon = createBigIcon("icon-remove", L('label_downloader_later'), false);
	_removeIcon.addEventListener('click', _self.downloadLaterHandler);
	_self.add(_removeIcon);

	return _self;

}

module.exports = downloadView;
