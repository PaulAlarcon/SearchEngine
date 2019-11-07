
window.onload = function show(){

  var res="";
  res += "<p><b>Screen Width:</b> " +   screen.width + "</p>";
  res += "<p><b>Screen Width:</b> " + screen.height + "</p>";
  res += "<p><b>Available Width:</b> " +  screen.availWidth + "</p>";
  res += "<p><b>Available Height</b> " + screen.availHeight + "</p>";
  res += "<p><b>Color Depth:</b> " + screen.colorDepth + "</p>";
  res += "<p><b>Pixel Depth:</b> " + screen.pixelDepth + "</p>";

  document.getElementById('browser_div').innerHTML = res;
};
