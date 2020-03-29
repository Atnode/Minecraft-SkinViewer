<?php
$file = $_GET['filename'];
header('Content-Type: application/octet-stream');
header("Content-Transfer-Encoding: Binary"); 
header("Content-disposition: attachment; filename=\"" . basename($file) . "\""); 
readfile($file);
?>
 