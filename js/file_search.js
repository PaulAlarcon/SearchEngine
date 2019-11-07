var parsedData;
var checkboxes = document.getElementsByName("index_json");
var selectedboxes = [];

var input;
var filelocation;
var fileText;

var XMLparser;

var openFile = function(event) {
    var input = event.target;
    var reader = new FileReader();
    var ext;
    var name;
    reader.onload = function(){
        fileText = reader.result;
        name = input.files[0].name;
        var nameArr = name.split('.');
        ext = nameArr[nameArr.length - 1];
        showUploadedResults(fileText , ext);
      };

    reader.readAsText(input.files[0]);
  }

function showUploadedResults(text, extension){
    //if JSON parse JSON
      if(extension == 'json'){
        parsedData = JSON.parse(text);
        displayJSON(parsedData);

      }
      // if XML parse XML
      else if(extension == 'xml'){
        parser = new DOMParser();
        parsedData = parser.parseFromString(text,"text/xml");
        displayXML(parsedData);
      }

      else if(extension == 'csv'){
          displayCSV(text);
      }
      else{
        window.alert("file not supported");
      }
    }

function displayJSON(data){

    var count = Object.keys(data.Result).length;

    var resultNum = "<h3>Found "+ count +" results.</h3>" +
    "<input type='button' class='btn btn-outline-success my-2 my-sm-0'  value='Download JSON' onclick='downloadSelectedResults(\"json\")'>" +
    "<input type='button' class='btn btn-outline-success my-2 my-sm-0'  value='Download XML' onclick='downloadSelectedResults(\"xml\")'>" +
    "<input type='button' class='btn btn-outline-success my-2 my-sm-0'  value='Download CSV' onclick='downloadSelectedResults(\"csv\")'>" +
    "<div id='downloadLinkanchor'></div>";

    var htmldisplay = "<div class='results_table container'>";

      for(var i = 0; i < count; i++){
        htmldisplay +=  "<div id='results container'>" +
                        "<a href='" + data.Result[i].url + "'><h2>" + data.Result[i].title +
                        "<input name='index_json'type='checkbox' style ='float: right;' value ='"+i+"''>" +
                        "</h2></a><p class='seSpam' style='color:green'>" + data.Result[i].url + "</p>" +
                        "<p>" + data.Result[i].description + "</p>" ;
      }
    htmldisplay += "</div>";

    // console.log(htmldisplay);
    document.getElementById("divResults").innerHTML = resultNum;
    document.getElementById("app").innerHTML = htmldisplay;
}


function displayXML(data){
  var title;
  var url;
  var description;

  var jsonText;

    count = data.getElementsByTagName("title").length;

    var resultNum = "<h3>Found "+ count +" results.</h3>" +
                    "<input type='button' class='btn btn-outline-success my-2 my-sm-0'  value='Download JSON' onclick='downloadSelectedResults(\"json\")'>" +
                    "<input type='button' class='btn btn-outline-success my-2 my-sm-0'  value='Download XML' onclick='downloadSelectedResults(\"xml\")'>" +
                    "<input type='button' class='btn btn-outline-success my-2 my-sm-0'  value='Download CSV' onclick='downloadSelectedResults(\"csv\")'>" +
                    "<div id='downloadLinkanchor'></div>";

    var htmldisplay = "<div class='results_table container'>";

    jsonText =  "{ \"Result\" : [";

      for(var i = 0; i < count; i++){

        url = data.getElementsByTagName("url")[i].childNodes[0].nodeValue;
        title = data.getElementsByTagName("title")[i].childNodes[0].nodeValue;
        description = data.getElementsByTagName("description")[i].childNodes[0].nodeValue

        htmldisplay +=  "<div id='results container'><a href='" + url +"'><h2>" + title +
                        "<input name='index_json'type='checkbox' style ='float: right;' value ='"+i+"''>" +
                        "</h2></a><p class='seSpam' style='color:green'>" + url + "</p>" +
                        "<p>" + description + "</p>" ;

                        //CONVERTING INTO JSON

                        if(i == count-1){
                          // console.log(i);
                          jsonText += "{\"title\":\"" + title +
                                 "\",\"url\":\"" + url +
                                 "\",\"description\":\"" + description + "\"}";
                        } else{
                          jsonText += "{\"title\":\"" + title +
                                 "\",\"url\":\"" + url +
                                 "\",\"description\":\"" + description + "\"},";
                        }

      }
    jsonText +="]}";
    htmldisplay += "</div>";

    document.getElementById("divResults").innerHTML = resultNum;
    document.getElementById("app").innerHTML = htmldisplay;
    console.log(jsonText);
    parsedData = JSON.parse(jsonText);
    console.log(parsedData);

}

