<!DOCTYPE html>
<html>
<head>
  <title>Minecraft SkinViewer</title>
  <meta content="text/html; charset=utf-8" http-equiv="Content-Type">
  <meta content="chrome=1" http-equiv="X-UA-Compatible">
  <meta content="width=device-width, initial-scale=1, maximum-scale=1" name="viewport">
  <link href="data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAIAAACyr5FlAAADH0lEQVR4nOzcMWqkBRiH8SQz2UkW2RWRdVEQL2BtZb8gFuIFxEJQ8ABW2mkh2OkJtBIsFFGUrb2DwhoN6oIS2HUJyWYm6gGebd6p5Pc7wJ93wjNflW+Wzz93fWdmvRkO/GexuzdcOF9fzM+4uFgPF/b2ph/kX/vLxXDh8nJ+xc4WPgn/V+IgiYMkDpI4SOIgiYMkDpI4SOIgiYMkDpI4SOIgiYMkDpI4SOIgiYMkDpI4SMut/O/43PpyesfVgyvzM66tpt+WzTa+b3/dP5uecTn9N/odTw4eQRwkcZDEQRIHSRwkcZDEQRIHSRwkcZDEQRIHSRwkcZDEQRIHSRwkcZDEQRIHSRyk5Xzi/bdfm49c2Z++WHB4cG1+xumDe9OJxRa+byd3fx8ufPj51/MzPDlI4iCJgyQOkjhI4iCJgyQOkjhI4iCJgyQOkjhI4iCJgyQOkjhI4iCJgyQOkjhIu5++++Zw4nC1mt9xejb9KfjFYgtnnNw7GS48+9SN+RlHRz/OR+Y8OUjiIImDJA6SOEjiIImDJA6SOEjiIImDJA6SOEjiIImDJA6SOEjiIImDJA6SOEjiIC3nLxa88s5H8ztevvXBcOH1F36dnzF/seCT75+Yn/HlN18MFz577635GZ4cJHGQxEESB0kcJHGQxEESB0kcJHGQxEESB0kcJHGQxEESB0kcJHGQxEESB0kcpN2P33hpOHHj5jPzO/ZX14cLX92+PT9j7tVbL85Hjn/5abhw548/52d4cpDEQRIHSRwkcZDEQRIHSRwkcZDEQRIHSRwkcZDEQRIHSRwkcZDEQRIHSRwkcZDEQVr+/fBiOHF+fGd+x9Hx/eHCY4v9+Rlz3373w3zk5tNXhwu7O1v4a3hykMRBEgdJHCRxkMRBEgdJHCRxkMRBEgdJHCRxkMRBEgdJHCRxkMRBEgdJHCRxkJY//3Z3OLHZbOZ3PPn49Ifxt+Ls4flw4XB1MD/jwel6uDD/IDueHDyCOEjiIImDJA6SOEjiIImDJA6SOEjiIImDJA6SOEjiIImDJA6SOEjiIImDJA6SOEj/BAAA//9so1g7pzo/WgAAAABJRU5ErkJggg==" rel="icon" type="image/x-icon">
  <link href="css/style.css" rel="stylesheet" type="text/css">
  <script src="../jquery/jquery.min.js"></script>
  <script src="js/skinview3d.bundle.js"></script>
</head>
<body style="background: none">
  <div id="skin_container"></div>
  <div class="btn" id="anim">▶</div>
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