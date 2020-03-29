<?php
   $ver = "3.3.0-dev";
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
<?php echo "<html lang='$lang'>"; ?>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="description" content="<?php echo $description; ?>"/>
	<meta property="og:title" content="Minecraft SkinViewer"/>
	<meta property="og:description" content="<?php echo $description; ?>"/>
	<meta property="og:image" content="img/logo.png"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Minecraft SkinViewer <?php echo substr($ver,0,3); ?></title>
    <link rel="icon" type="image/png" href="img/logo.png" />
    <link href="libs/Metro-UI-CSS-3/css/metro.min.css" rel="stylesheet">
    <link href="libs/Metro-UI-CSS-3/css/metro-icons.min.css" rel="stylesheet">
    <link href="libs/Metro-UI-CSS-3/css/metro-responsive.min.css" rel="stylesheet">
    <link href="libs/Metro-UI-CSS-3/css/metro-schemes.min.css" rel="stylesheet">
    <link href="css/mc-skinviewer.css" rel="stylesheet">
    <script src="libs/jquery/jquery.min.js"></script>
    <script src="libs/Metro-UI-CSS-3/js/metro.min.js"></script>
    <script src="libs/CLDRPluralRuleParser/CLDRPluralRuleParser.js"></script>
    <script src="libs/jquery.i18n/jquery.i18n.js"></script>
    <script src="libs/jquery.i18n/jquery.i18n.messagestore.js"></script>
    <script src="libs/jquery.i18n/jquery.i18n.language.js"></script>
    <script src="libs/jquery.i18n/jquery.i18n.fallbacks.js"></script>
    <script src="libs/jquery.i18n/jquery.i18n.parser.js"></script>
    <script src="libs/jquery.i18n/jquery.i18n.emitter.js"></script>
    <script src="libs/jquery.i18n/jquery.i18n.emitter.bidi.js"></script>
    <script src="js/mc-skinviewer.js"></script>
	<?php echo "<script>$.i18n({locale: '$lang'})</script>"; ?>
</head>