function displayCSV(data){
    var arr = [];
    var doubleArr = [];
    var temp = [];

    var title;
    var url;
    var description;

    var jsonText;

    arr = data.split("\n");
    // arr.pop(); //pop since the last line generates an extra space

    for( var i = 0; i < arr.length; i++){
      //creates escaping problems YOU can use JQuery
      temp = arr[i].split(",");
      doubleArr[i] = [];
        for(var j = 0; j < temp.length; j++){
          doubleArr[i][j] = temp[j];
    }
  }


    count = arr.length;

    var resultNum = "<h3>Found "+ count +" results.</h3>" +
                    "<input type='button' class='btn btn-outline-success my-2 my-sm-0'  value='Download JSON' onclick='downloadSelectedResults(\"json\")'>" +
                    "<input type='button' class='btn btn-outline-success my-2 my-sm-0'  value='Download XML' onclick='downloadSelectedResults(\"xml\")'>" +
                    "<input type='button' class='btn btn-outline-success my-2 my-sm-0'  value='Download CSV' onclick='downloadSelectedResults(\"csv\")'>" +
                    "<div id='downloadLinkanchor'></div>";

    var htmldisplay = "<div class='results_table container'>";
    jsonText =  "{ \"Result\" : [";
      for(var i = 0; i < count; i++){
          title = doubleArr[i][0];
          url = doubleArr[i][1];
          description = doubleArr[i][2];

          htmldisplay +=  "<div id='results container'><a href='" + url +"'><h2>" + title +
                          "<input name='index_json'type='checkbox' style ='float: right;' value ='"+i+"''>" +
                          "</h2></a><p class='seSpam' style='color:green'>" + url + "</p>" +
                          "<p>" + description + "</p>" ;

                          //CONVERTING INTO JSON

                          if(i == count-1){
                            // console.log(i);
                            jsonText += "{\"title\":\"" + title +
                                   "\",\"url\":\"" + url +
                                   "\",\"description\":\"" + description + "\"}";
                          } else{
                            jsonText += "{\"title\":\"" + title +
                                   "\",\"url\":\"" + url +
                                   "\",\"description\":\"" + description + "\"},";
                          }
      }
    jsonText +="]}";
    htmldisplay += "</div>";
    document.getElementById("divResults").innerHTML = resultNum;
    document.getElementById("app").innerHTML = htmldisplay;

    //parsedData is a global variable that changes according to what's shown in the screen
    parsedData = JSON.parse(jsonText);

}

  function showResults(){
        input = document.getElementById('jsonSearchInput').value.toLowerCase();
        filelocation = "/files/" + input + ".json"
        var JSONreq = new XMLHttpRequest();
        JSONreq.onreadystatechange = function(){
          if(JSONreq.readyState === 4) {
            if(JSONreq.status === 200){
            parsedData = JSON.parse(JSONreq.responseText);
          console.log(parsedData);
          var count = Object.keys(parsedData.Result).length;

          var resultNum = "<h3>Found "+ count +" results.</h3>" +
          "<input type='button' class='btn btn-outline-success my-2 my-sm-0'  value='Download JSON' onclick='downloadSelectedResults(\"json\")'>" +
          "<input type='button' class='btn btn-outline-success my-2 my-sm-0'  value='Download XML' onclick='downloadSelectedResults(\"xml\")'>" +
          "<input type='button' class='btn btn-outline-success my-2 my-sm-0'  value='Download CSV' onclick='downloadSelectedResults(\"csv\")'>" +
                          "<div id='downloadLinkanchor'></div>";

          var htmldisplay = "<div class='results_table container'>";
          for(var i = 0; i < count; i++){
            htmldisplay +=  "<div id='results container'>" +
                            "<a href='" + parsedData.Result[i].url + "'><h2>" + parsedData.Result[i].title +
                            "<input name='index_json'type='checkbox' style ='float: right;' value ='"+i+"''>" +
                            "</h2></a><p class='seSpam' style='color:green'>" + parsedData.Result[i].url + "</p>" +
                            "<p>" + parsedData.Result[i].description + "</p>" ;
          }
          htmldisplay += "</div>";

          // console.log(htmldisplay);
          document.getElementById("divResults").innerHTML = resultNum;
          document.getElementById("app").innerHTML = htmldisplay;
        }
      }
    };
    JSONreq.open('GET', filelocation );
    JSONreq.send();
  }

