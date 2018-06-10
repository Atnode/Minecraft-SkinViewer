/*
Main
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
    item: {}
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
    if (animating) canvas.onclick = play;
	setupWheel();
    loadSkinUrl(getSkinFromUrl() || "http://assets.mojang.com/SkinTemplates/steve.png");
    positionate();
    var c;
    if (c = location.hash.match(/item\(([^)]+)\)/)) {
        var d, b;
        if (d = c[1].split(",")[1]) {
            itemsPNG = d
        }
        if (b = c[0].match(/item\((\d+)/)) {
            b = Number(b[1])
        } else {
            if (b = c[0].match(/item\((\w+)/)) {
                b = itemNames[b[1]]
            }
        }
        loadItem({
            left: (b % (256 / 16)) * 16,
            top: Math.floor(b / 16) * 16
        })
    }
    $(window).resize(function (e) {
        updateCanvasSize()
    });
    updateCanvasSize();
    $("#item").click(function () {
        $("head").append('<link rel="stylesheet" href="js/fancybox/jquery.fancybox-1.3.4.css" type="text/css" media="screen"/>');
        jQuery.getScript("js/fancybox/jquery.fancybox-1.3.4.pack.js", function () {
            $("#item").unbind("click").click(function () {
                $.fancybox('<img id="itemsImage" src="' + itemsPNG + '" width="256" height="256"/><div id="sel" style="position: absolute; top:0; left: 0;   background-color: rgba(0, 0, 255, 0.4); box-shadow: 0 0 10px blue; width: 16px; height: 16px">');
                $("#itemsImage").mousemove(function (h) {
                    $("#sel").css({
                        left: Math.floor(h.layerX / 16) * 16,
                        top: Math.floor(h.layerY / 16) * 16
                    })
                });
                $("#sel").click(function () {
                    var e = $("#sel").position();
                    $.fancybox.close();
                    loadItem(e)
                })
            }).click()
        })
    });

    $(".bottom").delay(20000).animate({
        height: "10px"
    }).mouseenter(function () {
        $(this).animate({
            height: "70px"
        })
    }).mouseleave(function () {
        $(this).animate({
            height: "10px"
        })
    });
    $("#translate").mousedown(function (e) {
        var h = {
            x: e.pageX,
            y: e.pageY
        };
        $(document).bind("mousemove", function (i) {
            var j = {
                x: i.pageX,
                y: i.pageY
            };
            ctx.translate((j.x - h.x), (j.y - h.y));
            offset.x += (j.x - h.x);
            offset.y += (j.y - h.y);
            draw();
            h = j
        })
    });
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
    $("#coord").mousedown(function () {
        $(".cover").show()
    });
    $(document).mouseup(function () {
        $(document).unbind("mousemove");
        $(".cover").hide()
    });
    for (var a in positions) {
        $("<option>").attr("value", a).text($.i18n(a)).appendTo("#position")
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
    function f() {
        
        if (g) {
            g()
        }
    }
    yqlGetImageData(i, a)
}

function yqlGetImageData(url, success, error, extra) {
  $.ajax({
     url: 'https://query.yahooapis.com/v1/public/yql?format=json&q=select%20*%20from%20data.uri%20where%20url%3D%40url',
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
    loadSkin("https://s3.amazonaws.com/MinecraftSkins/" + b + ".png", false, d, c, a)
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
        if (!g[h].match(/https/)) {
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
    var screenshot;
    if (screenshot = location.hash.match(/screenshot\(([^)]+)\)/))
        screenshot = screenshot[1];
    if (screenshot) {
        $(document.body).css({
            'background': 'url(' + screenshot + ') center center',
            'background-size': 'auto 80%',
            'background-repeat': 'no-repeat'
        });
    }
    $('#toolbar').css({
        'height': '60px',
        'text-align': 'center',
        'vertical-align': 'middle',
        'padding-top': '40px',
        'visibility': 'visible'
    }).html('Could not load skin ' + skin);
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
var raf = window.mozRequestAnimationFrame    ||
          window.webkitRequestAnimationFrame ||
          window.msRequestAnimationFrame     ||
          window.oRequestAnimationFrame;

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

/*function cube(dimensione, fillcolor, linecolor)
{
	var punto0 = [-0.5*dimensione, -0.5*dimensione, 0.5*dimensione];
	var punto1 = [0.5*dimensione, -0.5*dimensione, 0.5*dimensione];
	var punto2 = [0.5*dimensione, 0.5*dimensione, 0.5*dimensione];
	var punto3 = [-0.5*dimensione, 0.5*dimensione, 0.5*dimensione];
	var punto4 = [-0.5*dimensione, -0.5*dimensione, -0.5*dimensione];
	var punto5 = [0.5*dimensione, -0.5*dimensione, -0.5*dimensione];
	var punto6 = [0.5*dimensione, 0.5*dimensione, -0.5*dimensione];
	var punto7 = [-0.5*dimensione, 0.5*dimensione, -0.5*dimensione];		
		
	this.points = [punto0, punto1, punto2, punto3, punto4, punto5, punto6, punto7];
	this.faces = [[0, 1, 2, 3], [1, 5, 6, 2], [5, 4, 7, 6], [4, 0, 3, 7], [3, 2, 6, 7], [0, 4, 5, 1]];
	this.normals = [[0, 0, 1], [1, 0, 0], [0, 0, -1], [-1, 0, 0], [0, 1, 0], [0, -1, 0]];
	this.center = [92, 92, 92, 1];
	this.points_number = this.points.length;
	this.faces_number = this.faces.length;
	this.vertex_number = 4;
	this.axis_x = [1, 0, 0];
	this.axis_y = [0, 1, 0];
	this.axis_z = [0, 0, 1];
	this.fillcolor = fillcolor;
	this.linecolor = linecolor;
}*/

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

			function rotate_x(center, sin_cos_angle, point)
			{
				var diff1 = point[1]-center[1];
				var diff2 = center[2]-point[2];

				point[1] = center[1]+diff1*sin_cos_angle[1]+diff2*sin_cos_angle[0];
				point[2] = center[2]-diff2*sin_cos_angle[1]+diff1*sin_cos_angle[0];
			}

			function rotate_x_normal(sin_cos_angle, point)
			{
				var temp = point[1];
				
				point[1] = temp*sin_cos_angle[1]-point[2]*sin_cos_angle[0];
				point[2] = point[2]*sin_cos_angle[1]+temp*sin_cos_angle[0];
			}

			
			function get_rotation_parameter(center, vector, teta)
			{
				var result = new Array();
				
				var u_u = vector[0]*vector[0];
				var v_v = vector[1]*vector[1];
				var w_w = vector[2]*vector[2]; 

				var v_v_p_w_w = (v_v+w_w);
				var u_u_p_w_w = (u_u+w_w);
				var u_u_p_v_v = (u_u+v_v);

				var b_v_p_c_w = center[1]*vector[1]+center[2]*vector[2];
				var a_u_p_c_w = center[0]*vector[0]+center[2]*vector[2];
				var a_u_p_b_v = center[0]*vector[0]+center[1]*vector[1];

				var b_w_m_c_v = center[1]*vector[2]-center[2]*vector[1];
				var c_u_m_a_w = center[2]*vector[0]-center[0]*vector[2];
				var a_v_m_b_u = center[0]*vector[1]-center[1]*vector[0];

				var den = v_v+u_u+w_w;

				result[0] = den;

				result[1] = v_v_p_w_w;
				result[2] = u_u_p_w_w;
				result[3] = u_u_p_v_v;

				result[4] = center[0]*v_v_p_w_w;
				result[5] = center[1]*u_u_p_w_w;
				result[6] = center[2]*u_u_p_v_v;

				result[7] = b_v_p_c_w;
				result[8] = a_u_p_c_w;
				result[9] = a_u_p_b_v;

				result[10] = Math.cos(teta);

				result[11] = Math.sin(teta)*Math.sqrt(den);

				result[12] = b_w_m_c_v;
				result[13] = c_u_m_a_w;
				result[14] = a_v_m_b_u;

				result[15] = center[0];
				result[16] = center[1];
				result[17] = center[2];
				result[18] = vector[0];
				result[19] = vector[1];
				result[20] = vector[2];

				
				return result;
			}

			
			function rotate(p, point)
			{
				var p_20_p_2 = p[20]*point[2];
				var p_19_p_1 = p[19]*point[1];
				var p_18_p_0 = p[18]*point[0];
				var u_x_p_v_y_p_w_z = p_18_p_0+p_19_p_1+p_20_p_2;
				
				var temp0 = point[0];
				var temp1 = point[1];

				point[0] = (p[4]+p[18]*(-p[7]+u_x_p_v_y_p_w_z)+((temp0-p[15])*p[1]+p[18]*(p[7]-p_19_p_1-p_20_p_2))*p[10]+p[11]*(p[12]-p[20]*temp1+p[19]*point[2]))/p[0];
				point[1] = (p[5]+p[19]*(-p[8]+u_x_p_v_y_p_w_z)+((temp1-p[16])*p[2]+p[19]*(p[8]-p_18_p_0-p_20_p_2))*p[10]+p[11]*(p[13]+p[20]*temp0-p[18]*point[2]))/p[0];
				point[2] = (p[6]+p[20]*(-p[9]+u_x_p_v_y_p_w_z)+((point[2]-p[17])*p[3]+p[20]*(p[9]-p_18_p_0-p_19_p_1))*p[10]+p[11]*(p[14]-p[19]*temp0+p[18]*temp1))/p[0];
			}

			function translate(vector, point)
			{
				point[0] = point[0] + vector[0];
				point[1] = point[1] + vector[1];
				point[2] = point[2] + vector[2];
			}
			
			
			function translate_solid(vector, solid)
			{
				translate(vector, solid.center);
				
				for (var i=0; i<solid.points_number; i++)
				{
					translate(vector, solid.points[i]);
				}
			}


			function rotate_solid(point, vector, angle, solid)
			{
				parametri = get_rotation_parameter(point, vector, angle);
				parametri2 = get_rotation_parameter([0, 0, 0], vector, angle);

				rotate(parametri, solid.center);
				rotate(parametri2, solid.axis_x);
				rotate(parametri2, solid.axis_y);
				rotate(parametri2, solid.axis_z);
				
				for (var i=0; i<solid.faces_number; i++)
				{
					rotate(parametri2, solid.normals[i]);
        }
					
				for (var j=0; j<solid.points_number; j++)
				{
					rotate(parametri, solid.points[j]);					
				}
			}

			function rotate_solid_x(center, angle, solid)
			{

				var sin_cosin_teta = [Math.sin(angle), Math.cos(angle)];

				rotate_x(center, sin_cosin_teta, solid.center);
				rotate_x_normal(sin_cosin_teta, solid.axis_x);
				rotate_x_normal(sin_cosin_teta, solid.axis_y);
				rotate_x_normal(sin_cosin_teta, solid.axis_z);
				
				for (var i=0; i<solid.faces_number; i++)
				{
					rotate_x_normal(sin_cosin_teta, solid.normals[i]);
        }
					
				for (var j=0; j<solid.points_number; j++)
				{
						rotate_x(center, sin_cosin_teta, solid.points[j]);					
				}
			}

			function project(distance, point)
			{
				var result = new Array();

				result[0] = point[0]*distance/point[2];
				result[1] = -point[1]*distance/point[2];
				result[2] = distance;

				return result;
			}

