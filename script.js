var map = null;
var centerLat = (localStorage['centerLat'] ? Number(localStorage['centerLat']) : 49.065177);
var centerLng = (localStorage['centerLng'] ? Number(localStorage['centerLng']) : 17.461245);
var zoomLvl = (localStorage['zoomLvl'] ? Number(localStorage['zoomLvl']) : 12);
var mapTypeId = (localStorage['mapTypeId'] ? String(localStorage['mapTypeId']) : google.maps.MapTypeId.HYBRID);
var mapTilt = (localStorage['mapTilt'] ? Number(localStorage['mapTilt']) : 0);
var markers = {};

function init() {
	var mapTypeIds = [];
	for (var type in google.maps.MapTypeId) {
		mapTypeIds.push(google.maps.MapTypeId[type]);
	}
	mapTypeIds.push('OSM');

	map = new google.maps.Map(document.getElementById('map_canvas'), {
		center: new google.maps.LatLng(centerLat, centerLng),
		zoom: zoomLvl,
		mapTypeId: mapTypeId,
		panControlOptions: { position: google.maps.ControlPosition.LEFT_BOTTOM },
		zoomControlOptions: { position: google.maps.ControlPosition.LEFT_BOTTOM },
		scaleControl: true,
		scaleControlOptions: { position: google.maps.ControlPosition.BOTTOM_LEFT },
		mapTypeControlOptions: {
			position: google.maps.ControlPosition.LEFT_TOP,
			mapTypeIds: mapTypeIds,
		},
		overviewMapControl : true,
		overviewMapControlOptions: { opened: true },
		streetViewControl: true,
    tilt: mapTilt,
	});

	// Define OSM map type pointing at the OpenStreetMap tile server
	map.mapTypes.set('OSM', new google.maps.ImageMapType({
		getTileUrl: function(coord, zoom) {
			return "http://tile.openstreetmap.org/" + zoom + "/" + coord.x + "/" + coord.y + ".png";
		},
		tileSize: new google.maps.Size(256, 256),
		name: 'OpenStreetMap',
		maxZoom: 18,
	}));

  // Listener for storing map center
  google.maps.event.addListener(map, 'center_changed', function() {
    localStorage['centerLat'] = map.getCenter().lat();
    localStorage['centerLng'] = map.getCenter().lng();
  });
  // Listener for storing zoom level
  google.maps.event.addListener(map, 'zoom_changed', function() {
    localStorage['zoomLvl'] = map.getZoom();
  });
  // Listener for storing map type
  google.maps.event.addListener(map, 'maptypeid_changed', function() {
    localStorage['mapTypeId'] = map.getMapTypeId();
  });
  // Listener for storing map tilt
  google.maps.event.addListener(map, 'tilt_changed', function() {
    localStorage['mapTilt'] = map.getTilt();
  });

  // Listener for responsive map
  google.maps.event.addDomListener(window, 'resize', function() {
    var center = map.getCenter();
    google.maps.event.trigger(map, 'resize');
    map.setCenter(center);
  });
}

google.maps.event.addDomListener(window, 'load', init);
