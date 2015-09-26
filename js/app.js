/**
 * app.js
 * Atomic Strategy demo
 * @ndaidong
 */
;(function(){

  var $loader, $animLoader, $progressBar, $barPercent, $presentation, $atomicLogo, $slider, $downer, $panel;

  var panelData;
  var timeLinePercent = 0;

  var _path = 'images';
    var _iOS = false;

  var baseRatio = 1,
    scaleRatio = 1,
    boardSize = {
      width: 2000,
      height: 1125
    }

  function log(txt){
    var el = Bella.element('log');
    var s = el.innerHTML;
    el.innerHTML = '<p>'+txt+'</p>'+s;
  }

  function addCss(path){
    var head = Bella.dom.all('head')[0];
    var link = Bella.dom.add('link', head);
    link.setAttribute('type', 'text/css');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', path+'?_='+Bella.createId(10));
  }

  function init(){

    $loader = Bella.element('loader');
    $animLoader = Bella.element('animLoader');
    $barPercent = Bella.element('barPercent');
    $progressBar = Bella.element('progressBar');
    $presentation = Bella.element('presentation');
    $atomicLogo = Bella.element('atomicLogo');
    $slider = Bella.element('slider');
    $downer = Bella.element('downer');
    $panel = Bella.element('panel');

    var $body = Bella.element(document.body);
    if(navigator.userAgent.match(/iPad;.*CPU.*OS 7_\d/i) && !window.navigator.standalone){
      $body.addClass('ipad ios7');
      _iOS = true;
    }
    $body.addClass('ipad ios7');

    panelData = (function(){
      var d = {};
      Bella.dom.all('.btn-panel').forEach(function(el){
        var sec = el.getAttribute('section');
        var txt = el.html();
        d[sec] = txt;
        el.empty();
      });
      return d;
    })();

    Bella.dom.all('.slide-stop').forEach(function(el){
      el.click(function(){
        if(el.hasClass('pos-1')){
          switchSceneTo(1);
        }
        else if(el.hasClass('pos-2')){
          switchSceneTo(2);
        }
        else if(el.hasClass('pos-3')){
          switchSceneTo(3);
        }
        else if(el.hasClass('pos-4')){
          switchSceneTo(4);
        }
      });
    });

    var dv = Bella.device;
    var ws = Bella.getWindowSize();
    var w = ws.w, h = ws.h;
    if(w<600){
      baseRatio = 0.25;
    }
    else if(w<=1024){
      baseRatio = 0.5;
    }

    boardSize.width*=baseRatio;
    boardSize.height*=baseRatio;
    reposition(w, h);

    window.onresize = window.onorientationchange = function(e){
      var ws = Bella.getWindowSize();
      reposition(ws.w, ws.h);
    }
  }

  function reposition(w, h){

    var wsw = Math.max(w, h), wsh = Math.min(w, h);

    var bw = boardSize.width, bh = boardSize.height;

    $presentation.setSize(bw, bh);

    var isLandscape = wsw>=wsh;

    var ratio = 1;

    if(isLandscape){
      ratio = wsh/bh;
    }
    else{
      ratio = wsw/bw;
    }

    $slider.style.left = (w-500*baseRatio)/2+'px';
    $panel.style.left = (w-595*baseRatio)/2+'px';

    scaleTo(ratio, isLandscape, wsw, wsh);
  }

  function scaleTo(r, l, w, h){
    scaleRatio = r;

    var sw = boardSize.width*r,
      sh = boardSize.height*r;

      var sl = st = 0;

      if(!!l){
        sl = ((w-sw)/2);
      }

    var css = [
      '-webkit-transform: scale('+r+')',
      '-moz-transform: scale('+r+')',
      '-ms-transform: scale('+r+')',
      '-o-transform: scale('+r+')',
      'transform: scale('+r+')',
      'top:'+st+'px',
      'left:'+sl+'px',
    ].join(';');
    $presentation.setAttribute('style', css);

    // place logo at its best position.
    var al = 10;
    if(sl<0){
        al+=(-1*sl);
    }
    $atomicLogo.style.left = al+'px';
  }


  function setActiveScene(k){
    $slider.removeClass('step-1 step-2 step-3 step-4').addClass('step-'+k);
  }

  function switchSceneTo(step){
    if(!!Presenter){
      setActiveScene(step);
      Presenter.scrollTo(step);
    }
  }


  init();

    var _libs = [
      'TweenMax.min',
      'iscroll-probe.min',
      'mousetrap.min',
    ];

    if(_iOS){
      _libs = _libs.concat(['ImageLoader', 'Presenter']);
    }
    else{
      var _url = new URL(document.URL);
      var _domain = _url.hostname;
      _libs = _libs.concat(['ImageLoader', 'Presenter']);
    }

  Bella.setCachable({libCache: 0});
  Bella.setJSPath(Bella.LIB, 'js/libs');
  Bella.require(_libs, Bella.LIB, function(){
    if(baseRatio==0.25){
      _path = 'm-images';
    }
    else if(baseRatio==0.5){
      _path = 't-images';
    }

    ImageLoader.load(1, function(k){
      TweenLite.to($barPercent, 0.2, {width: k+'%'});
    }, function(){
      var c = Bella.element('wrapper');
      if(!!c){
        if(baseRatio==0.25){
          addCss('css/presentation.m.css');
        }
        else if(baseRatio==0.5){
          addCss('css/presentation.t.css');
        }
        else if(baseRatio===1){
          addCss('css/presentation.d.css');
        }
        TweenLite.to([$loader, $progressBar] , 3, {autoAlpha: 0, onComplete: function(){
          $progressBar.hide();
          $loader.hide();
          setTimeout(function(){
            Presenter.init(c);
          }, 2000);
        }});
      }
    });
  });

  var app = window['app'] = {
    log : log,
    getPanelData : function(sec){
      return panelData[sec] || '';
    },
    getBaseRatio : function(){
      return baseRatio;
    },
    getBoardSize : function(){
      return boardSize;
    },
    setTimelinePercent : function(k){
      timeLinePercent = k;
    },
    getTimelinePercent : function(){
      return timeLinePercent;
    },
    getImgPath : function(){
      return _path;
    },
    setActiveScene : setActiveScene,
    switchSceneTo : switchSceneTo
  }
})();
