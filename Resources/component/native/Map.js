
//Widget Map Component Constructor

function widgetMap(dimensions, id) {

	var _isApple = Yaast.API.HW.System.isApple();
	var _routeShowed = null;
	var _annotationClicked = null;

	// Visualization _self
	var _self = Ti.Map.createView({
		height: dimensions.height,
		width: dimensions.width,
		userLocation: true,
	});

	// Event click on Annotation
	// fireEvent poiOutput
	_self.funClickMap = function funClickMap(e){
		if(e.clicksource == 'pin' && e.clicksource != null){
			Ti.App.fireEvent("poiOutput",JSON.stringify({
				id: e.annotation.idPoi,
				data: {title: e.annotation.title, subtitle: e.annotation.subtitle},
				icon: null,
				tooltip: null,
				currentLocation: {
					system: "WGS4",
					lat: e.annotation.latitude,
					lng: e.annotation.longitude
				}
			}));
			Ti.API.info("Lanzado poiOutput con datos: "+JSON.stringify({
				id: e.annotation.idPoi,
				data: {title: e.annotation.title, subtitle: e.annotation.subtitle},
				icon: null,
				tooltip: null,
				currentLocation: {
					system: "WGS4",
					lat: e.annotation.latitude,
					lng: e.annotation.longitude
				}
			}));
		}
		// TODO REMOVE AFTER DEMO
		else if (e.clicksource == 'rightButton') {
			Ti.App.fireEvent('goToRestaurant');
        }
	};
	_self.addEventListener('click', _self.funClickMap);

	// Event change viewport of Map
	// fireEvent boundsOutput | poiListOutput
	/*_self.funChangeMap = function funChangeMap(e){
		if(_annotationClicked != null) {
			_self.selectAnnotation(_annotationClicked);
			_annotationClicked = null;
		}

		if(_isApple){
			// SendBounds
			var _mapRegion = _self.getRegion();
			var _upleft = {
				lat : _mapRegion.latitude + _mapRegion.latitudeDelta,
				lng : _mapRegion.longitude - _mapRegion.longitudeDelta
			};
			var _doriht = {
				lat : _mapRegion.latitude - _mapRegion.latitudeDelta,
				lng : _mapRegion.longitude + _mapRegion.longitudeDelta
			};
			Ti.App.fireEvent("boundsOutput", "((" + _upleft.lat + ", " + _upleft.lng + "), (" + _doriht.lat + ", " + _doriht.lng + "))");
			Ti.API.info("Lanzado boundsOutput con datos: " + "((" + _upleft.lat + ", " + _upleft.lng + "), (" + _doriht.lat + ", " + _doriht.lng + "))");
			_upleft = null;
			_doriht = null;

			// SendPoiList
			var _poiListToSend = {};
			var _aAnnotations = _self.getAnnotations();
			for (var i = 0; i < _aAnnotations.length; i++) {
				var _annon = _aAnnotations[i];
				if (_annon.latitude < (_mapRegion.latitude + _mapRegion.latitudeDelta) && _annon.latitude > (_mapRegion.latitude - _mapRegion.latitudeDelta) && _annon.longitude < (_mapRegion.longitude + _mapRegion.longitudeDelta) && _annon.longitude > (_mapRegion.longitude - _mapRegion.longitudeDelta)) {
					_poiListToSend[_annon.idPoi] = {
						id : _annon.idPoi,
						data : {
							title : _annon.title,
							subtitle : _annon.subtitle
						},
						icon : null,
						tooltip : null,
						currentLocation : {
							system : "WGS4",
							lat : _annon.latitude,
							lng : _annon.longitude
						}
					};
				}
				_annon = null;
			}
			_aAnnotations = null;
			_mapRegion = null;
			Ti.App.fireEvent("poiListOutput", JSON.stringify(_poiListToSend));
			Ti.API.info("Lanzado poiListOutput con datos: " + JSON.stringify(_poiListToSend));
			_poiListToSend = null;
		}
	};
	_self.addEventListener('regionChanged', _self.funChangeMap);*/

	_self.activateCallback = function activateCallback(input, data){
		_self.inputs[input](data);
	};

	/** @title: handlerChangeTypeMap (Function)
	  * @parameters: typeString ([STANDARD | SATELLITE | HYBRID ])
	  * @usage: change type map for visualization */
	_self.handlerChangeTypeMap = function handlerChangeTypeMap(typeString){
		switch(typeString){
			case "STANDARD":
				_self.setMapType(Ti.Map.STANDARD_TYPE);
				break;
			case "SATELLITE":
				_self.setMapType(Ti.Map.SATELLITE_TYPE);
				break;
			case "HYBRID":
				_self.setMapType(Ti.Map.HYBRID_TYPE);
				break;
			default:
				break;
		}
	};

	/** @title: handlerInputRoute (Function)
	  * @parameters: routeString (JSON data {from: poiIdOrigin, to: poiIdDestiny})
	  *              mode = [ walking | transit | driving ]
	  * @usage: remove current route if exist
	  * 		represent route between two annotations
	  *         fireEvent routeDescriptionOutput */
	_self.handlerInputRoute = function handlerInputRoute (routeString, mode){
		var _pOrigin;
		var _pDestiny;
		if(routeString.from === "MKUSERLOCATION") _pOrigin = getUserLocation();
		else _pOrigin = checkAnnotation(routeString.from);
		if(routeString.to === "MKUSERLOCATION") _pDestiny = getUserLocation();
		else _pDestiny = checkAnnotation(routeString.to);
		if(_pOrigin != null && _pOrigin != null){
			_self.handlerCleanRoute();
			var _conObject = require('/connections/appConnection');
			var _conA = _conObject.getRouteWidgetMap({lat: _pOrigin.latitude, lng: _pOrigin.longitude},
				{lat: _pDestiny.latitude, lng: _pDestiny.longitude}, mode, function(values) {
					if (values !== "Error" && JSON.parse(values).status === "OK") {
						Ti.App.fireEvent("routeDescriptionOutput",{data:JSON.parse(values).routes});
						Ti.API.info("Lanzado routeDescriptionOutput con datos: "+{data:JSON.parse(values).routes});
						_routeShowed = JSON.parse(values).routes[0];
						var _leg = _routeShowed.legs;
                		for(var _i in _leg){
                			var _allPoints = new Array();
 	              			for(var step = 0; step < _leg[_i].steps.length; step++){
 	              				_allPoints.push(decodePolyline(_leg[_i].steps[step].polyline.points));
 	              			}
 	              			var _pointsRoute = new Array();
 	              			for (var _j = 0; _j < _allPoints.length; _j++){
 	              				_pointsRoute = _pointsRoute.concat(_allPoints[_j]);
 	              			}
 	              			_allPoints = null;
 	              			var _routeF = ({
 	              				name: "",
 	              				points: _pointsRoute,
 	              				color: "blue",
 	              				width: 2
 	              			});
 	              			_self.addRoute(_routeF);
 	              			_routeF = null;
 	              			_pointsRoute = null;
 	              			step = null;
 	              			_j = null;
                		}
                		_i = null;
                		_leg = null;
					}
					_conA = null;
					_conObject = null;
				});
		}
		_pDestiny = null;
		_pOrigin = null;
	};

	/** @title: handlerInputRouteStep (Function)
	  * @parameters: stepNum (number step of routeShowed)
	  * @usage: show alert with information of route */
	_self.handlerInputRouteStep = function handlerInputRouteStep (stepNum){
		if(_routeShowed != null){
			var _step = _routeShowed.legs[0].steps[stepNum];
			_self.setLocation({latitude:_step.start_location.lat, longitude:_step.start_location.lng, animate:true,
    		 	latitudeDelta:0.001953125, longitudeDelta:0.001953125});
		}
	};

	/** @title: handlerInputPoi (Function)
	  * @parameters: poiString (JSON data POI)
	  * @usage: add POI to Map */
	_self.handlerInputPoi = function handlerInputPoi(poiString){
		var _poi = createPOI(JSON.parse(poiString));
		var _pA = checkAnnotation(_poi.id);
		if(_pA !== null) _self.removeAnnotation(_pA);
		_pA = Ti.Map.createAnnotation({
			title: _poi.title,
			subtitle: _poi.subtitle,
			latitude: _poi.coordinates.lat,
			longitude: _poi.coordinates.lng,
			image: _poi.icon,
			idPoi: _poi.id
		});
		// TODO REMOVE AFTER DEMO
		if(_poi.id.toString().indexOf('11041677L10') != -1){
			_pA.setImage('images/open/restaurant_w.png');
			_pA.setRightButton(Ti.UI.iPhone.SystemButton.INFO_LIGHT);
		}
		_self.addAnnotation(_pA);
		_pA = null;
		_poi = null;
	};

	/** @title: handlerInputPoi (Function)
	  * @parameters: poiListString (JSON data Array POI)
	  * @usage: add POI List to Map
	  * @extras: remove All annotations */
	_self.handlerInputListPoi = function handlerInputListPoi(poiListString){
		_self.removeAllAnnotations();
		var _aPOI = JSON.parse(poiListString);
		var _aAnnotations = new Array();
		for(var i = 0; i < _aPOI.length; i++){
			var _poi = createPOI(_aPOI[i]);
			_aAnnotations.push(Ti.Map.createAnnotation({
				title: _poi.title,
				subtitle: _poi.subtitle,
				latitude: _poi.coordinates.lat,
				longitude: _poi.coordinates.lng,
				image: _poi.icon,
				idPoi: _poi.id
			}));
			_poi = null;
		}
		_aPOI = null;
		if(_aAnnotations.length > 0) _self.addAnnotations(_aAnnotations);
		_aAnnotations = null;
	};

	/** @title: handlerInputDeletePoi (Function)
	  * @parameters: poiString (JSON data POI)
	  * @usage: delete POI in Map */
	_self.handlerInputDeletePoi = function handlerInputDeletePoi(poiString){
		var _poi = createPOI(JSON.parse(poiString));
		var _pA = checkAnnotation(_poi.id);
		if(_pA !== null) _self.removeAnnotation(_pA);
		_poi = null;
		_pA = null;
	};

	/** @title: handlerInputPoiCenter (Function)
	  * @parameters: poiString (JSON data POI)
	  * @usage: usage POI for center Map */
	_self.handlerInputPoiCenter = function handlerInputPoiCenter(poiString){
		_self.handlerInputPoi(poiString);
		_self.handlerInputSelectPoi(poiString);
	};

	/** @title: handlerInputSelectPoi (Function)
	  * @parameters: poiString (JSON data POI)
	  * @usage: center Map with poi */
	_self.handlerInputSelectPoi = function handlerInputSelectPoi(poiString){
		var _poi = createPOI(JSON.parse(poiString));
		var _aAnnotations = _self.getAnnotations();
		var _pA = checkAnnotation(_poi.id);
		if(_pA !== null) {
			_annotationClicked = _pA;
			_self.setLocation({latitude:_poi.coordinates.lat, longitude:_poi.coordinates.lng, animate:true,
    		 latitudeDelta:1, longitudeDelta:1});
    	}
		_pA = null;
		_poi = null;
		_aAnnotations = null;
	};

	/** @title: handlerCleanRoute (Function)
	  * @usage: remove Route of the Map */
	_self.handlerCleanRoute = function handlerCleanRoute(){
		if(_routeShowed != null) {
			_self.removeRoute(_routeShowed);
			_routeShowed = null;
		}
	};

	/** @title: handlerInputCoords (Function)
	  * @parameters: decimalCoords ("Latitude, Longitude")
	  * @usage: create POI from decimal coordinates */
	_self.handlerInputCoords = function handlerInputCoords(decimalCoords){
		var decPattern = /^-{0,1}[0-9]+.{0,1}[0-9]*, -{0,1}[0-9]+.{0,1}[0-9]*$/;
        if (decimalCoords && decPattern.test(decimalCoords)) {
            var values = decimalCoords.split(", ");
            var _poi = Titanium.Map.createAnnotation({
    			title: "Annotation Decimal Coords",
        		latitude: parseFloat(values[0]),
        		longitude: parseFloat(values[1])
    		});
    	_self.addAnnotation(_poi);
    	}
    	else alert("Error decimal Coords");
 	};

	/** @title: handlerInputAddress (Function)
	 *  @parameters: addrString ("Zip, City, Country")
	 *  @usage: create POI from address for add to Map */
	_self.handlerInputAddress = function handlerInputAddress (addrString) {
		Ti.Geolocation.forwardGeocoder(addrString,function(e) {
    		var _poi = Titanium.Map.createAnnotation({
    			title: "Annotation Address",
        		latitude: e.latitude,
        		longitude: e.longitude
    		});
    	_self.addAnnotation(_poi);
		});
	};

	/** @title: handlerInputChangeStatus (Function)
	 *  @parameters: list of Status
	 *  @usage: change Annotation Image */
	_self.handlerInputChangeStatus = function handlerInputChangeStatus (newStatus) {
		var _status = JSON.parse(newStatus);
		for(var i = 0; i < _status.length; i++) {
		 	var _p = checkAnnotation(_status[i].uri);
		 	if(_p !== null){
		 		if (_status[i].open_close === "1") {
					_p.setImage(_p.image.replace("close", "open"));
				} else {
					_p.setImage(_p.image.replace("open", "close"));
				}
			}
		}
	};

	// Private Functions

	/** @title: decodePolyline (Function)
	  * @parameters: pl (Encoded String Route)
	  * @usage: return Array of Coordinates */
	function decodePolyline(pl){
			var encoded = pl;
    		var index = 0;
    		var array = new Array();
    		var lat = 0;
    		var lng = 0;
    		while (index < encoded.length) {
        		var b;
        		var shift = 0;
        		var result = 0;
        		do {
            		b = encoded.charCodeAt(index++) - 63;
            		result |= (b & 0x1f) << shift;
            		shift += 5;
        		} while (b >= 0x20);
        		lat += ((result & 1) ? ~(result >> 1) : (result >> 1));
        		shift = 0;
        		result = 0;
        		do {
            		b = encoded.charCodeAt(index++) - 63;
            		result |= (b & 0x1f) << shift;
            		shift += 5;
        		} while (b >= 0x20);
        		lng += ((result & 1) ? ~(result >> 1) : (result >> 1));
        		array.push({latitude:lat * 0.00001,longitude:lng * 0.00001});
    		}
    		return array;
		};

	/** @title: getUserLocation (Function)
	  * @usage: return Coordinates of User Location */
	function getUserLocation(){
		var _r = {};
		Ti.Geolocation.getCurrentPosition(function(e){
			if(e.error) _r = null;
			else {
				_r.latitude = e.latitude;
				_r.longitude = e.longitude;
			}
		});
		return _r;
	};

	/** @title: createPOI (Function)
	  * @parameters: dataPOI (object)
	  * @usage: return POI */
	function createPOI(dataPOI){
		return {
			id: dataPOI.data.id,
            title: dataPOI.data.title,
            subtitle: dataPOI.data.subtitle,
            // TODO REMOVE AFTER DEMO
            icon: (dataPOI.data.icon) ? dataPOI.data.icon.replace("http://138.100.12.106:8070/img/","images/") : null,
            tooltip: dataPOI.tooltip,
            coordinates: {
            	lat: parseFloat(dataPOI.currentLocation.lat),
            	lng: parseFloat(dataPOI.currentLocation.lng)
            }
       };
	};

	/** @title: checkAnnotation (Function)
	  * @parameters: id of poiToCheck (createPOI)
	  * @usage: return Annotation into the map or null if not exist */
	function checkAnnotation(poiToCheckID){
		var _aAnnotations = _self.getAnnotations();
		if(!_aAnnotations) return null;
		for(var i = 0; i < _aAnnotations.length; i++){
			if(_aAnnotations[i].idPoi === poiToCheckID) return _aAnnotations[i];
		}
		_aAnnotations = null;
		return null;
	};

	_self.inputs = {
		'changeStatus': _self.handlerInputChangeStatus,
		'routeInput': _self.handlerInputRoute,
        'routeStepInput': _self.handlerInputRouteStep,
        'addressInput': _self.handlerInputAddress,
        'coordsInput': _self.handlerInputCoords,
        'poiInput': _self.handlerInputPoi,
        'poiListInput': _self.handlerInputListPoi,
        'deletePoiInput': _self.handlerInputDeletePoi,
        'poiInputCenter': _self.handlerInputPoiCenter,
        'selectPoiInput': _self.handlerInputSelectPoi
   	};

	_self.clearObject = function clearObject(){
		_self.removeEventListener('regionChanged', _self.funChangeMap);
		_self.removeEventListener('click', _self.funClickMap);
		delete _self['funChangeMap'];
		delete _self['funClickMap'];
		delete _self['inputs'];
		delete _self['activateCallback'];
		delete _self['handlerChangeTypeMap'];
		delete _self['handlerInputRoute'];
		delete _self['handlerInputRouteStep'];
		delete _self['handlerInputPoi'];
		delete _self['handlerInputListPoi'];
		delete _self['handlerInputDeletePoi'];
		delete _self['handlerInputPoiCenter'];
		delete _self['handlerInputSelectPoi'];
		delete _self['handlerCleanRoute'];
		delete _self['handlerInputCoords'];
		delete _self['handlerInputAddress'];
		delete _self['handlerInputChangeStatus'];
	};

	// TODO REMOVE AFTER DEMO
	_self.setLocation({latitude:'40.441287', longitude:'-3.692637', animate:true,
    		 latitudeDelta:0.001, longitudeDelta:0.001});

	return _self;
}

module.exports = widgetMap;
