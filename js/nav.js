


window.onload = function show(){
  var app_ver = navigator.appVersion
  var agent = navigator.userAgent;
  var browser_name = navigator.appName;

  var res="";
  res = "<h2>Application Version : </h2>" +app_ver+ "<br><br>" +
        "<h2>Brower Name : </h2>"  + browser_name+ "<br><br>" +
        "<h2>Agent: </h2>"  +agent+ "<br><br>" ;

  document.getElementById('browser_div').innerHTML = res;
};