// DOWNLOAD RESULTS

function downloadSelectedResults(filetype){
  var url, title, description;
  var urlDownLoad;
  var txt = "";

  //checking the checked boxes
    for(var i = 0; i < checkboxes.length; i++) {
      if(checkboxes[i].checked){
        selectedboxes.push(i);
      }
    }
    //================================== JSON =========================================
    if(filetype == "json"){
        txt =  "{ \"Result\" : [";
        var num;
        for(var i = 0; i < selectedboxes.length; i++){
          num = selectedboxes[i];
          if(i == selectedboxes.length-1){
            // console.log(i);
            txt += "{\"title\":\"" + parsedData.Result[num].title + "\",\"url\":\"" +
                              parsedData.Result[num].url + "\",\"description\":\"" +
                              parsedData.Result[num].description + "\"}";
          } else{
            txt += "{\"title\":\"" + parsedData.Result[num].title + "\",\"url\":\"" +
                              parsedData.Result[num].url + "\",\"description\":\"" +
                              parsedData.Result[num].description + "\"},";
          }
      }
      txt +="]}";
      urlDownLoad = "<a href= 'data:text/plain," +  txt + " ' download=\"file.json\"\>Download JSON</a>";
      filetype = "";
    }
    //================================== CSV =========================================
    else if(filetype == "csv"){
      var num;
      for(var i = 0; i < selectedboxes.length; i++){
        num = selectedboxes[i];
        url = parsedData.Result[num].url;
        title = parsedData.Result[num].title;
        description = parsedData.Result[num].description;

        txt += title + "," + url + "," + description + "\n"
        console.log(txt);
      }
      urlDownLoad = "<a href= 'data:text/plain," +  txt + " ' download=\"file.csv\"\>Download CSV</a>";
    }
    //================================== XML =========================================
    else if(filetype == "xml"){
      txt =  '<?xml version="1.0" encoding="UTF-8"?>\n<results>\n';
      var num;
      for(var i = 0; i < selectedboxes.length; i++){
        num = selectedboxes[i];
        url = parsedData.Result[num].url;
        title = parsedData.Result[num].title;
        description = parsedData.Result[num].description
        ;

        txt += "<result>\n<title>"+ title +"</title>\n" +
                "<url>"+ url +"</url>\n" +
                "<description>"+ description +"</description>\n</result>\n";
      }
      txt +="</results>";
      urlDownLoad = "<a href= 'data:text/plain," +  txt + " ' download=\"file.xml\"\>Download XML</a>";
    }

    else{
      console.log("not working");
    }
    document.getElementById("downloadLinkanchor").innerHTML = urlDownLoad;

    //Cleans the selectedboxes array
    selectedboxes.length = 0;
  }
