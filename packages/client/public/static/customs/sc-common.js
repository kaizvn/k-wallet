// var Kosmo = {
//   screen: {
//     breakpoints: {
//       xxl: 1441,
//       xl: 1440,
//       lg: 992,
//       md: 768,
//       sm: 544,
//       xs: 320
//     }
//   }
// };

(function($) {
  $(document).on('sidebar:height:changed', function() {
    var isSidebarFixed = $('body').hasClass('ks-sidebar-position-fixed');
    if (isSidebarFixed) {
      $(document)
        .find('.ks-sidebar .ks-sidebar-wrapper')
        .jScrollPane({
          autoReinitialise: false,
          autoReinitialiseDelay: 300
        });
    }
  });

  $(document).on('click', '.ks-sidebar .dropdown-toggle', function() {
    var parent = $(this).parent();
    var menu = parent.find('> .dropdown-menu');

    if (parent.hasClass('open')) {
      menu.show();
      var height = menu.height();
      menu.height(0);
      menu.velocity(
        {
          height: height
        },
        {
          duration: 300,
          easing: 'easeOut',
          complete: function() {
            menu.removeAttr('style');
            $(document).trigger('sidebar:height:changed');
          }
        }
      );
    } else {
      menu.hide();
      menu.removeAttr('style');
      $(document).trigger('sidebar:height:changed');
    }
  });

  // KEEP THE CODE BELOW FOR EDUCATION PURPOSE

  // $(document).on('click', '.ks-sidebar-toggle', function() {
  //   var ksBody = $('body');
  //   if (ksBody.hasClass('ks-sidebar-compact')) {
  //     ksBody.removeClass('ks-sidebar-compact');
  //   } else {
  //     ksBody.addClass('ks-sidebar-compact');
  //   }
  // });

  //   $(document).on('click', '.ks-sidebar-mobile-toggle', function() {
  //     var self = $(this);
  //     var ksMobileOverlay = $('.ks-mobile-overlay'); //done
  //     var ksNavbarMenu = $('.ks-navbar-menu');
  //     var ksNavbarMenuToggle = $('.ks-navbar-menu-toggle');// not found
  //     var ksNavbarActions = $('.ks-navbar .ks-navbar-actions');
  //     var ksNavbarActionsToggle = $('.ks-navbar-actions-toggle');
  //     var ksSidebar = $('.ks-sidebar');
  //
  // // open mobile
  //     if (ksMobileOverlay.hasClass('ks-open') && !self.hasClass('ks-open')) {
  //       ksNavbarMenu.removeClass('ks-open');
  //       ksNavbarMenuToggle.removeClass('ks-open');
  //       ksNavbarActions.removeClass('ks-open');
  //       ksNavbarActionsToggle.removeClass('ks-open');
  //       ksMobileOverlay.removeClass('ks-open');
  //     }
  //
  //     self.toggleClass('ks-open');
  //     ksSidebar.toggleClass('ks-open');
  //     ksMobileOverlay.toggleClass('ks-open');
  //   });

  $(document).on(
    'click',
    '.ks-sidebar-wrapper .dropdown-item, .ks-sidebar-wrapper  .nav-link:not(.dropdown-toggle)',
    function() {
      var ksMobileOverlay = $('.ks-mobile-overlay');
      if (ksMobileOverlay.hasClass('ks-open')) {
        ksMobileOverlay.removeClass('ks-open');
      }
    }
  );

  // Response.create({
  //   prop: 'width',
  //   breakpoints: [
  //     Kosmo.screen.breakpoints.xxl,
  //     Kosmo.screen.breakpoints.xl,
  //     Kosmo.screen.breakpoints.lg,
  //     Kosmo.screen.breakpoints.md,
  //     Kosmo.screen.breakpoints.sm,
  //     Kosmo.screen.breakpoints.xs,
  //     0
  //   ]
  // });
  //
  // Response.crossover('width', function() {
  //   var ksBody = $('body');
  //   var isSidebarCompact = ksBody.hasClass('ks-sidebar-compact');
  //
  //   if (Response.band(Kosmo.screen.breakpoints.xxl)) {
  //     if (!isSidebarCompact) {
  //       ksBody.removeClass('ks-sidebar-compact');
  //     }
  //
  //     ksBody.removeClass('ks-sidebar-collapsed');
  //   } else if (
  //     Response.band(Kosmo.screen.breakpoints.lg, Kosmo.screen.breakpoints.xl)
  //   ) {
  //     ksBody.removeClass('ks-sidebar-collapsed');
  //   } else if (Response.band(0, Kosmo.screen.breakpoints.lg)) {
  //     if (!isSidebarCompact) {
  //       ksBody.removeClass('ks-sidebar-compact');
  //     }
  //
  //     ksBody.addClass('ks-sidebar-collapsed');
  //   }
  //
  //   // var api = $(document).find('.ks-sidebar .ks-sidebar-wrapper').data('jsp');
  //   // api.reinitialise();
  // });
  //
  // Response.ready(function() {
  //   $(window).trigger('resize');
  // });

  // $(document).on(
  //   'mouseenter',
  //   'body.ks-sidebar-compact .ks-sidebar',
  //   function() {
  //     $('body').addClass('ks-sidebar-compact-open');
  //   }
  // );
  //
  // $(document).on(
  //   'mouseleave',
  //   'body.ks-sidebar-compact .ks-sidebar',
  //   function() {
  //     $('body').removeClass('ks-sidebar-compact-open');
  //     $(this)
  //       .find('.open')
  //       .removeClass('open');
  //   }
  // );

  $(document).trigger('sidebar:height:changed');
})(window.jQuery);
