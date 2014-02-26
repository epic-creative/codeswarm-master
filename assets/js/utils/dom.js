define([
  'jquery'
], function ($) {

  var dom = {

    activate: function () {
      // Cache elements
      this.$notification = $('#notification');
      this.$document = $(document);

      // Start core dom handlers
      this.globalNav();
    },

    // Show notification modal
    // type = error, success
    showNotification: function (type, message) {
      var self = this;
      self.$notification.addClass(type).children('div').html(message);
      // Auto-close after timeout
      var closer = setTimeout(function () {
        self.$notification.removeClass(type);
      }, 3000);
      // Bind close button
      self.$notification.find('a').click(function () {
        self.$notification.removeClass(type);
        window.clearTimeout(closer);
      });
    },

    // Control global header
    globalNav: function () {
      var self = this,
        $navTrigger = $('.profile-nav--trigger'),
        $nav = $('.profile-nav'),
        navOpen = 'profile-nav--open';

      $navTrigger.click(function (e) {
        e.stopPropagation();
        e.preventDefault();

        if (!$nav.hasClass(navOpen)) {
          $nav.addClass(navOpen);
        } else {
          $nav.removeClass(navOpen);
        }
      });

      self.$document.on('click', function () {
        $nav.removeClass(navOpen);
      }).on('click', '.profile-nav--list', function (e) {
        e.stopPropagation();
      });

      $('.global-search--trigger').on('click', function () {
        $nav.removeClass(navOpen);
      });
    },

    // Hanlde global search
    globalSearch: function () {
      var self = this,
        $searchTrigger = $(".global-search--trigger"),
        $search = $(".global-search"),
        searchOpen = "global-search--open",
        searchTriggerOpen = "global-search--trigger--open";

      $searchTrigger.click(function (e) {
        e.stopPropagation();
        e.preventDefault();

        if (!$search.hasClass(searchOpen)) {
          $search.addClass(searchOpen);
          $(this).addClass(searchTriggerOpen);
        } else {
          $search.removeClass(searchOpen);
          $(this).removeClass(searchTriggerOpen);
        }
      });

      self.$document
      .on("click", function () {
        $search.removeClass(searchOpen);
        $searchTrigger.removeClass(searchTriggerOpen);
      })
      .on("click", ".global-search", function (e) {
        e.stopPropagation();
      });

      $(".profile-nav--trigger").on("click", function () {
        $search.removeClass(searchOpen);
        $searchTrigger.removeClass(searchTriggerOpen);
      });
    }

  };

  return dom;

});