function onMouseOver(e) {
  $(this).addClass('inner_hover');
}

function onMouseOut(e) {
  $(this).removeClass('inner_hover');
}

function prepareMenu() {
  var lastLevel;
  var activePathMenuSecondLevelClosedEl = $('div.closed[myself=1]');
  var activePathMenuSecondLevelOpenedEl = $('div.opened[myself=1]');
  var activePathMenuThirdLevelClosedEl  = $('div.closed[myself=2]');
  var activePathMenuThirdLevelOpenedEl  = $('div.opened[myself=2]');
  var activePathMenuFourthLevelClosedEl  = $('div.closed[myself=3]');
  var activePathMenuFourthLevelOpenedEl  = $('div.opened[myself=3]');
  $('div.closed[myself]').css('display', 'none');
  $('div.opened[myself]').css('display', 'none');
  $('div.desc').css('display', 'none');
  $('div.inner').removeClass('active_inner');
  if (menuPathInfo.thirdLevel) {
    lastLevel = menuPathInfo.thirdLevel;
    activePathMenuSecondLevelClosedEl.css('display', 'block');
    activePathMenuThirdLevelClosedEl.css('display', 'block');
    if (menuPathInfo.last_level) {
      activePathMenuFourthLevelClosedEl.css('display', 'block');
    } else {
      $('div.opened[myself=3]').css('display', 'block');
    }
    $('div.closed[myself=1] span').html("<a href='" + menuPathInfo.secondLevel.link + "'>" +
      menuPathInfo.secondLevel.selected+"</a>");
    if (menuPathInfo.secondLevel.cssClass) {
      $('div.closed[myself=1] span').addClass(menuPathInfo.secondLevel.cssClass);
    }
    $('div.closed[myself=2] span').html("<a href='" + menuPathInfo.thirdLevel.link + "'>" +
      menuPathInfo.thirdLevel.selected+"</a>");
    if (menuPathInfo.thirdLevel.cssClass) {
      $('div.closed[myself=2] span').addClass(menuPathInfo.thirdLevel.cssClass);
    }
  } else if (menuPathInfo.secondLevel) {
    lastLevel = menuPathInfo.secondLevel;
    if (menuPathInfo.last_level) {
      activePathMenuSecondLevelClosedEl.stop().css('display', 'block');
    } else {
      if (menuPathInfo.secondLevel.selected) {
        activePathMenuSecondLevelClosedEl.stop().css('display', 'block');
        activePathMenuThirdLevelOpenedEl.stop().css('display', 'block');
      } else {
        activePathMenuSecondLevelOpenedEl.stop().css('display', 'block');
      }
    }
    $('div.closed[myself=1] span').html("<a href='" + menuPathInfo.secondLevel.link + "'>" +
      menuPathInfo.secondLevel.selected + "</a>");
    if (menuPathInfo.secondLevel.cssClass) {
      $('div.closed[myself=1] span').addClass(menuPathInfo.secondLevel.cssClass);
    }
    $('div.opened[myself=2] div.icon_minus').css('display', 'none');
    $('div.opened[myself=2]').addClass('no-closable');
  }
  if (menuPathInfo.last_level)  {
    var parent = $('a.link:contains("' + lastLevel.selected + '")').parent();
    var tag = parent.attr('tag');
    $('div.desc[tag=' + tag + ']').css('display', 'block');
    $('div.inner[tag=' + tag + ']').addClass('active_inner');
  }
}

function ensureCloseExpandedBlocks(el) {
  var plusCollapseEl = $('.addition .plus_collapse.smart.expanded');
  if (el) {
    plusCollapseEl = plusCollapseEl.not(el);
  }
  if(plusCollapseEl.length > 0) {
    plusCollapseEl.removeClass('expanded');
    var parentTableEl = plusCollapseEl.parents().filter('table');
    var collapsedTextEl = parentTableEl.next();
    collapsedTextEl.css('display', 'none');
  }
}

