/*
Principal
*/

function scene() {
    this.solid = [];
    this.observer = [0, 0, 0];
    this.distance = -1000
}
var world = new scene();
var canvas, ctx;
var alpha = 1;
var showGrid = /showgrid/.test(location.href);
var allFaces = [];
var skin = {};
var player = {
    hat: {},
    head: {},
    body: {},
    left_arm: {},
    right_arm: {},
    left_leg: {},
    right_leg: {},
};
var offset = {
    x: 200,
    y: 130
};
var filterLayer;
var reverseMap;
$(function () {
    var g;
    canvas = document.getElementById("display");
    ctx = canvas.getContext("2d");
    imageData = ctx.createImageData(64, 32);
    testIsPointInPathIssue();
    createModel();
    skin.canvas = $("#skin")[0];
    skin.ctx = skin.canvas.getContext("2d");
    skin.imageData = skin.ctx.getImageData(0, 0, 64, 32);
    skin.map = {};
    skin.map.canvas = $("#skinMap")[0];
    skin.map.ctx = skin.map.canvas.getContext("2d");
    document.onkeydown = onKeyDown;
    canvas.onmousedown = onMouseDown;
    canvas.onmouseup = onMouseUp;
    canvas.onmousemove = onMouseMove;
    canvas.oncontextmenu = function () {
        return false
    };
    if (animating) canvas.onclick = play;
    loadSkinUrl(getSkinFromUrl() || "http://assets.mojang.com/SkinTemplates/steve.png");
    positionate();
    var c;
    $(window).resize(function (e) {
        updateCanvasSize()
    });
    updateCanvasSize();
    $("#rotate").mousedown(function (e) {
        var h = {
            x: e.pageX,
            y: e.pageY
        };
        $(document).bind("mousemove", function (i) {
            var j = {
                x: i.pageX,
                y: i.pageY
            };
            rotatePlayer(0, (j.y - h.y) / 100, (j.x - h.x) / 100);
            draw();
            h = j
        })
    });
    $("#rotateleft").bind('click touchstart', function () {
        rotatePlayer(-Math.PI / 8, 0, 0);
        draw();
        return false;
    });
    $("#rotateright").bind('click touchstart', function () {
        rotatePlayer(Math.PI / 8, 0, 0);
        draw();
        return false;
    });
    $("#zoomin").bind('click touchstart', function () {
        world.distance += 300;
        draw()
    });
    $("#zoomout").bind('click touchstart', function () {
        world.distance -= 300;
        draw()
    });
    for (var a in positions) {
        $("<option>").attr("value", a).text(a).appendTo("#position")
    }
    $("#position").change(function () {
        changePosition(positions[$(this).attr("value")]);
        draw()
    })
});

function createModel(playerItem) {
    function shareColors(source, destination) {
        for (var part in source) {
            for (var i = 0; i < Math.min(source[part].length, destination[part].length); i++) {
                destination[part][i].fillcolor = source[part][i].fillcolor;
                destination[part][i].linecolor = source[part][i].linecolor;
                destination[part][i].map = source[part][i].map
            }
        }
    }
    player = {
        hat: hatCubes(0.4),
        head: headCubes(),
        body: bodyCubes()
    };
    with(legCubes()) {
        player.left_leg = left;
        player.right_leg = right
    }
    with(armCubes()) {
        player.left_arm = left;
        player.right_arm = right
    }
    shareColors(player.left_arm, player.right_arm);
    shareColors(player.left_leg, player.right_leg);
    setGroups(player);
    if (playerItem) {
        for (var p in playerItem) {
            player.left_arm[p] = player.left_arm[p].concat(playerItem[p])
        }
    }
    showPart("all");
    allFaces = world.solid;
    makeReverseMapping();
    delete changePosition.old;
    draw()
}

function positionate() {
    var c;
    if (c = location.href.match(/pose[(=]([^)&]+)\)?/)) {
        try {
            c = c[1];
            changePosition(positions[c] || JSON.parse(decodeURIComponent(c.replace(/(\w+):/g, '"$1":'))))
        } catch (b) {}
    }
    var a;
    if (a = location.hash.match(/angle\(-?\d+,-?\d+,-?\d+\)/)) {
        a = a[0].match(/-?\d+/g);
        rotatePlayer((a[0] || 0) * Math.PI / 180, (a[1] || 0) * Math.PI / 180, (a[2] || 0) * Math.PI / 180)
    }
}
function showPart(part, show) {
    world.solid = [];

    function concatCubes(cubes) {
        with(cubes) {
            world.solid = world.solid.concat(left).concat(right).concat(top).concat(bottom).concat(front).concat(back)
        }
    }
    if (part != "all") {
        showPart[part] = show
    }
    for (var p in player) {
        if (showPart[p] || part == "all") {
            showPart[p] = true;
            concatCubes(player[p])
        }
    }
    draw()
}
function setGroups() {
    function a(c) {
        for (var b in c) {
            $(c[b]).each(function (e, d) {
                d.layer = c[b]
            })
        }
    }
    a(player.hat);
    a(player.head);
    a(player.left_arm);
    a(player.right_arm);
    a(player.body);
    a(player.left_leg);
    a(player.right_leg)
}
function makeReverseMapping() {
    reverseMap = new Array(64);
    allFaces.forEach(function (a) {
        if (a.map) {
            if (!reverseMap[a.map.x]) {
                reverseMap[a.map.x] = new Array(32)
            }
            reverseMap[a.map.x][a.map.y] = a
        }
    })
}
function testIsPointInPathIssue() {
    ctx.translate(-1000, -1000);
    ctx.moveTo(0, 0);
    ctx.lineTo(10, 0);
    ctx.lineTo(10, 10);
    ctx.lineTo(0, 10);
    translateThePoint = ctx.isPointInPath(5, 5);
    ctx.translate(1000, 1000)
}
function getSkinFromUrl() {
    return document.location.hash.replace("#", "").split(";")[0]
}
function updateCanvasSize() {
    canvas.width = $(window).width();
    canvas.height = $(window).height() - $(canvas).position().top;
    offset = {
        x: canvas.width / 2 - 35,
        y: canvas.height / 2 - 70
    };
    ctx.translate(offset.x, offset.y);
    draw()
}
function onKeyDown(a) {}
var clicked, lastCursorPosition = {},
    lastClick = {};

