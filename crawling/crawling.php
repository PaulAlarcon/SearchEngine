<?php

//notes: crawler has problems accessing the VENUS url, using relative link for now.
//handling links is a work in progress.

ini_set('display_startup_errors', true);
error_reporting(E_ALL);
ini_set('display_errors', true);

$start = "http://ec2-54-167-228-185.compute-1.amazonaws.com/";

function getLinks($url){

  $doc = new DOMDocument();
  $doc->loadHTML(file_get_contents($url));

  $linklist = $doc->getElementsByTagName("a");

  foreach ($linklist as $link) {
		$l =  $link->getAttribute("href");


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

    echo $l."\n"."\n";

		// If the link isn't already in our crawl array add it, otherwise ignore it.
		// if (!in_array($l, $already_crawled)) {
		// 		$already_crawled[] = $l;
		// 		$crawling[] = $l;
		// 		// Output the page title, descriptions, keywords and URL. This output is
		// 		// piped off to an external file using the command line.
		// 		echo get_details($l)."\n";
		// }
	}

}

getLinks($start);


 ?>
