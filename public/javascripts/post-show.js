$('.toggle-edit-form').on('click', function(){
	$(this).text() == 'Edit' ? $(this).text('Cancel') : $(this).text('Edit')
	$(this).siblings('.edit-form').toggle()
	
})

$('.clear-rating').on('click', function(e){
		$(this).siblings('.input-no-rate').click();
		// $('.input-no-rate').prop('checked', true) this works but it clears the rating for both!
})


mapboxgl.accessToken = mapBoxToken;
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11', 
	center: post.geometry.coordinates, 
	zoom: 4
  });
	
	
// 	var geojson = {
//   type: 'FeatureCollection',
//   features: [{
//     type: 'Feature',
//     geometry: {
//       type: 'Point',
//       coordinates: ,
//     },
//     properties: {
//       title: ,
//       description: 
//     }
//   }]
// };
	
	

  // create a HTML element for each feature
  var el = document.createElement('div');
  el.className = 'marker';

  // make a marker for each feature and add to the map
  new mapboxgl.Marker(el)
    .setLngLat(post.geometry.coordinates)
	.setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
    .setHTML('<h3>' + post.title + '</h3><p>' + post.location + '</p>'))
    .addTo(map);


 


		