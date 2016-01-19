/**
 *    @desc javascript Slider
 *    @parameter opt
 *    @parameter opt.items  Array 移动集合
 *    @parameter opt.width int 移动宽度
 *    @parameter opt.duration  int 时间间隔
 *    @parameter opt.unit  string 单位 %/px
 *    @parameter opt.loop  boolean 是否循环
 *    @parameter opt.type  int 0: 只负责滑动，1：既需要负责滑动，也需要延迟加载图片
 *    @date 2013年11月5日
 *    @author Gavin
 */
function Slider(opt) {
  this.items = opt.items;
  this.width = opt.width;
  this.duration = opt.duration;
  this.unit = opt.unit;
  this.loop = opt.loop;
  this.type = opt.type || 0;
  this.timer = null;
  this.avg = 10;
  this.direction = 1;
  this.handleWidth = this.width;
  this.prefix = this.getVendorPrefix();
  this.index = 0; // 焦点位置
  this.origns = opt.items.slice(0); // 原始数组
}

/**
 * 当前焦点位置
 * @returns {number}
 */
Slider.prototype.getIndex = function () {
  return this.index;
};

/**
 * 滑动
 * @param direction
 */
Slider.prototype.slide = function (direction) {

  this.direction = direction;
  var direcWidth = this.direction > 0 ? -this.width : this.width;

  //this.prefix = this.getVendorPrefix();
  if (this.prefix) {
    var duration = this.prefix + "TransitionDuration";
    for (var i = 0, len = this.items.length; i < len; i++) {
      this.items[i].style[duration] = this.duration + "ms";
      this.items[i].style.left = (parseInt(this.items[i].style.left, 10) + direcWidth) + this.unit;
    }
  } else {
    this.handleWidth = this.width;
    if (this.timer == null) {
      var that = this;
      (function (that) {
        that.timer = setInterval(function () {
          var step = Math.ceil((that.width * that.avg * 3) / that.duration);
          // handle special
          if (that.handleWidth - step < 0) {
            step = that.handleWidth;
          }

          var direcStep = that.direction > 0 ? -step : step;
          for (var i = 0, len = that.items.length; i < len; i++) {
            that.items[i].style.left = (parseInt(that.items[i].style.left, 10) + direcStep) + that.unit;
          }

          that.handleWidth -= step;
          if (that.handleWidth == 0) {
            clearInterval(that.timer);
            that.timer = null;
          }
        }, that.avg);
      })(that);
    }
  }

};

/**
 * 获取动画CSS前缀
 * @returns {*}
 */
Slider.prototype.getVendorPrefix = function () {
  var body, i, style, transition, vendor;
  body = document.body || document.documentElement;
  style = body.style;
  transition = "transition";
  vendor = ["Moz", "Webkit", "Khtml", "O", "ms"];
  transition = transition.charAt(0).toUpperCase() + transition.substr(1);
  i = 0;
  while (i < vendor.length) {
    if (typeof style[vendor[i] + transition] === "string") {
      return vendor[i];
    }
    i++;
  }
  return false;
};

/**
 * 向后滑动
 * @returns {boolean}
 */
Slider.prototype.next = function () {

  // 不循环
  if ((this.index + 1) == this.items.length && !this.loop) {
    return false;
  }

  // 滑动之后需要移动第一个到最后一个位置
  // 滑动
  this.slide(1);

  // 移动位置
  var that = this;
  (function (that) {

    if (that.prefix) {
      $(that.items[0]).on("transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd", function (event) {

        // 第一个
        var first = that.items.shift();
        // 最后一个
        var last = that.items[that.items.length - 1];

        //that.prefix = that.getVendorPrefix();
        if (that.prefix) {
          var duration = that.prefix + "TransitionDuration";
          first.style[duration] = "0ms";
        }

        first.style.left = (parseInt(last.style.left, 10) + that.width) + that.unit;

        that.items.push(first);
        $(event.target).off("transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd", arguments.callee);
      });
    } else {

      setTimeout(function () {
        // 第一个
        var first = that.items.shift();
        // 最后一个
        var last = that.items[that.items.length - 1];

        first.style.left = (parseInt(last.style.left, 10) + that.width) + that.unit;

        that.items.push(first);
      }, that.duration);

    }
  })(that);

  // 焦点位置
  this.index = (this.index + 1) % this.items.length;

  if (this.type) {
    // 显示图片
    this.showImage();
  }
};

/**
 * 向前滑动
 * @returns {boolean}
 */
Slider.prototype.preview = function () {

  // 不循环
  if (this.index == 0 && !this.loop) {
    return false;
  }

  // 滑动之前需要移动最后一个到第一个位置
  // 移动位置
  // 最后一个
  var last = this.items.pop();
  // 第一个
  var first = this.items[0];

  if (this.prefix) {
    var duration = this.prefix + "TransitionDuration";
    last.style[duration] = "1ms";
  }

  last.style.left = (parseInt(first.style.left, 10) - this.width) + this.unit;
  this.items.unshift(last);

  var that = this;
  (function (that) {
    if (that.prefix) {
      $(that.items[0]).on("transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd", function (event) {

        setTimeout(function () {
          // 滑动
          that.slide(-1);
        }, 2);
        $(event.target).off("transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd", arguments.callee);
      });
    } else {

      // 滑动
      that.slide(-1);
    }
  })(that);

  // 焦点位置
  this.index = (this.index - 1 + this.items.length) % this.items.length;
};

/**
 * 显示图片
 */
Slider.prototype.showImage = function () {
  var $target = $(this.origns[this.index]);
  var src = $target.attr('src');
  var imageUrl = $target.attr('data-src');
  if (!src) {
    $target.attr('src', imageUrl);
  }
};
