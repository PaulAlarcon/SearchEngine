


window.onload = function show(){
  var ref = window.location.href;
  var host = window.location.hostname;
  var path = window.location.pathname;
  var prot = window.location.protocol;
  var assign = window.location.assign ;

  var res="";
  res += "<p><b>Href:</b> " + window.location.href+ "</p>";
  res += "<p><b>Host:</b> " + window.location.hostname+ "</p>";
  res += "<p><b>Path:</b> " + window.location.pathname+ "</p>";
  res += "<p><b>Protocol:</b> " + window.location.protocol + "</p>";
  res += "<p><b>Assigned :</b> " + window.location.assign + "</p>";

  document.getElementById('browser_div').innerHTML = res;
};
