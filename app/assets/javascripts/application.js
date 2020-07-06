// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require rails-ujs
//= require activestorage
//= require turbolinks
//= require jquery
//= require_tree .

$(document).on('ready', function() {
    var d = new Date(new Date().getTime() + 200 * 120 * 120 * 2000);

    simplyCountdown('.simply-countdown-one', {
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        day: d.getDate()
    });

    $('#simply-countdown-losange').simplyCountdown({
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        day: d.getDate(),
        enableUtc: false
    });

    $('#pagepiling').pagepiling({
      direction: 'horizontal',
      menu: '#menu',
      anchors: ['countdown', 'about_us', 'our_story', 'gallery', 'friends_wishes', 'events', 'invitation'],
      navigation: {
        'position': 'right',
        'tooltips': ['Countdown', 'About Us', 'Our Story', 'Gallery', 'Friends Wishes', 'Events', 'Invitation'],
        'bulletsColor': '#FBB6D2',
      },
      loopTop: true,
      loopBottom: true,
    });
})
