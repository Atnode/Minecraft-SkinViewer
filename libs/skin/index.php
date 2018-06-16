<?php
   $lc = ""; 
   if(isset($_SERVER['HTTP_ACCEPT_LANGUAGE']))
   	$lc = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
   if($lc == "fr"){
   	$lang = "fr";
   } else if($lc == "en"){
   	$lang = "en";
   }
   else{
   	$lang = "en";
   }
?>
<!DOCTYPE html>
<html>
<?php if($lang == "fr"){echo "<html lang='fr'>";} else {echo "<html lang='en'>";} ?>
<head>
    <title>Minecraft SkinViewer</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF8">
    <meta http-equiv="X-UA-Compatible" content="chrome=1">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
	<link href="data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAIAAACyr5FlAAADH0lEQVR4nOzcMWqkBRiH8SQz2UkW2RWRdVEQL2BtZb8gFuIFxEJQ8ABW2mkh2OkJtBIsFFGUrb2DwhoN6oIS2HUJyWYm6gGebd6p5Pc7wJ93wjNflW+Wzz93fWdmvRkO/GexuzdcOF9fzM+4uFgPF/b2ph/kX/vLxXDh8nJ+xc4WPgn/V+IgiYMkDpI4SOIgiYMkDpI4SOIgiYMkDpI4SOIgiYMkDpI4SOIgiYMkDpI4SMut/O/43PpyesfVgyvzM66tpt+WzTa+b3/dP5uecTn9N/odTw4eQRwkcZDEQRIHSRwkcZDEQRIHSRwkcZDEQRIHSRwkcZDEQRIHSRwkcZDEQRIHSRyk5Xzi/bdfm49c2Z++WHB4cG1+xumDe9OJxRa+byd3fx8ufPj51/MzPDlI4iCJgyQOkjhI4iCJgyQOkjhI4iCJgyQOkjhI4iCJgyQOkjhI4iCJgyQOkjhIu5++++Zw4nC1mt9xejb9KfjFYgtnnNw7GS48+9SN+RlHRz/OR+Y8OUjiIImDJA6SOEjiIImDJA6SOEjiIImDJA6SOEjiIImDJA6SOEjiIImDJA6SOEjiIC3nLxa88s5H8ztevvXBcOH1F36dnzF/seCT75+Yn/HlN18MFz577635GZ4cJHGQxEESB0kcJHGQxEESB0kcJHGQxEESB0kcJHGQxEESB0kcJHGQxEESB0kcpN2P33hpOHHj5jPzO/ZX14cLX92+PT9j7tVbL85Hjn/5abhw548/52d4cpDEQRIHSRwkcZDEQRIHSRwkcZDEQRIHSRwkcZDEQRIHSRwkcZDEQRIHSRwkcZDEQVr+/fBiOHF+fGd+x9Hx/eHCY4v9+Rlz3373w3zk5tNXhwu7O1v4a3hykMRBEgdJHCRxkMRBEgdJHCRxkMRBEgdJHCRxkMRBEgdJHCRxkMRBEgdJHCRxkJY//3Z3OLHZbOZ3PPn49Ifxt+Ls4flw4XB1MD/jwel6uDD/IDueHDyCOEjiIImDJA6SOEjiIImDJA6SOEjiIImDJA6SOEjiIImDJA6SOEjiIImDJA6SOEj/BAAA//9so1g7pzo/WgAAAABJRU5ErkJggg==" rel="icon" type="image/x-icon" />
    <link href="css/style.css" rel="stylesheet" type="text/css">
    <script src="js/jquery.min.js"></script>
	<script src="js/jquery.getimagedata.min.js"></script>
    <script src="js/jquery.xdomainajax.js"></script>
    <script src="js/jquery.event.wheel-1.0.js"></script>
	<script src="../i18n/CLDRPluralRuleParser.js"></script>
    <script src="../i18n/jquery.i18n.js"></script>
    <script src="../i18n/jquery.i18n.messagestore.js"></script>
    <script src="../i18n/jquery.i18n.language.js"></script>
    <script src="../i18n/jquery.i18n.fallbacks.js"></script>
    <script src="../i18n/jquery.i18n.parser.js"></script>
    <script src="../i18n/jquery.i18n.emitter.js"></script>
    <script src="../i18n/jquery.i18n.emitter.bidi.js"></script>
    <script src="../i18n/main-jquery_i18n.js"></script>
    <script src="js/script.js"></script>
	<?php if($lang == "fr"){echo "<script>$.i18n({locale: 'fr'})</script>";} else {echo "<script>$.i18n({locale: 'en'})</script>";} ?>
  </head>
  <body style="background: none">

    <div id="all" class="hidebuttons">
    <canvas id="display" class="centered"></canvas>

    <div id="showSkin">
      <canvas class="skin" id="skin" width="64" height="32"></canvas>
      <canvas class="skin" id="skinMap" width="512" height="256" style="width: 64px; height: 32px;"></canvas>
      <span id="hideSkin" style="display:none">◳</span> <!--⇗-->
    </div>
    
    <div id="toolbar">
        <div id="coord" class="centered" style="height:38px;max-width: 480px;padding-bottom: 0px;padding-top: 0px;">
          <div class="button" id="play" style="cursor: pointer;width: 13%;float: left;height: 100%;font-size: 32px;color: #ffffff;padding: 0;" onclick="play()">&#9654;</div>
          <div class="button" id="rotateleft" style="float: left;height: 100%;width: 13%;padding: 0;font-size: 32px;">&larr;</div>
          <div class="button" id="rotateright" style="width: 13%;padding: 0;height: 100%;font-size: 32px;float: left;">&rarr;</div>
          <div class="button" id="zoomin" style="float: left;width: 13%;height: 100%;padding: 0;font-size: 32px;">-</div>
          <div class="button" id="zoomout" style="float: left;height: 100%;width: 13%;font-size: 32px;padding: 0;">+</div>
          <select id="position" style="width: 23%;height: 100%;position:absolute;right:0;font-family: 'Roboto', sans-serif;"></select>
        </div>
    </div>
	
	<script>
      if (!/no-buttons/.test(location.href)) $('#all').removeClass('hidebuttons');
    </script>  

  </body>
</html>