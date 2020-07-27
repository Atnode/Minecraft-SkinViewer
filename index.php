<!--
This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see http://www.gnu.org/licenses/.
-->
<?php
   $ver = "3.3.1";
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
<html>
<head>
  <meta charset="UTF-8">
  <meta content="IE=edge" http-equiv="X-UA-Compatible">
  <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport">
  <title>Minecraft SkinViewer</title>
  <link rel="shortcut icon" href="img/logo.png">
  <link rel="manifest" href="manifest.json" />
	<meta name="description" content="<?php echo $description; ?>" />
	<meta property="og:title" content="Minecraft SkinViewer" />
	<meta property="og:description" content="<?php echo $description; ?>" />
	<meta name="author" content="Minecraft SkinViewer" />
	<meta property="og:type" content="website">
	<meta property="og:title" content="Minecraft SkinViewer" />
	<meta property="og:description" content="<?php echo $description; ?>" />
	<meta property="og:image" content="img/logo.png" />
	<meta property="og:site_name" content="Minecraft SkinViewer">
	<meta name="twitter:card" content="summary">
	<meta name="twitter:title" content="Minecraft SkinViewer">
	<meta name="twitter:site" content="@Atnode.fr">
	<meta name="twitter:image" content="img/logo.png">
	<link rel="icon" type="image/png" sizes="16x16" href="img/favicon-16x16.png" />
	<link rel="icon" type="image/png" sizes="32x32" href="img/favicon-32x32.png" />
	<link rel="icon" type="image/png" sizes="96x96" href="img/favicon-96x96.png" />
	<link rel="apple-touch-icon" sizes="57x57" href="img/apple-touch-icon.png">
	<link rel="apple-touch-icon-precomposed" sizes="76x76" href="img/apple-touch-icon-76x76.png" />
	<link rel="apple-touch-icon-precomposed" sizes="120x120" href="img/apple-touch-icon-120x120.png" />
	<link rel="apple-touch-icon-precomposed" sizes="152x152" href="img/apple-touch-icon-152x152.png" />
	<link rel="apple-touch-icon-precomposed" sizes="180x180" href="img/apple-touch-icon-180x180.png" />
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
    <div class="dialog" data-close-button="true" data-role="dialog" data-windows-style="true" id="username" style="padding: 20px !important;">
      <div class="container">
        <label data-i18n="modal1">Type in a Minecraft username to open it’s skin:</label>
        <div class="input-control text full-size">
          <input id="username-text" placeholder="Jeb_" type="text">
        </div>
        <div class="buttoncontainer">
          <button class="button" data-i18n="cancel" id="cancel"><button class="button" data-i18n="ok" id="username-confirm"></button></button>
        </div>
      </div>
    </div>
    <div class="dialog" data-close-button="true" data-role="dialog" data-windows-style="true" id="url" style="padding: 20px !important;">
      <div class="container">
        <label data-i18n="modal2">Type in the full web address to a skin image:</label>
        <div class="input-control text full-size">
          <input id="url-text" placeholder="http://www.exemple.com/skin.png" type="text">
        </div>
        <div class="buttoncontainer">
          <button class="button" data-i18n="cancel" id="cancel"></button><button class="button" data-i18n="ok" id="url-confirm"></button>
        </div>
      </div>
    </div>
    <div class="dialog" data-close-button="true" data-role="dialog" data-windows-style="true" id="apply-pe" style="padding: 20px !important;">
      <div class="container">
        <p data-i18n="modal3-1">Type the web address below:</p>
        <p class="bitly"></p>
        <p data-i18n="modal3-2">Or scan the QR code on your mobile device to download the skin faster.</p>
      </div><span class="dialog-close-button"></span>
    </div>
    <div class="dialog help" data-close-button="true" data-role="dialog" data-windows-style="true" id="help" style="padding: 20px !important;">
      <div class="container">
        <p data-i18n="modal4-1">Minecraft SkinViewer is a Minecraft skins viewer</p>
        <p data-i18n="modal4-2">You can open a skin from an external link (for example, a direct link to the skin image), or from a Minecraft user.</p>
        <p data-i18n="modal4-3">This tool also offers you the ability to download the displayed skin, apply it to Minecraft.net or apply it to Minecraft Pocket Edition by downloading it via a QR Code or a web address.</p>
        <p data-i18n="modal4-4">This tool uses the following open source libraries:</p>
        <ul>
          <li>
            <a href="https://github.com/olton/Metro-UI-CSS-3" target="_blank">Metro UI CSS 3</a> - <a href="https://github.com/olton/Metro-UI-CSS-3/blob/master/LICENSE" target="_blank">MIT</a>
          </li>
          <li>
            <a href="https://github.com/jquery/jquery" target="_blank">jQuery</a> - <a href="https://github.com/jquery/jquery/blob/master/LICENSE.txt" target="_blank">MIT</a>
          </li>
          <li>
            <a href="https://github.com/wikimedia/jquery.i18n" target="_blank">jQuery.i18n</a> - <a href="https://github.com/wikimedia/jquery.i18n/blob/master/MIT-LICENSE" target="_blank">MIT</a>
          </li>
          <li>
            <a href="https://github.com/timovn/qrcode-url" target="_blank">QRCode-URL</a>
          </li>
          <li>
            <a href="https://github.com/santhoshtr/CLDRPluralRuleParser" target="_blank">CLDRPluralRuleParser</a> - <a href="https://github.com/santhoshtr/CLDRPluralRuleParser/blob/master/LICENSE.txt" target="_blank">MIT</a>
          </li>
          <li>
            <a href="https://github.com/bs-community/skinview3d" target="_blank">Skinview3d</a> - <a href="https://github.com/bs-community/skinview3d/blob/master/LICENSE" target="_blank">MIT</a>
          </li>
        </ul>
        <p data-i18n="modal4-5">This tool also uses:</p>
        <ul>
          <li>
            <a href="https://fonts.google.com/specimen/Lato">Lato</a> - <a href="https://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=OFL">Open Font License</a>
          </li>
          <li>
            <a href="http://minotar.net/">Minotar</a>
          </li>
          <li>
            <a href="https://bitly.com/">Bitly</a>
          </li>
        </ul>
        <p>Version <?php echo $ver; ?></p>
        <div class="buttoncontainer">
          <a class="button" data-i18n="modal4-6" href="https://github.com/Atnode/Minecraft-SkinViewer" style="margin-right: 10px;" target="_blank"></a>
        </div>
      </div><span class="dialog-close-button"></span>
    </div>
    <div class="app-bar fixed-top darcula gradient" data-role="appbar">
      <a class="app-bar-element branding"><img src="img/logo.png" style="height: 28px; display: inline-block; margin-right: 10px;">Minecraft SkinViewer <?php echo substr($ver,0,3); ?></a> <span class="app-bar-divider"></span>
      <ul class="app-bar-menu">
        <li class="" data-flexorder="2" data-flexorderorigin="1">
          <a class="dropdown-toggle" data-i18n="menu1" href="">Open a skin...</a>
          <ul class="d-menu" data-role="dropdown" style="display: none;">
            <li>
              <a data-i18n="username" href="#username">from an username</a>
            </li>
            <li>
              <a data-i18n="url" href="#url">from an URL</a>
            </li>
          </ul>
        </li>
        <li class="" data-flexorder="3" data-flexorderorigin="2">
          <a class="dropdown-toggle" data-i18n="menu2" href="">Save/apply a skin...</a>
          <ul class="d-menu" data-role="dropdown" style="display: none;">
            <li>
              <a class="save" data-i18n="png" href="#save">in .png format</a>
            </li>
            <li>
              <a class="apply-account" data-i18n="net" href="#apply-account" target="">on Minecraft.net</a>
            </li>
            <li>
              <a data-i18n="pe" href="#apply-pe">on Minecraft PE</a>
            </li>
          </ul>
        </li>
        <li data-flexorder="4" data-flexorderorigin="3">
          <a data-i18n="about" href="#help">About...</a>
        </li>
      </ul>
    </div>
    <div id="content"></div>
  </div>
</body>
</html>