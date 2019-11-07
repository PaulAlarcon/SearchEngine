<?php

$root = $_GET["url_crawl"];

$Queue = array();

function connect(){
    static $conn;
    if ($conn === NULL)
    {
      // $conn = mysqli_connect ("127.0.0.1", "user331", "mysql?", "db331");
      $conn = mysqli_connect ("searchenginedb.cnxtpk1sq2xi.us-east-1.rds.amazonaws.com", "SEDB", "mysql123", "search_engine");
    }
    return $conn;
}

function scrapper($url){
  $conn = connect();
  $doc = new DOMDocument();
  if ($conn->connect_error)
  {
      die("Connection failed: " . $conn->connect_error);
  }

	@$doc->loadHTML(@file_get_contents($url, false, $context));

  $title = $doc->getElementsByTagName("title");

  if ($title){
  $title = $title->item(0)->nodeValue;
  }
  else{
    $title = "";
  }

  $body = $doc->getElementsByTagName("body");
  $body = $body->item(0)->nodeValue;

  $body = preg_replace(array('/\s{2,}/', '/[\t\n]/'), ' ', $body);
  //removing single quoutes and double quoutes
  $body = str_replace("'", "", $body);
  // echo print_r($body_arr)."\n";

  $description = substr( $body ,0, 200);
  $keywords = "";

  $metas = $doc->getElementsByTagName("meta");

  // for ($i = 0; $i < $metas->length; $i++) {
  //   $meta = $metas->item($i);
  //   // Get the description and the keywords.
  //   if (strtolower($meta->getAttribute("name")) == "description")
  //     $description = $meta->getAttribute("content");
  // }

  $lastIndexed = date("Y/m/d");
  $timeToIndex = date("h:i:sa");

  $lastModified = "";

  $insert_page = "INSERT INTO page (url, title, description, lastModified, lastIndexed, timeToindex)VALUES('".$url. "','".$title."','".$description."','".$lastModified."','".$lastIndexed."','".$timeToIndex."') ";

  $appearances = checkPage($url);

  if($appearances > 0){
    parseBody($url, $body);
  }
  else {
    $conn->query($insert_page);
    parseBody($url, $body);
  }
}

function get_links($url){

  global $Queue;

  $doc = new DOMDocument();
  @$doc->loadHTML(@file_get_contents($url, false, $context));
  $linklist = $doc->getElementsByTagName("a");

  // $arr = array();

  // if (!in_array($url, $Queue)) {
      $Queue[] = $url;
    // }
  //take $numberPag links per page
  for($i = 0; $i < 10; $i++) {
    if($linklist[$i]){
      $l =  $linklist[$i]->getAttribute("href");
      // Process all of the links we find. This is covered in part 2 and part 3 of the video series.
      if (substr($l, 0, 1) == "/" && substr($l, 0, 2) != "//") {
        $l = parse_url($url)["scheme"]."://".parse_url($url)["host"].$l;
      } else if (substr($l, 0, 2) == "//") {
        $l = parse_url($url)["scheme"].":".$l;
      } else if (substr($l, 0, 2) == "./") {
        $l = parse_url($url)["scheme"]."://".parse_url($url)["host"].dirname(parse_url($url)["path"]).substr($l, 1);
      } else if (substr($l, 0, 1) == "#") {
        $l = parse_url($url)["scheme"]."://".parse_url($url)["host"].parse_url($url)["path"].$l;
      } else if (substr($l, 0, 3) == "../") {
        $l = parse_url($url)["scheme"]."://".parse_url($url)["host"]."/".$l;
      } else if (substr($l, 0, 11) == "javascript:") {
        continue;
      } else if (substr($l, 0, 5) != "https" && substr($l, 0, 4) != "http") {
        $l = parse_url($url)["scheme"]."://".parse_url($url)["host"]."/".$l;
      }

      //finally add the link to the QUEUE
      // $Queue[] = $l;

    }
  }

  for($i = 0; $i < 5; $i++){
    getLinks2($Queue[$i]);
    getLinks2(count($Queue)-9);
  }

  // echo count($Queue);

}

