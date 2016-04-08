(function() {
  $('.drawer').drawer({
      nav: 'drawer-nav',
      navList:     'drawer-nav-list',
      overlay:     'drawer-overlay',
      toggle:      'drawer-toggle',
      openClass:   'drawer-open',
      closeClass:  'drawer-close',
      desktopEvent: 'mouseover', // or click 
      speed: 200,
      width: 480
  });

}).call(this)