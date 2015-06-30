/*
This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see http://www.gnu.org/licenses/.
*/

function open() {
	var img = new Image();
	img.onload = function() {
		$(".save").attr("href", skin)
		$(".apply-account").attr("href", "https://minecraft.net/profile/skin/remote?url=" + skin);
		if ($("#iframe")) {
			$("#iframe").remove();
		}
		$("#content").html('<iframe src="http://preview.novaskin.me/?#' + skin + '" id="iframe" frameborder="0" allowtransparency="true"></iframe>');
		$(".twitter-share").mouseenter(function(){
			$('.twitter-share').popover('show')
		}).mouseleave(function() {
			$('.twitter-share').popover('hidden')
		});
		if (this.width == 64 && this.height == 64) {
			if (username == true) {
				$.Notify({
					caption: 'Skin loaded!',
					content: ' '
				});
			} else {
				$.Notify({
					caption: 'Warning',
					content: 'Skin Manager cannot check if the skin is valid when opened from a URL.',
					keepOpen: true
				});
			}
		} else if (this.width == 64 && this.height == 32) {
			if (username == true) {
				$.Notify({
					caption: 'Warning',
					content: 'This appears to be a skin designed for Minecraft 1.7 and below. It will load fine in Minecraft 1.8 and up, but may look weird on Minecraft Pocket Edition.',
					keepOpen: true
				});
			} else {
				$.Notify({
					caption: 'Warning',
					content: 'Skin Manager cannot check if the skin is valid when opened from a URL. Judging from the size, this skin appears to be designed for Minecraft 1.7 and below. It will load fine in Minecraft 1.8 and up, but may look weird on Minecraft Pocket Edition.',
					keepOpen: true
				});
			}
		} else {
			$.Notify({
				caption: 'Warning',
				content: 'This does not appear to be a valid skin file.',
				keepOpen: true
			});
		}
	}
	img.onerror = function() {
		$.Notify({
			caption: 'There was an error loading the skin :(',
			content: ' '
		});
	}
	img.src = skin;
}

function showDialog(id){
	var dialog = $(id).data('dialog');
	dialog.open();
}

function closeDialog(id){
	var dialog = $(id).data('dialog');
	dialog.close();
}

$(document).on('click', '#cancel', function() {
	closeDialog($(this).parent().parent().parent());
});

$(document).on('click', '#username-confirm', function() {
	if ( /\s/g.test($('#username-text').val()) || $('#username-text').val() === "" ) {
		$.Notify({
			caption: 'Invalid username',
			content: 'Minecraft usernames cannot contain spaces or be blank.',
			type: 'alert',
			timeout: 5000
		});
	} else {
		skin = "https://minotar.net/skin/" + $('#username-text').val();
		username = true;
		open();
	}
	closeDialog($(this).parent().parent().parent());
});

$(document).on('click', '#url-confirm', function() {
	if ( /\s/g.test($('#url-text').val()) || $('#url-text').val() === "" ) {
		$.Notify({
			caption: 'Invalid username',
			content: 'URLs cannot contain spaces or be blank.',
			type: 'alert',
			timeout: 5000
		});
	} else {
		skin = $('#url-text').val();
		console.log(skin);
		username = false;
		open();
	}
	closeDialog($(this).parent().parent().parent());
});

$(document).on('click', 'a[href$="#username"]', function() {
	showDialog('#username');
});

$(document).on('click', 'a[href$="#url"]', function() {
	showDialog('#url');
});

$(document).on('click', 'a[href$="#apply-pe"]', function() {
	if (skin != "") {
		$(".bitly").html('<div class="progress small" data-value="33" data-role="progressBar"><div class="bar default" style="width: 33%;"></div></div>');
		showDialog('#apply-pe');
		var url = skin;
		var username="corbindavenport";
		var key="R_fc9079f048624ceda44a6e6c798db6a4";
		$(".bitly").html('<div class="progress small" data-value="33" data-role="progressBar"><div class="bar default" style="width: %;"></div></div>');
		$.ajax({
			url:"http://api.bit.ly/v3/shorten",
			data:{longUrl:url,apiKey:key,login:username},
			dataType:"jsonp",
			success:function(v) {
				var bit_url=v.data.url;
				$(".bitly").html('<table class="linktable"><tr><th><img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data='+bit_url+'" /></th><th>'+bit_url+'</th></tr></table>');
			},
			error: function (status_txt) {
				$(".bitly").html('<span style="color: #DA4429"><b>Bit.ly API error:</b> ' + status_txt + '<br />Please try again later.</span>');
			}
		});
	} else {
		$(".bitly").html('<span style="color:#DA4429; text-align:center; font-weight:bold;">Open a skin first!</span>');
		showDialog('#apply-pe');
	}
});

$(document).on('click', 'a[href$="#help"]', function() {
	showDialog('#help');
});

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-42411310-2', 'auto');
ga('send', 'pageview');

var skin = "";