/*
Positions
*/

var positions = {
    "default": {
        left_arm:   {x: 0, y: 0, z: 0},
        right_arm:  {x: 0, y: 0, z: 0},
        left_leg:   {x: 0, y: 0, z: 0},
        right_leg:  {x: 0, y: 0, z: 0},
        head:       {x: 0, y: 0, z: 0}
    },
    "nicetodraw": {
        left_arm:   {z: -45},
        right_arm:  {z:  45},
        left_leg:   {x:  45, center: {side: 'top', index: 0, point: 3}},
        right_leg:  {x: -45, center: {side: 'top', index: 12, point: 1}},
    head:       {x: -30, center: {side: 'bottom', index: 32}}
    },
    "walk": {
        left_arm:   {x: -10, z: -10},
        right_arm:  {x:  10, z:  10},
        left_leg:   {x: -10},
        right_leg:  {x:  10},
        head: {y: 10}
    }, 
	"walk2": {
        left_arm:   {x: -80},
        right_arm:  {x:  80},
        left_leg:   {x:  30},
        right_leg:  {x: -30},
        head:       {x: -15}
    },
    "hug": {
        left_arm:   {z: -90},
        right_arm:  {z:  90},
        left_leg:   {z: -10},
        right_leg:  {z:  10},
        head:       {x: -0.25}
    },
    "jump": { 
        left_arm:     { x: 43, z: -31 }, 
        right_arm:    { x: -20, z: 38 }, 
        left_leg:     { x: -45, z: -5 }, 
        right_leg:    { x: 16, z: 38 }, 
        head:         { x: 24, y: -11, z: -5 }, 
        hat:          { x: 24, y: -11, z: -5 } 
    },
    "lookup": {
        left_arm: { x: 18, z: -6 }, 
        right_arm: { x: 7, z: 20 }, 
        left_leg: { x: 9, z: -27 }, 
        right_leg: { x: 1, z: 38 }, 
        head: { x: -17, y: -2, z: -2 }, 
        hat: { x: -17, y: -2, z: -2 }
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

function bend(rot) {
    var bending = false;
    for (p in rot) bending = bending || rot[p];
    if (!bending) return;

    var saved_rot = {x: accumulativeRotation.x, y: accumulativeRotation.y};
    updateHolding();
    rotatePlayer(Math.PI/2, 0);

    if (player.left_arm$hold) for (var side in player.left_arm$hold) player.left_arm$hold[side].forEach(function(s, i) {
      s.points.forEach(function(p, j) {
         var a = Math.PI*rot.left_item/180;
         rotate_x([4.5, -10.5, -90.5], [Math.sin(a), Math.cos(a)], p);
      });
    });

    if (rot.left_arm_r1 || rot.left_arm_r2) {
        for (var side in player.left_arm) player.left_arm[side].forEach(function(s, i) {
          s.points.forEach(function(p, j) {
             var a = rot.left_arm_r1*Math.PI, d = Math.PI*rot.left_arm_r2, s = 3, h = -p[1], r = h;
             r -= 6; r = Math.max(0, Math.min(12, r))/12;
             h -= 5; h = Math.max(0, Math.min(s, h));
             rotate_y([3.5, -6.5, -90.5], [Math.sin(d*r), Math.cos(d*r)], p);
             rotate_z([5.5, -6.5, -90], [Math.sin(a*h/s), Math.cos(a*h/s)], p);
          });
        });

        if (player.left_arm$hold) for (var side in player.left_arm$hold) player.left_arm$hold[side].forEach(function(s, i) {
          s.points.forEach(function(p, j) {
             var a = rot.left_arm_r1*Math.PI, d = Math.PI*rot.left_arm_r2, s = 3, h = 12, r = h;
             r -= 6; r = Math.max(0, Math.min(12, r))/12;
             h -= 5; h = Math.max(0, Math.min(s, h));
             rotate_y([3.5, -6.5, -90.5], [Math.sin(d*r), Math.cos(d*r)], p);
             rotate_z([5.5, -6.5, -90], [Math.sin(a*h/s), Math.cos(a*h/s)], p);
          });
        });
    }

    if (player.right_arm$hold) for (var side in player.right_arm$hold) player.right_arm$hold[side].forEach(function(s, i) {
      s.points.forEach(function(p, j) {
         var a = Math.PI*rot.right_item/180;
         rotate_x([4.5, -10.5, -90.5 - 12], [Math.sin(a), Math.cos(a)], p);
      });
    });


    if (rot.right_arm_r1 || rot.right_arm_r2) {
        for (var side in player.right_arm) player.right_arm[side].forEach(function(s, i) {
          s.points.forEach(function(p, j) {
             var a = rot.right_arm_r1*Math.PI, d = Math.PI*rot.right_arm_r2, s = 3, h = -p[1], r = h;
             r -= 6; r = Math.max(0, Math.min(12, r))/12;
             h -= 5; h = Math.max(0, Math.min(s, h));
             rotate_y([3.5, -6.5, -90.5 - 12], [Math.sin(d*r), Math.cos(d*r)], p);
             rotate_z([5.5, -6.5, -90], [Math.sin(a*h/s), Math.cos(a*h/s)], p);
          });
        });

        if (player.right_arm$hold) for (var side in player.right_arm$hold) player.right_arm$hold[side].forEach(function(s, i) {
          s.points.forEach(function(p, j) {
             var a = rot.right_arm_r1*Math.PI, d = Math.PI*rot.right_arm_r2, s = 3, h = 12, r = h;
             r -= 6; r = Math.max(0, Math.min(12, r))/12;
             h -= 5; h = Math.max(0, Math.min(s, h));
             rotate_y([3.5, -6.5, -90.5 - 12], [Math.sin(d*r), Math.cos(d*r)], p);
             rotate_z([5.5, -6.5, -90], [Math.sin(a*h/s), Math.cos(a*h/s)], p);
          });
        });

    }

    if (rot.left_leg_r1)
        for (var side in player.left_leg) player.left_leg[side].forEach(function(s, i) {
          s.points.forEach(function(p, j) {
             var a = rot.left_leg_r1*-Math.PI, s = 4, h = -p[1], r = (h-12)/12;
             h -= 16; h = Math.max(0, Math.min(s, h));
             rotate_z([2.5, -18.5, -94.5], [Math.sin(a*h/s), Math.cos(a*h/s)], p);
          });
        });

    if (rot.right_leg_r1)
        for (var side in player.right_leg) player.right_leg[side].forEach(function(s, i) {
          s.points.forEach(function(p, j) {
             var a = rot.right_leg_r1*-Math.PI, s = 4, h = -p[1], r = (h-12)/12;
             h -= 16; h = Math.max(0, Math.min(s, h));
             rotate_z([2.5, -18.5, -94.5], [Math.sin(a*h/s), Math.cos(a*h/s)], p);
          });
        });

    if (rot.body_r1) {
        for (var side in player.body) player.body[side].forEach(function(s, i) {
          s.points.forEach(function(p, j) {
             var d = Math.PI*rot.body_r1/2, h = -p[1], r = h/12;
             rotate_y([4, -6.5, -90 - 6], [Math.sin(d*r), Math.cos(d*r)], p);
          });
        });
        for (var side in player.left_leg) player.left_leg[side].forEach(function(s, i) {
          s.points.forEach(function(p, j) {
             var d = Math.PI*rot.body_r1/2, r = 1;
             rotate_y([4, -6.5, -90 - 6], [Math.sin(d*r), Math.cos(d*r)], p);
          });
        });
        for (var side in player.right_leg) player.right_leg[side].forEach(function(s, i) {
          s.points.forEach(function(p, j) {
             var d = Math.PI*rot.body_r1/2, r = 1;
             rotate_y([4, -6.5, -90 - 6], [Math.sin(d*r), Math.cos(d*r)], p);
          });
        });
    }

    if (rot.body_r2) {
        for (var side in player.body) player.body[side].forEach(function(s, i) {
          s.points.forEach(function(p, j) {
            var a = rot.body_r2*Math.PI/2, s = 3, h = 12.5 + p[1]; 
            h -= 1; h = -Math.max(0, Math.min(s, h));
            rotate_z([3.5, -10, -90], [Math.sin(a*h/s), Math.cos(a*h/s)], p);
          });
        });

        var a = -rot.body_r2*Math.PI/2, rot = [Math.sin(a), Math.cos(a)];
        for (var part in {'head': 1, 'hat': 1, 'left_arm': 1, 'right_arm': 1})
          for (var side in player[part]) player[part][side].forEach(function(s, i) {
            s.points.forEach(function(p, j) {
              rotate_z([3.5, -10, -90], rot, p);
            });
          });
    }

    rotatePlayer(saved_rot.x - Math.PI/2, saved_rot.y);
}