function parseBody($url, $body){
  $conn = connect();

  $page_id = getPageID($url);
  $numWords = 100;

  $words = strtr($body, array('.' => '', ',' => '', '!' => ''));
  $words = strtolower($words);

      //Converts it into an array
  $words_arr = explode(" ", $words);

      //Getting rid of dupes

  $freq = array_count_values($words_arr);

  for($i = 0 ; $i < $numWords; $i++ ){
    $freq_num = $freq[$words_arr[$i]];
    insert_word($page_id, $words_arr[$i], $freq_num);
    }
}

function insert_word($page_id, $word, $frequency ){
  $conn = connect();

  $appearances = checkWord($word);

  if($appearances > 0){
    $word_id = getWordID($word);
  }
  else{
      $insert_word = "INSERT INTO word (wordName)VALUES('$word')";
      $conn->query($insert_word);
      echo $insert_word."<br/>";
      $word_id = getWordID($word);
  }

  $insert_word_page = "INSERT INTO page_word (page_id, word_id, freq)VALUES($page_id, $word_id, $frequency)";

  echo $insert_word_page."<br/>";

  $conn->query($insert_word_page);

}

function checkWord($word){
  $conn = connect();
  $exists = "select count(*) from word WHERE wordName = '$word'";
  $size = "count(*)";
  $result = $conn->query($exists);
  $row = $result->fetch_assoc();
  $appearances = $row[$size];

  return $appearances;
}

function checkPage($url){
  $conn = connect();
  $exists = "select count(*) from page WHERE url like '$url'";
  $size = "count(*)";
  $result = $conn->query($exists);
  $row = $result->fetch_assoc();
  $appearances = $row[$size];

  return $appearances;
}

function getWordID($word){
  $conn = connect();

  $get_id = "select * from word WHERE wordName like '$word'";
  $attribute = "word_id";
  $result2 = $conn->query($get_id);
  $row2 = $result2->fetch_assoc();
  $word_id = $row2[$attribute];

  return $word_id;
}

function getPageID($url){
  $conn = connect();

  $get_id = "select * from page WHERE url like '$url'";
  $attribute = "page_id";
  $result2 = $conn->query($get_id);
  $row2 = $result2->fetch_assoc();
  $page_id = $row2[$attribute];

  return $page_id;
}

function getLinks2($url){

  Global $Queue;

  $doc = new DOMDocument();
  @$doc->loadHTML(@file_get_contents($url, false, $context));
  $linklist = $doc->getElementsByTagName("a");

  $j = 0;
  for($i = 0; $i < 15; $i++) {
    if($linklist[$i]){
      $l =  $linklist[$i]->getAttribute("href");
      // Process all of the links we find. This is covered in part 2 and part 3 of the video series.
      if (substr($l, 0, 1) == "/" && substr($l, 0, 2) != "//") {
        $l = parse_url($url)["scheme"]."://".parse_url($url)["host"].$l;
      } else if (substr($l, 0, 2) == "//") {
        $l = parse_url($url)["scheme"].":".$l;
      } else if (substr($l, 0, 2) == "./") {
        $l = parse_url($url)["scheme"]."://".parse_url($url)["host"].dirname(parse_url($url)["path"]).substr($l, 1);
      } else if (substr($l, 0, 1) == "#") {
        $l = parse_url($url)["scheme"]."://".parse_url($url)["host"].parse_url($url)["path"].$l;
      } else if (substr($l, 0, 3) == "../") {
        $l = parse_url($url)["scheme"]."://".parse_url($url)["host"]."/".$l;
      } else if (substr($l, 0, 11) == "javascript:") {
        continue;
      } else if (substr($l, 0, 5) != "https" && substr($l, 0, 4) != "http") {
        $l = parse_url($url)["scheme"]."://".parse_url($url)["host"]."/".$l;
      }

      if (!in_array($l, $Queue)) {
      $Queue[] = $l;
      $j++;
      }

    }
    if($j == 10) return;
  }
}

get_links($root);

foreach($Queue as $q){
  scrapper($q);
}



 ?>