$(document).ready(function() {
  window.menuPathInfo = window.menuPathInfo || {};
  $('.active_path_menu_second_level .menu_content div.inner').hover(onMouseOver, onMouseOut);
  $('.active_path_menu_third_level  .menu_content div.inner').hover(function() {
    $(this).addClass('inner_hover');
  }, function() {
    $(this).removeClass('inner_hover');
  });
  $('.icon_minus').click(function(e) {
    var divParent = $(this).parent();
    var divOpenedMySelfAttribute  = parseInt(divParent.attr('myself'));
    $('div.opened[myself=' + divOpenedMySelfAttribute + ']').css('display', 'none');
    $('div.closed[myself=' + divOpenedMySelfAttribute + ']').stop().fadeIn(0);
  });
  $('body').click(function(e) {
    var openedLevels = $('div.opened[myself]');
    $.each(openedLevels, function(i, level) {
       var checkLevel = $(level);
       if (checkLevel.css('display') == 'block') {
         var myselfAttribute = checkLevel.attr('myself');
         if (!checkLevel.hasClass('no-closable')) {
           $('div.opened[myself=' + myselfAttribute + ']').css('display','none');
           $('div.closed[myself=' + myselfAttribute + ']').stop().fadeIn('fast');
         }
       }
    });
    ensureCloseExpandedBlocks();
  });
  $('.opened').add('.closed').click(function(e) {
    e.stopPropagation();
  })
  $('.closed .icon_plus').click(function(e) {
    var divParent = $(this).parent();
    var divOpenedMySelfAttribute  = parseInt(divParent.attr('myself'));
    $('div.opened[myself=' + divOpenedMySelfAttribute + ']').stop().fadeIn(0);
    $('div.closed[myself=' + divOpenedMySelfAttribute + ']').css('display', 'none');
    var openedLevels = $('div.opened[myself!=' + divOpenedMySelfAttribute + ']');
    $.each(openedLevels, function(i, level) {
      var checkLevel = $(level);
      if (!checkLevel.hasClass('no-closable')) {
        checkLevel.css('display', 'none');
        var myselfAttribute = checkLevel.attr('myself');
        $('div.closed[myself=' + myselfAttribute + ']').stop().fadeIn(0);
      }
    });
  });
  $('.detail span').click(function() {
    var spanAttributeTarget = parseInt($(this).attr('t'));
    var targetDiv = $('div[t=' + spanAttributeTarget + ']');
    if (targetDiv.css('display') == 'none') {
      var detailGroupAttrubute = targetDiv.attr('group');
      $('div[t]').filter('div[group!=' + detailGroupAttrubute + ']').css('display', 'none').removeClass('openedBlock');
      targetDiv.stop().css('opacity', 1).fadeIn('fast');
      targetDiv.addClass('openedBlock');
    } else {
      targetDiv.removeClass('openedBlock');
      targetDiv.stop().css('top', 0).fadeOut('fast');
      var openedBlocks = $('div[t].openedBlock').size();
      if (openedBlocks == 0) {
          var expandButton = $('.expand_div');
          if (expandButton.hasClass('collapse')) {
            expandButton.removeClass('collapse');
          }
      }
    }
  });
  $('.expand_div').click(function() {
    var expandDivEl = $(this);
    if (!expandDivEl.hasClass('collapse')) {
      expandDivEl.addClass('collapse');
      $('div[t]').stop().css('opacity', 1).fadeIn().addClass('openedBlock');
    } else {
      $('div[t]').stop().css('display', 'none').removeClass('openedBlock');
      expandDivEl.removeClass('collapse');
    }
  });
  $('.addition .plus_collapse').bind('click', function(e){
    var plusCollapseEl = $(this);
    ensureCloseExpandedBlocks(plusCollapseEl);
    var sideDivEl = plusCollapseEl.parents().children('div.sidediv');
    var sideLinesDivEl = plusCollapseEl.parents().children('div.line');
    if(!(plusCollapseEl.hasClass('expanded'))) {
        var parentExpanded = plusCollapseEl.addClass('expanded').parents();
        var txtCollapseEl = parentExpanded.children('div.txt_collapse');
        var map = txtCollapseEl.find('div.map');
        var speed = map.length > 0 ? 10 : 'slow';
        txtCollapseEl.fadeIn(speed, function(){
          txtCollapseEl.css({
            display: 'block',
            opacity: 1
          });
          if (map.length > 0) {
              var divMap = txtCollapseEl.children('div');
              if (divMap.length == 1) {
                var mapId = $(divMap[0]).attr('id');
                if (mapId == 'map_kiev') {
                  initKievMap();
                } else if (mapId == 'map_moskov') {
                  initMoskovMap();
                } else if (mapId == 'map_london') {
                  initLondonMap();
                } else if (mapId == 'map_almati') {
                  initAlmatiMap();
                }
              }
          }
        });
        if (sideDivEl.length > 0) {
          sideDivEl.css('right', '-' + (sideDivEl.width()+85)+'px');
          sideLinesDivEl.css('right', '-' + (sideLinesDivEl.width() + 10)+'px');
          var parentElHeight = sideDivEl.parents().filter('.client_list_page').height();
          if (sideDivEl.length == 2) {
            var top1 = (parentElHeight - $(sideDivEl[0]).height() - $(sideDivEl[1]).height())/2 - 5;
            var top2 = top1 + $(sideDivEl[0]).height() + 10;
            $(sideDivEl[0]).css('top', top1 + 'px');
            $(sideDivEl[1]).css('top', top2 + 'px');
            $(sideLinesDivEl[0]).css('top', top1 + $(sideDivEl[0]).height()/2 + 'px');
            $(sideLinesDivEl[1]).css('top', top2 + $(sideDivEl[1]).height()/2 + 'px');
          } else {
            var top = (parentElHeight - sideDivEl.height())/2;
            sideDivEl.css('top', top + 'px');
            sideLinesDivEl.css('top', top + sideDivEl.height()/2 + 'px');
          }
          sideDivEl.fadeIn('slow');
          sideLinesDivEl.fadeIn('slow');
        }
        e.stopPropagation();
    } else {
        var parentExpanded = plusCollapseEl.removeClass('expanded').parents();
        var txtCollapseEl = parentExpanded.children('div.txt_collapse');
        txtCollapseEl.stop(true, true).hide();
        if (sideDivEl.length > 0) {
          sideDivEl.stop().hide();
          sideLinesDivEl.stop().hide();
        }
        e.stopPropagation();
    }
  });
  $('.expand_divs').click(function(){
    var expandDivEl = $(this);
    if (!expandDivEl.hasClass('collapse')) {
      var parentDiv = expandDivEl.parent().next();
      var plusCollapseEl = parentDiv.find('div.plus_collapse');
      plusCollapseEl.addClass('expanded')
      var plusCollapseParentEl = plusCollapseEl.parents();
      var txtCollapseEl = plusCollapseParentEl.find('div.txt_collapse');
      debugger;
      var map = txtCollapseEl.children('div.map');
      var speed = map.length > 0 ? 10 : 'slow';
      txtCollapseEl.fadeIn(speed, function(){
        txtCollapseEl.css({
          display: 'block',
          opacity: 1
        });
        if (map.length > 0 && !$(map[0]).hasClass('initialized')) {
          initKievMap();
          initMoskovMap();
          initLondonMap();
          initAlmatiMap();
          map.addClass('initialized');
        }
      });
      expandDivEl.addClass('collapse');
    } else {
      var parentDiv = expandDivEl.parent().next();
      var plusCollapseEl = parentDiv.find('div.plus_collapse');
      plusCollapseEl.removeClass('expanded');
      var plusCollapseParentEl = plusCollapseEl.parents();
      var txtCollapseEl = plusCollapseParentEl.find('div.txt_collapse');
      txtCollapseEl.stop(true, true).hide();
      expandDivEl.removeClass('collapse');
    }
  });
  //prepareMenu();
});
