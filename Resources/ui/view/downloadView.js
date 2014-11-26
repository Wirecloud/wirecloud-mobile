//downloadsPlatform Window Component Constructor

function downloadView(h, listWidgets, listOperators, workspaceName, userName, operatorsIdsByName, returnCallback) {

	var IN_PROGRESS_COLOR = "#006100";
	var ERROR_COLOR = "#610000";
	var OK_COLOR = "#68FF42";

	var _mainFolderName = Yaast.Sandbox.mainFolderName;
	var _isApple = Yaast.API.HW.System.isApple();
	var _fontSize = Yaast.API.UI.getDefaultFontSize();
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
	function createDescriptionLabel(h, textString, fontSize) {
		return Ti.UI.createLabel({
			top : 0,
			left : 0,
			width : _self.width,
			height : h,
			touchEnabled : false,
			font : {
				fontSize : fontSize,
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
			color : "#CED2DF",
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
				fontSize : parseInt(_fontSize) * 2.5,
				fontFamily : Yaast.FontAwesome.getFontFamily()
			},
			color : "#FFFFFF",
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			verticalAlign : Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
			text : Yaast.FontAwesome.getCharCode("fa-cloud-download")
		});
	};

	/** @title: createBigIcon (Function)
	 *  @usage: create Label with Icon and subLabel */
	function createBigIcon(icon, textString, left) {
		var iconColor;

		var _view = Ti.UI.createView({
			top : _description.top + _description.height,
			width : parseInt(_self.width / 2, 10) - parseInt(_self.width / 5, 10),
			height : 200
		});
		if (left === true) {
			_view.setLeft(parseInt(_self.width / 5, 10));
			iconColor = "#006100";
		} else {
			_view.setRight(parseInt(_self.width / 5, 10));
			iconColor = "#610000";
		}
		_view.add(Ti.UI.createLabel({
			top : 0,
			left : 0,
			width : _view.width,
			height : 150,
			touchEnabled : false,
			font : {
				fontSize : parseInt(_fontSize) * 4.5,
				fontFamily : Yaast.FontAwesome.getFontFamily()
			},
			color : iconColor,
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			verticalAlign : Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
			text : Yaast.FontAwesome.getCharCode(icon)
		}));
		_view.add(Ti.UI.createLabel({
			top : 120,
			left : 0,
			width : _view.width,
			height : 50,
			touchEnabled : false,
			font : {
				fontSize : _fontSize,
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
            var _fileMashupPlatform = Ti.Filesystem.getFile(Ti.Filesystem.getApplicationDataDirectory(), Yaast.Sandbox.instanceDir + userName + '/operators/' + i + '/wiringPlatform.js');
            var _textMashupOriginal = Ti.Filesystem.getFile(Ti.Filesystem.getResourcesDirectory(), 'workspace/wiring/wiringPlatformJS.lib').read().toString();
            var _fileBridge = Ti.Filesystem.getFile(Ti.Filesystem.getApplicationDataDirectory(), Yaast.Sandbox.instanceDir + userName + '/operators/'+i+'/APIBridge.js');
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
            var _routeHTML = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, Yaast.Sandbox.instanceDir + userName + '/operators/' + i + '/index.html');
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

	/** @title: funShowWorkspace (Function)
	 *  @usage: fireEvent showWorkspace (workspaceView.js) */
	_self.returnMain = function returnMain(){
		_footer.removeEventListener('click', _self.returnMain);
		_footer.hide();
		_self.clearObject();
		returnCallback();
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
		_description = createDescriptionLabel(200, L('label_downloader_desc_down'), _fontSize * 2);
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
		_footer = Ti.UI.createActivityIndicator({
	  		message: 'Downloading Dashboard',
	  		width: "100%",
	  		style:Ti.UI.ActivityIndicatorStyle.BIG_DARK,
	  		color: "#FFFFFF",
	        font : {
	            fontSize : _fontSize * 2,
	            fontFamily : 'Bangla Sangam MN'
	        }
	    });
		_footer.setTop(525);
		_footer.show();
		_self.add(_footer);

		// Query the list of resources used in this mashup to the Wirecloud Server
		_checkURLIcon.setColor(IN_PROGRESS_COLOR);
		var _conObject = require('/connections/appConnection');
		_footer.addEventListener('click', _self.returnMain);
		var _conA = _conObject.checkListResource(_widgetsToDownload.concat(_operatorsToDownload), function(checkResult) {
			if (checkResult.value === true) {
				_footer.setMessage(L('label_downloader_footer_error') + ' (' + checkResult.uri + ')');
				_footer.setColor(ERROR_COLOR);
				_checkURLIcon.setColor(ERROR_COLOR);
			} else {
				_checkURLIcon.setColor(OK_COLOR);
				_checkURLIcon.text = Yaast.FontAwesome.getCharCode("fa-check");
				_downWidgetsIcon.setColor(IN_PROGRESS_COLOR);

				_conA = _conObject.downloadListResource(_widgetsToDownload.concat(_operatorsToDownload), _widgetsToDownload.length,
				    function(downResult) {
					if (downResult.value == true) {
						_footer.setMessage(L('label_downloader_footer_error_down') + ' ' + downResult.uri);
						_footer.setColor(ERROR_COLOR);
						_downWidgetsIcon.setColor(ERROR_COLOR);
						_downWidgetsIcon.text = Yaast.FontAwesome.getCharCode("fa-times-circle");
					} else {
						_footer.removeEventListener('click', _self.returnMain);
						_downWidgetsIcon.setColor(OK_COLOR);
						_downWidgetsIcon.text = Yaast.FontAwesome.getCharCode("fa-check");
						_buildWidgetsIcon.setColor(IN_PROGRESS_COLOR);
						createHTMLOperators(downResult.files);
						_buildWidgetsIcon.setColor(OK_COLOR);
						_buildWidgetsIcon.text = Yaast.FontAwesome.getCharCode("fa-check");
						_footer.setColor(OK_COLOR);
						_footer.hide();
						// Load workspace
						_self.funShowWorkspace();
					}
				}, userName);
			}
		});
	};
	var mess;
	if (Yaast.API.HW.Network.getNetwork() == 'WIFI') {
		mess = L('label_downloader_desc_main_fl') + ' ' + workspaceName + L('label_downloader_desc_main_ol_wifi');
	} else {
		mess = L('label_downloader_desc_main_fl') + ' ' + workspaceName + L('label_downloader_desc_main_ol');
	}
	_description = createDescriptionLabel(350, mess, _fontSize * 1.5);
	_self.add(_description);

	_downloadIcon = createBigIcon("fa-download", L('label_downloader_down'), true);
	_downloadIcon.addEventListener('click', _self.downloadHandler);
	_self.add(_downloadIcon);

	_removeIcon = createBigIcon("fa-times-circle", L('label_downloader_later'), false);
	_removeIcon.addEventListener('click', _self.downloadLaterHandler);
	_self.add(_removeIcon);

	return _self;

}

module.exports = downloadView;
