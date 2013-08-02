CONST_DEFAULT_LAT = 49.065177;
CONST_DEFAULT_LNG = 17.461245;
CONST_DEFAULT_ZOOMLVL = 12;
CONST_DEFAULT_MAPTYPEID = google.maps.MapTypeId.HYBRID;
CONST_DEFAULT_MAPTILT = 0;
CONST_DRAGGABLE = true;

var centerLat = Number(localStorage['centerLat']) || CONST_DEFAULT_LAT;
var centerLng = Number(localStorage['centerLng']) || CONST_DEFAULT_LNG;
var zoomLvl = Number(localStorage['zoomLvl']) || CONST_DEFAULT_ZOOMLVL;
var mapTypeId = String(localStorage['mapTypeId']) || CONST_DEFAULT_MAPTYPEID;
var mapTilt = Number(localStorage['mapTilt']) || CONST_DEFAULT_MAPTILT;

var map = null;
var marker = null;
var markers = {};

var client_icon = 'http://maps.google.com/intl/en_us/mapfiles/ms/micons/blue-dot.png';
var ap_icon = 'http://maps.google.com/intl/en_us/mapfiles/ms/micons/red-dot.png';

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

  // Listener for client marker
  google.maps.event.addListener(map, 'click', function(position) {
    if (marker == null) {
      marker = createMarker(position.latLng, client_icon, CONST_DRAGGABLE);
      (localStorage['marker.lat'] = position.latLng.lat()) && (localStorage['marker.lng'] = position.latLng.lng());
    } else {
      marker.setPosition(position.latLng);
      (localStorage['marker.lat'] = position.latLng.lat()) && (localStorage['marker.lng'] = position.latLng.lng());
    }
  });

  // Set client marker if exists in localStorage
  (localStorage['marker.lat'] && localStorage['marker.lng']) &&
    (marker = createMarker(new google.maps.LatLng(parseFloat(localStorage['marker.lat']), parseFloat(localStorage['marker.lng'])), client_icon, CONST_DRAGGABLE));
}

function createMarker(position, icon, draggable) {
  var m = new google.maps.Marker({
    position: position,
    icon: icon,
    draggable: draggable,
    map: map
  });
  google.maps.event.addListener(m, 'drag', function() {
  });
  google.maps.event.addListener(m, 'dragend', function() {
    (localStorage['marker.lat'] = m.position.lat()) && (localStorage['marker.lng'] = m.position.lng());
  });
  return m;
}

function resetMap() {
  // Reset localStorage values
  localStorage['centerLat'] = CONST_DEFAULT_LAT;
  localStorage['centerLng'] = CONST_DEFAULT_LNG;
  localStorage['zoomLvl'] = CONST_DEFAULT_ZOOMLVL;
  localStorage['mapTypeId'] = CONST_DEFAULT_MAPTYPEID;
  localStorage['mapTilt'] = CONST_DEFAULT_MAPTILT;
  localStorage.removeItem('marker.lat');
  localStorage.removeItem('marker.lng');
  // Reset marker object
  if (marker) {
    marker.setMap(null);
    google.maps.event.clearInstanceListeners(marker);
    marker = null;
  }

  // Read values from localStorage, else use CONSTs (workaround for broswsers that don't support HTML5 Storage)
  centerLat = Number(localStorage['centerLat']) || CONST_DEFAULT_LAT;
  centerLng = Number(localStorage['centerLng']) || CONST_DEFAULT_LNG;
  zoomLvl = Number(localStorage['zoomLvl']) || CONST_DEFAULT_ZOOMLVL;
  mapTypeId = String(localStorage['mapTypeId']) || CONST_DEFAULT_MAPTYPEID;
  mapTilt = Number(localStorage['mapTilt']) || CONST_DEFAULT_MAPTILT;

  // Refresh map with default parameters
  map.setCenter(new google.maps.LatLng(parseFloat(centerLat), parseFloat(centerLng)));
  map.setZoom(parseInt(zoomLvl));
  map.setMapTypeId(String(mapTypeId));
  map.setTilt(parseInt(mapTilt));
}

google.maps.event.addDomListener(window, 'load', init);
