

  var parsedData;
  var checkboxes = document.getElementsByName("index_json");
  var selectedboxes = [];

  var input;
  var filelocation;
  var fileText;

  var XMLparser;


  function displayHDresults(){

    //silly way of handling two divisions

    document.getElementById('search_form').style.display = 'none';
    document.getElementById('search_display').style.display = 'block';

    filelocation = "/files/realmadrid.json"
    var JSONreq = new XMLHttpRequest();
    JSONreq.onreadystatechange = function(){
      if(JSONreq.readyState === 4) {
        if(JSONreq.status === 200){
        parsedData = JSON.parse(JSONreq.responseText);
      // console.log(parsedData);
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

      document.getElementById('HCResults').innerHTML = htmldisplay;
      document.getElementById('divResults').innerHTML = resultNum;




    }
  }
  };
  JSONreq.open('GET', filelocation );
  JSONreq.send();

  }

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
