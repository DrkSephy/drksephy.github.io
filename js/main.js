$(document).ready(function() {

  // Menu Toggle
  var navigation = $('nav');
  var navigationToggle = $('.toggle');

  navigation.hide();

  navigationToggle.on('click', function() {
    $(this).toggleClass('open');
    navigation.fadeToggle('fast');
  });

  // Reading Time
  $('article').readingTime();


  $('.post').readingTime({
    remoteTarget: '.post-content',
    readingTimeTarget: '.post-reading-time'
  });

  var $window = $(window);
  var $image = $('.post-image-image');
  var height = $('.article-image').height();

  $window.on('scroll', function() {
    var top = $window.scrollTop();
    if (top < 0 || top > 1500) { return; }
    $image
        .css('transform', 'translate3d(0px, '+top/3+'px, 0px)')
        .css('opacity', 1-Math.max(top/700, 0));
  });

  $window.trigger('scroll');
  $('.post-content').css('padding-top', height + 'px');

  $(function() {
    $('a[href*=#]:not([href=#])').click(function() {
      if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
        if (target.length) {
          $('html,body').animate({
            scrollTop: target.offset().top
          }, 500);
          return false;
        }
      }
    });
  });
});