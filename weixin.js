// 微信配置
var OPTIONS = {
  appId: 'wxb7ed75bd4d2cf872',
  timestamp: ((new Date).getTime() / 1e3).toFixed(),
  debug: false,
  title: '【房多多&曲解房事】第1期#房价井喷，你何去何从？',
  desc: '听10年地产老炮儿说，现在该从众追涨还是袖手旁观，按兵不动是否错失良机。',
  link: 'http://static.fangdd.com/nh-c-activity/fangshi/index.html',
  imgUrl: 'http://static.fangdd.com/nh-c-activity/fangshi/img/img.png'
};

$(document).ready(function() {
  // 微信浏览器
  if (/micromessenger/i.test(navigator.userAgent.toLowerCase())) {
    // 微信签名
    getSignature();
  }
});

/**
 * 微信签名
 */
function getSignature() {
  $.ajax({
    url: 'http://s.fangdd.com/wechat/weixin/getjssign',
    dataType: 'jsonp',
    data: {
      appId: OPTIONS.appId,
      timestamp: OPTIONS.timestamp
    },
    success: function (res) {
      wx.config({
        debug: OPTIONS.debug,
        appId: OPTIONS.appId,
        timestamp: OPTIONS.timestamp,
        nonceStr: res.nonceStr,
        signature: res.signature,
        jsApiList: [
          'onMenuShareTimeline',
          'onMenuShareAppMessage',
          'onMenuShareQQ',
          'onMenuShareWeibo',
          'openLocation',
          'getLocation'
        ]
      });

      wx.ready(function () {
        // 设置分享
        shareConfig();
      });
    }
  });
}

/**
 * 设置分享
 */
function shareConfig() {
  // 分享到朋友圈
  wx.onMenuShareTimeline({
    title: OPTIONS.title,
    link: OPTIONS.link,
    imgUrl: OPTIONS.imgUrl,
    success: function () {
      console.log("onMenuShareTimeline success");
    },
    cancel: function () {
      console.log("onMenuShareTimeline cancel");
    }
  });

  // 分享给朋友
  wx.onMenuShareAppMessage({
    title: OPTIONS.title,
    desc: OPTIONS.desc,
    link: OPTIONS.link,
    imgUrl: OPTIONS.imgUrl,
    type: "",
    dataUrl: "",
    success: function () {
      console.log("onMenuShareAppMessage success");
    },
    cancel: function () {
      console.log("onMenuShareAppMessage cancel");
    }
  });

  // 分享到QQ
  wx.onMenuShareQQ({
    title: OPTIONS.title,
    desc: OPTIONS.desc,
    link: OPTIONS.link,
    imgUrl: OPTIONS.imgUrl,
    success: function () {
      console.log("onMenuShareQQ success");
    },
    cancel: function () {
      console.log("onMenuShareQQ cancel");
    }
  });

  // 分享到腾讯微博
  wx.onMenuShareWeibo({
    title: OPTIONS.title,
    desc: OPTIONS.desc,
    link: OPTIONS.link,
    imgUrl: OPTIONS.imgUrl,
    success: function () {
      console.log("onMenuShareWeibo success");
    },
    cancel: function () {
      console.log("onMenuShareWeibo cancel");
    }
  });
}