# QRCode-URL 

2015 - Timo van Neerden


This is QRCode-URL, a PHP based QRCode generator based on PHP-QRCode by Dominik Dzienia.


## Requirements
  * PHP 5.3
  * PHP GD (for image generation);

## Installation
  * Unzip the downloaded .zip file
  * Upload folder to your site (eg: http://example.com/qrcode)


## Usage
Create a QR-Code using this format : http://example.com/qrcode/?q=DATATEXT&s=SIZE&l=LEVEL&b=BORDERSIZE

Where the parameters are:
  * q (required) : Your text. The data you want to put in the QRCode. Keep out of url-encoding !
  * s (optionnal): An integer between 1 and 20. Defines the size of the “pixels” in the QRCode. Default: 4.
  * l (optionnal): One of L, M, Q or H. Defines the error-correction level in the data. L is lowest (smaller image), H is highest (larger image). Default: M.
  * b (optionnal): An integer between 1 and 20. Defines the white border width of the QRCode (may be given, but should be left empty). Default: 4.


## Acknowledgments

QRCode-URL is based on PHP-QRCode by Dominik Dzienia, a free PHP QRCode lib.
http://sourceforge.net/projects/phpqrcode/

QR Code is registered trademarks of DENSO WAVE INCORPORATED in JAPAN and other
countries.
