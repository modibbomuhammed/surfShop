mapboxgl.accessToken = 'pk.eyJ1IjoibW9kaWJib211aGFtbWVkIiwiYSI6ImNrN2o4bW1rajA5cnEzZXJ3Z2tjcHh0eG4ifQ.HhXWW8u_prQskpDfMM_43g';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11', 
	center: post.coordinates, 
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
    .setLngLat(post.coordinates)
	.setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
    .setHTML('<h3>' + post.title + '</h3><p>' + post.location + '</p>'))
    .addTo(map);


$('.toggle-edit-form').on('click', function(){
	$(this).text() == 'Edit' ? $(this).text('Cancel') : $(this).text('Edit')
	$(this).siblings('.edit-form').toggle()
})

		