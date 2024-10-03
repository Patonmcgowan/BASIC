#!/usr/bin/php
<?php
echo "/home/jfriesen/public_html/articles/bb/programs/".$_GET["name"];
if (unlink("/home/jfriesen/public_html/articles/bb/programs/".$_GET["name"]) == FALSE)
   echo "unable to delete file\n";
?>