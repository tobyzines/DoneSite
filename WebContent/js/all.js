$(function() {
  // $('input').click(function() {
  // $(this).select();
  // });
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
      return this.each(function() {
        var $this = $(this), data = $this.data('popover'), options = typeof option == 'object' && option
        if (!data)
          $this.data('popover', (data = new Constructor(this, options)))
        if (typeof option == 'string')
          data[option]()
      })
    }
    $.fn.popover2.Constructor = Constructor;
  })(jQuery);

  updateItemTools(jQuery);
});

function htmlTableToCSV($target, filename) {
  var $table;
  if ($target.is("table")) {
    $table = $target;
  } else {
    $table = $target.parents("table").first();
  }
  var $headers = $table.find('tr:has(th)');
  var $rows = $table.find('tr:has(td)');
  // Temporary delimiter characters unlikely to be typed by keyboard
  // This is to avoid accidentally splitting the actual contents
  var tmpColDelim = String.fromCharCode(11); // vertical tab character
  var tmpRowDelim = String.fromCharCode(0); // null character

  // actual delimiter characters for CSV format
  var colDelim = '","', rowDelim = '"\r\n"';

  // Grab text from table into CSV formatted string
  var csv = '"';
  csv += formatRows($headers.map(grabRow));
  csv += rowDelim;
  csv += formatRows($rows.map(grabRow)) + '"';

  downloadCsv(csv, filename);

  // ------------------------------------------------------------
  // Helper Functions
  // ------------------------------------------------------------
  // Format the output so it has the appropriate delimiters
  function formatRows(rows) {
    return rows.get().join(tmpRowDelim).split(tmpRowDelim).join(rowDelim).split(tmpColDelim).join(colDelim);
  }
  // Grab and format a row from the table
  function grabRow(i, row) {

    var $row = $(row);
    // for some reason $cols = $row.find('td') || $row.find('th') won't
    // work...
    var $cols = $row.find('td');
    if (!$cols.length)
      $cols = $row.find('th');

    return $cols.map(grabCol).get().join(tmpColDelim);
  }
  // Grab and format a column from the table
  function grabCol(j, col) {
    var $col = $(col), $text = $col.text(), $data = $col.attr("data");

    if (typeof $data === "undefined")
      return $text.replace('"', '""'); // escape double quotes
    return $data.replace('"', '""'); // escape double quotes

  }
}

