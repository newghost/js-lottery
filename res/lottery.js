/*
* Photo Lottery
* Author: Kris Zhang
* Lincense: MIT
* https://github.com/newghost/js-lottery.git
*/
var Lottery = (function() {
  /*
  Fix old IE.
  */
  var Audio = Audio || function() { 
    var self  = this;
    self.play = self.stop = new Function();
  };


  var timer           = null,
      itemWidth       = 142,
      itemCount       = 0,
      curPos          = 0;

  var stopAudio       = new Audio("res/ping.mp3");

  var $container      = $("#lottery-container"),
      $content        = $("#lottery-container ul"),
      $item           = $("#lottery-container ul li"),
      $hero           = $("#lottery-hero img");

  var init = function() {

    //Pre-caculate the count of items
    itemCount       = $item.size();
    //Clone the contents
    $content.append($content.html());
  };

  var start  = function() {
    clearInterval(timer);

    timer = setInterval(function() {

      curPos = parseInt($content.css("left")) | 0;
      curPos -= itemWidth / 2;

      (curPos < 0 - itemWidth * itemCount) && (curPos = 0);

      $content.css("left", curPos);

    }, 25);

    $hero.hide();
  };

  var stop = function() {
    clearInterval(timer);
    timer = null;

    stopAudio.play();

    //Roll at the half width?
    (curPos % itemWidth == 0 - itemWidth / 2) && (curPos = curPos - itemWidth / 2);

    var selected  = getCurIdx();

    if (selected % 2 != 0) selected += 1;

    setCurIdx(selected);
  };

  var running = function() {
    return timer != null;
  };

  //Index: first item on the left
  var setCurIdx = function(idx) {
    curPos = (0 - idx) * itemWidth;

    var $items = $("#lottery li img"),
        imgUrl = $items.eq(idx + 3).attr("src");

    $content.css("left", curPos);
    $hero.attr("src", imgUrl).show("slow");

    console.log(curPos, idx);
  };

  var getCurIdx = function() {
    return (0 - curPos) / itemWidth;
  };

  return {
      init: init
    , start: start
    , stop: stop
    , running: running
    , setCurIdx: setCurIdx
    , getCurIdx: getCurIdx
  };

})();

$(document).ready(function() {
  Lottery.init();
});

$(document).keydown(function(e) {
    var key = e.keyCode;
    if (key != 32 && key != 13) return;

    Lottery.running()
      ? Lottery.stop()
      : Lottery.start();
});