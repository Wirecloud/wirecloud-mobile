//downloadsPlatform Window Component Constructor

function downloadsPlatform(h, listWidgets, listOperators, workspaceName) {

	var _isApple = (Ti.Platform.osname == 'ipad');
	var _self = Ti.UI.createView({
		top : 0,
		left : 0,
		height : h,
		width : Ti.Platform.displayCaps.platformWidth
	});

	var _description = createDescriptionLabel(350, "Ha ocurrido un error al intentar visualizar " + workspaceName +
	"\n\n Se ha detectado que faltan widgets/operadores en la cache de Wirecloud4Tablet" +
	"\n\n se procederá a la descarga de dichas dependencias \n\n ¿desea continuar\?");
	_self.add(_description);

	var _widgetsToDownload = listWidgets;
	var _operatorsToDownload = listOperators;

	/** @title: createDescriptionLabel (Function)
	 *  @usage: create Label for Description View */
	function createDescriptionLabel(h, textString) {
		return Ti.UI.createLabel({
			top : 0,
			left : 0,
			width : _self.width,
			height : h,
			touchEnabled : false,
			font : {
				fontSize : (_isApple) ? 20 : '18sp',
				fontFamily : 'Comfortaa'
			},
			color : "#FFFFFF",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			verticalAlign : Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
			text : textString
		});
	};

	/** @title: createRowLabel (Function)
	 *  @usage: create Row Label with state */
	function createRowLabel(t, textString) {
		return Ti.UI.createLabel({
			top : t,
			left : parseInt(_self.width / 6, 10),
			width : 650,
			height : 50,
			touchEnabled : false,
			font : {
				fontSize : (_isApple) ? 20 : '18sp',
				fontFamily : 'Comfortaa'
			},
			color : "#FFFFFF",
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			verticalAlign : Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
			text : textString
		});
	};

	/** @title: createOkIcon (Function)
	 *  @usage: create Label with Ok FontAwesome Icon */
	function createOkIcon(t, l, w) {
		return Ti.UI.createLabel({
			top : t,
			left : l + w,
			width : 50,
			height : 50,
			touchEnabled : false,
			font : {
				fontSize : (_isApple) ? 25 : '18sp',
				fontFamily : Yaast.FontAwesome.getFontFamily()
			},
			color : "#D3D3D3",
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			verticalAlign : Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
			text : Yaast.FontAwesome.getCharCode("icon-ok")
		});
	};

	/** @title: createBigIcon (Function)
	 *  @usage: create Label with Icon and subLabel */
	function createBigIcon(icon, textString, left) {
		var _view = Ti.UI.createView({
			top : _description.top + _description.height,
			width : parseInt(_self.width / 2, 10) - parseInt(_self.width / 5, 10),
			height : 300
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
				fontSize : (_isApple) ? 200 : '170sp',
				fontFamily : Yaast.FontAwesome.getFontFamily()
			},
			color : "#FFFFFF",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			verticalAlign : Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
			text : Yaast.FontAwesome.getCharCode(icon)
		}));
		_view.add(Ti.UI.createLabel({
			top : 180,
			left : 0,
			width : _view.width,
			height : 50,
			touchEnabled : false,
			font : {
				fontSize : (_isApple) ? 20 : '18sp',
				fontFamily : 'Comfortaa'
			},
			color : "#FFFFFF",
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			verticalAlign : Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
			text : textString
		}));
		return _view;
	};

	/** @title: removeVariables (Function)
	 *  @usage: clean view by variables */
	function removeVariables() {
		_downloadIcon.removeEventListener('click', _self.downloadHandler);
		_removeIcon.removeEventListener('click', _self.downloadLaterHandler);
		_self.remove(_description);
		_self.remove(_downloadIcon);
		_self.remove(_removeIcon);
	};

	/** @title: createHTMLOperators (Function)
	 *  @parameters: list of operators and files js
	 *  @usage: create HTML view */
	function createHTMLOperators(operators){
		for(var i in operators){
            var _fileMashupPlatform = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'operators/'+i+'/wiringPlatform.js');
            var _textMashupOriginal = Ti.Filesystem.getFile(Ti.Filesystem.getResourcesDirectory(), 'ui/lib/wiringPlatformJS.lib').read().toString();
            var _fileBridge = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'operators/'+i+'/APIBridge.js');
            var _textBridgeOriginal = Ti.Filesystem.getFile(Ti.Filesystem.getResourcesDirectory(), 'ui/lib/APIBridgeJS.lib').read().toString();

            // Set Android/iOS var in the bridge. appleOS
            var res = _textBridgeOriginal.split("// ChangeMeYaaST!! appleOS bool");
            _textBridgeOriginal = res[0] + "var appleOS = " + _isApple + ";" + res[1];
            Ti.API.info("var appleOS = " + _isApple + ";");

            _fileMashupPlatform.write(_textMashupOriginal, false);
            _fileBridge.write(_textBridgeOriginal, false);
            _textMashupOriginal = null;
            _fileMashupPlatform = null;
            _fileBridge = null;
            _fileMashupPlatform = null;
			var _routeHTML = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'operators/' + i + '/index.html');
			var _textHTML = '<!DOCTYPE html>\n<html>\n\t<head>\n';
			_textHTML = _textHTML + '\t\t<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">\n';
			_textHTML = _textHTML + '\t\t<script type="text/javascript" src="wiringPlatform.js"></script>\n';
			_textHTML = _textHTML + '\t\t<script type="text/javascript" src="APIBridge.js"></script>\n';
			var _files = JSON.parse(operators[i]);
			for(var j in _files){
				if(_files[j].indexOf('.js') != -1) _textHTML = _textHTML + '\t\t<script type="text/javascript" src="' + _files[j] + '"></script>\n';
			};
			_textHTML = _textHTML + '\t</head>\n\t<body>\n\t</body>\n</html>';
			_routeHTML.write(_textHTML, false);
			_textHTML = null;
			_configOperator = null;
		}
	};

	/** @title: removeVariables (Function)
	 *  @usage: clean view by variables */
	_self.clearObject = function clearObject() {
		_downloadIcon.removeEventListener('click', _self.downloadHandler);
		_removeIcon.removeEventListener('click', _self.downloadLaterHandler);
		_self.remove(_description);
		_self.remove(_downloadIcon);
		_self.remove(_removeIcon);
	};

	/** @title: downloadLaterHandler (Function)
	 *  @usage: clean view and show workspace without widgets */
	_self.downloadLaterHandler = function downloadLaterHandler(){

	};

	_self.downloadHandler = function downloadHandler() {

		// Clean View
		removeVariables();

		// Create Layout
		_description = createDescriptionLabel(200, "Cargando Workspace");
		_self.add(_description);
		var _checkURL = createRowLabel(_description.top + _description.height, "Comprobación de dependencias alojadas en Wirecloud Desktop");
		_self.add(_checkURL);
		var _checkURLIcon = createOkIcon(_checkURL.top, _checkURL.left, _checkURL.width);
		_self.add(_checkURLIcon);
		var _downWidgets = createRowLabel(_checkURL.top + _checkURL.height + 50, "Widgets/operadores descargados en caché");
		_self.add(_downWidgets);
		var _downWidgetsIcon = createOkIcon(_downWidgets.top, _downWidgets.left, _downWidgets.width);
		_self.add(_downWidgetsIcon);
		var _buildWidgets = createRowLabel(_downWidgets.top + _downWidgets.height + 50, "Construida cache de recursos asignados al Workspace");
		_self.add(_buildWidgets);
		var _buildWidgetsIcon = createOkIcon(_buildWidgets.top, _buildWidgets.left, _buildWidgets.width);
		_self.add(_buildWidgetsIcon);
		var _footer = createDescriptionLabel(100, "Espere por favor ...");
		_footer.setTop(_buildWidgets.top + _buildWidgets.height + 75);
		_self.add(_footer);

		// Check List Resource from Wirecloud Desktop
		var _conObject = require('/connections/appConnection');
		var _conA = _conObject.checkListResource(_widgetsToDownload.concat(_operatorsToDownload), function(checkResult) {
			if (checkResult.value === true) {
				_footer.setText("Error debido a la dependencia: "+checkResult.uri);
				_footer.setColor("#610000");
				_checkURLIcon.setColor("#610000");
			} else {
				_checkURLIcon.setColor("#006100");
				_conA = _conObject.downloadListResource(_widgetsToDownload.concat(_operatorsToDownload), _widgetsToDownload.length,
				    function(downResult) {
					if (downResult.value == true) {
						_footer.setText("Error en la descarga de la dependencia: "+downResult.uri);
						_footer.setColor("#610000");
						_downWidgetsIcon.setColor("#610000");
					} else {
						createHTMLOperators(downResult.files);
						_downWidgetsIcon.setColor("#006100");
						_buildWidgetsIcon.setColor("#006100");
						_footer.setText("Visualizar Workspace");
						_footer.setTouchEnabled(true);
						_self.funShowWorkspace = function funShowWorkspace(){
							Ti.App.fireEvent('showWorkspace');
						};
						_footer.addEventListener('click', _self.funShowWorkspace);
					}
				});
			}
		});
	};

	var _downloadIcon = createBigIcon("icon-download-alt", "Descargar dependencias", true);
	_downloadIcon.addEventListener('click', _self.downloadHandler);
	_self.add(_downloadIcon);
	var _removeIcon = createBigIcon("icon-remove", "Aplazar", false);
	_removeIcon.addEventListener('click', _self.downloadLaterHandler);
	_self.add(_removeIcon);

	return _self;

}

module.exports = downloadsPlatform;
