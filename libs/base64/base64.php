<?php

if (isset($_GET['url'])) {
	
	$file = $_GET['url'];
	
    $data   = base64_encode(file_get_contents($file));
	
    $date   = time();
	
    $result = array(
        "url" => "$file",
        "image" => "data:text/html;charset=UTF-8;base64,$data",
        "time" => "$date"
    );
    
    echo "Base64convert(" . stripslashes(json_encode($result)) . ")";
    
} else {
    echo "Nothing to show.";
}

?> 

