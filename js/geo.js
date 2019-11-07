


window.onload = function getLocation(){

  if (navigator.geolocation) {
    var timeoutVal = 10 * 1000 * 1000;
    navigator.geolocation.getCurrentPosition( //this needs at least 2 parameters success, error
      displayPosition,
      displayError,
      { enableHighAccuracy: true, timeout: timeoutVal, maximumAge: 0 }
    );
  }
  else {
    alert("Geolocation is not supported by this browser");
  }

};


 function displayPosition(position) {
  var res = "<b>Latitude:</b>" + position.coords.latitude + "<br><br><b>Longitude:</b> " + position.coords.longitude ;
  document.getElementById('browser_div').innerHTML = res ;
 }

 function displayError(error) {
 var errors = {
   1: 'Permission denied',
   2: 'Position unavailable',
   3: 'Request timeout'
 };
 alert("Error: " + errors[error.code]);
}
