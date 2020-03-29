<!DOCTYPE html>
<html>
<head>
  <title>3DSkinViewer</title>
  <meta content="text/html; charset=utf-8" http-equiv="Content-Type">
  <meta content="chrome=1" http-equiv="X-UA-Compatible">
  <meta content="width=device-width, initial-scale=1, maximum-scale=1" name="viewport">
  <link href="css/style.css" rel="stylesheet" type="text/css">
  <script src="../../libs/jquery/jquery.min.js"></script>
  <script src="../../libs/skinview3d/skinview3d.bundle.js"></script>
</head>
<body style="background: none">
  <div id="skin_container"></div>
  <a class="btn" id="anim" href="#">▶</a>
  <script>
    let skinViewer = new skinview3d.SkinViewer({
      domElement: document.getElementById("skin_container"),
      width: window.innerWidth,
      height: window.innerHeight,
      skinUrl: "<?php if (isset($_GET['url'])) {echo $_GET['url'];} ?>"
    });


    let control = skinview3d.createOrbitControls(skinViewer);
    control.enableRotate = true;
    control.enableZoom = true;
    control.enablePan = true;
    skinViewer.camera.position.z = 90
    skinViewer.animations.speed = 0.7;

    $(window).bind('resize', function(e) {
      skinViewer.width =  window.innerWidth;
      skinViewer.height =  window.innerHeight;
    });

    click = 0;
    document.getElementById("anim").addEventListener("click", () => {
      if (click == 0) {
        let rotate = skinViewer.animations.add(skinview3d.RotatingAnimation);
        let walk = skinViewer.animations.add(skinview3d.WalkingAnimation);
        click = 1;
        $('#anim').html('&#9208;');
      } else {
        skinViewer.animations.paused = !skinViewer.animations.paused;
        if (skinViewer.animations.paused == false) {
          $('#anim').html('&#9208;'); 
        } else {
          $('#anim').html('&#9654;'); 
        }
      }
    });
  </script>
</body>
</html>