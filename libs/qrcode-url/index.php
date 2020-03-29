<?php


/*
	Url to make QRCodes :

	http://example.com/qrcode/?q=<DataText>&s=<size>&l=<level>&b=<border-size>

	** q (required) : Your text. The data you want to put in the QRCode. Keep out of url-encoding !
	** s (optionnal): An integer between 1 and 20. Defines the size of the “pixels” in the QRCode. Default: 4.
	** l (optionnal): One of L, M, Q or H. Defines the error-correction level in the data. L is lowest (smaller image), H is highest (larger image). Default: M.
	** b (optionnal): An integer between 1 and 20. Defines the white border width of the QRCode (may be given, but should be left empty). Default: 4.

*/

include "lib/qrlib.php";


$data =   ( (!empty($_GET['q'])                                             ) ? htmlspecialchars($_GET['q']) : 'http://lehollandaisvolant.net');
$size =   ( (!empty($_GET['s']) and is_numeric($_GET['s'])                  ) ? htmlspecialchars($_GET['s']) : 4);
$level =  ( (!empty($_GET['l']) and in_array(strtoupper($_GET['l']), str_split('LMQH')) ) ? htmlspecialchars($_GET['l']) : 'M') ;
$border = ( (!empty($_GET['b']) and is_numeric($_GET['b'])                  ) ? htmlspecialchars($_GET['b']) : 4) ;


// QRcode::png((data), (img.png||false for direct img), (level), (pointsize), (marginsize));
QRcode::png($data, false, $level, $size, $border);
