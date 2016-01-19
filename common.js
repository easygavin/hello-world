/**
 * 本地定位
 * @param callback
 */
function getLonLatFromGeo(callback) {
  // 定位经纬度
  if (navigator.geolocation) {
    console.log(' 你的浏览器支持 geolocation ');

    navigator.geolocation.getCurrentPosition(function (position) {
      var lat = position.coords.latitude;
      var lon = position.coords.longitude;
      console.log('您所在的位置： 经度' + lat + '，纬度' + lon);
      // 经纬度回调
      callback({lat: lat, lon: lon});

    }, function (error) {

      // 回调函数
      callback(null);

      switch (error.code) {
        case error.TIMEOUT :
          console.log(' 连接超时，请重试 ');
          break;
        case error.PERMISSION_DENIED :
          console.log(' 您拒绝了使用位置共享服务，查询已取消 ');
          break;
        case error.POSITION_UNAVAILABLE :
          console.log(' 亲爱的火星网友，非常抱歉，我们暂时无法为您所在的星球提供位置服务 ');
          break;
      }
    }, {
      timeout: 5000 // 5 秒超时
    });

  } else {
    console.log(' 你的浏览器不支持 geolocation ');
  }
}

/**
 * 根据经纬度获取城市名称
 * @param lat
 * @param lon
 * @param callback
 */
function getCityNameByBaiDu(lat, lon, callback) {
  if (lat && lon) {

    $.ajax({
      type: 'GET',
      url: 'http://api.map.baidu.com/geocoder/v2/',
      data: {
        ak: '5101f877f8c9913f2d62c93bbf56d7b2',
        output: 'json',
        pois: 0,
        location: lat + ',' + lon
      },
      dataType: 'jsonp',
      success: function (data) {
        if (data !== null && typeof data != 'undefined') {
          if (data.status !== null && typeof data.status != 'undefined' && data.status == 0) {
            console.log('[result] : ' + JSON.stringify(data.result));
            var city = data.result.addressComponent.city;
            if (city.length > 1) {
              var localCityName = city.substring(0, city.length - 1);
              callback(localCityName);
            }
          }
        }
      },
      error: function (data) {

      }
    });
  }
}

/*
 通过IP获取当前区域
 引入：<script src="http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js"></script>
 区域信息在全局变量：remote_ip_info中
  */

// 图片文件系统
// 测试：http://fs.fangdd.net/
// 正式：http://fs.fangdd.com/
var IMG_SERVER = 'http://fs.fangdd.com/';
/**
 * 固定宽度图片根据devicePixelRatio输出自适应图片
 * @param url
 * @param width
 * @param height
 * @param type
 * @returns {string}
 */
function imageRatio(url, width, height, type) {
  if (!url) {
    return '';
  }
  var ratio = window.devicePixelRatio || 1;

  var httpFlag = url.indexOf('http://'),
    imageFlag = url.indexOf('/image/'), thumbFlag = url.indexOf('/thumb/');
  if (httpFlag > -1) {
    if (imageFlag > 0) {
      url = url.substring(imageFlag + 6);
    } else if (thumbFlag > 0) {
      url = url.substring(thumbFlag + 7);
      // 再次截取
      var slashFlag = url.indexOf('/');
      url = url.substring(slashFlag);
    }
  }
  console.log('[image_ratio] url: ' + url);
  console.log('[image_ratio] type: ' + type);
  return IMG_SERVER + 'thumb/' + width * ratio + (type ? 'x' : ('m' + height * ratio)) + url;
}

/**
 * 验证是否为数字
 * @param str
 * @returns {boolean}
 */
function regNum(str) {
  var rex = /^\d+(\.\d+)?$/;
  return rex.test(str);
}

/**
 * 判断是否是微信
 * @returns {boolean}
 */
function isWeixin() {
  var ua = navigator.userAgent.toLowerCase();
  return ua.match(/MicroMessenger/i) == 'micromessenger';
}

/**
 * 手机号码验证
 * @returns {boolean}
 */
function isMobile(mobile) {
  var pattern = /^(?:1\d{2}|15[0123456789])-?\d{5}(\d{3}|\*{3})$/;
  return  !!(pattern.test(mobile) && mobile != '');
}

/**
 * 将查询字符串解析成一个对象
 * @param str
 * @returns {{}}
 */
function getParams(str) {
  var rs = {};
  if (typeof str == 'string' && (str = $.trim(str))) {
    var decode = decodeURIComponent, pairs = str.split('&');
    for (var i = 0, l = pairs.length; i < l; ++i) {
      var pair = pairs[i].split('='), key = decode(pair[0]).replace('[]', ''), val = decode(pair[1]);
      if (key in rs) {
        if ($.isArray(rs[key])) {
          rs[key].push(val);
        } else {
          rs[key] = [rs[key], val];
        }
      } else {
        rs[key] = val;
      }
    }
  }
  return rs;
}

// 全局监听
$(document).on('touchmove', function (e) {
  e.preventDefault();
}).on('ajaxSend', function (e, xhr, options) {
  // addAjaxRequest(xhr);
  console.log('[ajaxSend] url : ' + options.url);
});
