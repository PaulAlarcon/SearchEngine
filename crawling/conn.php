<?php
ini_set('display_startup_errors', true);
error_reporting(E_ALL);
ini_set('display_errors', true);

$servername = "searchenginedb.cnxtpk1sq2xi.us-east-1.rds.amazonaws.com";
$username = "SEDB";
$password = "mysql123";

// Create connection
$conn = new mysqli($servername, $username, $password);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
else {
  echo "Connected to DB";
}


?>
