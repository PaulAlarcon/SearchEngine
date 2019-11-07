


function getResults() {
  document.getElementById('search_form').style.display = 'none';
  document.getElementById('search_display').style.display = 'block';

  var KEY_API = '' // API FROM GOOGLE
  var CSE = '' // CSE FROM GOOGLE
  var q = document.getElementById('searchfield').value;

  // if( document.getElementById('searchfield').value == null){
  //   q = document.getElementById('searchfield').value ;
  // }
  // else {
  //   q = document.getElementById('searchfield').value;
  // }


  var API_URL = "https://www.googleapis.com/customsearch/v1?key="
              + KEY_API + "&cx=" + CSE + "&q=" + encodeURIComponent(q);

  searchfield = null;
  searchfield2 = null;

  var jsondata;

  var Httpreq = new XMLHttpRequest();
  Httpreq.open("GET",API_URL,true);
  Httpreq.setRequestHeader("content-type","application/json");
  Httpreq.onreadystatechange = function (){
    if (Httpreq.readyState == 4 && Httpreq.status == 200) {
        jsondata = JSON.parse(Httpreq.responseText);
        console.log(jsondata);
        var currentdata = convertIntoStandardJSON(jsondata);
        displayAPIData(currentdata);
        // handleLook();

    }
  }

  if (document.getElementById('search_display').style.display =! 'block'){
    console.log("nope");
  }

  Httpreq.send();
}

function displayAPIData(data){

    var count, number_results, html_display;

    count = Object.keys(data.Result).length;

     number_results = "<h3>Found "+ count +" results.</h3>" +
                    "<input type='button' class='btn btn-outline-success my-2 my-sm-0'  value='Download JSON' onclick='downloadSelectedResults(\"json\")'>" +
                    "<input type='button' class='btn btn-outline-success my-2 my-sm-0'  value='Download XML' onclick='downloadSelectedResults(\"xml\")'>" +
                    "<input type='button' class='btn btn-outline-success my-2 my-sm-0'  value='Download CSV' onclick='downloadSelectedResults(\"csv\")'>" +
                    "<div id='downloadLinkanchor'></div>";

     html_display = "<div class='results_table container'>";

      for(var i = 0; i < count; i++){
        html_display +=  "<div id='results container'>" +
                        "<a href='" + data.Result[i].url + "'><h2>" + data.Result[i].title +
                        "<input name='index_json'type='checkbox' style ='float: right;' value ='"+i+"''>" +
                        "</h2></a><p class='seSpam' style='color:green'>" + data.Result[i].url + "</p>" +
                        "<p>" + data.Result[i].description + "</p>" ;
      }
    html_display += "</div>";

    document.getElementById("results").innerHTML = html_display;
    document.getElementById("results_num").innerHTML = number_results;

}

function convertIntoStandardJSON(data){
    var url, title, description;
    var count, parsed_data;
    //initialize tempData
    var tempdata =  "{\n \"Result\" : [";

    var count = data.items.length;

      for(var i = 0; i < count; i++){
        url = data.items[i].link;
        title = data.items[i].title;
        description = data.items[i].snippet;

        if(i == count - 1){
          tempdata += "{\"title\":\"" + title +
                 "\",\"url\":\"" + url +
                 "\",\"description\":\"" + description + "\"}";
        } else{
          tempdata += "{\"title\":\"" + title +
                 "\",\"url\":\"" + url +
                 "\",\"description\":\"" + description + "\"},";
        }
      }
      tempdata +="]}";

  //deletes all the extra spaces that are causing the problem
  tempdata = tempdata.replace(/(\r\n|\n|\r|)/gm,"");

  tempdata = tempdata.replace(/<b>/g,'');
  tempdata = tempdata.replace(/''/g,'');
  tempdata = tempdata.replace(/<\/\b>/g,'');
  // tempdata = tempdata.replace('/'g,'');




  parsed_data = JSON.parse(tempdata);
  console.log(parsed_data);
  // parsed_data = tempdata;
  return parsed_data;
}
