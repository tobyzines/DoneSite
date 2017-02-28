var Gwt = Gwt || {}
Gwt.faves = {}
Gwt.formatCurrency = function(amount) {
  if (amount == 0)
    return '0';
  var negative = amount < 0;
  var amount = Math.abs(amount);
  var gold = Math.floor(amount / 10000);
  var silver = Math.floor(amount / 100) % 100;
  var copper = Math.floor(amount % 100);
  var output = [];
  if (negative) {
    output.push('<span style="color:red">-</span>');
  }
  if (gold) {
    output.push('<i class="gold-img"></i><span class="gold">' + gold
        + '</span>');
  }
  if (silver) {
    output.push('<i class="silver-img"></i><span class="silver">' + silver
        + '</span>');
  }
  if (copper) {
    output.push('<i class="copper-img"></i><span class="copper">' + copper
        + '</span>');
  }
  return output.join(' ');
};
function changeSubdomain(sub) {
  var host = window.location.hostname;
  var chunks = host.split('.');
  chunks[0] = sub;
  window.location.hostname = chunks.join('.');
}
function insertParam(key, value) {
  key = escape(key);
  value = escape(value);
  var kvp = document.location.search.substr(1).split('&');
  if (kvp == '') {
    document.location.search = key + '=' + value
    return;
  }
  var i = kvp.length;
  var x;
  while (i--) {
    x = kvp[i].split('=');
    if (x[0] == key) {
      x[1] = value;
      kvp[i] = x.join('=');
      break;
    }
  }
  if (i < 0) {
    kvp[kvp.length] = [ key, value ].join('=');
  }
  document.location.search = kvp.join('&');
}
Gwt.qs = (function(a) {
  if (a == "")
    return {};
  var b = {};
  for (var i = 0; i < a.length; ++i) {
    var p = a[i].split('=');
    if (p.length != 2)
      continue;
    b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
  }
  return b;
})(window.location.search.substr(1).split('&'));
Gwt.changeSubdomain = function(subdomain) {
  var location = window.location;
  var split = location.host.split('.');
  if (split[0] == subdomain)
    return;
  split[0] = subdomain;
  var host = split.join('.');
  window.location = [ location.protocol, '//', host, location.pathname,
      location.search, location.hash ].join('');
}
$(function() {
  $.pnotify.defaults.history = false;
  $('input').click(function() {
    $(this).select();
  });
  function set_watch_icon(e, id) {
    var saved = Gwt.faves[id]
    if (saved === true || saved === undefined)
      e.find('i').removeClass('fa-eye-slash').addClass('fa-eye')
    else
      e.find('i').removeClass('fa-eye').addClass('fa-eye-slash')
  }
  function watch_item() {
    var me = $(this);
    var id = parseInt(me.attr('data-id'))
    if (SIGNED === false) {
      setTimeout(function() {
        $('#login-dropdown').children(':first').click();
      }, 0);
      return;
    }
    me.addClass('disabled');
    $.post('/api/favorite', {
      item : id
    }, function(data) {
      if (data.state == 'add') {
        Gwt.faves[id] = true
        set_watch_icon(me, id)
        if (data.message == 'full')
          $.pnotify({
            text : 'Watchlist Full',
            type : 'error',
            delay : 1000
          })
        else
          $.pnotify({
            text : 'Removed',
            type : 'success',
            delay : 1000
          })
      } else {
        Gwt.faves[id] = false
        set_watch_icon(me, id)
        $.pnotify({
          text : 'Added',
          type : 'success',
          delay : 1000
        })
      }
      me.removeClass('disabled')
    }, 'json').error(function() {
      me.removeClass('disabled')
    });
  }
  $('.watch-item').click(watch_item);
  $('.remove-favorite').click(function(e) {
    var me = $(this);
    me.parent().parent().hide(300);
    params = {
      item : me.attr('data')
    };
    $.post('/api/favorite', params);
  });
  $('.formatgw2money').each(function() {
    var me = $(this);
    me.html(Gwt.formatCurrency(me.html()));
  });
  $('.timestamp').each(function() {
    var me = $(this);
    var m = moment(parseInt(me.attr('data-timestamp')) * 1000);
    me.html(m.fromNow(me.attr('data-ago') == undefined ? true : false));
    me.attr('title', m.format('LLLL'));
  });
  (function() {
    ZeroClipboard.setDefaults({
      moviePath : '/static/swf/ZeroClipboard.swf'
    });
    var clip = new ZeroClipboard();
    clip.on('mouseover', function(c, a) {
      if (c.mouseover && c.mouseover.call(this, c, a) === undefined) {
        return;
      }
      $(this).css('opacity', 0.5);
    });
    clip.on('mouseout', function(c, a) {
      if (c.mouseout && c.mouseout.call(this, c, a) === undefined) {
        return;
      }
      $(this).css('opacity', 1);
    });
    clip.on('mousedown', function(c, a) {
      if (c.mousedown && c.mousedown.call(this, c, a) === undefined) {
        return;
      }
      $(this).css('opacity', 1);
    });
    clip.on('mouseup', function(c, a) {
      if (c.mouseup && c.mouseup.call(this, c, a) === undefined) {
        return;
      }
      $(this).css('opacity', 0.5);
    });
    clip.on('complete', function(c, a) {
      if (c.complete && c.complete.call(this, c, a) === undefined) {
        return;
      }
    });
  })();
  (function($) {
    var parent = $.fn.popover;
    var Constructor = function() {
      return parent.Constructor.apply(this, arguments)
    }
    Constructor.prototype = $.extend({}, parent.Constructor.prototype, {
      show : function() {
        var result = parent.Constructor.prototype.show.apply(this);
        if (this.options.onshow)
          this.options.onshow.call(this);
        return result;
      }
    });
    $.fn.popover2 = function(option) {
      return this
          .each(function() {
            var $this = $(this), data = $this.data('popover'), options = typeof option == 'object'
                && option
            if (!data)
              $this.data('popover', (data = new Constructor(this, options)))
            if (typeof option == 'string')
              data[option]()
          })
    }
    $.fn.popover2.Constructor = Constructor;
  })(jQuery);
  function clear_hiding(e) {
    clearTimeout(e.data('hidetimer'))
    e.data('hidetimer', null)
  }
  function start_hiding(e) {
    clear_hiding(e)
    var timer = setTimeout(function() {
      e.popover2('hide')
      e.data('hidetimer', null)
    }, 200)
    e.data('hidetimer', timer)
  }
  $('.money-helper')
      .popover2(
          {
            html : true,
            trigger : 'manual',
            animation : false,
            placement : function() {
              var offset = this.$element.offset();
              var right = $(window).width() + $(window).scrollLeft()
                  - offset.left - this.$element.outerWidth();
              var left = offset.left
              if (left < 130)
                return 'right';
              else if (right < 130)
                return 'left';
              else
                return 'top';
            },
            content : function() {
              var output = $('<div class="input-prepend">');
              var gold = $('<span class="add-on"><i class="gold-img"></i></span><input id="gold" data-ignore style="width:3em;margin-right:4px" type="text" maxlength="5">');
              var silver = $('<span class="add-on"><i class="silver-img"></i></span><input id="silver" data-ignore style="width:2em;margin-right:4px" type="text" maxlength="2">');
              var copper = $('<span class="add-on"><i class="copper-img"></i></span><input id="copper" data-ignore style="width:2em;margin-right:4px" type="text" maxlength="2">');
              output.append(gold).append(silver).append(copper);
              return output;
            },
            onshow : function() {
              var target = this.$element;
              var tip = this.$tip;
              var e_gold = tip.find('#gold');
              var e_silver = tip.find('#silver');
              var e_copper = tip.find('#copper');
              function update() {
                var raw = parseInt(target.val()) || 0;
                var gold = Math.floor(raw / 10000);
                var silver = Math.floor(raw / 100) % 100;
                var copper = raw % 100;
                e_gold.val(gold || '');
                e_silver.val(silver || '');
                e_copper.val(copper || '');
              }
              update();
              tip.data('update', update);
              tip.find('input').on('change keyup', function() {
                var gold = parseInt(e_gold.val()) || 0;
                var silver = parseInt(e_silver.val()) || 0;
                var copper = parseInt(e_copper.val()) || 0;
                target.val(gold * 10000 + silver * 100 + copper);
              }).click(function() {
                $(this).select();
              });
            }
          }).mouseenter(function(e) {
        var target = $(this);
        clear_hiding(target)
        target.popover2('show')
        var tip = target.next()
        if (tip.data('bind') !== true) {
          tip.mouseenter(function() {
            clear_hiding(target)
          }).mouseleave(function() {
            start_hiding(target)
          });
          tip.data('bind', true);
        }
      }).mouseleave(function(e) {
        var target = $(this)
        start_hiding(target)
      }).keyup(function() {
        $(this).next('.popover').data('update')();
      });
  $('.item-tools')
      .popover2(
          {
            trigger : 'manual',
            html : true,
            animation : false,
            placement : function() {
              var offset = this.$element.offset()
              var right = $(window).width() + $(window).scrollLeft()
                  - offset.left
              var left = offset.left + this.$element.outerWidth()
              if (right < 100)
                return 'left'
              else if (left < 100)
                return 'bottom'
              else
                return 'right'
            },
            content : function() {
              var clipboard = '<button class="btn btn-default btn-xs clipboard" title="copy to clipboard"><i class="fa fa-files-o"></i></button>';
              var watch = '<button class="btn btn-default btn-xs watch-item" title="watch item"><i class="fa fa-eye"></i></button>';
              var wiki = '<button class="btn btn-default btn-xs wiki" title="wiki"><i class="fa fa-wikipedia-w"></i></button>';
              return [ wiki, clipboard, watch ].join(' ');
            },
            onshow : function() {
              var target = this.$element;
              var tip = this.$tip;
              tip.css('line-height', 0)
              tip.find('.clipboard').each(function() {
                $(this).attr('data-clipboard-text', target.text())
                var button = $(this);
                var clip = new ZeroClipboard({
                  activeClass : 'active',
                  hoverClass : 'hover'
                });
                clip.glue(this);
                clip.mouseover = function() {
                  clear_hiding(target)
                  button.addClass('btnhover')
                }
                clip.mouseout = function() {
                  start_hiding(target)
                  button.removeClass('active btnhover')
                }
                clip.mousedown = function() {
                  button.addClass('active')
                }
                clip.mouseup = function() {
                  button.removeClass('active')
                }
                clip.complete = function(c, a) {
                  $.pnotify({
                    text : 'Copied: ' + a.text,
                    type : 'success',
                    delay : 2000
                  })
                }
              });
              tip.find('.watch-item').click(watch_item).each(function() {
                var button = $(this)
                var id = target.attr('data-id')
                button.attr('data-id', id)
                set_watch_icon(button, id)
              })
              tip.find('.wiki').click(
                  function() {
                    var text = target.text().replace(/ /g, '_')
                    var subdomain = ITEM_LANGUAGE == 'en' ? 'wiki' : 'wiki-'
                        + ITEM_LANGUAGE
                    window.open('http://' + subdomain + '.guildwars2.com/wiki/'
                        + text)
                  })
            }
          }).mouseenter(function() {
        var target = $(this);
        clear_hiding(target)
        target.popover2('show')
        var tip = target.next()
        if (tip.data('bind') !== true) {
          tip.mouseenter(function() {
            setTimeout(function() {
              clear_hiding(target)
            }, 0)
          }).mouseleave(function() {
            start_hiding(target)
          });
          tip.data('bind', true);
        }
      }).mouseleave(function(e) {
        start_hiding($(this))
      });
});
