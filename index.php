<?php
   $lc = ""; 
   if(isset($_SERVER['HTTP_ACCEPT_LANGUAGE']))
   	$lc = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
   if($lc == "fr"){
   	$lang = "fr";
	$description = "Une visionneuse de skins Minecraft.";
   } else if($lc == "en"){
   	$lang = "en";
	$description = "A Minecraft skins viewer.";
   }
   else{
   	$lang = "en";
   }
?>
<!DOCTYPE html>
<html>
<?php if($lang == "en"){echo "<html lang='en'>";} else {echo "<html lang='fr'>";} ?>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="description" content="<?php echo $description; ?>"/>
	<meta property="og:title" content="Minecraft SkinViewer"/>
	<meta property="og:description" content="<?php echo $description; ?>"/>
	<meta property="og:image" content="img/logo.png"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Minecraft SkinViewer</title>
    <link rel="icon" type="image/png" href="img/logo.png" />
    <link href="css/metro.min.css" rel="stylesheet">
    <link href="css/metro-icons.min.css" rel="stylesheet">
    <link href="css/metro-responsive.min.css" rel="stylesheet">
    <link href="css/metro-schemes.min.css" rel="stylesheet">
    <link href="css/mc-skinviewer.css" rel="stylesheet">
    <script src="js/jquery.min.js"></script>
    <script src="js/metro.min.js"></script>
    <script src="libs/i18n/CLDRPluralRuleParser.js"></script>
    <script src="libs/i18n/jquery.i18n.js"></script>
    <script src="libs/i18n/jquery.i18n.messagestore.js"></script>
    <script src="libs/i18n/jquery.i18n.language.js"></script>
    <script src="libs/i18n/jquery.i18n.fallbacks.js"></script>
    <script src="libs/i18n/jquery.i18n.parser.js"></script>
    <script src="libs/i18n/jquery.i18n.emitter.js"></script>
    <script src="libs/i18n/jquery.i18n.emitter.bidi.js"></script>
    <script src="libs/i18n/main-jquery_i18n.js"></script>
    <script src="js/mc-skinviewer.js"></script>
	<?php if($lang == "fr"){echo "<script>$.i18n({locale: 'fr'})</script>";} else {echo "<script>$.i18n({locale: 'en'})</script>";} ?>
</head>

<body>
    <div data-role="dialog" id="username" class="dialog" data-close-button="true" data-windows-style="true" style="padding: 20px !important;">
        <div class="container">
            <label data-i18n="modal1"></label>
            <div class="input-control text full-size">
                <input type="text" id="username-text" placeholder="Jeb_">
            </div>
            <div class="buttoncontainer"><button class="button" id="username-confirm" data-i18n="ok"></button><button class="button" id="cancel" data-i18n="cancel"></button></div>
        </div>
    </div>
    <div data-role="dialog" id="url" class="dialog" data-close-button="true" data-windows-style="true" style="padding: 20px !important;">
        <div class="container">
            <label data-i18n="modal2"></label>
            <div class="input-control text full-size">
                <input type="text" id="url-text" placeholder="http://www.exemple.com/skin.png">
            </div>
            <div class="buttoncontainer"><button class="button" id="url-confirm" data-i18n="ok"></button><button class="button" id="cancel" data-i18n="cancel"></button></div>
        </div>
    </div>
    <div data-role="dialog" id="apply-pe" class="dialog" data-close-button="true" data-windows-style="true" style="padding: 20px !important;">
        <div class="container">
            <p data-i18n="modal3-1"></p>
            <p class="bitly"></p>
            <p data-i18n="modal3-2"></p>
        </div>
        <span class="dialog-close-button"></span>
    </div>
    <div data-role="dialog" id="help" class="dialog" data-close-button="true" data-windows-style="true" style="padding: 20px !important;">
        <div class="container">
            <p data-i18n="modal4-1"></p>
            <p data-i18n="modal4-2"></p>
            <p data-i18n="modal4-3"></p>
            <p data-i18n="modal4-4"></p>
            <p>Version 1.2.1</p>
            <div class="buttoncontainer"><a href="https://framagit.org/Atnode/Minecraft-SkinViewer" target="_blank" class="button" style="margin-right: 10px;" data-i18n="modal4-5"></a></div>
        </div>
        <span class="dialog-close-button"></span>
    </div>
    <div class="app-bar fixed-top darcula" data-role="appbar">
        <span class="app-bar-divider"></span>
        <a class="app-bar-element branding"><img src="img/logo.png" style="height: 28px; display: inline-block; margin-right: 10px;">Minecraft SkinViewer</a>
        <span class="app-bar-divider"></span>
        <ul class="app-bar-menu">
            <li data-flexorderorigin="1" data-flexorder="2" class="">
                <a href="" class="dropdown-toggle" data-i18n="menu1"></a>
                <ul class="d-menu" data-role="dropdown" style="display: none;">
                    <li><a href="#username" data-i18n="username"></a></li>
                    <li><a href="#url" data-i18n="url"></a></li>
                </ul>
            </li>
            <li data-flexorderorigin="1" data-flexorder="2" class="">
                <a href="" class="dropdown-toggle" data-i18n="menu2"></a>
                <ul class="d-menu" data-role="dropdown" style="display: none;">
                    <li><a class="save" href="#save" target="_blank" data-i18n="png" download></a></li>
                    <li><a class="apply-account" href="#apply-account" target="" data-i18n="net"></a></li>
                    <li><a href="#apply-pe" data-i18n="pe"></a></li>
                </ul>
            </li>
            <li data-flexorderorigin="3" data-flexorder="4"><a href="#help" data-i18n="about"></a></li>
        </ul>
        <span class="app-bar-divider"></span>
    </div>
    <div id="content"></div>
</body>
</html>