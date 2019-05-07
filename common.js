/**
 * 两位小数金额输入
 * @param target
 */
amount(target) {
  let regStrs = [
    ['^0(\\d+)$', '$1'], // 禁止录入整数部分两位以上，但首位为0
    ['[^\\d\\.]+$', ''], // 禁止录入任何非数字和点
    ['\\.(\\d?)\\.+', '.$1'], // 禁止录入两个以上的点
    ['^(\\d+\\.\\d{2}).+', '$1'] // 禁止录入小数点后两位以上
  ]

  let val = target.value
  for (let i = 0; i < regStrs.length; i++) {
    let reg = new RegExp(regStrs[i][0])
    val = val.replace(reg, regStrs[i][1])
  }

  return val
}

/**
 * [binarySearch 二分查找]
 * @param  {[type]} value      [查找元素]
 * @param  {[type]} arr        [数组]
 * @param  {[type]} startIndex [开始索引]
 * @param  {[type]} endIndex   [结束索引]
 * @return {[type]}            [返回查找元素的索引]
 */
function binarySearch(value, arr, startIndex, endIndex) {
  if (!value || !(arr instanceof Array)) return null;

  var len = arr.length;

  startIndex = typeof startIndex === "number" ? startIndex : 0;
  endIndex = typeof endIndex === "number" ? endIndex : len - 1;
  var midIndex = Math.floor((startIndex + endIndex) / 2),
    midVal = arr[midIndex];

  if (startIndex > endIndex) return null;

  if (value >= midVal.min  && value <= midVal.max) {
    return midVal;
  } else if (value < midVal.min) {
    return binarySearch(value, arr, startIndex, midIndex - 1);
  } else {
    return binarySearch(value, arr, midIndex + 1, endIndex);
  }
}

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

/**
 * 初始化地图
 * @param lon
 * @param lat
 */
function initMap(lon, lat) {

    if (lon && lat) {

      $('.map').removeClass('hidden')
        .attr('data-lon', lon)
        .attr('data-lat', lat);

      // 百度地图API功能
      var map = new BMap.Map('mapBox');    // 创建Map实例
      var point = new BMap.Point(lon, lat);
      map.centerAndZoom(point, 17);

      //map.enableScrollWheelZoom();
      map.disableDragging();

      map.removeOverlay(marker);

      var marker = new BMap.Marker(point);  // 创建标注
      map.addOverlay(marker);              // 将标注添加到地图中

      return point;
    }
  }

/*
 通过IP获取当前区域
 引入：<script src="http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js"></script>
 区域信息在全局变量：remote_ip_info中
  */

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

    var thumbUrl = url;
    // clientWidth = 640px，ratio = 1 为基准计算缩略图尺寸
    var clientWidth = parseInt(document.documentElement.clientWidth, 10);
    var ratio = window.devicePixelRatio || 1;
    // 基数
    var base = (clientWidth < 640 ? clientWidth / 640 : 1) * ratio;
    var thumbMode = Math.ceil(width * base) + (mode && mode == 1 ? 'x' : ('m' + Math.ceil(height * base)));

    var imageFlag = url.indexOf('/image/'), thumbFlag = url.indexOf('/thumb/');
    if (url.indexOf('http://') > -1) {
      if (imageFlag > 0) {
        thumbUrl = url.replace('/image/', '/thumb/' + thumbMode + '/');
      } else if (thumbFlag > 0) {
        var paths = url.split('/thumb/');
        var slashFlag = paths[1].indexOf('/', 0);
        thumbUrl = paths[0] + '/thumb/' + thumbMode + '/' + paths[1].substring(slashFlag + 1);
      }
    }

    console.log('[image_ratio] thumbUrl: ' + thumbUrl);
    console.log('[image_ratio] mode: ' + mode);
    return thumbUrl;
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
 * 验证url
 * @param url
 * @returns {boolean}
 */
function isUrl(url) {
  var urlPattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;
  return !!(urlPattern.test(url) && url != '');
}

/**
 * 判断是否是数组
 */
var isArray = Array.isArray || function (obj) {
  return toString.call(obj) === '[object Array]';
};

/**
 * 字符串显示时间
 * @param milltime
 * @param type
 * @returns {string}
 * 默认：2015-10-25 10:23:50
 * 0: 10:23,
 * 1: 10-25,
 * 2: 10-25 10:23,
 * 3：10-25 周一
 * 4: 2015-10-25
 * 5：2015年
 * 6：2015-10-25 10:23
 */
var dateFormat = function (milltime, type) {
  if (!milltime) {
    return '';
  }
  var weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  var result = '';
  // 处理时间
  var toDate = new Date(milltime);
  var year = toDate.getFullYear();
  var month = (toDate.getMonth() + 1) < 10 ? '0' + (toDate.getMonth() + 1) : (toDate.getMonth() + 1);
  var date = toDate.getDate() < 10 ? '0' + toDate.getDate() : toDate.getDate();
  var hours = toDate.getHours() < 10 ? '0' + toDate.getHours() : toDate.getHours();
  var minutes = toDate.getMinutes() < 10 ? '0' + toDate.getMinutes() : toDate.getMinutes();
  var seconds = toDate.getSeconds() < 10 ? '0' + toDate.getSeconds() : toDate.getSeconds();
  result = year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds;
  switch (type) {
    case 0:
      result = hours + ':' + minutes;
      break;
    case 1:
      result = month + '-' + date;
      break;
    case 2:
      result = month + '-' + date + ' ' + hours + ':' + minutes;
      break;
    case 3:
      result = month + '-' + date + ' ' + weeks[toDate.getDay()];
      break;
    case 4:
      result = year + '-' + month + '-' + date;
      break;
    case 5:
      result = year + '年';
      break;
    case 6:
      result = year + '-' + month + '-' + date + ' ' + hours + ':' + minutes;
      break;
  }

  return result;
};

/**
 * 字符串时间转毫秒
 * 2015-11-15 12:30:30
 * @param datetime
 * @returns {number}
 */
var dateParse = function (datetime) {
  return new Date(datetime.replace(/-/g, '/')).getTime();
};

/**
 * 输入转义
 * @param str
 * @returns {*}
 */
var htmlEnCode = function (str) {
  if (str.length == 0) {
    return '';
  }

  return str.replace(/&/g, "&gt;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/ /g, "&nbsp;")
    .replace(/\'/g, "'")
    .replace(/\"/g, "&quot;")
    .replace(/\n/g, "<br>");
};
  
  
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

/**
 * cookie 操作
 * @type {{get: get, set: set, del: del}}
 */
var Cookie = {
  /**
   * 获取cookie值
   * @param name
   * @returns {*}
   */
  get: function (name) {
    if (document.cookie.length > 0) {
      var c_start = document.cookie.indexOf(name + "=");
      if (c_start != -1) {
        c_start = c_start + name.length + 1;
        var c_end = document.cookie.indexOf(";", c_start);
        if (c_end == -1) c_end = document.cookie.length;
        return unescape(document.cookie.substring(c_start, c_end));
      }
    }
    return "";
  },
  /**
   * 设置cookie值
   * @param name
   * @param value
   * @param expiredays
   */
  set: function (name, value, expiredays) {
    var exdate = new Date(), ext = '';
    exdate.setDate(exdate.getDate() + expiredays);
    var domain = location.hostname.match(/([a-z0-9\-]+\.[a-z]+$)|([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$)/);
    if (domain && domain.length) {
      domain = domain[0];
      ext = '; domain=' + domain + '; path=/';
    }
    document.cookie = name + "=" + escape(value) +
      ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString()) + ext;
  }
};