function JSON2CSV(objArray) {
  var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
  var str = '';
  var line = '';

  if ($("#labels").is(':checked')) {
    var head = array[0];
    if ($("#quote").is(':checked')) {
      for ( var index in array[0]) {
        var value = index + "";
        line += '"' + value.replace(/"/g, '""') + '",';
      }
    } else {
      for ( var index in array[0]) {
        line += index + ',';
      }
    }

    line = line.slice(0, -1);
    str += line + '\r\n';
  }

  for (var i = 0; i < array.length; i++) {
    var line = '';

    if ($("#quote").is(':checked')) {
      for ( var index in array[i]) {
        var value = array[i][index] + "";
        line += '"' + value.replace(/"/g, '""') + '",';
      }
    } else {
      for ( var index in array[i]) {
        line += array[i][index] + ',';
      }
    }

    line = line.slice(0, -1);
    str += line + '\r\n';
  }
  return str;
}
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

function downloadCsv(csv, filename) {
  var downloadLink = document.createElement("a");
  var blob = new Blob([ "\ufeff", csv ]);
  var url = URL.createObjectURL(blob);
  downloadLink.href = url;
  downloadLink.download = filename;

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

function formatMoney(moneyValue) {
  // generate <i class="gold-img"></i><span class="gold">8</span><i
  // class="silver-img"></i><span class="silver">75</span><i
  // class="copper-img"></i><span class="copper">80</span>
  var moneyString = moneyValue + "";
  var isNegative = false;

  if (moneyString.indexOf("-") == 0) {
    isNegative = true;
    moneyString = moneyString.slice(1);
  }
  var length = moneyString.length;
  var gold = 0;
  var silver = 0;
  var copper = moneyString.slice(-2);

  if (length > 2) {
    silver = moneyString.slice(-4, -2);
  }

  if (length > 4) {
    gold = moneyString.slice(0, length - 4);
  }

  var txt = "";
  if (isNegative) {
    txt += '<span style="color:red">-</span>';
  }
  if (gold > 0) {
    txt += '<i class="gold-img"></i><span class="gold">' + gold + '</span>';
  }
  if (silver > 0) {
    txt += '<i class="silver-img"></i><span class="silver">' + silver + '</span>';
  }
  if (copper > 0) {
    txt += '<i class="copper-img"></i><span class="copper">' + copper + '</span>';
  }

  return txt;
}

function updateIcons(objectIds) {
  var idArray = objectIds.split(",");

  for (x = 0; x < idArray.length; x++) {

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var myObject = JSON.parse(this.responseText);
        $("#icon-" + myObject.item_id)
            .attr(
                "src",
                "https://render.guildwars2.com/file/" + myObject.icon_file_signature + "/" + myObject.icon_file_id
                    + ".jpg");
      }
    };

    xmlhttp.open("GET", "https://api.guildwars2.com/v1/item_details.json?item_id=" + idArray[x], true);
    xmlhttp.send();
  }
}

function updateItemTools($) {
  $('.item-tools')
      .popover2(
          {
            trigger : 'manual',
            html : true,
            animation : false,
            placement : function() {
              var offset = this.$element.offset()
              var right = $(window).width() + $(window).scrollLeft() - offset.left
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
              var wiki = '<button class="btn btn-default btn-xs wiki" title="wiki"><i class="fa fa-wikipedia-w"></i></button>';
              return [ wiki, clipboard ].join(' ');
            },
            onshow : function() {
              var target = this.$element;
              var tip = this.$tip;
              tip.css('line-height', 0)
              tip.find('.clipboard').click(function() {
                window.prompt("Copy to clipboard: Ctrl+C, Enter", target.text());
              });
              tip.find('.wiki').click(function() {
                var text = target.text().replace(/ /g, '_')
                var subdomain = ITEM_LANGUAGE == 'en' ? 'wiki' : 'wiki-' + ITEM_LANGUAGE
                window.open('http://' + subdomain + '.guildwars2.com/wiki/' + text)
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

  $('.table-tools')
      .popover2(
          {
            trigger : 'manual',
            html : true,
            animation : false,
            placement : function() {
              var offset = this.$element.offset()
              var right = $(window).width() + $(window).scrollLeft() - offset.left
              var left = offset.left + this.$element.outerWidth()
              if (right < 100)
                return 'left'
              else if (left < 100)
                return 'bottom'
              else
                return 'right'
            },
            content : function() {
              var csv = '<button class="btn btn-default btn-xs csv" title="save as csv"><i class="fa fa-file-text-o"></i></button>';
              var csv2 = '<button class="btn btn-default btn-xs csv2" title="save as csv"><i class="fa fa-file-text"></i></button>';
              return [ csv ].join(' ');
            },
            onshow : function() {
              var target = this.$element;
              var tip = this.$tip;
              tip.css('line-height', 0)
              tip.find('.csv').click(function() {
                var filename = target.attr("filename");
                if (typeof filename === "undefined") {
                  filename = "data.csv";
                } else if (filename.indexOf(".csv") == -1) {
                  filename += ".csv";
                }
                htmlTableToCSV(target, filename);
              });
              tip
                  .find('.csv2')
                  .click(
                      function() {
                        var json_pre = '[{"Id":1,"UserName":"Sam Smith"},{"Id":2,"UserName":"Fred Frankly"},{"Id":1,"UserName":"Zachary Zupers"}]';
                        var json = $.parseJSON(json_pre);

                        var csv = JSON2CSV(json);

                        downloadCsv(csv, "data.csv");
                      });
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
}
