<?php
    if(isset($_POST['submit'])){
  		$name=$_POST['name'];
  		$email=$_POST['email'];
      $subject=$_POST['subject'];
  		$message=$_POST['message'];

  		$subject1="Subject: ".$subject;
  		$message1="Name :".$name."\n"."Says: ".$message;
  		$from="From: ".$email;

		if(mail("pa.f.e@hotmail.com", $subject1, $message1, $from)){
			echo "<h1>Thank you for your consideration"." ".$name.", We will reply ASAP</h2>";
		}
		else{
			echo "Something went wrong!";
		}
	}
?>
