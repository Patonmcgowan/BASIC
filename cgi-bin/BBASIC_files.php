#!/usr/bin/php
<?php
$files = scandir('/home/jfriesen/public_html/articles/bb/programs');
foreach ($files as $file) 
{
   if ($file != '.' && $file != '..')
      echo "$file\n";
}
?>