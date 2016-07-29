var Mobile = {};
Mobile.mobileDetection = {
    Android:function () {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry:function () {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS:function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera:function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows:function () {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any:function () {
        return (this.Android() || this.BlackBerry() || this.iOS() || this.Opera() || this.Windows());
    }
};

function initJQueryCss() {
  var cls = $.browser.msie ? "jquery-ie jquery-ie-" + parseInt($.browser.version)
    : $.browser.opera ? "jquery-opera jquery-opera-" + $.browser.version
    : $.browser.safari ? "jquery-webkit jquery-webkit-" + $.browser.version
    : $.browser.mozilla ? "jquery-gecko jquery-gecko-" + $.browser.version : "";
  var body = document.body || document.getElementsByTagName('body')[0];
  body.className += ' ' + cls;
}

function user_vote_anonimos(nid) {
  var nodeNid = $('#' + nid);
  if ($.cookie("ts_vote") && ($.cookie("ts_vote").indexOf(nid + '.')>-1)) {
    if (!nodeNid.hasClass('vote-button-inactive')) {
      nodeNid.replaceWith('<div id="' + nid + '" class = "vote-button vote-button-inactive">Голосовать</div>');
    }
  }
  else {
    if (nodeNid.hasClass('vote-button-inactive')) {
      nodeNid.removeClass('vote-button-inactive');
      nodeNid.html('<a title = "Голосовать" href = "/user_vote_vote/node/' + nid  + '/up">Голосовать</a>');
    }
  }
}

$.fn.textWidth = function(){
  var html_org = $(this).html();
  var html_calc = '<span>' + html_org + '</span>'
  $(this).html(html_calc);
  var width = $(this).find('span:first').width();
  $(this).html(html_org);
  return width;
}

$.fn.validateForm = function() {
  if (!validationFormConfig.fieldsToValidate) {
    return false;
  }
  var form = $(this);
  var tsContainerMessage = $('.ts_container_message');
  var validationConfig = {
    rules: {},
    messages: {}
  };
  if (!validationFormConfig.onsubmit) {
    validationConfig.onsubmit = false;
  }
  if (!validationFormConfig.onfocusout) {
    validationConfig.onfocusout = false;
  }
  if (!validationFormConfig.onfocusin) {
    validationConfig.onfocusin = false;
  }
  if (!validationFormConfig.onkeyup) {
    validationConfig.onkeyup = false;
  }
  if (!validationFormConfig.onclick) {
    validationConfig.onclick = false;
  }
  if (!validationFormConfig.focusInvalid) {
    validationConfig.focusInvalid = false;
  }
  if (validationFormConfig.focusCleanup) {
    validationConfig.focusCleanup = validationFormConfig.focusCleanup;
  }
  if (validationFormConfig.errorClass) {
    validationConfig.errorClass = validationFormConfig.errorClass;
  }
  if (validationFormConfig.validClass) {
    validationConfig.validClass = validationFormConfig.validClass;
  }
  for (i=0;i<validationFormConfig.fieldsToValidate.length;i++) {
    var field = validationFormConfig.fieldsToValidate[i];
    if (!field['name']) {
      continue;
    }
    var rule = validationConfig.rules[field.name] = {};
    var message = validationConfig.messages[field.name] = {};
    if (field.validationConfig.required) {
      rule.required = field.validationConfig.required;
      message.required = 'required';
    }
    if (field.validationConfig.email) {
      rule.email = field.validationConfig.email;
      message.email = 'email';
    }
    if (field.validationConfig.equalTo) {
      rule.equalTo = $('[name=' + field.validationConfig.equalTo + ']');
      message.equalTo = 'equalTo';
    }
    if (field.validationConfig.minlength) {
      rule.minlength = field.validationConfig.minlength;
      message.minlength = 'minlength' + field.validationConfig.minlength;
    }
    if (field.validationConfig.remote && !(field.validationConfig.takeemail)) {
      rule.remote = field.validationConfig.remote;
      message.remote = 'takename';
    }
    if (field.validationConfig.remote && field.validationConfig.takeemail) {
      rule.remote = field.validationConfig.remote;
      message.remote = 'takeemail';
    }
  }
  validationConfig.errorPlacement = function(errorLabelEl, field) {

    var errorParents  = field.parents('.field-item');
    var errorTag = errorLabelEl.text();
    if (errorTag == '') {
      return;
    }
    var errorElement = errorParents.find('.ts_validate_' + errorTag);
    var errorElementItem = errorParents.find('.validate-item');
    errorElement.addClass('validation_msg');
    errorElementItem.addClass('novalid');
    var parentEl = field.parent();
    if (!parentEl.hasClass('errors')) {
      parentEl.addClass('errors');
    }
  };
  validationConfig.success = function(errorLabelEl) {

    var field = $('#'+errorLabelEl[0].htmlFor);
    if (field.length == 0) {
      return;
    }
    var errorParents  = field.parents('.field-item');
    var errorElement = errorParents.find('.ts-validate');
    var errorElementItem = errorParents.find('.validate-item');
    errorElement.removeClass('validation_msg');
    errorElementItem.removeClass('novalid');
    var parentEl = field.parent();
    parentEl.removeClass('errors');

  };
  return form.validate(validationConfig);
}

function validationVerification() {
  var error = $('input.error');
  error.focus();
  error.blur();
}

$.fn.maxwidth = function() {
  var maxWidth = 0;
  if (this.length == 0) {
    return 0;
  }
  this.each(function(index) {
    tableWidth = $(this).width();
    if (tableWidth > maxWidth) {
      maxWidth = tableWidth;
    }
  });
  return maxWidth;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function hideOpenedDMenu(e) {
  $('[id^=m_item].menu-item').removeClass("menu-item");
  $('[id^=m_item]').removeClass('next_menu_item');
  $('[id^=dm_item]').hide();
  $('.dropdown-menu').hide();
}

function processMainPanel() {
  var mainPanelLink = $('.main_panel_link');
  var mainPanelCollapse = $('.main_panel_collapse');
  var mainPanelLinkCollapse = $('.main_panel_link_collapse');
  mainPanelLink.click(function() {
    mainPanelCollapse.show();
    mainPanelLink.hide();
    mainPanelLinkCollapse.show();
  });
  mainPanelLinkCollapse.click(function() {
    mainPanelCollapse.hide();
    mainPanelLinkCollapse.hide();
    mainPanelLink.show();
  });
}

function processMainMenu() {
  var menuShowDelay = 300;
  var menuHideDelay = 0;
  //$('[id^=m_item_]:last').addClass('last');
  var cv = null;
  var timeoutMenu = 0;
  var timeoutHideMenu = 0;
  var menu_items = $('[id^=m_item_]');
  $('[id^=dm_item_]').mouseover(function() {
    if (timeoutMenu != 0) {
      clearTimeout(timeoutMenu);
    }
    if (timeoutHideMenu != 0) {
      clearTimeout(timeoutHideMenu);
    }
  });
    if(!Mobile.mobileDetection.any()) {
        $('[id^=m_item_]').hover( function() {
            if (timeoutMenu != 0) {
                clearTimeout(timeoutMenu);
            }
            if (timeoutHideMenu != 0) {
                clearTimeout(timeoutHideMenu);
            }
            var el = $(this);
            var ce = el.attr('id').split('m_item_');
            if (cv == ce[1]) {
                return 0;
            }
            timeoutMenu = setTimeout(function() {
                cv = ce[1];
                hideOpenedDMenu();
                clearTimeout(timeoutHideMenu);
                if ($('#dm_item_' + ce[1]).size() == 0) {
                    return;
                }
                $('#m_item_' + ce[1]).removeClass("next_menu_item").addClass("menu-item");
                var nextIndex = parseInt(ce[1]) + 1;
                if (!$('#m_item_' + nextIndex).hasClass('next_menu_item')) {
                    $('#m_item_' + nextIndex).addClass("next_menu_item");
                }
                $('.dropdown-menu').show();
                $('#dm_item_' + ce[1]).show();
                var w = $('#dm_item_' + ce[1] + ' table').maxwidth();
                w = (w > 910 ? 910 : w);
                if (/MSIE (7).+Win/.test(navigator.userAgent)) {
                    $('.dropdown-menu').height($('#dm_item_' + ce[1]).height() + 30);
                    $('.dropdown-menu-cl').height($('#dm_item_' + ce[1]).height() + 30);
                    $('.dropdown-menu-cr').height($('#dm_item_' + ce[1]).height() + 30);
                    $('.dropdown-menu-cc').height($('#dm_item_' + ce[1]).height());
                }
                if (/MSIE (7).+Win/.test(navigator.userAgent)) {
                    $('.break_line').width($('#dm_item_' + ce[1]).width() - 73);
                } else {
                    $('.break_line').width($('.dropdown-menu').width() - 114);
                }
                if (/MSIE (7|8).+Win/.test(navigator.userAgent) &&
                    (!document.compatMode || document.compatMode == "CSS1Compat")) {
                    $('.menu-item-tc').removeClass('c2');
                    $('.menu-item-bc').removeClass('c1');
                    $('.menu-item div.menu-item-tc').addClass('c2');
                    $('.menu-item div.menu-item-bc').addClass('c1');
                }
                if (/MSIE (6).+Win/.test(navigator.userAgent)) {
                    $('.dropdown-menu').width($('#dm_item_'+ce[1]).width()+41);
                    $('.dropdown-menu').height($('#dm_item_'+ce[1]).height()+25);
                }
            }, menuShowDelay);
        }, function() {
            clearTimeout(timeoutMenu);
        });
    }
    else {
        menu_items.click(function(){
            var current = $(this);
            if(current.attr("data-opened") == "yes" || !current.hasClass("has_children")) {
                return true;
            }
            else {
                menu_items.attr("data-opened","no");
                current.attr("data-opened","yes");
                return false;
            }
        });
        menu_items.bind("touchstart", function (event) {
            if (timeoutMenu != 0) {
                clearTimeout(timeoutMenu);
            }
            if (timeoutHideMenu != 0) {
                clearTimeout(timeoutHideMenu);
            }
            var el = $(this);
            var ce = el.attr('id').split('m_item_');
            if (cv == ce[1]) {
                return 0;
            }
            timeoutMenu = setTimeout(function() {
                cv = ce[1];
                hideOpenedDMenu();
                clearTimeout(timeoutHideMenu);
                if ($('#dm_item_' + ce[1]).size() == 0) {
                    return;
                }
                $('#m_item_' + ce[1]).removeClass("next_menu_item").addClass("menu-item");
                var nextIndex = parseInt(ce[1]) + 1;
                if (!$('#m_item_' + nextIndex).hasClass('next_menu_item')) {
                    $('#m_item_' + nextIndex).addClass("next_menu_item");
                }
                $('.dropdown-menu').show();
                $('#dm_item_' + ce[1]).show();
                var w = $('#dm_item_' + ce[1] + ' table').maxwidth();
                w = (w > 910 ? 910 : w);
            }, menuShowDelay);
        });
        $('body').bind("touchstart",function(e) {
            var target = $(e.target);
            if(target.parents('.dropdown-menu').length == 0 && !target.hasClass('dropdown-menu')) {
                menu_items.removeClass("menu-opened");
                cv=null;
                hideOpenedDMenu();
            }
        });
    }

  var dropdownMenu = $('.dropdown-menu');
  $('body').mousemove(function(e) {
    if (cv != null) {
      if ($('[id^=m_item].menu-item').length > 0) {
        var pm = $('#m_item_0').position();
        pm.top = pm.top - 20;
        pm.left = pm.left - 20;
        var ch  = dropdownMenu.height() + pm.top + 60;
        var cw = dropdownMenu.width() + pm.left + 20;
        if((e.pageY > ch || e.pageY < pm.top) || (e.pageX < pm.left || e.pageX > cw)) {
          if (timeoutHideMenu != 0) {
              clearTimeout(timeoutHideMenu);
          }
          timeoutHideMenu = setTimeout(function() {
            hideOpenedDMenu(e);
            cv=null;
          }, menuHideDelay);
        }
      }
    }
  });
}

function getDomain(url) {
    return url.toString().split(/\/+/g)[1];
}

function init_block_user() {
  var blockUserContent = $('.block_user_content');
  var iconPlus = $('#block-user-1 .icon_plus');
  iconPlus.click(function() {
    if (iconPlus.hasClass('active')) {
      blockUserContent.hide();
      iconPlus.removeClass('active');
    }
    else {
      blockUserContent.show();
      iconPlus.addClass('active');
    }
  });
  $(document).click(function(event) {
    var $target = $(event.target);
    if ($target.filter('.ts_block_user_target').length || $target.parents().filter('.ts_block_user_target').length) {
      return;
    } else {
      if (iconPlus.hasClass('active')) {
        blockUserContent.hide();
        iconPlus.removeClass('active');
      }
    }
  });
}

function init_fancybox() {
  $('a.ts_fancybox').fancybox({
    'overlayShow'	: true,
    'transitionIn'	: 'elastic',
    'transitionOut'	: 'elastic',
    'overlayOpacity' : 0.5,
    'overlayColor' : '#000'
  });
}

function init_block_online() {
  var authenticatedUser = $('.authenticated_user');
  var tsCustomUserOnline = $('.ts_custom_user_online');
  authenticatedUser.click(function() {
    if (!tsCustomUserOnline.hasClass('open')) {
      if (tsCustomUserOnline.hasClass('add')) {
        tsCustomUserOnline.addClass('open');
        $('.user_online_list').show();
      }
      else {
        $.ajax({
          type: "POST",
          url: "/ts/custom/user/online",
          data: "name=userOnlineGet",
          dataType: "html",
          success: function(msg){
            if (msg) {
              //alert(msg);
              $(msg).appendTo(tsCustomUserOnline);
              tsCustomUserOnline.addClass('add');
              tsCustomUserOnline.addClass('open');
            }
          }
        });
      }
    }
    else {
      tsCustomUserOnline.removeClass('open');
      $('.user_online_list').hide();
    }
  });
}

function init_block_top() {
  var topUserWeeks = $('.top_user_weeks');
  var topUerMonth = $('.top_user_month');
  var topUserAll = $('.top_user_all');
  var topUserWeeksId = $('#top_user_weeks');
  var topUerMonthId = $('#top_user_month');
  var topUserAllId = $('#top_user_all');
  var topUser = $('#top_user div');
  var topUsersContainer = $('.top_users_container');
  topUserWeeks.click(function(){
    if (!$(this).hasClass('active')) {
      topUser.removeClass('active');
      $(this).addClass('active');
      topUsersContainer.removeClass('top_users_active');
      topUserWeeksId.addClass('top_users_active');
    }
  });
  topUerMonth.click(function(){
    if (!$(this).hasClass('active')) {
      topUser.removeClass('active');
      $(this).addClass('active');
      topUsersContainer.removeClass('top_users_active');
      topUerMonthId.addClass('top_users_active');
    }
  });
  topUserAll.click(function(){
    if (!$(this).hasClass('active')) {
      topUser.removeClass('active');
      $(this).addClass('active');
      topUsersContainer.removeClass('top_users_active');
      topUserAllId.addClass('top_users_active');
    }
  });
}

function init_block_new() {
  var newMaterials = $('.new_materials');
  var newForum = $('.new_forum');
  var newBlog = $('.new_blog');
  var newIdeas = $('.new_ideas');
  var newMaterialsId = $('#new_materials');
  var newForumId = $('#new_forum');
  var newBlogId = $('#new_blog');
  var newIdeasId = $('#new_ideas');
  var newCommunity = $('#new_community div');
  var newCommunitysContainer = $('.new_communitys_container');
  newMaterials.click(function(){
    if (!$(this).hasClass('active')) {
      newCommunity.removeClass('active');
      $(this).addClass('active');
      newCommunitysContainer.removeClass('new_communitys_active');
      newMaterialsId.addClass('new_communitys_active');
    }
  });
  newForum.click(function(){
    if (!$(this).hasClass('active')) {
      newCommunity.removeClass('active');
      $(this).addClass('active');
      newCommunitysContainer.removeClass('new_communitys_active');
      newForumId.addClass('new_communitys_active');
    }
  });
  newBlog.click(function(){
    if (!$(this).hasClass('active')) {
      newCommunity.removeClass('active');
      $(this).addClass('active');
      newCommunitysContainer.removeClass('new_communitys_active');
      newBlogId.addClass('new_communitys_active');
    }
  });
  newIdeas.click(function(){
    if (!$(this).hasClass('active')) {
      newCommunity.removeClass('active');
      $(this).addClass('active');
      newCommunitysContainer.removeClass('new_communitys_active');
      newIdeasId.addClass('new_communitys_active');
    }
  });
}

function init_block_main_seach() {
  $("<div class=\"search_prompt\">Поиск</div>").appendTo(".bg_search");
  var searchPrompt = $(".search_prompt");
  var searchText = $("#edit-ts-custom-search-text");
  searchPrompt.click(function() {
    searchText.focus();
  });
  searchText.focus(function() {
    searchPrompt.hide(0);
  });
  searchText.change(function() {
    searchPrompt.hide(0);
  });
  if (searchText.val() != "") {
    searchPrompt.hide(0);
  }
  searchText.blur(function() {
    if (searchText.val() == "") {
      searchPrompt.show(0);
    }
  });
}

function init_block_login() {
  $("<div class=\"login_name_prompt\">Логин</div>").appendTo("#block-user-0 #edit-name-wrapper");
  $("<div class=\"login_pass_prompt\">Пароль</div>").appendTo("#block-user-0 #edit-pass-wrapper");
  var loginNamePrompt = $(".login_name_prompt");
  var loginPassPrompt = $(".login_pass_prompt");
  var editNameWrapper = $("#edit-name-wrapper input");
  var editPassWrapper = $("#edit-pass-wrapper input");
  function ValueField() {
    if (editNameWrapper.val() != "") {
      loginNamePrompt.hide(0);
    }
    if (editPassWrapper.val() != "") {
      loginPassPrompt.hide(0);
    }
  }
  loginNamePrompt.click(function() {
    editNameWrapper.focus();
  });
  editNameWrapper.focus(function() {
    loginNamePrompt.hide(0);
  });
  editNameWrapper.change(function() {
    loginNamePrompt.hide(0);
  });
  if (editNameWrapper.val() != "") {
    loginNamePrompt.hide(0);
  }
  editNameWrapper.blur(function() {
    if (editNameWrapper.val() == "") {
      loginNamePrompt.show(0);
    }
  });
  loginPassPrompt.click(function() {
    editPassWrapper.focus();
  });
  editPassWrapper.focus(function() {
    loginPassPrompt.hide(0);
  });
  editPassWrapper.change(function() {
    loginPassPrompt.hide(0);
  });
  if (editPassWrapper.val() != "") {
    loginPassPrompt.hide(0);
  }
  editPassWrapper.blur(function() {
    if (editPassWrapper.val() == "") {
      loginPassPrompt.show(0);
    }
  });
  setTimeout(ValueField, 4000);
}

function init_block_calendar() {
  var moscow = $('.moscow');
  var kiev = $('.kiev');
  var calendarManagement = $('.calendar_management');
  $('.calendar_moscow').click(function(){
    if (!$(this).hasClass('active')) {
      calendarManagement.removeClass('active');
      $(this).addClass('active');
      moscow.show();
      kiev.hide();
    }
  });
  $('.calendar_kiev').click(function(){
    if (!$(this).hasClass('active')) {
      calendarManagement.removeClass('active');
      $(this).addClass('active');
      moscow.hide();
      kiev.show();
    }
  });
}

function processMainMenuClick() {
  $('.dropdown-menu-item a').click(function() {
    hideOpenedDMenu();
    return true;
  });
}

function recordOutboundLink(category, action) {
  var domain = getDomain(document.location);
  if (domain == 'terrasoft.ru' || domain == 'www.terrasoft.ru' || domain == 'tscrm.ru' || domain == 'www.tscrm.ru' || domain == 'main.ru') {
    window.pageTracker=window._gat._getTracker("UA-580630-7");
    window.pageTracker._trackEvent(category, action);
  }
  if (domain == 'terrasoft.ua' || domain == 'www.terrasoft.ua' || domain == 'terrasoft.com.ua'
  || domain == 'www.terrasoft.com.ua') {
    window.pageTracker=window._gat._getTracker("UA-580630-3");
    window.pageTracker._trackEvent(category, action);
  }
}

function user_vote_user() {
  var url = new String(window.location);
  $('.vote-button').click(function() {
    var element = $(this);
    if (!element.hasClass('vote-button-inactive')) {
      element.animate({
        opacity: 0.3
      }, 500, function() {
        // Animation complete.
      });
      $.ajax({
        type: "POST",
        url: "/user_vote_vote/node/" + element.attr("id") + "/js",
        data: "url=" + url,
        dataType: "json",
        success: function(data){
          if (data) {
            element.prev().html('<div class="node-rate-text">' + data['data'] + '</div>');
            if (!data['status']) {
              element.replaceWith('<div id="' + element.attr("id") + '" class = "vote-button vote-button-inactive">Голосовать</div>');
            }
            else {
              element.animate({
                opacity: 1
              }, 100, function() {
                // Animation complete.
              });
            }
          }
        }
      });
    }
    return false;
  });
}

function skip_unpublish() {
  var skipUnpublishClose = $('.skip_unpublish_close');
  var skipUnpublish = $('.skip_unpublish');
  if (skipUnpublishClose.length != 0) {
    skipUnpublishClose.click(function() {
      skipUnpublish.remove();
      $.ajax({
        type: "POST",
        url: "/ts/custom/skip",
        data: "name=skip",
        dataType: "html",
        success: function(msg){

        }
      });
    });
  }
}

function preload(srcArray) {
  preloadImg = new Array();
  for (i = 0; i < srcArray.length; i++) {
    preloadImg[i] = new Image();
    preloadImg[i].src = srcArray[i];
  }
}

function articles_tags() {
  var articles_icon_plus = $('#article_container .icon_plus');
  var articles_head = $('#article_container h2');
  var article_tags = $('.article_tags');
  articles_icon_plus.click(function() {
    if (articles_icon_plus.hasClass('open')) {
      articles_icon_plus.removeClass('open');
      article_tags.hide();
    }
    else {
      articles_icon_plus.addClass('open');
      article_tags.show();
    }
  });
  articles_head.click(function() {
    if (articles_icon_plus.hasClass('open')) {
      articles_icon_plus.removeClass('open');
      article_tags.hide();
    }
    else {
      articles_icon_plus.addClass('open');
      article_tags.show();
    }
  });
}

$(document).ready(function() {
  window.activeItemIndex = 0;
  initJQueryCss();
  processMainMenu();
  processMainPanel();
  init_block_user();
  init_fancybox();
  init_block_online();
  init_block_top();
  init_block_new();
  init_block_main_seach();
  init_block_login();
  init_block_calendar();
  processMainMenuClick();
  user_vote_user();
  articles_tags();
  skip_unpublish();
});
