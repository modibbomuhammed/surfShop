function geoFindMe() {

  const status = document.querySelector('#status');
  const locationInput = document.querySelector('#location');

  locationInput.textContent = '';

	
  function success(position) {
    const latitude  = position.coords.latitude;
    const longitude = position.coords.longitude;
	
    status.textContent = '';
    locationInput.value = `[${longitude}, ${latitude}]` 
  }

  function error() {
    status.textContent = 'Unable to retrieve your location';
  }

  if (!navigator.geolocation) {
    status.textContent = 'Geolocation is not supported by your browser';
  } else {
    status.textContent = 'Locating…';
    navigator.geolocation.getCurrentPosition(success, error);
  }

}

document.querySelector('#use-my-location').addEventListener('click', geoFindMe);