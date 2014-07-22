
//Operator GPS Component Constructor

function operatorGPS(id) {

	var _isApple = Yaast.API.HW.System.isApple();
	var _routeShowed = null;
	var _annotationClicked = null;
	var _idOperator = id;

	// Visualization _self
	var _self = Ti.UI.createView({
		height: 0,
		width: 0,
		left: 0,
		top: 0,
		backgroundColor: 'transparent'
	});

    // Geolocation Service
	Ti.Geolocation.purpose = "Map Viewer GPS Geolocation";
	Ti.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
    Ti.Geolocation.distanceFilter = 10;

	// Update Bounding Box Native GPS and push event this data
	_self.outputBoundingGPS = function outputBoundingGPS(coordinateGPS){
		Ti.API.info('geo bounding -> ' + coordinateGPS[0] + ' ' + coordinateGPS[1]);
		var bBox = {
            'lng0': coordinateGPS[0]+0.00075,
            'lng1': coordinateGPS[0]-0.00075,
            'lat0': coordinateGPS[1]-0.00075,
            'lat1': coordinateGPS[1]+0.00075
        };
        Ti.App.fireEvent('pushEvent', {
        	'id': _idOperator,
        	'name': 'outputBoundingGPS',
        	'dataEvent': '(('+bBox.lng1+','+bBox.lat0+'),('+bBox.lng0+','+bBox.lat1+'))'
        });
	};

	// Update Coordinate Native GPS and push event this data
	_self.outputPositionGPS = function outputPositionGPS(e){
		if(!e.success){
			alert("Error to get coordinate GPS");
			return;
		}
		var longitude = e.coords.longitude;
        var latitude = e.coords.latitude;
        Ti.API.info('geo location -> long: ' + longitude + ' lat: ' + latitude);
        _self.outputBoundingGPS([longitude, latitude]);
        Ti.App.fireEvent('pushEvent', {
        	'id': _idOperator,
        	'name': 'outputPositionGPS',
        	'dataEvent': JSON.stringify({
                "id": "locationUser",
                "icon": "",
                "tooltip":"Current GPS Position",
                "data":{
                    "title":"Current GPS Position",
                    "subtitle": "GPS Native"
                },
                "infoWindow":"",
                "currentLocation":{
                    "system":"WGS84",
                    "lat": latitude,
                    "lng": longitude
                 }
           })
        });
	};
	Ti.Geolocation.addEventListener('location', _self.outputPositionGPS);

	// Geolocation Service
	Ti.Geolocation.purpose = "GPS Geolocation Service - Wirecloud";
	Ti.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
    Ti.Geolocation.distanceFilter = 10;
    Ti.Geolocation.getCurrentPosition(function(e){
    	var longitude = e.coords.longitude;
        var latitude = e.coords.latitude;
        var altitude = e.coords.altitude;
        var heading = e.coords.heading;
        var accuracy = e.coords.accuracy;
        var speed = e.coords.speed;
        var timestamp = e.coords.timestamp;
        var altitudeAccuracy = e.coords.altitudeAccuracy;
        Ti.API.info('geo - current location: ' + new Date(timestamp) + ' long ' + longitude + ' lat ' + latitude + ' accuracy ' + accuracy);
    });

	_self.clearObject = function clearObject(){
		delete _self['outputCoordinateGPS'];
		delete _self['outputBoundingGPS'];
	};

	return _self;
}

module.exports = operatorGPS;
