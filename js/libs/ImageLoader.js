/**
 * ImageLoader, utility for adding image scene by scene
 * @AtomicStrategy
 * @ndaidong at Twitter
**/

;(function(){

  'use strict';

  var Scene = [
    null,
    [
      ['bg/scene-1/1.jpg', 138.8],
      ['bg/scene-1/2.png', 157.9],
      ['bg/scene-1/3.png', 148.3],
      ['bg/scene-1/4.png', 73.3],
      ['bg/scene-1/7.png', 54.6],
      ['items/light.png', 7.7],
      ['items/clear-lighting.png', 25.9],
      ['items/dim-lighting.png', 110.6],
      ['items/control-table.png', 500],
      ['items/robot-holder.png', 37.9],
      ['items/needle1.png', 3.3],
      ['items/needle2.png', 3.6],
      ['items/screen1.png', 2.5],
      ['items/screen2.png', 1.1],
      ['items/shadow.png', 20.4],
      ['items/down-arrow.png', 5.2],
      ['items/down-text.png', 3.2],
      ['items/circle.png', 4.7],
      ['items/panel.png', 164.3],
      ['objects/gap-right-hand.png', 6],
      ['objects/gap-left-hand.png', 6],
      ['objects/gap-right-foot.png', 7.1],
      ['objects/gap-left-foot.png', 7.9],
      ['objects/right-hand.png', 9.6],
      ['objects/left-hand.png', 10.0],
      ['objects/right-foot.png', 16.6],
      ['objects/left-foot.png', 17.3],
      ['objects/robot-body.png', 31.4],
      ['objects/robot-main.png', 62.8],
      ['objects/tick-hand.png', 8.1],
      ['objects/thumb-up.png', 10.2],
      ['objects/left-board.png', 32.0],
      ['objects/right-board.png', 31.8],
      ['sprite/gap-1.png', 143.6],
      ['sprite/gap-2.png', 85.1],
      ['sprite/gap-touch.png', 47.5],
      ['sprite/robot-move.png', 583.8]
    ],
    [
      ['bg/scene-2/1.jpg', 202.9],
      ['bg/scene-2/4.png', 599.4],
      ['bg/scene-2/5.png', 13.4],
      ['bg/scene-2/6.png', 264.6],
      ['bg/scene-2/7.png', 695.1],
      ['bg/scene-2/switcher.png', 127.4],
      ['bg/scene-2/tunnel-back-in.png', 152.6],
      ['bg/scene-2/tunnel-front-in.png', 223.9],
      ['objects/rocket-body.png', 105.9],
      ['objects/tank-body.png', 119.3],
      ['objects/truck-body.png', 129.6]
    ],
    [
      ['bg/scene-3/tunnel-back-out.png', 152.6],
      ['bg/scene-3/tunnel-front-out.png', 223.9],
      ['bg/scene-3/1.jpg', 74.3],
      ['bg/scene-3/2.png', 12000],
      ['bg/scene-3/3.png', 69.9],
      ['bg/scene-3/4.png', 50.3],
      ['bg/scene-3/6.png', 2600],
      ['bg/scene-3/7.png', 1200],
      ['bg/scene-3/8.png', 661],
      ['items/logo.png', 20.6],
      ['items/smoke-1.png', 414.3],
      ['items/smoke-2.png', 757.7],
      ['items/smoke-3.png', 448.2],
      ['sprite/UFO.png', 417.4],
      ['sprite/animals.png', 1500],
      ['sprite/clouds.png', 869.2],
      ['sprite/spacecraft.png', 498.1],
      ['sprite/missile.png', 148.9],
      ['sprite/tank-wheel.png', 62.1],
      ['sprite/truck-wheel.png', 21.4],
      ['sprite/3.png', 79],
      ['sprite/box-sprite.png', 123.6]
    ]
  ];

  var load = function(k, onprogress, onfinish){
    var cb1 = onprogress || function(){};
    var cb2 = onfinish || function(){};

    var ls = Scene[k];
    if(ls.length>0){

      var path = app.getImgPath();
      var _total = 0, _percent = 0;

      ls.forEach(function(item){
        _total+=item[1];
      });

      ls.forEach(function(item){
        var src = item[0];
        var size = item[1];
        var percent = size*100/_total;

        var img = new Image();
        img.onload = function(){
          _percent+=percent;
          cb1(_percent);
          if(_percent>=100){
            cb2();
          }
        }
        img.onerror = function(e){
          console.log('Missing an image: '+img.src);
          _percent+=percent;
          cb1(_percent);
          if(_percent>=100){
            cb2();
          }
        }
        img.src = 'css/'+path+'/'+src;
      });
    }
    else{
      cb2();
    }
  }

  var I = {
    load : load
  }

  window['ImageLoader'] = I;

})();