<body>
    <div class="jswarning">
		<h1>We are sorry, yet Minecraft SkinViewer needs JavaScript support to work.</h1>
		<p>Nous sommes désolé, mais Minecraft SkinViewer a besoin que le support de JavaScript soit activé pour fonctionner.</p>
	</div>
    <div class="main">
        <div data-role="dialog" id="username" class="dialog" data-close-button="true" data-windows-style="true" style="padding: 20px !important;">
            <div class="container">
                <label data-i18n="modal1">Type in a Minecraft username to open it’s skin:</label>
                <div class="input-control text full-size">
                    <input type="text" id="username-text" placeholder="Jeb_">
                </div>
                <div class="buttoncontainer"><button class="button" id="cancel" data-i18n="cancel"><button class="button" id="username-confirm" data-i18n="ok"></button></button></div>
            </div>
        </div>
        <div data-role="dialog" id="url" class="dialog" data-close-button="true" data-windows-style="true" style="padding: 20px !important;">
            <div class="container">
                <label data-i18n="modal2">Type in the full web address to a skin image:</label>
                <div class="input-control text full-size">
                    <input type="text" id="url-text" placeholder="http://www.exemple.com/skin.png">
                </div>
                <div class="buttoncontainer"><button class="button" id="cancel" data-i18n="cancel"></button><button class="button" id="url-confirm" data-i18n="ok"></button></div>
            </div>
        </div>
        <div data-role="dialog" id="apply-pe" class="dialog" data-close-button="true" data-windows-style="true" style="padding: 20px !important;">
            <div class="container">
                <p data-i18n="modal3-1">Type the web address below:</p>
                <p class="bitly"></p>
                <p data-i18n="modal3-2">Or scan the QR code on your mobile device to download the skin faster.</p>
            </div>
            <span class="dialog-close-button"></span>
        </div>
        <div data-role="dialog" id="help" class="dialog" data-close-button="true" data-windows-style="true" style="padding: 20px !important;">
            <div class="container">
                <p data-i18n="modal4-1">Minecraft SkinViewer is a Minecraft skins viewer</p>
                <p data-i18n="modal4-2">You can open a skin from an external link (for example, a direct link to the skin image), or from a Minecraft user.</p>
                <p data-i18n="modal4-3">This tool also offers you the ability to download the displayed skin, apply it to Minecraft.net or apply it to Minecraft Pocket Edition by downloading it via a QR Code or a web address.</p>
                <p data-i18n="modal4-4">This tool uses the following open source libraries:</p>
                <ul>
                    <li><a href="https://github.com/olton/Metro-UI-CSS-3" target="_blank">Metro UI CSS 3</a> - <a href="https://github.com/olton/Metro-UI-CSS-3/blob/master/LICENSE" target="_blank">MIT</a></li>
                    <li><a href="https://github.com/jquery/jquery" target="_blank">jQuery</a> - <a href="https://github.com/jquery/jquery/blob/master/LICENSE.txt" target="_blank">MIT</a></li>
                    <li><a href="https://github.com/wikimedia/jquery.i18n" target="_blank">jQuery.i18n</a> - <a href="https://github.com/wikimedia/jquery.i18n/blob/master/MIT-LICENSE" target="_blank">MIT</a></li>
                    <li><a href="https://github.com/timovn/qrcode-url" target="_blank">QRCode-URL</a></li>
                    <li><a href="https://github.com/santhoshtr/CLDRPluralRuleParser" target="_blank">CLDRPluralRuleParser</a> - <a href="https://github.com/santhoshtr/CLDRPluralRuleParser/blob/master/LICENSE.txt" target="_blank">MIT</a></li>
                    <li><a href="https://github.com/bs-community/skinview3d" target="_blank">Skinview3d</a> - <a href="https://github.com/bs-community/skinview3d/blob/master/LICENSE" target="_blank">MIT</a></li>
                </ul>
                <p data-i18n="modal4-5">This tool also uses:</p>
                <ul>
                    <li><a href="https://fonts.google.com/specimen/Lato">Lato</a> - <a href="https://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=OFL">Open Font License</a></li>
                    <li><a href="http://minotar.net/">Minotar</a></li>
                    <li><a href="https://bitly.com/">Bitly</a></li>
                </ul>
                <p>Version <?php echo $ver; ?></p>
                <div class="buttoncontainer"><a href="https://github.com/Atnode/Minecraft-SkinViewer" target="_blank" class="button" style="margin-right: 10px;" data-i18n="modal4-6"></a></div>
            </div>
            <span class="dialog-close-button"></span>
        </div>
        <div class="app-bar fixed-top darcula gradient" data-role="appbar">
            <a class="app-bar-element branding"><img src="img/logo.png" style="height: 28px; display: inline-block; margin-right: 10px;">Minecraft SkinViewer <?php echo substr($ver,0,3); ?></a>
            <span class="app-bar-divider"></span>
            <ul class="app-bar-menu">
                <li data-flexorderorigin="1" data-flexorder="2" class="">
                    <a href="" class="dropdown-toggle" data-i18n="menu1">Open a skin...</a>
                    <ul class="d-menu" data-role="dropdown" style="display: none;">
                        <li><a href="#username" data-i18n="username">from an username</a></li>
                        <li><a href="#url" data-i18n="url">from an URL</a></li>
                    </ul>
                </li>
                <li data-flexorderorigin="2" data-flexorder="3" class="">
                    <a href="" class="dropdown-toggle" data-i18n="menu2">Save/apply a skin...</a>
                    <ul class="d-menu" data-role="dropdown" style="display: none;">
                        <li><a class="save" href="#save" target="_blank" data-i18n="png" download>in .png format</a></li>
                        <li><a class="apply-account" href="#apply-account" target="" data-i18n="net">on Minecraft.net</a></li>
                        <li><a href="#apply-pe" data-i18n="pe">on Minecraft PE</a></li>
                    </ul>
                </li>
                <li data-flexorderorigin="3" data-flexorder="4"><a href="#help" data-i18n="about">About...</a></li>
            </ul>
        </div>
        <div id="content"></div>
    </div>
</body>
<script>
    $('div.jswarning').css('display','none');
    $('div.main').css('visibility','visible');
</script>
</html>