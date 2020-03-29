/*
This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see http://www.gnu.org/licenses/.
*/

window.onload = function() {
  $('div.jswarning').css('display', 'none');
  $('div.main').css('visibility', 'visible');
}

/*
Translation
*/

$.i18n().load('lang/' + $.i18n().locale + '.json', $.i18n().locale).done(
  function() {
    $('body').i18n();
  }
);

/*
Main function
*/

function open() {
  var img = new Image();
  img.onload = function() {
    $(".save").attr("href", "tools/download/index.php?filename=" + skin + ".png")
    $(".apply-account").attr("href", "https://my.minecraft.net/profile/skin/remote?url=" + skin).attr("target", "_blank");
    if ($("#iframe")) {
      $("#iframe").remove();
    }
    $("#content").html('<iframe src="tools/3dskinviewer/index.php?url=' + skin + '" id="iframe" frameborder="0" allowtransparency="true"></iframe>');
    if (this.width == this.height || this.width == 2 * this.height) {
      if (username == true) {
        $.Notify({
          caption: $.i18n('js1'),
          content: " ",
          type: 'success',
          icon: "<span class='mif-checkmark'></span>"
        });
      } else {
        $.Notify({
          caption: $.i18n('warning'),
          content: $.i18n('js2'),
          type: 'warning',
          icon: "<span class='mif-warning'></span>"
        });
      }
    } else if (this.width == 64 && this.height == 32) {
      if (username == true) {
        $.Notify({
          caption: $.i18n('warning'),
          content: $.i18n('js3'),
          type: 'warning',
          icon: "<span class='mif-warning'></span>"
        });
      } else {
        $.Notify({
          caption: $.i18n('warning'),
          content: $.i18n('js4'),
          type: 'warning',
          icon: "<span class='mif-warning'></span>"
        });
      }
    } else {
      $.Notify({
        caption: $.i18n('hum'),
        content: $.i18n('js5'),
        type: 'alert',
        icon: "<span class='mif-warning'></span>"
      });
    }
  }
  img.onerror = function() {
    $.Notify({
      caption: $.i18n('hum'),
      content: $.i18n('js6'),
      type: 'alert',
      icon: "<span class='mif-warning'></span>",
    });
  }
  img.src = skin;
}

function showDialog(id) {
  var dialog = $(id).data('dialog');
  dialog.open();
}

function closeDialog(id) {
  var dialog = $(id).data('dialog');
  dialog.close();
}

$(document).on('click', '#cancel', function() {
  closeDialog($(this).parent().parent().parent());
});

