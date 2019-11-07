function show_navigator(){
  window.open("navigator.html","_self")
}
function show_window(){
  window.open("window.html","_self")
}
function show_screen(){
  window.open("screen.html","_self")
} 
function show_location(){
  window.open("location.html","_self")
}
function show_geoLocation(){
  window.open("geolocation.html","_self")
}

function projectDescription(){
 var x = document.getElementById("container-description");
 if(x.style.display==="none"){
   x.style.display="block";
 }
 else {
   x.style.display = "none";
 }
}
