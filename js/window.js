window.onload = function show(){
  var res="";
  res += "<p><b>innerWidth:</b> " + window.innerWidth + "</p>";
  res += "<p><b>innerHeight:</b> " + window.innerHeight + "</p>";
  res += "<p><b>outerWidth:</b> " + window.outerWidth + "</p>";
  res += "<p><b>outerHeight:</b> " + window.outerHeight + "</p>";

  document.getElementById('browser_div').innerHTML = res;
};