$(document).on('click', '#username-confirm', function() {
  if (/\s/g.test($('#username-text').val()) || $('#username-text').val() === "") {
    $.Notify({
      caption: $.i18n('js7-1'),
      content: $.i18n('js7-2'),
      type: 'alert',
      icon: "<span class='mif-not'></span>",
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
  if (/\s/g.test($('#url-text').val()) || $('#url-text').val() === "") {
    $.Notify({
      caption: $.i18n('js8-1'),
      content: $.i18n('js8-2'),
      type: 'alert',
      icon: "<span class='mif-not'></span>",
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

$(document).on('click', 'a[href$="#save"]', function() {
  if (skin == "") {
    $.Notify({
      caption: $.i18n('warning'),
      content: $.i18n('js-skinfirst'),
      type: 'warning',
      icon: "<span class='mif-warning'></span>",
      keepOpen: false
    });
  }
});

$(document).on('click', 'a[href$="#apply-account"]', function() {
  if (skin == "") {
    $.Notify({
      caption: $.i18n('warning'),
      content: $.i18n('js-skinfirst'),
      type: 'warning',
      icon: "<span class='mif-warning'></span>",
      keepOpen: false
    });
  }
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
    var username = "atnode";
    var key = "R_7fbe329dbfe743c6b381509a2dfbc76a";
    $(".bitly").html('<div class="progress small" data-value="33" data-role="progressBar"><div class="bar default" style="width: %;"></div></div>');
    $.ajax({
      url: "https://api-ssl.bit.ly/v3/shorten",
      data: {
        longUrl: url,
        apiKey: key,
        login: username
      },
      dataType: "jsonp",
      success: function(v) {
        var bit_url = v.data.url;
        $(".bitly").html('<table class="linktable"><tr><th><img src="libs/qrcode-url/index.php?q=' + bit_url + '&l=L&b=1" /></th><th>' + bit_url + '</th></tr></table>');
      },
      error: function(status_txt) {
        $(".bitly").html('<span style="color: #DA4429"><b>Bit.ly API error:</b> ' + status_txt + '<br />Please try again later.</span>');
      }
    });
  } else {
    $.Notify({
      caption: $.i18n('warning'),
      content: $.i18n('js-skinfirst'),
      type: 'warning',
      icon: "<span class='mif-warning'></span>",
      keepOpen: false
    });
  }
});

$(document).on('click', 'a[href$="#help"]', function() {
  showDialog('#help');
});

var skin = "";

/*
Metro UI CSS v3.0.17 Dialog box animation fix
*/

(function($) {

  "use strict";

  $.widget("metro.dialog", {

    version: "3.0.0",

    options: {
      modal: false,
      overlay: false,
      overlayColor: 'default',
      type: 'default', // success, alert, warning, info
      place: 'center', // center, top-left, top-center, top-right, center-left, center-right, bottom-left, bottom-center, bottom-right
      position: 'default',
      content: false,
      hide: false,
      width: 'auto',
      height: 'auto',
      background: 'default',
      color: 'default',
      closeButton: false,
      windowsStyle: false,

      _interval: undefined,
      _overlay: undefined,

      onDialogOpen: function(dialog) {},
      onDialogClose: function(dialog) {}
    },

    _create: function() {
      var that = this,
        element = this.element,
        o = this.options;

      $.each(element.data(), function(key, value) {
        if (key in o) {
          try {
            o[key] = $.parseJSON(value);
          } catch (e) {
            o[key] = value;
          }
        }
      });

      if (o.overlay) {
        this._createOverlay();
      }
      this._createDialog();

      element.data('dialog', this);
    },

    _createOverlay: function() {
      var that = this,
        element = this.element,
        o = this.options;
      var overlay = $('body').find('.dialog-overlay');

      if (overlay.length === 0) {
        overlay = $("<div/>").addClass('dialog-overlay');
      }

      if (o.overlayColor) {
        if (o.overlayColor.isColor()) {
          overlay.css({
            background: o.overlayColor
          });
        } else {
          overlay.addClass(o.overlayColor);
        }
      }

      o._overlay = overlay;
    },

    _createDialog: function() {
      var that = this,
        element = this.element,
        o = this.options;

      element.addClass('dialog');

      if (o.type !== 'default') {
        element.addClass(o.type);
      }

      if (o.windowsStyle) {
        o.width = 'auto';

        element.css({
          left: 0,
          right: 0
        });
      }

      if (o.background !== 'default') {
        if (o.background.isColor()) {
          element.css({
            background: o.background
          });
        } else {
          element.addClass(o.background);
        }
      }

      if (o.color !== 'default') {
        if (o.color.isColor()) {
          element.css({
            color: o.color
          });
        } else {
          element.addClass(o.color);
        }
      }

      element.css({
        width: o.width,
        height: o.height
      });

      if (o.closeButton) {
        $("<span/>").addClass('dialog-close-button').appendTo(element).on('click', function() {
          that.close();
        });
      }

      element.hide();
    },

    _setPosition: function() {
      var that = this,
        element = this.element,
        o = this.options;
      var width = element.width(),
        height = element.height();

      element.css({
        left: o.windowsStyle === false ? ($(window).width() - width) / 2 : 0,
        top: ($(window).height() - height) / 2
      });
    },

    open: function() {
      var that = this,
        element = this.element,
        o = this.options;
      var overlay;

      this._setPosition();

      element.data('opened', true);

      if (o.overlay) {
        overlay = o._overlay;
        overlay.appendTo('body').show();
      }

      element.fadeIn();

      if (typeof o.onDialogOpen === 'string') {
        window[o.onDialogOpen](element);
      } else {
        o.onDialogOpen(element);
      }

      if (o.hide && parseInt(o.hide) > 0) {
        o._interval = setTimeout(function() {
          that.close();
        }, parseInt(o.hide));
      }
    },

    close: function() {
      var that = this,
        element = this.element,
        o = this.options;

      clearInterval(o._interval);

      if (o.overlay) {
        $('body').find('.dialog-overlay').remove();
      }

      element.data('opened', false);

      element.fadeOut();

      if (typeof o.onDialogClose === 'string') {
        window[o.onDialogClose](element);
      } else {
        o.onDialogClose(element);
      }
    },

    _destroy: function() {},

    _setOption: function(key, value) {
      this._super('_setOption', key, value);
    }
  });
})(jQuery);