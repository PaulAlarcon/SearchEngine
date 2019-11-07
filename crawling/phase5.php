<?php
ini_set('display_startup_errors', true);
error_reporting(E_ALL);
ini_set('display_errors', true);

$servername = "searchenginedb.cnxtpk1sq2xi.us-east-1.rds.amazonaws.com";
$username = "SEDB";
$password = "mysql123";
$dbname = "SearchEngineDB";

$conn = new mysqli($servername, $username, $password);

if($conn->connect_error)
{
    die("Connection failed: " . $conn->connect_error);
}

//Start with a base url
$url = 'https://en.wikipedia.org/wiki/Dark_Souls';

for($i = 0; $i < 1000; $i++)
{
	$lastURL = $url;

    $url = storeWordsAndURL($url);

    if(!validTags($url))
    {
        $url = $lastURL;
    }
}

function validTags($u)
{
	$dom = new DOMDocument('1.0');
  @$dom->loadHTMLFile($u);
  $h1tags = $dom->getElementsByTagName('h1');
	$ptags = $dom->getElementsByTagName('p');

    if($h1tags->length > 0 && $ptags->length > 0)
    {
        return true;
    }else
     {
         return false;
     }
}

function storeWordsAndURL($url)
{
    $dom = new DOMDocument('1.0');
    @$dom->loadHTMLFile($url);
    $h1tags = $dom->getElementsByTagName('h1');
		$ptags = $dom->getElementsByTagName('p');
		$titletag = $dom->getElementsByTagName('title')[0]->nodeValue;
		$t = true;
		global $conn;

	foreach($h1tags as $h1tag)
	{
		$h1tagValue = str_replace("\n", "", $h1tag->nodeValue);
		$words = explode(" ", $h1tagValue);

		if(preg_match('/[a-zA-Z]/', $h1tagValue))
		{
	        foreach($ptags as $ptag)
	        {
		        $ptagValue = str_replace("\n", "", $ptag->nodeValue);
		        $ptagValue = str_replace("'", "''", $ptagValue);

		        if(preg_match('/[a-zA-Z]/', $ptagValue) && strlen($ptagValue) <= 500)
		        {
					$sql = "insert into page (title, url, description, lastModified) values ('" . $titletag . "', '" . $url . "', '" . $ptagValue . "', current_timestamp);";
					if($conn->query($sql) === TRUE){}

					foreach($words as $word)
                    {
						$word = str_replace(array(':', ';', '-', '/', '\\', ',', '_', '\'', '\"'), '', $word);
						$sql2 = "select * from page, word, page_word where page.pageId=page_word.pageId and word.wordId=page_word.wordId and Upper(word.wordName)=Upper('" . $word . "');";
						$result = $conn->query($sql2);
						$sql3 = "insert into word (wordName) values ('" . $word . "');";
						$sql4 = "insert into page_word (pageId, wordId) select p.pageId, w.wordId from page p, word w where p.url='" . $url . "' and w.wordName='" . $word . "';";

                        if($result->num_rows == 0)
						{
                            if($conn->query($sql3) === TRUE){}
							if($conn->query($sql4) === TRUE){}
						}else
						 {
							 while($row = $result->fetch_assoc())
	                         {
								 if($row["title"] == $titletag && $row["url"] == $url)
								 {
									 $t = false;
									 break;
								 }
							 }

							 if($t)
							 {
                                 if($conn->query($sql3) === TRUE){}
								 if($conn->query($sql4) === TRUE){}
						     }
						 }
                    }

					break;
		        }
	        }

			break;
		}
	}

    $aTags = $dom->getElementsByTagName('a');
    $randomLink = $aTags[rand (0, $aTags->length - 1)];
    $href = $randomLink->getAttribute('href');

    while(strpos($href, 'www') == false)
    {
         $randomLink = $aTags[rand (0, $aTags->length - 1)];
         $href = $randomLink->getAttribute('href');
    }

    return $href;
}

$conn->close();
?>
