/**
 * BellaJS v3.2.2
 * Author by @ndaidong
 * GitHub : https://github.com/techpush/bella.js.git
 * Copyright by *.techpush.net
**/
;(function(root){

  "use strict";

  var Bella = {};

  /**
   *  private methods for detecting datatypes
  **/
  var tof = function(v){
    var ots = Object.prototype.toString;
    var s=typeof v;
    if(s=='object'){
      if(v){
      if((ots.call(v).indexOf('HTML')!==-1 && ots.call(v).indexOf('Element')!=-1)){return 'element'}
      if(v instanceof Array||(!(v instanceof Object)&&(ots.call(v)=='[object Array]')||typeof v.length=='number'&&typeof v.splice!='undefined'&&typeof v.propertyIsEnumerable!='undefined'&&!v.propertyIsEnumerable('splice'))){return 'array'}
      if(!(v instanceof Object)&&(ots.call(v)=='[object Function]'|| typeof v.call!='undefined'&& typeof v.propertyIsEnumerable!='undefined'&&!v.propertyIsEnumerable('call'))){return 'function'}
      }
      return 'null';
    }
    else if(s=='function'&&typeof v.call=='undefined'){return 'object'}
    return s;
  }

  var isDef = Bella.isDef = function(val){return val!=='undefined'}
  var isNull = Bella.isNull = function(val){return !val || val===null}
  var isEmpty = Bella.isEmpty = function(val){return isNull(val) || val=='' || val.length==0}
  var isEND = Bella.isEND = function(val){return !val||isEmpty(val)||isNull(val)||!isDef(val)}
  var isArray = Bella.isArray = function(val){return !isNull(val) && tof(val)=='array'}
  var isString = Bella.isString = function(val){return !isNull(val) && typeof val=='string'}
  var isNumber = Bella.isNumber = function(val){return !isNaN(val) && typeof Number(val)=='number'}
  var isFunction = Bella.isFunction = function(val){return !isNull(val) && tof(val)=='function'}
  var isElement = Bella.isElement = function(val){return !isNull(val) && tof(val)=='element'}
  var isObject = Bella.isObject = function(val){return !isNull(val) && typeof(val)=='object'}

  function createId(leng, prefix){
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    chars+=chars.toLowerCase();
    var t = chars.length ;
    var ln = leng || 32;
    var px = prefix || '';
    var s = px;
    while(s.length<ln){
      var k = Math.floor(Math.random()*t);
      s+=chars.charAt(k) || '';
    }
    return s;
  }

  Bella.id = createId(32);
  Bella.createId = createId;

  Bella.now = function(){return new Date()}
  Bella.time = function(){return (new Date()).getTime()}

  ;(function(){
    var y = new URL(document.URL);
    y.domain = '.'+y.hostname;
    Bella.__origin = y;
  })();

  Bella.text = {
    encode : function(s){
      return window.encodeURIComponent(s);
    },
    decode : function(s){
      return window.decodeURIComponent(s.replace(/\+/g, ' '));
    },
    trim : function(s){
      return s.replace(/^[\s\xa0]+|[\s\xa0]+$/g, '');
    },
    truncate : function(s, l){
      var trim = this.trim;
      s = trim(s);

      if(s==''){
        return s;
      }

      var t = l || 140;

      if(s.length<=t){
        return s;
      }

      var x = s.substring(0, t);
      var a = x.split(' '), b = a.length, r = '';
      if(b>1){
        var c = a.pop();
        r+=a.join(' ');
        if(r.length<s.length){
          r+='...';
        }
      }
      else{
        x=x.substring(0, t-3);
        r+='...';
      }
      return r;
    },
    stripTags : function(s){
      return s.replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi, '');
    },
    escapeHTML : function(s){
      return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    },
    unescapeHTML : function(s){
      return s.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
    },
    replaceAll : function(s, a, b){
      if(isString(a) && isString(b)){
        var aa = s.split(a);
        s = aa.join(b);
      }
      else if(isArray(a) && isString(b)){
        a.forEach(function(v){
          s = Bella.text.replaceAll(s, v, b);
        });
      }
      else if(isArray(a) && isArray(b) && a.length===b.length){
        var k = a.length;
        if(k>0){
          for(var i=0;i<k;i++){
            var aa = a[i], bb = b[i];
            s = Bella.text.replaceAll(s, aa, bb);
          }
        }
      }
      return s;
    },
    strtolower : function(s){
      return s.toLowerCase();
    },
    strtoupper : function(s){
      return s.toUpperCase();
    },
    ucfirst : function(s){
      return s.charAt(0).toUpperCase()+s.slice(1);
    },
    ucwords : function(s){
      var c = s.split(' '), a = [];
      c.forEach(function(w){
        a.push(w.ucfirst());
      });
      return a.join(' ');
    }
  }


  Bella.collection = {
    unique : function(a){
      var r = [];
      for(var i = 0; i < a.length; i++){
         if(r.indexOf(a[i]) === -1){
          r.push(a[i]);
         }
      }
      return r;
    },
    max : function(a){
      return Math.max.apply({}, a);
    },
    min : function(a){
      return Math.min.apply({}, a);
    },
    contains : function(a, el, key){
      for(var i=0;i<a.length;i++){
        var val = a[i];
        if((key && val[key]===el[key])||(val===el)){
          return true;
        }
      };
      return false;
    },
    msort : function(a, p, d){
      var dn = (!d||d==='asc')?1:-1;
      a.sort(function(m, n){
        return (m[p]>n[p])?dn:(m[p]<n[p]?(-1*dn):0);
      });
      return a;
    },
    empty : function (a){
      for(var i=a.length-1;i>=0;i--){
        a[i] = null;
        delete a[i];
      }
      a.length=0;
    }
  }

  // number
  Bella.number = {
    round : function(num, dec){
      return Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
    },
    addComma : function(s, comma){
      try{
        if(s.match(/^\d+(\.?)\d+$/)){
          s+='';x=s.split('.');x1=x[0];x2=x.length>1?'.'+x[1]:'';
          var rgx =/(\d+)(\d{3})/;
            while(rgx.test(x1)){
              x1=x1.replace(rgx,'$1'+(comma?comma:',')+'$2');
            }
          return x1+x2;
        }
      }
      catch(e){return s}
    }
  }

  Bella.inherits = Object.create,

  Bella.copies = function(from, to, matched, excepts){
    var mt = matched || false;
    var ex = excepts || [];
    for(var k in from){
      if(ex.length>0 && ex.contains(k)){
        continue;
      }
      if(!mt || (!!mt && to.hasOwnProperty(k))){
        var oa = from[k];
        var ob = to[k];
        if((isObject(ob) && isObject(oa))||(isArray(ob) && isArray(oa))){
          to[k] = Bella.copies(oa, to[k], mt, ex);
        }
        else{
          to[k] = oa;
        }
      }
    }
    return to;
  }

  Bella.mixin = function(a, b){
    for(var k in a){
      b[k]=a[k];
    }
    return b;
  }

  Bella.clone = function(obj){
    if(null == obj || "object" != typeof obj){
      return obj;
    }
    if(obj instanceof Date){
      var copy = new Date();
      copy.setTime(obj.getTime());
      return copy;
    }
    if(obj instanceof Array){
      var copy = [], arr = obj.slice(0);
      for(var i = 0, len = arr.length; i < len; ++i){
        copy[i] = Bella.clone(arr[i]);
      }
      return copy;
    }
    if(obj instanceof Object){
      var copy = {};
      for(var attr in obj){
        if(attr=='clone'){
          continue;
        }
        if(obj.hasOwnProperty(attr)){
          copy[attr] = Bella.clone(obj[attr]);
        }
      }
      return copy;
    }
    return false;
  }

  Bella.bind = function(obj, fn){
        return function () {
            return fn.apply(obj, arguments);
        };
    }

  Bella.date = (function(){

    var pattern = 'D, M d, Y  H:i:s A', gmt_pattern = 'D, j M Y H:i:s';
    var weeks = ["Sunday", "Monday", "Tuesday","Wednesday", "Thursday", "Friday","Saturday"];
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    var now = function(){return new Date()};
    var time = function(){return now().getTime()};

    var timezone = -1000*60*now().getTimezoneOffset();

    Bella.now = now;
    Bella.time = time;

    var local2GMT = function(input){
      var d = new Date(input);
      d.setTime(d.getTime()-timezone);
      return d.getTime();
    }
    var gmt2Local = function(input){
      var d = new Date(input);
      d.setTime(d.getTime()+timezone);
      return d.getTime();
    }
    var gmtTime = function(){
      return local2GMT(now());
    }

    var make = function(n){
      return format(n || now(), pattern);
    }
    var gmtMake = function(n){
      return format(n || gmtTime(), gmt_pattern)+' +0000';
    }

    var format = function(input, output){
      var s='', meridiem=false, d, f, vchar=/\.*\\?([a-z])/gi;
      if(!input){
        input = now();
      }
      if(!output){
        output = pattern;
      }
      var wn = weeks;
      var mn = months;
      var _num = function(n){
        return ''+(n<10?'0'+n:n);
      }
      var _ord = function(day){
        return day+=function(day){
          var s=' ';
          switch(day){
            case 1:s+='st';break;
            case 2:s+='nd';break;
            case 3:s+='rd';break;
            case 21:s+='st';break;
            case 22:s+='nd';break;
            case 23:s+='rd';break;
            case 31:s+='st';break;
            default:s+='th';
          };
          return s;
        }
      }
      var _term = function(t,s){
        return f[t]?f[t]():s;
      }
      d = (input instanceof Date) ? input : new Date(input);

      if(isNaN(d.getTime())){
        var reg=/^(\d+-\d+-\d+)\s(\d+:\d+:\d+)$/i;
        if(reg.test(input)){
          d = new Date(input.replace(' ','T'));
        }
        else{
          return input+' !';
        }
      }
      if(output.indexOf('a')>0 || output.indexOf('A')>0){
        meridiem=true;
      }
      f = {
        Y:function(){return d.getFullYear()},     // full year, ex: 2014
        y:function(){return (f.Y()+'').slice(-2)},  // short year, ex: 14
        F:function(){return mn[f.n()-1]},       // full month name, ex: August
        M:function(){return (f.F()+'').slice(0,3)}, // short month name, ex: Aug
        m:function(){return _num(f.n())},       // month index with zero, ex: 08 (in 08/24/2014)
        n:function(){return d.getMonth()+1},    // short month name with no zero, ex: 8 (in 8/24/2014)
        S:function(){return _ord(f.j())},       // the ordering subfix for date, ext: 1st, 2nd, 3rd, 4th
        j:function(){return d.getDate()},       // date, with no zero, ex: 3 (in 18/3/2014)
        d:function(){return _num(f.j())},       // date, with zero, ex: 03 (in 18/03/2014)
        t:function(){return (new Date(f.Y(), f.n(), 0)).getDate()}, // date in year
        w:function(){return d.getDay()},      // weekday in number
        l:function(){return wn[f.w()]},       // long name of weekday, ex: Sunday
        D:function(){var r=(f.l()+'').slice(0,3);return r},// short name of weekday, ex: Sun
        G:function(){return d.getHours()},      // hour, with no zero: 0 - 24
        g:function(){return (f.G()%12||12)},    // hour, with no zero: 0 - 12
        h:function(){return _num(f.g())},       // hour, with zero:  00 - 24
        H:function(){return (meridiem?f.h():_num(f.G()))}, // hour, with zero:  00 - 12
        i:function(){return _num(d.getMinutes())},  // minute:  00 - 59
        s:function(){return _num(d.getSeconds())},  // second:  00 - 59
        a:function(){return f.G()>11?'pm':'am'},  // am, pm
        A:function(){return (f.a()).toUpperCase()}  // AM, PM
      }
      return output.replace(vchar, _term);
    }

    var toRelativeTime = function(input){
      var time = (input instanceof Date?input:new Date(input));
      var delta = new Date()-time;
      var now_threshold = parseInt(time, 10);
      if(isNaN(now_threshold)){
        now_threshold = 0;
      }
      if(delta <= now_threshold){
        return 'Just now';
      }
      var units = null;
      var conversions = {
        millisecond: 1,
        second: 1000,
        minute: 60,
        hour:   60,
        day:    24,
        month:  30,
        year:   12
      };
      for(var key in conversions){
        if (delta < conversions[key]){
          break;
        }
        else{
          units = key;
          delta = delta / conversions[key];
        }
      }
      delta = Math.floor(delta);
      if (delta!==1){units += 's';}
      return [delta, units].join(' ')+' ago';
    }

    var _date = {
      getTimeZone : function(){
        return timezone;
      },
      setTimeZone : function(t){
        timezone = t*1000*60;
      },
      getPattern : function(){
        return pattern;
      },
      setPattern : function(p){
        pattern = p;
      },
      toRelativeTime : toRelativeTime,
      gmtToLocal : gmt2Local,
      localToGMT : local2GMT,
      gmtTime : gmtTime,
      gmtMake : gmtMake,
      make : make,
      validate : function(m, d, y){
        return m>0&&m<13&&y>0&&y<32768&&d>0&&d<=(new Date(y,m,0)).getDate();
      }
    }

    return _date;
  })();

  Bella.transactor = (function(){

    var requests = [];

    var encode = Bella.text.encode;

    function make(){
      var xhr = new XMLHttpRequest();

      var reqid = createId(32, 'ajax-');

      var http = {
        id: reqid,
        xhr: xhr,
        state: -1,
        abort: function(){
          this.xhr.abort();
          removeRequest(reqid);
        }
      }
      requests.push(http);
      return http;
    }

    function removeRequest(id){
      if(requests.length>0){
        for(var i=requests.length-1;i>=0;i--){
          if(requests[i].id==id){
            requests.splice(i, 1);
            break;
          }
        }
      }
    }

    function isRequest(id){
      var r = false;
      if(requests.length>0){
        for(var i=requests.length-1;i>=0;i--){
          if(requests[i].id==id){
            r = true;
            break;
          }
        }
      }
      return r;
    }

    function parse(data){
      var s = '';
      if(isString(data)){
        s = data;
      }
      else if(isArray(data) || isObject(data)){
        var ar = [];
        for(var k in data){
          if(data.hasOwnProperty(k)){
            var val = data[k];
            if(isString(val)){
              val = encode(val);
            }
            else if(isArray(val) || isObject(val)){
              val = JSON.stringify(val);
            }
            ar.push(encode(k)+'='+val);
          }
        }
        if(ar.length>0){
          s = ar.join('&');
        }
      }
      return s;
    }

    function done(xhr, http, callback){
      if(!!http.id && isRequest(http.id)){
        var res = false;
        var err = (!xhr.status || (xhr.status<200 || xhr.status>=300) && xhr.status!==304);
        if(xhr.status==200){
          if(!!http.type){
            switch(http.type){
              case 'json': res = xhr.json; break;
              case 'text': res = xhr.responseText; break;
              case 'blob': res = xhr.blob; break;
              case 'document': res = xhr.document; break;
              case 'arraybuffer': res = xhr.arraybuffer; break;
            }
          }
          else{
            if(!!xhr.responseText){
              try{
                res = JSON.parse(xhr.responseText);
              }
              catch(e){
                console.log(xhr.responseText);
              }
            }
          }
        }
        removeRequest(http.id);
        callback(res, err, xhr);
      }
    }

    return {
      push : function(target, data, callback){
        var opts = {};
        if(!!isObject(callback)){
          opts = callback;
        }
        else if(!!isFunction(callback)){
          opts.callback = callback;
        }
        var cb1 = opts.onprogress || function(){};
        var cb2 = opts.onabort || function(){};
        var cb3 = opts.ontimeout || function(){};
        var cb4 = opts.onerror || function(){};
        var cb5 = opts.onloadstart || function(){};
        var cb6 = opts.onloadend || function(){};
        var cb7 = opts.callback || function(){};

        var headers = {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-type': 'application/x-www-form-urlencoded'
        }
        if(!!opts.headers){
          headers = Bella.mixin(opts.headers, headers);
        }

        var resType = opts.responseType || false;

        var http = make();
        http.xhr.open("POST", target, true);

        for(var key in headers){
          http.xhr.setRequestHeader(key, headers[key]);
        }

        http.xhr.onreadystatechange = function(){
          http.state = this.readyState;
          if(this.readyState===4){
            done(this, http, cb7);
          }
        }
        http.xhr.onprogress = cb1;
        http.xhr.onabort = cb2;
        http.xhr.ontimeout = cb3;
        http.xhr.onerror = cb4;
        http.xhr.onloadstart = cb5;
        http.xhr.onloadend = cb6;

        if(!!resType){
          http.xhr.responseType = resType;
          http.type = resType;
        }
        else{
          http.xhr.overrideMimeType('text/plain');
        }

        http.xhr.send(parse(data));
        return http;
      },
      pull : function(target, data, callback){
        var opts = {};
        if(!!isObject(callback)){
          opts = callback;
        }
        else if(!!isFunction(callback)){
          opts.callback = callback;
        }
        if(isFunction(data)){
          opts = {
            callback: data
          }
        }

        var cb1 = opts.onprogress || function(){};
        var cb2 = opts.onabort || function(){};
        var cb3 = opts.ontimeout || function(){};
        var cb4 = opts.onerror || function(){};
        var cb5 = opts.onloadstart || function(){};
        var cb6 = opts.onloadend || function(){};
        var cb7 = opts.callback || function(){};

        var headers = {'X-Requested-With': 'XMLHttpRequest'}
        if(!!opts.headers){
          headers = Bella.mixin(opts.headers, headers);
        }

        var resType = opts.responseType || false;

        var query = target;
        query+=(target.charAt(target.length-1)!='?'?'?':'')+parse(data);
        var http = make();
        http.xhr.open("GET", query);

        for(var key in headers){
          http.xhr.setRequestHeader(key, headers[key]);
        }

        http.xhr.onreadystatechange = function(){
          http.state = this.readyState;
          if(this.readyState===4){
            done(this, http, cb7);
          }
        }
        http.xhr.onprogress = cb1;
        http.xhr.onabort = cb2;
        http.xhr.ontimeout = cb3;
        http.xhr.onerror = cb4;
        http.xhr.onloadstart = cb5;
        http.xhr.onloadend = cb6;

        if(!!resType){
          http.xhr.responseType = resType;
          http.type = resType;
        }
        else{
          http.xhr.overrideMimeType('text/plain');
        }

        http.xhr.send();
        return http;
      }
    }
  })();

  Bella.device = (function(){

    var ua = navigator.userAgent;
    var n = ua.toLowerCase(), rv = 0;
    if(!!window.attachEvent){
      if(n.indexOf('trident/5.0')>-1){
        rv = 9;
      }
      else{
        var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null){
          rv = parseFloat(RegExp.$1);
        }
      }
    }
    function detect(p){
      return p.test(n);
    }

    return {
      isStandard  : !!window.localStorage,
      isWebkit    : n.indexOf('applewebkit')>-1,
      isGecko     : n.indexOf('gecko')>-1&&n.indexOf('khtml')==-1,
      isChrome    : n.indexOf('applewebkit')>-1&&n.indexOf('chrome')>-1&&n.indexOf('midori')===-1,
      isSafari    : n.indexOf('applewebkit')>-1&&n.indexOf('chrome')==-1&&n.indexOf('midori')===-1,
      isFirefox   : n.indexOf('gecko')>-1&&n.indexOf('firefox')>0,
      isMidori  : n.indexOf('midori')>-1,
      isIE        : !!window.attachEvent&&!window.opera,
      IEvers      : rv,
      isOpera     : !!window.opera,
      isLinux     : n.indexOf('linux')!=-1,
      isWin       : n.indexOf('win')!=-1,
      isMac       : n.indexOf('mac')!=-1,
      isUnix      : n.indexOf('x11')!=-1,
      isAndroid : detect(/android/i),
      isIOS   : detect(/(ipad|iphone|ipod)/i),
      isKindle  : detect(/\W(kindle|silk)\W/i),
      isMobile  : detect(/(iphone|ipod|((?:android)?.*?mobile)|blackberry|nokia)/i),
      isTablet  : detect(/(ipad|android(?!.*mobile))/i),
      isTV    : detect(/googletv|sonydtv/i),
      isIPad    : detect(/ipad/i),
      isIPhone  : detect(/iphone/i),
      isIPod    : detect(/ipod/i),
      isWPhone  : detect(/iemobile/i)
    }
  })();


  ;(function(){

    var EVENT_TYPES = {
      CLICK: 'click',
      DBLCLICK: 'dblclick',
      MOUSEOVER: 'mouseover',
      MOUSEOUT: 'mouseout',
      MOUSEUP: 'mouseup',
      MOUSEDOWN: 'mousedown',
      WHEEL: 'wheel',
      CONTEXTMENU: 'contextmenu',
      KEYDOWN: 'keydown',
      KEYUP: 'keyup',
      KEYPRESS: 'keypress',
      CHANGE: 'change',
      INPUT: 'input',
      PROPERTYCHANGE: 'propertychange',
      DRAGSTART: 'dragstart',
      DRAG: 'drag',
      DRAGENTER: 'dragenter',
      DRAGOVER: 'dragover',
      DRAGLEAVE: 'dragleave',
      DROP: 'drop',
      DRAGEND: 'dragend',
      TOUCHSTART: 'touchstart',
      TOUCHMOVE: 'touchmove',
      TOUCHEND: 'touchend',
      TOUCHCANCEL: 'touchcancel'
    }

    var event = {
      listen : function(element, event, callback){
        if(event=='wheel'){
          event = !!Bella.device.isFirefox?'DOMMouseScroll':'mousewheel';
        }
        var el = isString(element)?_getElement(element):element;
        var cb = callback || function(){};

        if(el.addEventListener){
          el.addEventListener(event, cb, false);
        }
        else if(el.attachEvent){
          el.attachEvent('on'+event, cb);
        }
      },
      ignore : function(element, event, callback){
        var el = isString(element)?_getElement(element):element;
        if(el.removeEventListener){
          el.removeEventListener(event, callback, false);
        }
        else if(el.detachEvent){
          el.detachEvent('on'+event, callback);
        }
      },
      simulate : function(element, event){
        var el = isString(element)?_getElement(element):element;
        if(document.createEventObject){
          var evt = document.createEventObject();
          el.fireEvent('on'+event, evt);
        }
        else{
          var evt = document.createEvent("HTMLEvents");
          evt.initEvent(event, true, true );
          el.dispatchEvent(evt);
        }
      },
      exit : function(e){
        e.cancelBubble = true;
        if(e.stopPropagation){
          e.stopPropagation();
        }
        if(e.preventDefault){
          e.preventDefault();
        }
        return false;
      },
      locate : function(e){
        var evt = e || window.event;
        var targ = evt.target || evt.srcElement;
        if (targ && targ.nodeType == 3){
          targ = targ.parentNode;
        }
        return _getElement(targ);
      }
    }

    function _getElement(el){
      var p = (isString(el)?document.getElementById(el):el)||null;
      if(!!p && isElement(p)){
        p.hasClass = function(c){
          var r = true, e = this.className.split(' '); c = c.split(' ');
          for(var i=0; i<c.length; i++){
            if(e.indexOf(c[i])===-1){
              r = false;
              break;
            }
          }
          return r;
        }
        p.addClass = function(c){
          c = c.split(' ');
          var t = this.className.split(' ');
          var nc = c.concat(t);
          var sc = Bella.collection.unique(nc);
          this.className = sc.join(' ');
          return this;
        }
        p.removeClass = function(c){
          var e = this.className.split(' '); c = c.split(' ');
          for(var i=0; i<c.length; i++){
            if(this.hasClass(c[i])){
              e.splice(e.indexOf(c[i]), 1);
            }
          }
          this.className = e.join(' ');
          return this;
        }
        p.toggleClass = function(c){
          if(p.hasClass(c)){
            p.removeClass(c);
          }
          else{
            p.addClass(c);
          }
          return this;
        }
        p.opacity = function(o){
          this.style.opacity = o;
          if(typeof this.style.opacity!="string"){
            this.style.MozOpacity=o;
            try{
              if(this.filters){
                this.style.filter="progid:DXImageTransform.Microsoft.alpha(opacity="+(o*100)+")";
              }
            }
            catch(e){}
          }
          return this;
        }

        for(var k in EVENT_TYPES){
          (function(ev){
            p[ev] = function(callback){
              event.listen(p, ev, callback);
            }
          })(EVENT_TYPES[k]);
        }

        p.show = function(){
          p.style.display='inline';
          p.style.visibility='visible';
          p.removeClass('bella-hide');
          p.addClass('bella-show');
          return p;
        }
        p.hide = function(){
          p.style.display='none';
          p.style.visibility='invisible';
          p.removeClass('bella-show');
          p.addClass('bella-hide');
          return p;
        }
        p.css = function(os){
          if(!os){
            return this.getAttribute('style');
          }
          else{
            var arr = ['width', 'height', 'top', 'left', 'right', 'bottom', 'font-size', 'offsetTop', 'offsetLeft', 'offsetWidth', 'offsetHeight'];
            var s = this.style;
            for(var k in os){
              var v = os[k];
              if(Bella.collection.contains(arr, k)){
                s[k] = os[k]+'px';
              }
              else{
                s[k] = os[k];
              }
            }
          }
          return p;
        }
        p.bgpos = function(l, t){
          if(isNumber(l) && isNumber(t)){
            this.style.backgroundPosition = Bella.number.round(l,3)+'px '+Bella.number.round(t,3)+'px';
          }
          return p;
        }
        p.bgimg = function(src){
          this.style.backgroundImage = 'url('+src+')';
          return p;
        }
        p.empty = function(){
          while(p.firstChild){
            p.removeChild(p.firstChild);
          }
          return p;
        }
        p.html = function(s){
          if(!s){
            return p.innerHTML;
          }
          p.empty();
          p.insertAdjacentHTML('afterbegin', s);
          return p;
        }
        p.getText = function(){
          return p.innerText||p.textContent;
        }
        p.setText = function(s){
          if(p.innerText){
            p.innerText = s;
          }
          else if(p.textContent){
            p.textContent = s;
          }
          return p;
        }
        p.setValue = function(v){
          var tn = p.tagName.toLowerCase();
          var tp = !!p.type?p.type.toLowerCase():'';
          if(tn=='input' || tn=='textarea' || tn=='select'){
            if(tp=='checkbox' || tp=='radio'){
              p.checked=!!v?true:false;
            }
            else{
              p.value = v;
            }
          }
          else{
            p.html(v);
          }
          event.simulate(el, 'change');
          return p;
        }
        p.getValue = function(v){
          var tn = p.tagName.toLowerCase();
          var tp = !!p.type?p.type.toLowerCase():'';
          if(tn=='input' || tn=='textarea' || tn=='select'){
            if(tp=='checkbox' || tp=='radio'){
              return p.checked;
            }
            else{
              return Bella.text.trim(p.value);
            }
          }
          else{
            return p.html();
          }
        }

        p.setSize = function(width, height){
          var w = width || 0;
          var h = height || w;
          this.style.width = w+'px';
          this.style.height = h+'px';
          return p;
        }
        p.setPosition = function(top, left){
          var t = top || 0;
          var l =left || t;
          this.style.top = t+'px';
          this.style.left = l+'px';
          return p;
        }
        p.rotate = function(opts){
          this.style.webkitTransform = this.style.MozTransform = this.style.OTransform = this.style.transform = 'rotate('+opts+')';
          return p;
        }
        p.getOffset = function(ancestor){
          return (function(el, anc){
            var pos = {left:0,top:0};
            var root = (!anc?document.body:_getElement(anc));
            var bs=0;
            if(!!el.offsetParent){
              do{
                if(el==root){break}
                bs = parseInt(document.defaultView.getComputedStyle(el, null).getPropertyValue('border-width'));
                pos.left+=el.offsetLeft+(bs>0?bs:0);
                pos.top+=el.offsetTop+(bs>0?bs:0);
              }
              while(el=el.offsetParent);
            }
            return pos;
          })(this, ancestor);
        }
        p.isAncestorOf = function(child){
          var child = _getElement(child);
          return child.isDescendantOf(p);
        }
        p.isOrAncestorOf = function(child){
          var child = _getElement(child);
          return child.isOrDescendantOf(p);
        }
        p.isDescendantOf = function(parent){
          var parent = _getElement(parent);
          var node = p.parentNode;
          while(node != null){
            if(node == parent){
              return true;
            }
            node = node.parentNode;
          }
          return false;
        }
        p.isOrDescendantOf = function(parent){
          var parent = _getElement(parent);
          var node = p.parentNode;
          while(node != null){
            if(node == parent){
              return true;
            }
            node = node.parentNode;
          }
          return parent == p;
        }
        p.destroy = function(){
          if(!!this.parentNode){
            this.parentNode.removeChild(this);
          }
        }
      }
      return p;
    };

    var _addElement = function(tag, parent){
      var p = !!parent?Bella.element(parent):document.body;
      var d = document.createElement(tag);
      p.appendChild(d);
      return _getElement(d);
    }

    var _create = function(tag){
      return _getElement(document.createElement(tag));
    }

    var _query = function(condition){
      var el=null, tmp = document.querySelector(condition);
      if(!!tmp){
        el = _getElement(tmp);
      }
      return el;
    }

    var _queryAll = function(condition){
      var els=[], tmp = document.querySelectorAll(condition);
      if(!!tmp){
        for(var i=0;i<tmp.length;i++){
          els.push(_getElement(tmp[i]));
        }
      }
      return els;
    }

    Bella.element = _getElement;

    Bella.dom = {
      one : _query,
      all : _queryAll,
      get : _getElement,
      add : _addElement,
      make : _create
    }
    Bella.event = event;
  })();


  /**
   *  Simple storage
  **/

  var _dbName = 'bella-storage';
  var _dbLocal = (function(){
    var k, s = localStorage.getItem(_dbName);
    if(!!s){
      k = JSON.parse(s);
    }
    return k || {};
  })();

  Bella.storage = {
    insert : function(k, v){
      _dbLocal[k] = v;
      return this;
    },
    select : function(k){
      return _dbLocal[k] || null;
    },
    remove : function(k){
      if(!!_dbLocal[k]){
        _dbLocal[k] = null;
        delete _dbLocal[k];
      }
      return this;
    },
    save : function(){
      localStorage.setItem(_dbName, JSON.stringify(_dbLocal));
    },
    load : function(){
      return _dbLocal;
    },
    empty : function(){
      _dbLocal = {};
      Bella.storage.save();
    }
  }

  /**
   *  Cookies
  **/

  Bella.cookies = {
    set: function(name, value, days){
      var d = new Date(), v = value+'';
      d.setDate(d.getDate()+days?days:0);
      document.cookie=name+'='+(!!v?encodeURIComponent(v):'')+(!!days?'; expires='+d.toUTCString():'')+'; path=/; domain='+Bella.__origin.domain;
    },
    get: function(name, callback){
      if(document.cookie){
        var a = document.cookie.split(';');
        var n = Bella.text.trim(name);
        for(var i=0;i<a.length;i++){
          var t = a[i], ac = t.split('='), x = Bella.text.trim(ac[0]);
          if(x==n){
            var res = decodeURIComponent(ac[1]);
            if(!!callback){
              callback(res);
            }
            return res;
          }
        };
      }
      return null;
    },
    remove: function(name){
      this.set(name, null, -1);
    }
  }

  /**
   * Associating
   * just something like data binding :)
  **/
  function associate(source, target, attr, is2way){
    if(isElement(source)){
      _associateDom2Object(source, target, attr);
      if(!!is2way){
        _associateObject2Dom(target, source, attr);
      }
    }
    else {
      _associateObject2Dom(source, target, attr);
      if(!!is2way){
        _associateDom2Object(target, source, attr);
      }
    }
  }

  function _associateDom2Object(source, target, attribute){
    var el = Bella.element(source);
    if(!!el){
      el.change(function(){
        var v = el.getValue();
        if(!!target){
          target[attribute] = v;
        }
        else{
          event.ignore(el, 'change');
        }
      });
    }
  }

  function _associateObject2Dom(source, target, attribute){
    var el = Bella.element(target);
    Object.observe(source, function(changes){
      changes.forEach(function(change){
        if(change.name==attribute && !!el){
          el.setValue(change.object[attribute]);
        }
      });
    });
  }

  Bella.associate = associate;


  /**
   * Moduling
  */
  var Router, Templater;
  var _ms = Bella.Model = {}, _vs = Bella.View = {};

  Bella.setRouteParser = function(rp){
    Router = rp;
    if(_ms.length>0){
      for(var k in _ms){
        _ms[k].Router = rp;
      }
    }
  }
  Bella.setTemplateEngine = function(te){
    Templater = te;
    if(_vs.length>0){
      for(var k in _vs){
        _vs[k].Templater = te;
      }
    }
  }

  Bella.getModel = function(n){
    return _ms[n];
  }
  Bella.getView = function(n){
    return _vs[n];
  }

  // defines model's prototype
  var _model = {
    init : function(){}
  }
  // defines view's prototype
  var _view = {
    init : function(){}
  }

  // public methods for creating Models and Views
  Bella.createModel = function(name, definition){
    var m = this.inherits(_model);
    var opts = definition || {};
    if(!!opts){
      m = this.mixin(opts, m);
      m.Router = Router;
      _ms[name] = m;
    }
    return m;
  }

  Bella.createView = function(name, definition){
    var v = this.inherits(_view);
    var opts = definition || {};
    if(!!opts){
      v = this.mixin(opts, v);
      v.Templater = Templater;
      _vs[name] = v;
    }
    return v;
  }

  // Loaders

  Bella.DEP = 'dependencies';
  Bella.MOD = 'modules';
  Bella.LIB = 'lib';

  var rootDir = '../src/';
  var dirConf = {
    rootDir : rootDir,
    modules : rootDir+Bella.MOD,
    dependencies : rootDir+Bella.DEP,
    lib : rootDir+Bella.LIB
  }

  var modCache = 0, libCache = 1;

  Bella.setCachable = function(opt){
    var ob = opt || {};
    modCache = ob.mod || 0;
    libCache = ob.lib || 0;
  }

  Bella.setJSPath = function(dir, path){
    if(!!dirConf[dir]){
      if(dir==='rootDir'){
        for(var d in dirConf){
          var t = dirConf[d];
          if(t.indexOf(rootDir)===0){
            dirConf[d] = t.replace(rootDir, path);
          }
        }
        rootDir = path;
      }
      else{
        dirConf[dir] = path;
      }
    }
  }

  Bella.getJSPath = function(dir){
    if(!dir){
      return dirConf;
    }
    return dirConf[dir] || false;
  }

  function include(file, callback){
    var cb = callback || function(){};
    var f = function(p, onfinish){
      if(!p){
        onfinish();
        return false;
      }
      var src = autoFixExt(p);

      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.onload = script.onreadystatechange = function(){
        if(!this.readyState||this.readyState==='loaded'||this.readyState==='complete'){
          onfinish();
        }
      }
      script.onerror = function(e){
        console.log('Error: could not load specified file: '+src);
        onfinish();
      }
      script.src = src;
      document.body.appendChild(script);
    }
    if(isArray(file)){
      var k = file.length;
      var fn = function(){
        k--;
        if(k==0){
          cb();
        }
      }
      file.forEach(function(p){
        f(p, fn);
      });
    }
    else{
      f(file, cb);
    }
  }

  function autoFixExt(n){
    if(n.indexOf('http://')===0 || n.indexOf('https://')===0 || n.indexOf('.js')===n.length-3){
      return n;
    }
    return n+'.js';
  }

  function require(packages, dir, callback){
    var cb = callback || function(){};
    var ph = '';
    if(!callback && !!dir){
      if(isFunction(dir)){
        cb = dir;
      }
    }
    if(!!dir && isString(dir)){
      if(dirConf.hasOwnProperty(dir)){
        ph = dirConf[dir];
      }
      else{
        ph = dir;
      }
    }
    else{
      ph = dirConf.dependencies;
    }
    if(ph.charAt(ph.length-1)!=='/'){
      ph+='/';
    }

    if(isArray(packages)){
      var ps = packages;
      var fs = Bella.collection.unique(ps);
      if(fs.length>0){
        var a = [];
        fs.forEach(function(item){
          a.push(item);
        });
        var k = a.length;
        var f = function(){
          k--;
          if(k==0){
            cb();
          }
        }
        a.forEach(function(_file){
                    _file = autoFixExt(_file);
          if(_file.indexOf('http://')===0 || _file.indexOf('https://')===0){
            include(_file, f);
          }
          else{
            var id = !libCache?'?_='+createId(16):'';
            include(ph+_file+id, f);
          }
        });
      }
    }
    else if(isString(packages)){
      include(ph+autoFixExt(packages), cb);
    }
    else{
      cb();
    }
  }

  function importModules(mods, callback){
    var id = !modCache?'?_='+createId(16):'';
    var fs = [];
    var _add = function(m){
      if(isString(m)){
        fs.push(Bella.text.strtolower(m));
      }
    }
    if(isArray(mods)){
      mods.forEach(function(mod){
        _add(mod);
      });
    }
    else{
      _add(mods);

    }
    fs = Bella.collection.unique(fs);
    if(fs.length>0){
      var ar = [], ks = ['model', 'template', 'view'];
      fs.forEach(function(m){
        ks.forEach(function(n){
          ar.push(m+'/'+n+'.js'+id);
        });
      });
      require(ar, Bella.MOD, callback);
    }
  }

  Bella.include = include;
  Bella.require = require;
  Bella.implement = importModules;

  setTimeout(function(){
    var ss = Bella.dom.all('script');
    for(var i=0;i<ss.length;i++){
      var o = ss[i];
      var s = o.getAttribute('src') || '';
      var t = s.length;
      var x1 = s.indexOf('bella.js'), l1 = t-8;
      var x2 = s.indexOf('bella.min.js'), l2 = t-12;
      if(x1===l1 || x2===l2){
        var q = o.getAttribute('ping');
        if(!!q){
          include(autoFixExt(q)+'?_='+Bella.createId(40));
        }
        break;
      }
    }
    include();
  }, 100);

  ;(function(){

    function _getMousePosition(ev){
      var cursor = {x:0,y:0}, e = ev||window.event;
      if(e.pageX||e.pageY){
        cursor.x=e.pageX;
        cursor.y=e.pageY;
      }
      else{
        var de=document.documentElement;
        var db=document.body;
        cursor.x=e.clientX+(de.scrollLeft||db.scrollLeft)-(de.clientLeft||0);
        cursor.y=e.clientY+(de.scrollTop||db.scrollTop)-(de.clientTop||0);
      }
      return cursor;
    }

    function _getWindowSize(){
      var wsize={w:0,h:0};
      if(window.innerWidth){
        wsize.w=window.innerWidth;
        wsize.h=window.innerHeight;
      }
      else if(document.documentElement&&document.documentElement.clientWidth){
        wsize.w=document.documentElement.clientWidth;
        wsize.h=document.documentElement.clientHeight;
      }
      else if(document.body){
        wsize.w=document.body.clientWidth;
        wsize.h=document.body.clientHeight;
      }
      return wsize;
    }
    Bella.getMousePosition = _getMousePosition;
    Bella.getWindowSize = _getWindowSize;

    var a = [], b = [], c = [], d = [];
    function _call(ls){
      ls.forEach(function(f){
        f();
      });
    }
    Bella.setOnloadCallback = function(f){a.push(f)};
    Bella.setOnresizeCallback = function(f){b.push(f)};

    var clicks = [], resizes = [];

    function onclick(e, tg){
      clicks.forEach(function(f){
        f(e, tg);
      });
    }
    function onresize(w, h){
      resizes.forEach(function(f){
        f(w, h);
      });
    }

    function getFuncName(f){
      var ret = f.toString();
      ret = ret.substr('function '.length);
      ret = ret.substr(0, ret.indexOf('('));
      return ret || '';
    }

    Bella.setClickCallback = function(f){
      var name = getFuncName(f);
      if(!!name){
        for(var i=clicks.length-1;i>=0;i--){
          var n = clicks[i];
          var ret = getFuncName(n);
          if(!!ret && ret==name){
            clicks.splice(i, 1);
            break;
          }
        }
      }
      clicks.push(f);
    }
    Bella.unsetClickCallback = function(name){
      for(var i=clicks.length-1;i>=0;i--){
        var f = clicks[i];
        var ret = getFuncName(f);
        if(!!ret && ret==name){
          clicks.splice(i, 1);
          break;
        }
      }
    }

    Bella.setResizeCallback = function(f){
      var name = getFuncName(f);
      if(!!name){
        for(var i=resizes.length-1;i>=0;i--){
          var n = resizes[i];
          var ret = getFuncName(n);
          if(!!ret && ret==name){
            resizes.splice(i, 1);
            break;
          }
        }
      }
      resizes.push(f);
    }
    Bella.unsetResizeCallback = function(name){
      for(var i=resizes.length-1;i>=0;i--){
        var f = resizes[i];
        var ret = getFuncName(f);
        if(!!ret && ret==name){
          resizes.splice(i, 1);
          break;
        }
      }
    }

    window.onload = function(){
      _call(a);
      Bella.event.listen(document, 'click', function(e){
        var tg = Bella.event.locate(e);
        if(!!isElement(tg)){
          onclick(e, tg);
        }
      });
      Bella.setOnresizeCallback(function(){
        var ws = Bella.getWindowSize();
        onresize(ws.w, ws.h);
      });
    };
    window.onresize = function(){_call(b)};
  })();

    if(isFunction(root.define)){
        root.define(function(require){
            return Bella;
        });
    }
    else{
        root['Bella'] = Bella;
    }
  return Bella;
})(this);