function onMouseDown(c) {
    var b = c.pageX - canvas.offsetLeft;
    var d = c.pageY - canvas.offsetTop;
    var a = {
        x: b - (translateThePoint ? offset.x : 0),
        y: d - (translateThePoint ? offset.y : 0)
    };
    lastClick = lastCursorPosition = {
        x: b,
        y: d
    };
    if (c.shiftKey || c.altKey) {
        canvas.onmousemove = function (f) {
            var e = f.pageX - canvas.offsetLeft;
            var g = f.pageY - canvas.offsetTop;
            ctx.translate((e - lastCursorPosition.x), (g - lastCursorPosition.y));
            offset.x += (e - lastCursorPosition.x);
            offset.y += (g - lastCursorPosition.y);
            lastCursorPosition = {
                x: e,
                y: g
            };
            draw()
        }
    }
    clicked = a;
    draw();
    c.preventDefault()
}
n = 0;

function onMouseUp(a) {
    canvas.onmousemove = onMouseMove;
    clicked = null;
    filterLayer = null;
    draw()
}
function onMouseMove(b) {
    var a = b.pageX - canvas.offsetLeft;
    var c = b.pageY - canvas.offsetTop;
    if (b.shiftKey || b.altKey || clicked) {
        rotatePlayer((a - lastCursorPosition.x) / 100, (c - lastCursorPosition.y) / 100);
        draw()
    }
    lastCursorPosition = {
        x: a,
        y: c
    }
}
function rotatePlayer(b, h, g) {
    var f = player.body.front[0].axis_y.concat();
    var e = player.body.front[0].axis_z.concat();
    var d = [this.player.body.back[12 * 8 - 1].points[0], this.player.body.front[0].points[0]];
    var a = [d[0][0] + (d[1][0] - d[0][0]) / 2, d[0][1] + (d[1][1] - d[0][1]) / 2, d[0][2] + (d[1][2] - d[0][2]) / 2];
    for (var c = 0; c < allFaces.length; c++) {
        rotate_solid(a, f, b, allFaces[c]);
        rotate_solid_x(a, h, allFaces[c]);
        if (g) {
            rotate_solid(a, e, -g, allFaces[c])
        }
    }
}
function setupWheel() {
    $(canvas).wheel(function (a, b) {
        if (a.shiftKey || a.altKey) {
            world.distance -= b * 360
        } else {
            rotatePlayer(b * Math.PI / 6, 0, 0)
        }
        draw();
        a.preventDefault()
    })
}
function getPixel(a, b) {
    index = (a + b * skin.imageData.width) * 4;
    return [skin.imageData.data[index + 0], skin.imageData.data[index + 1], skin.imageData.data[index + 2], skin.imageData.data[index + 3]]
}
function updateCubeColors() {
    skin.imageData = skin.ctx.getImageData(0, 0, 64, 32);
    $(allFaces).each(function (c, a) {
        if (a.map) {
            var b = getPixel(a.map.x, a.map.y);
            a.fillcolor[0] = b[0];
            a.fillcolor[1] = b[1];
            a.fillcolor[2] = b[2];
            a.fillcolor[3] = b[3] > 32 ? 255 : 0
        }
    })
}

