#!/usr/bin/php
<?php
$name = $_POST["name"];
$listing = $_POST["listing"];
$fh = fopen("/home/jfriesen/public_html/articles/bb/programs/".$name, 'wb');
if ($fh == FALSE)
   echo "unable to save to file\n";
else
{
   fwrite($fh, $listing);
   fclose($fh);
   echo "file saved\n";
}
?>