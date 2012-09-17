/*
@Name: V2EX reply pusher on HTML5 notification API
@URL: http://hzlzh.github.com/project/v2ex-notification/
@Twitter: @hzlzh
*/

// notification close delay time
var AUTO_CLOSE_DELAY_SECONDS = 6, updated_time = '',
  refresh_time = 5,
  V2EX_RSS = $('.sll').val();
  // Get yours here http://www.v2ex.com/notifications#Bottom
$('#Top .content td:last').prepend('<input style="font-size:16px;" type="button" value="推到~我" onclick="init();" />');

setInterval(function() {
  // Loop
  load_rss();
}, refresh_time * 1000);

// Load XML
var load_rss = function() {
    $.get(V2EX_RSS, function(data) {
    console
      if (updated_time == '') {
        console.log('First time!')
        updated_time = $(data).find('feed > updated').text();
      } else if (updated_time != $(data).find('feed > updated').text()) {
        var new_reply_text = $.trim($($(data).find('entry content')[0]).text()).replace(/<[^>]+>/g, "");
        var new_reply_topic = $($(data).find('entry id')[0]).text().split('/')[2];
        var new_reply_author = $.trim($($(data).find('entry name')[0]).text());
        notify(new_reply_topic, new_reply_text, new_reply_author);
        updated_time = $(data).find('feed > updated').text();
      } else {
        console.log('No new reply! - ' + updated_time)
      }
    });
  }

// init HTML5 notification API
function init() {
  if (window.webkitNotifications) {
    window.webkitNotifications.requestPermission();
  }
}

// push it
function notify(title, body, author) {
  var icon = "http://www.v2ex.com/favicon.ico";
  var title = "[" + title + "] from " + author;
  var body = body;

  if (window.webkitNotifications) {
    if (window.webkitNotifications.checkPermission() == 0) {
      var popup = window.webkitNotifications.createNotification(icon, title, body);
      popup.ondisplay = function(event) {
        setTimeout(function() {
          event.currentTarget.cancel();
        }, AUTO_CLOSE_DELAY_SECONDS * 1000);
      }
      popup.show();
    } else {
      window.webkitNotifications.requestPermission();
      return;
    }
  }
}