function loadSkin(i, c, j, g, b) {
    var d = i.match(/s3.amazonaws.com\/MinecraftSkins\/(.*)\.png/);
    if (d) {
        d = d[1]
    }
    var e = document.location.href.replace(/#.*$/, "");
    if (!b) {
        document.location.href = e + (c ? (document.location.hash || "#") + "+" : "#") + (d ? d : i)
    }
    $("#skinUrl").val((d ? d : i));

    function a(k) {
        if (!c) {
            skin.ctx.clearRect(0, 0, skin.canvas.width, skin.canvas.height)
        }
        skin.ctx.drawImage(k, 0, 0, k.width, k.height);
        updateCubeColors();
        draw();
        if (j) {
            j()
        }
    }
    yqlGetImageData(i, a)
}

function yqlGetImageData(url, success, error, extra) {
  $.ajax({
     url: 'http://query.yahooapis.com/v1/public/yql?format=json&q=select%20*%20from%20data.uri%20where%20url%3D%40url',
     data: {
       url: url
     },
     dataType: 'jsonp',
     jsonp: 'callback',
     jsonpCallback: 'yqlCallback',
     cache: true,
     error: error,
     timeout: 5000
  });

  yqlCallback = function(data) {
    try {
      if (!data || !data.query || !data.query.results || data.query.results.error || !data.query.results.url) {
        error();
      } else {
        var image = new Image();
        image.onload = function() { 
          success(image, url, extra);
        };
        image.src = data.query.results.url;
      }
    } catch(e) {
      error();
    }
  }
  
}

function loadUserSkin(b, d, c, a) {
    loadSkin("http://s3.amazonaws.com/MinecraftSkins/" + b + ".png", false, d, c, a)
}
function loadSkinUrl(c) {
    var g = $(c.split("+"));
    var e = [];
    var d;

    function f() {
        if (++d < g.length) {
            a(d)
        }
    }
    function b() {
        e[d] = (e[d] || 0) + 1;
        if (e[d] > 3) {
            informError(g[d]);
        } else {
            a(d)
        }
    }
    function a(h) {
        if (!g[h].match(/http/)) {
            loadUserSkin(g[h], f, b, true)
        } else {
            loadSkin(g[h], h > 0, f, b, true)
        }
    }
    d = 0;
    a(d)
}
function draw() {
    if (ctx) {
        var g = 0;
        var k = [];
        var d;
        var c;
        var b;
        for (var e = 0; e < world.solid.length; e++) {
            for (var f = 0; f < world.solid[e].faces_number; f++) {
                d = (world.solid[e].points[world.solid[e].faces[f][0]][0] + world.solid[e].points[world.solid[e].faces[f][2]][0]) / 2 - world.observer[0];
                c = (world.solid[e].points[world.solid[e].faces[f][0]][1] + world.solid[e].points[world.solid[e].faces[f][2]][1]) / 2 - world.observer[1];
                b = (world.solid[e].points[world.solid[e].faces[f][0]][2] + world.solid[e].points[world.solid[e].faces[f][2]][2]) / 2 - world.observer[2];
                k[g++] = {
                    solid: e,
                    vertex: world.solid[e].faces[f],
                    fillcolor: world.solid[e].fillcolor,
                    linecolor: world.solid[e].linecolor,
                    distance: d * d + c * c + b * b
                }
            }
        }
        k.sort(function (j, i) {
            return i.distance - j.distance
        });
        var h = [];
        for (var e = 0; e < world.solid.length; e++) {
            h[e] = [];
            for (var f = 0; f < world.solid[e].points_number; f++) {
                h[e][f] = project(world.distance, world.solid[e].points[f])
            }
        }
        ctx.clearRect(-1000, -1000, 2000, 2000);
        var a = {
            x1: 1 / 0,
            y1: 1 / 0,
            x2: -1 / 0,
            y2: -1 / 0
        };

        function l(p) {
            var o = k[p];
            var q = h[o.solid];
            var r = o.vertex;
            var j = world.solid[o.solid];
            var m = filterLayer && j.layer !== filterLayer;
            ctx.fillStyle = "rgb(" + o.fillcolor[0] + "," + o.fillcolor[1] + "," + o.fillcolor[2] + ")";
            ctx.strokeStyle = showGrid ? "rgb(" + o.linecolor[0] + "," + o.linecolor[1] + "," + o.linecolor[2] + ")" : ctx.fillStyle;
            ctx.beginPath();
            ctx.moveTo(q[r[0]][0], q[r[0]][1]);
            ctx.lineTo(q[r[1]][0], q[r[1]][1]);
            ctx.lineTo(q[r[2]][0], q[r[2]][1]);
            ctx.lineTo(q[r[3]][0], q[r[3]][1]);
            ctx.globalAlpha = m ? 0.2 : o.fillcolor[3] / 255;
            ctx.fill();
            if (showGrid) {
                ctx.globalAlpha = m ? 0 : filterLayer ? 1 : 0.6
            }
            ctx.stroke();
            if (clicked && ctx.isPointInPath(clicked.x, clicked.y)) {
                clicked.cube = j;
                clicked.polygon = p
            }
            if (clicked && clicked.tool && j.layer === filterLayer && ctx.isPointInPath(clicked.tool.to.x, clicked.tool.to.y)) {
                clicked.tool.clickedCube = world.solid[o.solid];
                clicked.tool.clickedPolygon = p
            }
            a.x1 = Math.min(a.x1, q[r[0]][0], q[r[2]][0]);
            a.x2 = Math.max(a.x2, q[r[1]][0], q[r[3]][0]);
            a.y1 = Math.min(a.y1, q[r[0]][1], q[r[2]][1]);
            a.y2 = Math.max(a.y2, q[r[1]][1], q[r[3]][1])
        }
        for (var f = 0; f < g; f++) {
            l(f)
        }
    }
    return a
}
function informError(skin) {
    $('#toolbar').css({
        'height': '60px',
        'text-align': 'center',
        'vertical-align': 'middle',
        'padding-top': '40px',
        'visibility': 'visible'
    }).html('Impossible de charger le skin ' + skin);
}

function touchHandler(c) {
    var d = c.changedTouches,
        e = d[0],
        a = "";
    switch (c.type) {
    case "touchstart":
        a = "mousedown";
        break;
    case "touchmove":
        a = "mousemove";
        break;
    case "touchend":
        a = "mouseup";
        break;
    default:
        return
    }
    var b = document.createEvent("MouseEvent");
    b.initMouseEvent(a, true, true, window, 1, e.screenX, e.screenY, e.clientX, e.clientY, false, false, false, false, 0, null);
    switch (c.type) {
    case "touchstart":
        onMouseDown(b);
        break;
    case "touchmove":
        onMouseMove(b);
        break;
    case "touchend":
        onMouseUp(b);
        break
    }
    if (c.type == "touchmove") {
        c.preventDefault()
    }
}

$(function () {
    document.addEventListener("touchstart", touchHandler, true);
    document.addEventListener("touchmove", touchHandler, true);
    document.addEventListener("touchend", touchHandler, true);
    document.addEventListener("touchcancel", touchHandler, true)
});

/*
Animation
*/

// Cross browser, backward compatible solution
(function( window, Date ) {
// feature testing
var raf = window.RequestAnimationFrame;

window.animLoop = function( render, element ) {
  var running, lastFrame = +new Date;
  function loop( now ) {
    if ( running !== false ) {
      raf ?
        raf( loop, element ) :
        // fallback to setTimeout
        setTimeout( loop, 16 );
      // Make sure to use a valid time, since:
      // - Chrome 10 doesn't return it at all
      // - setTimeout returns the actual timeout
      now = now && now > 1E4 ? now : +new Date;
      var deltaT = now - lastFrame;
      // do not render frame when deltaT is too high
      if ( deltaT < 160 ) {
        running = render( deltaT, now );
      }
      lastFrame = now;
    }
  }
  loop();
};
})( window, Date );

var animating = false;

function play() {
	if (animating = !animating) {
	  $('#play').html('&#8718;');
      animLoop(function(delta, now) {
		changePosition({
			left_arm: { x: Math.cos(now/250)*60 - 45, z: -15 + Math.sin(now/500)*10 },
			right_arm: { x: Math.sin(now/500)*30, z: 15 - Math.sin(now/500)*10 },
			left_leg: { x: Math.cos(now/250)*45, z: -5 + Math.sin(now/500)*5 },
			right_leg: { x: -Math.cos(now/250)*45, z: 5 - Math.sin(now/500)*5 },
			head: {y: Math.cos(now/1000)*30, x: Math.sin(now/750)*15}
		});
		rotatePlayer(2*Math.PI*delta/(1000*10), Math.cos(now/(1000))*delta*Math.PI/10000);
		draw();
		return animating;
	  });
	} else {
		$('#play').html('&#9654;');
	}
}

if (/play=true/.test(location.href)) play();

/*
Design
*/

function get_triangle_normal(point1, point2, point3)
{
	
	var result = new Array(3);
	var vettore1 = new Array(3);
	var vettore2 = new Array(3);

	vettore1[0] = point2[0]-point1[0];
	vettore1[1] = point2[1]-point1[1];
	vettore1[2] = point2[2]-point1[2];

	vettore2[0] = point3[0]-point1[0];
	vettore2[1] = point3[1]-point1[1];
	vettore2[2] = point3[2]-point1[2];

	result[0] = vettore1[1]*vettore2[2]-vettore1[2]*vettore2[1];
	result[1] = -(vettore1[0]*vettore2[2]-vettore1[2]*vettore2[0]);
	result[2] = vettore1[0]*vettore2[1]-vettore1[1]*vettore2[0];

	return result;
}

function get_triangle(point1, point2, point3)
{
	var result = new Array(2,3);

	result[0][1] = point1;
	result[0][2] = point2;
	result[0][3] = point3;
	result[1] = get_triangle_normal(point1, point2, point3);

	return result;
}

function get_quadrilateral_normal(point1, point2, point3, point4)
{
	var result = new Array(2,3);

	result[0] = get_triangle_normal(point1, point2, point4);
	result[1] = get_triangle_normal(point2, point3, point4);

	return result;
}

function get_quadrilateral(point1, point2, point3, point4)
{
	var result = new Array(2,2,3,3);
	
	result[0][0][0] = point1;
	result[0][0][1] = point2;
	result[0][0][2] = point3;

	result[0][1][0] = point2;
	result[0][1][1] = point3;
	result[0][1][2] = point4;
	
	result[1] = get_quadrilater_normal(point1, point2, point3, point4);

}

var faces = {
	left: "left",
	right: "right",
	top: "top",
	bottom: "bottom",
	front: "front",
	back: "back"
};

function facedPlane(face, dimensione, fillcolor, linecolor) {
	var punto0 = [-0.5*dimensione, -0.5*dimensione, 0.5*dimensione];
	var punto1 = [0.5*dimensione, -0.5*dimensione, 0.5*dimensione];
	var punto2 = [0.5*dimensione, 0.5*dimensione, 0.5*dimensione];
	var punto3 = [-0.5*dimensione, 0.5*dimensione, 0.5*dimensione];
	var punto4 = [-0.5*dimensione, -0.5*dimensione, -0.5*dimensione];
	var punto5 = [0.5*dimensione, -0.5*dimensione, -0.5*dimensione];
	var punto6 = [0.5*dimensione, 0.5*dimensione, -0.5*dimensione];
	var punto7 = [-0.5*dimensione, 0.5*dimensione, -0.5*dimensione];

	var faceMaker = {
		left: function() {
			return [punto4, punto0, punto3, punto7];
		},
		right: function() {
			return [punto1, punto5, punto6, punto2];
		},
		top: function() {
			return [punto3, punto2, punto6, punto7];
		},
		bottom: function() {
			return [punto0, punto4, punto5, punto1];
		},
		front: function() {
			return [punto0, punto1, punto2, punto3];
		},
		back: function() {
			return [punto5, punto4, punto7, punto6];
		}
	};
		
	this.points = faceMaker[face]();
	this.faces = [[0, 1, 2, 3]];
	this.normals = [{
		left: [-1, 0, 0],
		right: [1, 0, 0],
		top: [0, 1, 0],
		bottom: [0, -1, 0],
		front: [0, 0, 1],
		back: [0, 0, -1]
	}[face]];
	this.center = [92, 92, 92, 1];
	this.points_number = this.points.length;
	this.faces_number = this.faces.length;
	this.vertex_number = 4;
	this.axis_x = [1, 0, 0];
	this.axis_y = [0, 1, 0];
	this.axis_z = [0, 0, 1];
	this.fillcolor = fillcolor;
	this.linecolor = linecolor;
}

function cube(model, texture) {
  var cubeObject = {
    left: [],
    right: [],
    top: [],
    bottom: [],
    front: [],
    back: []
  };
  
  var pos = {
    x: -model.center.x - model.size.x/2,
    y: -model.center.y - model.size.y/2,
    z: -model.center.z - model.size.z/2
  };
  
  var line_color = [92, 92, 92, 1];
  var color = [0, 0, 0, 0.3];
  var cubo, map;
  
  for (var i = 0; i < model.size.x*texture.scale; i++)
    for (var j = 0; j < model.size.y*texture.scale; j++) {
      map = {
        x: (model.texture.x + model.size.x + 2*model.size.z)*texture.scale + (model.texture.mirror? model.size.x*texture.scale - i - 1: i),
        y: (model.texture.y + model.size.z)*texture.scale + j
      };
      if (texture) color = texture[map.x][map.y];
      cubo = new facedPlane(faces.back, 1/texture.scale, color, line_color);
      translate_solid([pos.x + i/texture.scale, -pos.y - j/texture.scale, -100 + pos.z], cubo);
      cubo.map = map;
      cubeObject.back.push(cubo);
      
      map = {
        x: (model.texture.x + model.size.z)*texture.scale + (model.texture.mirror? model.size.x*texture.scale - i - 1 : i), 
        y: (model.texture.y + model.size.z)*texture.scale + j
      };
      if (texture) color = texture[map.x][map.y];
      cubo = new facedPlane(faces.front, 1/texture.scale, color, line_color);
      translate_solid([pos.x + i/texture.scale, -pos.y - j/texture.scale, -100 + pos.z + model.size.z - 1/texture.scale], cubo);
      cubo.map = map;
      cubeObject.front.push(cubo);
    }
    
    for (var i = 0; i < model.size.z*texture.scale; i++)
      for (var j = 0; j < model.size.y*texture.scale; j++) {
        var map1 = {
          x: (model.texture.x)*texture.scale + i, 
          y: (model.texture.y + model.size.z)*texture.scale + j
        };
        var map2 = {
          x: (model.texture.x + 2*model.size.z + model.size.x)*texture.scale - i - 1, 
          y: (model.texture.y + model.size.z)*texture.scale + j
        };
        
        map = model.texture.mirror? map2 : map1;
        if (texture) color = texture[map.x][map.y];
        cubo = new facedPlane(faces.left, 1/texture.scale, color || [255, 255, 255, 1.0], line_color);
        translate_solid([pos.x + 0.01, -pos.y - j/texture.scale, -100 + pos.z + i/texture.scale], cubo);
        cubo.map = map;
        cubeObject.left.push(cubo);
        
        map = model.texture.mirror? map1 : map2;
        if (texture) color = texture[map.x][map.y];
        cubo = new facedPlane(faces.left, 1/texture.scale, color || [255, 255, 255, 1.0], line_color);
        translate_solid([pos.x + model.size.x, -pos.y - j/texture.scale, -100 + pos.z + i/texture.scale], cubo);
        cubo.map = map;
        cubeObject.right.push(cubo);
    }   
      
    for (var i = 0; i < model.size.x*texture.scale; i++)
      for (var k = 0; k < model.size.z*texture.scale; k++) {
        map = {
          x: (model.texture.x + model.size.z)*texture.scale + (model.texture.mirror? model.size.x*texture.scale - i - 1: i), 
          y: (model.texture.y)*texture.scale + k
        };
        if (texture) color = texture[map.x][map.y];
        cubo = new facedPlane(faces.top, 1/texture.scale, color || [255, 255, 255, 1.0], line_color);
        translate_solid([pos.x + i/texture.scale, -pos.y, -100 + pos.z + k/texture.scale], cubo);
        cubo.map = map;
        cubeObject.top.push(cubo);
        
        map = {
          x: (model.texture.x + model.size.z + model.size.x)*texture.scale + (model.texture.mirror? model.size.x*texture.scale - i - 1: i), 
          y: (model.texture.y)*texture.scale + k
        };
        if (texture) texture[map.x][map.y];
        cubo = new facedPlane(faces.bottom, 1/texture.scale, color || [255, 255, 255, 1.0], line_color);
        translate_solid([pos.x + i/texture.scale, -pos.y - model.size.y + 1, -100 + pos.z + k/texture.scale], cubo);
        cubo.map = map;
        cubeObject.bottom.push(cubo);
      }       
  return cubeObject;
}


function headCubes(color) {
	var head = {
		left: [],
		right: [],
		top: [],
		bottom: [],
		front: [],
		back: []
	};
	for (var i = 0; i < 8; i++)
		for (var j = 0; j < 8; j++) {
			var cubo = new facedPlane(faces.left, 1, [255, 255, 255, 1.0], color || [92, 92, 92, 1]);
			translate_solid([0, i, -100 + j], cubo);
			cubo.map = {x: j, y: 15 - i};
			head.left.push(cubo);
			
			cubo = new facedPlane(faces.right, 1, [255, 255, 255, 1.0], color || [92, 92, 92, 1]);
			translate_solid([7, i, -100 + j], cubo);
			cubo.map = {x: 23 - j, y: 15 - i};
			head.right.push(cubo);

			cubo = new facedPlane(faces.top, 1, [255, 255, 255, 1.0], color || [92, 92, 92, 1]);
			translate_solid([i, 7, -100 + j], cubo);
			cubo.map = {x: 8 + i, y: j};
			head.top.push(cubo);			
			
			cubo = new facedPlane(faces.bottom, 1, [255, 255, 255, 1.0], color || [92, 92, 92, 1]);
			translate_solid([i, 0, -100 + j], cubo);
			cubo.map = {x: 16 + i, y: j};
			head.bottom.push(cubo);
			
			cubo = new facedPlane(faces.back, 1, [255, 255, 255, 1.0], color || [92, 92, 92, 1]);
			translate_solid([i, j, -100], cubo);
			cubo.map = {x: 31 - i, y: 15 - j};
			head.back.push(cubo);
			
			cubo = new facedPlane(faces.front, 1, [255, 255, 255, 1.0], color || [92, 92, 92, 1]);
			translate_solid([i, j, -100 + 7], cubo);
			cubo.map = {x: 8 +  i, y: 15 - j};
			head.front.push(cubo);
		}
	return head;
}

function hatCubes(alpha, color) {
	var hat = {
		left: [],
		right: [],
		top: [],
		bottom: [],
		front: [],
		back: []
	};
	var size = 1.2;
	if (!alpha) alpha = 1;
	for (var _i = 0; _i < 8; _i++)
		for (var _j = 0; _j < 8; _j++) {
			var i = _i*size;
			var j = _j*size;
			var delta = (size - 1)*4;
			
			var cubo = new facedPlane(faces.left, size, color || [0, 0, 0, alpha], [255, 255, 255, 1.0, alpha]);
			translate_solid([0, i, -100 + j], cubo);
			translate_solid([-delta, -delta, -delta], cubo);
			cubo.map = {x: 32 + _j, y:  15 - _i};
			hat.left.push(cubo);
			
			cubo = new facedPlane(faces.right, size, color || [0, 0, 0, alpha], [255, 255, 255, 1.0, alpha]);
			translate_solid([7*size, i, -100 + j], cubo);
			translate_solid([-delta, -delta, -delta], cubo);
			cubo.map = {x: (32 + 23) - _j, y: 15 - _i};
			hat.right.push(cubo);

			cubo = new facedPlane(faces.top, size, color || [0, 0, 0, alpha], [255, 255, 255, 1.0, alpha]);
			translate_solid([i, 7*size, -100 + j], cubo);
			translate_solid([-delta, -delta, -delta], cubo);
			cubo.map = {x: (32 + 8) + _i, y: _j};
			hat.top.push(cubo);			
			
			cubo = new facedPlane(faces.bottom, size, color || [0, 0, 0, alpha], [255, 255, 255, 1.0, alpha]);
			translate_solid([i, 0, -100 + j], cubo);
			translate_solid([-delta, -delta, -delta], cubo);
			cubo.map = {x: (32 + 16) + _i, y: _j};
			hat.bottom.push(cubo);
			
			cubo = new facedPlane(faces.back, size, color || [0, 0, 0, alpha], [255, 255, 255, 1.0, alpha]);
			translate_solid([i, j, -100, alpha], cubo);
			translate_solid([-delta, -delta, -delta], cubo);
			cubo.map = {x: (32 + 24 + 7) - _i, y: 15 - _j};
			hat.back.push(cubo);
			
			cubo = new facedPlane(faces.front, size, color || [0, 0, 0, alpha], [255, 255, 255, 1.0, alpha]);
			translate_solid([i, j, -100 + 7*size], cubo);
			translate_solid([-delta, -delta, -delta], cubo);
			cubo.map = {x: (32 + 8) +  _i, y: 15 - _j};
			hat.front.push(cubo);
		}
	return hat;
}

function bodyCubes(color) {
	var body = {
		left: [],
		right: [],
		top: [],
		bottom: [],
		front: [],
		back: []
	};
	for (var i = 0; i < 12; i++)
		for (var j = 0; j < 8; j++) {
			var cubo = new facedPlane(faces.back, 1, color || [255, 255, 255, 1.0], [92, 92, 92, 1]);
			translate_solid([j, i - 12, -100 + 2], cubo);
			cubo.map = {x: 39 - j, y: 31 - i};
			body.back.push(cubo);
			
			cubo = new facedPlane(faces.front, 1, color || [255, 255, 255, 1.0], [92, 92, 92, 1]);
			translate_solid([j, i - 12, -100 + 3 + 2], cubo);
			cubo.map = {x: 20 + j, y: 31 - i};
			body.front.push(cubo);
		}
		
	for (var i = 0; i < 12; i++)
		for (var j = 0; j < 4; j++) {
			var cubo = new facedPlane(faces.left, 1, color || [255, 255, 255, 1.0], [92, 92, 92, 1]);
			translate_solid([0.01, i - 12, -100 + 2 + j], cubo);
			cubo.map = {x: 16 + j, y: 31 - i};
			body.left.push(cubo);
			
			cubo = new facedPlane(faces.left, 1, color || [255, 255, 255, 1.0], [92, 92, 92, 1]);
			translate_solid([8.01, i - 12, -100 + 2 + j], cubo);
			cubo.map = {x: 31 - j, y: 31 - i};
			body.right.push(cubo);
		}		
		
	for (var i = 0; i < 8; i++)
		for (var j = 0; j < 4; j++) {
			var cubo = new facedPlane(faces.top, 1, color || [255, 255, 255, 1.0], [92, 92, 92, 1]);
			translate_solid([i, -1.01, -100 + 2 + j], cubo);
			cubo.map = {x: 20 + i, y: 16 + j};
			body.top.push(cubo);
			
			cubo = new facedPlane(faces.bottom, 1, color || [255, 255, 255, 1.0], [92, 92, 92, 1]);
			translate_solid([i, -12, -100 + 2 + j], cubo);
			cubo.map = {x: 28 + i, y: 16 + j};
			body.bottom.push(cubo);
		}				
	return body;
}

function legCubes(color) {
	var leg = {
		left: {
			left: [],
			right: [],
			top: [],
			bottom: [],
			front: [],
			back: []
		},
		right: {
			left: [],
			right: [],
			top: [],
			bottom: [],
			front: [],
			back: []
		}
	};
	for (var i = 0; i < 12; i++)
		for (var j = 0; j < 4; j++) {
			var cubo = new facedPlane(faces.back, 1, color || [255, 255, 255, 1.0], [92, 92, 92, 1]);
			translate_solid([j, i - 12 - 12, -100 + 2], cubo);
			cubo.map = {x: 15 - j, y: 31 - i};
			leg.left.back.push(cubo);
			
			cubo = new facedPlane(faces.front, 1, color || [255, 255, 255, 1.0], [92, 92, 92, 1]);
			translate_solid([j, i - 12 - 12, -100 + 2 + 3], cubo);
			cubo.map = {x: 4 + j, y: 31 - i};
			leg.left.front.push(cubo);
			
			cubo = new facedPlane(faces.back, 1, color || [255, 255, 255, 1.0], [92, 92, 92, 1]);
			translate_solid([7 - j, i - 12 - 12, -100 + 2], cubo);
			leg.right.back.push(cubo);
			
			cubo = new facedPlane(faces.front, 1, color || [255, 255, 255, 1.0], [92, 92, 92, 1]);
			translate_solid([7 - j, i - 12 - 12, -100 + 2 + 3], cubo);
			leg.right.front.push(cubo);
			
			cubo = new facedPlane(faces.left, 1, color || [255, 255, 255, 1.0], [92, 92, 92, 1]);
			translate_solid([0, i - 12 - 12, -100 + 2 + j], cubo);
			cubo.map = {x: j, y: 31 - i};
			leg.left.left.push(cubo);
			
			cubo = new facedPlane(faces.right, 1, color || [255, 255, 255, 1.0], [92, 92, 92, 1]);
			translate_solid([3, i - 12 - 12, -100 + 2 + j], cubo);
			cubo.map = {x: 11 - j, y: 31 - i};
			leg.left.right.push(cubo);
			
			cubo = new facedPlane(faces.left, 1, color || [255, 255, 255, 1.0], [92, 92, 92, 1]);
			translate_solid([4, i - 12 - 12, -100 + 2  + j], cubo);
			leg.right.right.push(cubo);
			
			cubo = new facedPlane(faces.right, 1, color || [255, 255, 255, 1.0], [92, 92, 92, 1]);
			translate_solid([4 + 3.01, i - 12 - 12, -100 + 2 + j], cubo);
			leg.right.left.push(cubo);			
		}
		
	for (var i = 0; i < 4; i++)
		for (var j = 0; j < 4; j++) {
			var cubo = new facedPlane(faces.top, 1, [255, 255, 255, 1.0], [92, 92, 92, 1]);
			translate_solid([j, -13.01, -100 + 2 + i], cubo);
			cubo.map = {x: 4 + j, y: 16 + i};
			leg.left.top.push(cubo);
			
			cubo = new facedPlane(faces.bottom, 1, [255, 255, 255, 1.0], [92, 92, 92, 1]);
			translate_solid([j, -12 - 12, -100 + 2 + i], cubo);
			cubo.map = {x: 8 + j, y: 16 + i};
			leg.left.bottom.push(cubo);
			
			cubo = new facedPlane(faces.top, 1, [255, 255, 255, 1.0], [92, 92, 92, 1]);
			translate_solid([7 - j, -13.01, -100 + 2 + i], cubo);
			leg.right.top.push(cubo);
			
			cubo = new facedPlane(faces.bottom, 1, color || [255, 255, 255, 1.0], [92, 92, 92, 1]);
			translate_solid([7 - j, -12 - 12, -100 + 2 + i], cubo);
			leg.right.bottom.push(cubo);
	}
	return leg;
}

function armCubes(color) {
	var arm = {
		left: {
			left: [],
			right: [],
			top: [],
			bottom: [],
			front: [],
			back: []
		},
		right: {
			left: [],
			right: [],
			top: [],
			bottom: [],
			front: [],
			back: []
		}
	};
	for (var i = 0; i < 12; i++)
		for (var j = 0; j < 4; j++) {
			var cubo = new facedPlane(faces.back, 1, color || [255, 255, 255, 1.0], [92, 92, 92, 1]);
			translate_solid([j - 4, i - 12, -100 + 2], cubo);
			cubo.map = {x: 55 - j, y: 31 - i};
			arm.left.back.push(cubo);
			
			cubo = new facedPlane(faces.front, 1, color || [255, 255, 255, 1.0], [92, 92, 92, 1]);
			translate_solid([j - 4, i - 12, -100 + 2 + 3], cubo);
			cubo.map = {x: 44 + j, y: 31 - i};
			arm.left.front.push(cubo);
			
			cubo = new facedPlane(faces.back, 1, color || [255, 255, 255, 1.0], [92, 92, 92, 1]);
			translate_solid([7 - j + 4, i - 12, -100 + 2], cubo);
			arm.right.back.push(cubo);
			
			cubo = new facedPlane(faces.front, 1, color || [255, 255, 255, 1.0], [92, 92, 92, 1]);
			translate_solid([11 - j, i - 12, -100 + 2 + 3], cubo)
			arm.right.front.push(cubo);
			
			cubo = new facedPlane(faces.left, 1, color || [255, 255, 255, 1.0], [92, 92, 92, 1]);
			translate_solid([-4, i - 12, -100 + 2 + j], cubo);
			cubo.map = {x: 40 + j, y: 31 - i};
			arm.left.left.push(cubo);
			
			cubo = new facedPlane(faces.right, 1, color || [255, 255, 255, 1.0], [92, 92, 92, 1]);
			translate_solid([3 - 4, i - 12, -100 + 2 + j], cubo);
			cubo.map = {x: 51 - j, y: 31 - i};
			arm.left.right.push(cubo);
			
			cubo = new facedPlane(faces.left, 1, color || [255, 255, 255, 1.0], [92, 92, 92, 1]);
			translate_solid([4 + 4, i - 12, -100 + 2  + j], cubo);
			arm.right.right.push(cubo);
			
			cubo = new facedPlane(faces.right, 1, color || [255, 255, 255, 1.0], [92, 92, 92, 1]);
			translate_solid([4 + 3 + 4, i - 12, -100 + 2 + j], cubo);
			arm.right.left.push(cubo);			
		}
		
	for (var i = 0; i < 4; i++)
		for (var j = 0; j < 4; j++) {
			var cubo = new facedPlane(faces.top, 1, [255, 255, 255, 1.0], [92, 92, 92, 1]);
			translate_solid([j - 4, -1, -100 + 2 + i], cubo);
			cubo.map = {x: 44 + j, y: 16 + i};
			arm.left.top.push(cubo);
			
			cubo = new facedPlane(faces.bottom, 1, [255, 255, 255, 1.0], [92, 92, 92, 1]);
			translate_solid([j - 4, -12, -100 + 2 + i], cubo);
			cubo.map = {x: 48 + j, y: 16 + i};
			arm.left.bottom.push(cubo);
			
			cubo = new facedPlane(faces.top, 1, [255, 255, 255, 1.0], [92, 92, 92, 1]);
			translate_solid([11 - j, -1, -100 + 2 + i], cubo);
			arm.right.top.push(cubo);
			
			cubo = new facedPlane(faces.bottom, 1, color || [255, 255, 255, 1.0], [92, 92, 92, 1]);
			translate_solid([11 - j, -12, -100 + 2 + i], cubo);
			arm.right.bottom.push(cubo);
	}
	return arm;
}

/*
Transform
*/

function rotate_x(b, e, a) {
    var d = a[1] - b[1];
    var c = b[2] - a[2];
    a[1] = b[1] + d * e[1] + c * e[0];
    a[2] = b[2] - c * e[1] + d * e[0]
}
function rotate_x_normal(c, a) {
    var b = a[1];
    a[1] = b * c[1] - a[2] * c[0];
    a[2] = a[2] * c[1] + b * c[0]
}
function rotate_y(b, e, a) {
    var d = a[0] - b[0];
    var c = a[2] - b[2];
    a[0] = b[0] + d * e[1] + c * e[0];
    a[2] = b[2] + c * e[1] - d * e[0]
}
function rotate_y_normal(c, a) {
    var b = a[0];
    a[0] = b * c[1] + a[2] * c[0];
    a[2] = a[2] * c[1] - b * c[0]
}
function rotate_z(b, e, a) {
    var d = a[0] - b[0];
    var c = a[1] - b[1];
    a[0] = b[0] + d * e[1] - c * e[0];
    a[1] = b[1] + c * e[1] + d * e[0]
}
function rotate_z_normal(c, a) {
    var b = a[0];
    a[0] = b * c[1] - a[1] * c[0];
    a[1] = a[1] * c[1] + b * c[0]
}
function get_rotation_parameter(a, h, b) {
    var q = new Array();
    var i = h[0] * h[0];
    var l = h[1] * h[1];
    var m = h[2] * h[2];
    var d = (l + m);
    var j = (i + m);
    var c = (i + l);
    var g = a[1] * h[1] + a[2] * h[2];
    var k = a[0] * h[0] + a[2] * h[2];
    var f = a[0] * h[0] + a[1] * h[1];
    var e = a[1] * h[2] - a[2] * h[1];
    var p = a[2] * h[0] - a[0] * h[2];
    var o = a[0] * h[1] - a[1] * h[0];
    var n = l + i + m;
    q[0] = n;
    q[1] = d;
    q[2] = j;
    q[3] = c;
    q[4] = a[0] * d;
    q[5] = a[1] * j;
    q[6] = a[2] * c;
    q[7] = g;
    q[8] = k;
    q[9] = f;
    q[10] = Math.cos(b);
    q[11] = Math.sin(b) * Math.sqrt(n);
    q[12] = e;
    q[13] = p;
    q[14] = o;
    q[15] = a[0];
    q[16] = a[1];
    q[17] = a[2];
    q[18] = h[0];
    q[19] = h[1];
    q[20] = h[2];
    return q
}
function rotate(f, b) {
    var c = f[20] * b[2];
    var d = f[19] * b[1];
    var g = f[18] * b[0];
    var e = g + d + c;
    var a = b[0];
    var h = b[1];
    b[0] = (f[4] + f[18] * (-f[7] + e) + ((a - f[15]) * f[1] + f[18] * (f[7] - d - c)) * f[10] + f[11] * (f[12] - f[20] * h + f[19] * b[2])) / f[0];
    b[1] = (f[5] + f[19] * (-f[8] + e) + ((h - f[16]) * f[2] + f[19] * (f[8] - g - c)) * f[10] + f[11] * (f[13] + f[20] * a - f[18] * b[2])) / f[0];
    b[2] = (f[6] + f[20] * (-f[9] + e) + ((b[2] - f[17]) * f[3] + f[20] * (f[9] - g - d)) * f[10] + f[11] * (f[14] - f[19] * a + f[18] * h)) / f[0]
}
function translate(b, a) {
    a[0] = a[0] + b[0];
    a[1] = a[1] + b[1];
    a[2] = a[2] + b[2]
}
function scale(b, a) {
    a[0] = a[0] * b[0];
    a[1] = a[1] * b[1];
    a[2] = a[2] * b[2]
}
function translate_solid(b, a) {
    translate(b, a.center);
    for (var c = 0; c < a.points_number; c++) {
        translate(b, a.points[c])
    }
}
function translate_solid_direction(b, d, a) {
    translate([b[0] * d, b[1] * d, b[2] * d], a.center);
    for (var c = 0; c < a.points_number; c++) {
        translate([b[0] * d, b[1] * d, b[2] * d], a.points[c])
    }
}
function scale_solid(d, c) {
    var e = c.center;
    var b = [-c.center[0], -c.center[1], -c.center[2]];
    translate_solid(b, c);
    for (var f = 0; f < c.points_number; f++) {
        scale(d, c.points[f])
    }
    translate_solid(e, c)
}
function rotate_solid(a, c, f, b) {
    parametri = get_rotation_parameter(a, c, f);
    parametri2 = get_rotation_parameter([0, 0, 0], c, f);
    rotate(parametri, b.center);
    rotate(parametri2, b.axis_x);
    rotate(parametri2, b.axis_y);
    rotate(parametri2, b.axis_z);
    for (var e = 0; e < b.faces_number; e++) {
        rotate(parametri2, b.normals[e])
    }
    for (var d = 0; d < b.points_number; d++) {
        rotate(parametri, b.points[d])
    }
}
function rotate_solid_fast(c, b, a) {
    rotate(c, a.center);
    rotate(b, a.axis_x);
    rotate(b, a.axis_y);
    rotate(b, a.axis_z);
    for (var e = 0; e < a.faces_number; e++) {
        rotate(b, a.normals[e])
    }
    for (var d = 0; d < a.points_number; d++) {
        rotate(c, a.points[d])
    }
}
function rotate_solid_x(a, f, b) {
    var e = [Math.sin(f), Math.cos(f)];
    rotate_x(a, e, b.center);
    rotate_x_normal(e, b.axis_x);
    rotate_x_normal(e, b.axis_y);
    rotate_x_normal(e, b.axis_z);
    for (var d = 0; d < b.faces_number; d++) {
        rotate_x_normal(e, b.normals[d])
    }
    for (var c = 0; c < b.points_number; c++) {
        rotate_x(a, e, b.points[c])
    }
}
function rotate_solid_y(a, f, b) {
    var e = [Math.sin(f), Math.cos(f)];
    rotate_y(a, e, b.center);
    rotate_y_normal(e, b.axis_x);
    rotate_y_normal(e, b.axis_y);
    rotate_y_normal(e, b.axis_z);
    for (var d = 0; d < b.faces_number; d++) {
        rotate_y_normal(e, b.normals[d])
    }
    for (var c = 0; c < b.points_number; c++) {
        rotate_y(a, e, b.points[c])
    }
}
function rotate_solid_z(a, f, b) {
    var e = [Math.sin(f), Math.cos(f)];
    rotate_z(a, e, b.center);
    rotate_z_normal(e, b.axis_x);
    rotate_z_normal(e, b.axis_y);
    rotate_z_normal(e, b.axis_z);
    for (var d = 0; d < b.faces_number; d++) {
        rotate_z_normal(e, b.normals[d])
    }
    for (var c = 0; c < b.points_number; c++) {
        rotate_z(a, e, b.points[c])
    }
}
function project(c, b) {
    var a = new Array();
    a[0] = b[0] * c / b[2];
    a[1] = -b[1] * c / b[2];
    a[2] = c;
    return a
}
function isPointInPoly(e, f) {
    for (var g = false, d = -1, a = e.length, b = a - 1; ++d < a; b = d) {
        ((e[d].y <= f.y && f.y < e[b].y) || (e[b].y <= f.y && f.y < e[d].y)) && (f.x < (e[b].x - e[d].x) * (f.y - e[d].y) / (e[b].y - e[d].y) + e[d].x) && (g = !g)
    }
    return g
};

/*
Positions
*/

var positions = {
    "Défaut": {
        left_arm:   {x: 0, y: 0, z: 0},
        right_arm:  {x: 0, y: 0, z: 0},
        left_leg:   {x: 0, y: 0, z: 0},
        right_leg:  {x: 0, y: 0, z: 0},
        head:       {x: 0, y: 0, z: 0}
    },
    "Parfait pour dessiner": {
        left_arm:   {z: -45},
        right_arm:  {z:  45},
        left_leg:   {x:  45, center: {side: 'top', index: 0, point: 3}},
        right_leg:  {x: -45, center: {side: 'top', index: 12, point: 1}},
    head:       {x: -30, center: {side: 'bottom', index: 32}}
    },
    "Marche": {
        left_arm:   {x: -10, z: -10},
        right_arm:  {x:  10, z:  10},
        left_leg:   {x: -10},
        right_leg:  {x:  10},
        head: {y: 10}
    },
	"Marche 2": {
        left_arm:   {x: -80},
        right_arm:  {x:  80},
        left_leg:   {x:  30},
        right_leg:  {x: -30},
        head:       {x: -15}
    },
    "Câlin": {
        left_arm:   {z: -90},
        right_arm:  {z:  90},
        left_leg:   {z: -10},
        right_leg:  {z:  10},
        head:       {x: -0.25}
    },
    "Sauter": { 
        "left_arm":     { "x": 43, "z": -31 }, 
        "right_arm":    { "x": -20, "z": 38 }, 
        "left_leg":     { "x": -45, "z": -5 }, 
        "right_leg":    { "x": 16, "z": 38 }, 
        "head":         { "x": 24, "y": -11, "z": -5 }, 
        "hat":          { "x": 24, "y": -11, "z": -5 } 
    },
    "Regarder en l'air": {
        "left_arm": { "x": 18, "z": -6 }, 
        "right_arm": { "x": 7, "z": 20 }, 
        "left_leg": { "x": 9, "z": -27 }, 
        "right_leg": { "x": 1, "z": 38 }, 
        "head": { "x": -17, "y": -2, "z": -2 }, 
        "hat": { "x": -17, "y": -2, "z": -2 }
    },
    "random": {
        left_arm:   {},
        right_arm:  {},
        left_leg:   {},
        right_leg:  {},
        head:     {},
        hat:    {}
      },
};

var centers = {
    left_arm:   {side: 'right', index: 45, point: 3},
    right_arm:  {side: 'right', index: 45, point: 2},
    left_leg: {side: 'top', index: 7, point: 1},
    right_leg: {side: 'top', index: 11, point: 2},
    head: {side: 'bottom', index: 35},
    hat: {side: 'bottom', index: 35}
}

function changePosition(newposition) {
    newposition.hat = newposition.head;
    newposition.right_arm$hold = newposition.right_arm;
    newposition.left_arm$hold = newposition.left_arm;
  
    function applyPosition(position, factor) {
        var axislist = factor > 0 ? {x: 1, y: 1, z: 1} : {z: 1, y: 1, x: 1};
        for (var part in position)
          if (position[part])
            for (var axis in axislist) 
              if (position[part][axis])
                rotatePart(part, position[part][axis] * factor, axis, position[part].center);
    }
    if (changePosition.old) applyPosition(changePosition.old, -1);
    if (newposition === positions.random) generateNewRandomPosition();
    
    applyPosition(newposition, 1);
    changePosition.old = newposition;
}

function rotatePart(part, angle, axis, center) {
    var pname = part.split('$')[0];
    var c = center || centers[pname]; 
    var centerCube = player[pname][c.side][c.index];
    var center = player[pname][c.side][c.index].points[c.point || 0];
    axis = (axis == 'y' ? centerCube : player.body.front[0])["axis_" + axis];
    for (var side in player[part])
        player[part][side].forEach(function(cube) {
            rotate_solid(center, axis, angle*Math.PI/180, cube);
        });
}

function generateNewRandomPosition() {
    centers.left_leg.index = 7; centers.left_leg.point=1;
    centers.right_leg.index = 11; centers.right_leg.point=2;
    
    var limits = {
        left_arm:   {x: [-45, 45], z: [-45, 0]},
        right_arm:  {x: [-45, 45], z: [0, 45]},
        left_leg:   {x: [-45, 45], z: [-45, 0]},
        right_leg:  {x: [-45, 45], z: [0, 45]},
        head:       {x: [-30, 30], y: [-30, 30], z: [-30, 30]}
    }
    
    for (var part in limits) {
        if (showPart[part])
            for (var d in limits[part])
                positions.random[part][d] = Math.round((limits[part][d][1] - limits[part][d][0])*Math.random() + limits[part][d][0]);
            
    }
    if (Math.random() > 0.6) positions.random.head = {x: 0, y: 0, z: 0};
    positions.random.hat = positions.random.head;
}