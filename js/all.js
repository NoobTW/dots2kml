var data = []
var markers = []
map = L.map('map').setView([22.7334926, 120.2870684], 17);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '<a href="https://www.openstreetmap.org/">OSM</a>',
	maxZoom: 18,
}).addTo(map);

$text = document.querySelector('#text');

map.on('click', function(e){
	var x = e.latlng.lat;
	var y = e.latlng.lng;

	data.push({
		lat: x,
		lng: y,
	});
	var marker = L.marker([x, y]);
	marker.on('click', function(em){
		var mx = em.latlng.lat;
		var my = em.latlng.lng;
		$text.value = $text.value.split('\n').filter(function(x){
			return !x.includes(mx + ', ' + my);
		}).join('\n');
		data = data.filter(function(x){
			return x !== mx && y !== my;
		});
		map.removeLayer(marker);
	});
	markers.push(marker);
	marker.addTo(map);

	document.querySelector('#text').value += '\n' + 'P: ('+x + ', ' + y+')'
});

document.querySelector('#convert').onclick = function(){
	var kml = tokml(GeoJSON.parse(data, {Point: ['lat', 'lng']}));
	markers.forEach(function(m){
		map.removeLayer(m);
	});
	data = [];
	markers = [];
	$text.value = kml;
	var a = document.createElement('a');
	a.setAttribute('download', 'Test.kml');
	a.setAttribute('href', 'data:application/octet-stream,' + encodeURIComponent(kml));
	a.click();
}
