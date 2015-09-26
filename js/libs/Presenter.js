/**
 * Presenter, utility for managing scenes and their scenario
 * @AtomicStrategy
 * @ndaidong at Twitter
**/

;(function(){

  'use strict';

  var TIMESCALE = 10;

  var Breaks = [0, 0.015, 0.15, 0.521, 1.0];

  var Timeline;

  var _scene = 0, _scene1, _scene2, _scene3;
  var _defaultSection, _panelScroll;
  var _nested;

  var _automatic, _progress = 0;

  var $clearLight, $dimLight;
  var $freeFight;
  var $wrapper;

  function onScroll(k, mode){
    app.setTimelinePercent(k);
    if(!!Timeline){
      Timeline.progress(k/100);
    }
  }

  function onFinish(){

  }

  function onUpdate(){
    _progress = Timeline.progress();
    if(!!_automatic){
      _scrollTo(_progress, 0.1);
    }
  }

  function onChangeScene(){
    setTextureAnim();
  }

  function setScene(k){
    if(k!=_scene){
      app.setActiveScene(k);
      _scene = k;
      onChangeScene();
    }
  }


  function setTextureAnim(){
    if(_scene==1){
      animScene1Start();
      Sky.stop();
      animScene4Stop();
    }
    else if(_scene==2){
      animScene1Stop();
      Sky.init();
      animScene4Stop();
    }
    else if(_scene==3){
      animScene1Stop();
      Sky.stop();
      animScene4Stop();
    }
    else if(_scene==4){
      animScene1Stop();
      Sky.stop();
      loadPanel();
      animScene4Start();
    }
  }


  function makeScenario(wsize, timescale){

    if(!!Timeline){
      Timeline.kill();
    }

    var tc = timescale || TIMESCALE;
    var tl = new TimelineLite({onComplete: onFinish, onReverseComplete: onFinish, onUpdate: onUpdate, paused: true});
    tl.timeScale(tc);
    Timeline = tl;

    var baseRatio = app.getBaseRatio(),
      step = Bella.createId(30),
      speed = 5,
      delay = 5,
      ease = Power3.easeOut;

    tl.call(function(){
      setScene(1);
    });


    tl.to('#downer', 150, {top: 1150}, 'slide-up');
    tl.to('#slider', 150, {bottom: 5}, 'slide-up');

    tl.to('#gapLeftTop', 320, {left: -625*baseRatio, top: 42*baseRatio, delay: 1, ease: Power1.easeInOut}, 'racking');
    tl.to('#gapLeftBottom', 320, {left: -484*baseRatio, top: 1422*baseRatio, delay: 0.5, ease: Power1.easeInOut}, 'racking');
    tl.to('#gapRightTop', 320, {right: -196*baseRatio, top: 315*baseRatio, delay: 0.3, ease: Power1.easeInOut}, 'racking');
    tl.to('#gapRightBottom', 320, {right: -194*baseRatio, top: 732*baseRatio, ease: Power1.easeInOut}, 'racking');

    tl.to('#gapLeftTopHand', 320, {scale: 0.8, top: 60*baseRatio, right: -231*baseRatio, delay: 1, ease: Power1.easeInOut}, 'racking');
    tl.to('#gapLeftBottomFoot', 320, {scale: 0.8, top: -9*baseRatio, right: -321*baseRatio, delay: 0.5, ease: Power1.easeInOut}, 'racking');
    tl.to('#gapRightTopHand', 320, {scale: 0.8, top: 40*baseRatio, left: -114*baseRatio, delay: 0.3, ease: Power1.easeInOut}, 'racking');
    tl.to('#gapRightBottomFoot', 320, {scale: 0.8, top: -52*baseRatio, left: -208*baseRatio, ease: Power1.easeInOut}, 'racking');



    tl.set('#gapLeftTopHolder', {delay: 20, top:21*baseRatio, right:-78*baseRatio, width:122*baseRatio, height:176*baseRatio, backgroundPosition:'0px -'+4*baseRatio+'px'}, 'racking-end');
    tl.set('#gapLeftBottomHolder', {delay: 20, top:25*baseRatio, right:-79*baseRatio, width:122*baseRatio, height:176*baseRatio, backgroundPosition:'0px -'+4*baseRatio+'px'}, 'racking-end');
    tl.set('#gapRightTopHolder', {delay: 20, top:4*baseRatio, left:-78*baseRatio, width:122*baseRatio, height:176*baseRatio, backgroundPosition:'-'+160*baseRatio+'px -'+4*baseRatio+'px'}, 'racking-end');
    tl.set('#gapRightBottomHolder', {delay: 20, top:-2*baseRatio, right:-100*baseRatio, width:122*baseRatio, height:176*baseRatio, backgroundPosition:'-'+160*baseRatio+'px -'+4*baseRatio+'px'}, 'racking-end');

    tl.set('#gapLeftTopHand', {opacity: 0});
    tl.set('#robotLeftHand', {opacity: 1});

    tl.set('#gapLeftBottomFoot', {opacity: 0});
    tl.set('#robotRightHand', {opacity: 1});

    tl.set('#gapRightTopHand', {opacity: 0});
    tl.set('#robotLeftFoot', {opacity: 1});

    tl.set('#gapRightBottomFoot', {opacity: 0});
    tl.set('#robotRightFoot', {opacity: 1});


    tl.to('#gapLeftTop', 240, {left: -1900*baseRatio, top: 200*baseRatio, delay: 4}, 'rackingOut');
    tl.to('#gapLeftBottom', 240, {left: -1900*baseRatio, top: 1800*baseRatio, delay: 4}, 'rackingOut');
    tl.to('#gapRightTop', 240, {right: -1900*baseRatio, top: 300*baseRatio, delay: 4}, 'rackingOut');
    tl.to('#gapRightBottom', 240, {right: -1000*baseRatio, top: 1800*baseRatio, delay: 4}, 'rackingOut');

    tl.set('#gapLeftTop', {opacity: 0});
    tl.set('#gapLeftBottom', {opacity: 0});
    tl.set('#gapRightTop', {opacity: 0});
    tl.set('#gapRightBottom', {opacity: 0});



    tl.to('#robot', 160, {top: 335*baseRatio});
    tl.to('#robotHolder', 240, {right: '-='+1000*baseRatio}, 'phare');

    tl.set('#robotBody', {opacity: 0}, 'phare');
    tl.set('#robotRightHand', {opacity: 0}, 'phare');
    tl.set('#robotLeftHand', {opacity: 0}, 'phare');
    tl.set('#robotRightFoot', {opacity: 0}, 'phare');
    tl.set('#robotLeftFoot', {opacity: 0}, 'phare');

    tl.set('#robot', {top: 345*baseRatio}, 'phare');
    tl.set('#robotMain', {opacity: 1}, 'phare');
    tl.set('#robotTickHand', {opacity: 1}, 'phare');
    tl.set('#robotThumbUp', {opacity: 1}, 'phare');

    tl.to('#robotThumbUp', 80, {scale: 1, top: 58*baseRatio}, 'phare');
    tl.set('#robotUnrack', {opacity: 0, delay: 10});


    var stepDelay = 12;
    tl.set('#robot', {width: 280*baseRatio, height: 621*baseRatio, top: 370*baseRatio, scale: 1.15});
    // robot walk to righ
      tl.set('#robot', {backgroundPosition: '0px 0px', width: 240*baseRatio});
      tl.set('#robot', {delay: stepDelay, backgroundPosition: '-'+330*baseRatio+'px 0px', width: 280*baseRatio});
      tl.set('#robot', {delay: stepDelay, backgroundPosition: '-'+681*baseRatio+'px '+8*baseRatio+'px', width: 348*baseRatio});
      tl.set('#robot', {left: '+='+20*baseRatio, delay: stepDelay, backgroundPosition: '-'+1040*baseRatio+'px 0px', width: 340*baseRatio});
      tl.set('#robot', {left: '+='+180*baseRatio, delay: stepDelay, backgroundPosition: '-'+1430*baseRatio+'px 0px', width: 310*baseRatio});
      tl.set('#robot', {left: '+='+110*baseRatio, delay: stepDelay, backgroundPosition: '-'+1820*baseRatio+'px 0px', width: 340*baseRatio});
      tl.set('#robot', {left: '+='+20*baseRatio, delay: stepDelay, backgroundPosition: '-'+2170*baseRatio+'px 0px', width: 350*baseRatio});

      tl.set('#robot', {left: '+='+180*baseRatio, delay: stepDelay, backgroundPosition: '-'+330*baseRatio+'px 0px', width: 280*baseRatio});
      tl.set('#robot', {delay: stepDelay, backgroundPosition: '-'+681*baseRatio+'px '+8*baseRatio+'px', width: 348*baseRatio});
      tl.set('#robot', {left: '+='+20*baseRatio, delay: stepDelay, backgroundPosition: '-'+1040*baseRatio+'px 0px', width: 340*baseRatio});
      tl.set('#robot', {left: '+='+180*baseRatio, delay: stepDelay, backgroundPosition: '-'+1430*baseRatio+'px 0px', width: 310*baseRatio});
      tl.set('#robot', {left: '+='+110*baseRatio, delay: stepDelay, backgroundPosition: '-'+1820*baseRatio+'px 0px', width: 340*baseRatio});
      tl.set('#robot', {left: '+='+20*baseRatio, delay: stepDelay, backgroundPosition: '-'+2170*baseRatio+'px 0px', width: 350*baseRatio});

      tl.set('#robot', {left: '+='+180*baseRatio, delay: stepDelay, backgroundPosition: '-'+330*baseRatio+'px 0px', width: 280*baseRatio});
      tl.set('#robot', {left: '+=0', delay: stepDelay, backgroundPosition: '-'+681*baseRatio+'px '+8*baseRatio+'px', width: 348*baseRatio});
      tl.set('#robot', {left: '+='+20*baseRatio, delay: stepDelay, backgroundPosition: '-'+1040*baseRatio+'px 0px', width: 340*baseRatio});
      tl.set('#robot', {left: '+='+180*baseRatio, delay: stepDelay, backgroundPosition: '-'+1430*baseRatio+'px 0px', width: 310*baseRatio});
      tl.set('#robot', {left: '+='+110*baseRatio, delay: stepDelay, backgroundPosition: '-'+1820*baseRatio+'px 0px', width: 340*baseRatio});
      tl.set('#robot', {left: '+='+20*baseRatio, delay: stepDelay, backgroundPosition: '-'+2170*baseRatio+'px 0px', width: 350*baseRatio});

    tl.call(function(){
      setScene(1);
    });

    tl.call(function(){
      setScene(2);
    });

    tl.set('#scene1', {opacity: 1, top: 0});
    tl.set('#scene2', {opacity: 1, top: '100%'});
    tl.to('#scene1', 240, {top: '-100%'}, 's1tos2');
    tl.to('#scene2', 240, {top: 0}, 's1tos2');

      tl.set('#robotClone', {backgroundPosition: '0px 0px', width: 240*baseRatio});
      tl.set('#robotClone', {left: '+=0', delay: stepDelay, backgroundPosition: '-'+330*baseRatio+'px 0px', width: 280*baseRatio});
      tl.set('#robotClone', {left: '+=0', delay: stepDelay, backgroundPosition: '-'+681*baseRatio+'px '+8*baseRatio+'px', width: 348*baseRatio});
      tl.set('#robot', {left: '+='+20*baseRatio, delay: stepDelay, backgroundPosition: '-'+1040*baseRatio+'px 0px', width: 340*baseRatio});
      tl.set('#robot', {left: '+='+180*baseRatio, delay: stepDelay, backgroundPosition: '-'+1430*baseRatio+'px 0px', width: 310*baseRatio});
      tl.set('#robot', {left: '+='+110*baseRatio, delay: stepDelay, backgroundPosition: '-'+1820*baseRatio+'px 0px', width: 340*baseRatio});
      tl.set('#robot', {left: '+='+20*baseRatio, delay: stepDelay, backgroundPosition: '-'+2170*baseRatio+'px 0px', width: 350*baseRatio});


      tl.set('#robotClone', {left: '+='+180*baseRatio, delay: stepDelay, backgroundPosition: '-'+330*baseRatio+'px 0px', width: 280*baseRatio});
      tl.set('#robotClone', {left: '+=0', delay: stepDelay, backgroundPosition: '-'+681*baseRatio+'px '+8*baseRatio+'px', width: 348*baseRatio});
      tl.set('#robotClone', {left: '+='+20*baseRatio, delay: stepDelay, backgroundPosition: '-'+1040*baseRatio+'px 0px', width: 340*baseRatio});

      tl.set('#robotClone', {left: '+='+180*baseRatio, delay: stepDelay, backgroundPosition: '-'+330*baseRatio+'px 0px', width: 280*baseRatio});
      tl.set('#robotClone', {left: '+=0', delay: stepDelay, backgroundPosition: '-'+681*baseRatio+'px '+8*baseRatio+'px', width: 348*baseRatio});
      tl.set('#robotClone', {left: '+='+20*baseRatio, delay: stepDelay, backgroundPosition: '-'+1040*baseRatio+'px 0px', width: 340*baseRatio});
      tl.set('#robotClone', {left: '+='+180*baseRatio, delay: stepDelay, backgroundPosition: '-'+330*baseRatio+'px 0px', width: 280*baseRatio});

      tl.set('#robotClone', {backgroundPosition: 2500*baseRatio+'px 0px', top: '-='+40*baseRatio, left: '+='+36*baseRatio});

      tl.set('#robotCloneMain', {opacity: 1});
      tl.set('#robotCloneLeftHand', {opacity: 1});
      tl.set('#robotCloneRightHand', {opacity: 1});

      tl.set('#robotClone', {delay: 16, opacity: 0});
      tl.set('#missileMain', {backgroundPosition: '-'+588*baseRatio+'px -'+30*baseRatio+'px'});

      // missile move
      var eas1 = Power2.easeIn,
        eas2 = Linear.easeNone,
        missileMoveNext = Bella.createId(16),
        missileMove = Bella.createId(16);

      tl.set('#missileFire', {delay: 8, opacity: 1});
      tl.call(missileRun);

      tl.to('#missile', 24, {left: '+='+20*baseRatio+'px', ease: Power4.easeInOut});
      tl.to('#missile', 42, {left: '+='+50*baseRatio+'px', ease: eas2}, missileMove);

      // bus appears
      tl.to('#bus', 1200, {left: 2100, ease: eas2, delay: 120}, missileMove);
      // hello bus
      tl.set('#missileMain', {backgroundPosition: '-'+1250*baseRatio+'px -'+30*baseRatio+'px'}, missileMove+'+='+(150+(300*baseRatio)));
      tl.set('#missileMain', {backgroundPosition: '-'+588*baseRatio+'px -'+30*baseRatio+'px'}, missileMove+'+='+(280+(300*baseRatio)));


      // tank appears
      tl.to('#tank', 2100, {left: -1000, ease: eas1, delay: 420}, missileMove);
      // tank meets robot
      tl.set('#tankMain', {backgroundPosition: '0px -'+481*baseRatio+'px'}, missileMove+'+='+(1750+(300*baseRatio)));
      tl.set('#tankMain', {backgroundPosition: '0px 50px'}, missileMove+'+='+(2000+(300*baseRatio)));
      // hello tank
      tl.set('#missileMain', {backgroundPosition: '-'+1250*baseRatio+'px -'+30*baseRatio+'px'}, missileMove+'+='+(1800+(300*baseRatio)));
      tl.set('#missileMain', {backgroundPosition: '-'+588*baseRatio+'px -'+30*baseRatio+'px'}, missileMove+'+='+(1900+(300*baseRatio)));

      // rocket appears
      tl.to('#rocket', 600, {left: 2100, delay: 2500}, missileMove);
      // hello rocket
      tl.set('#missileMain', {backgroundPosition: '-'+1250*baseRatio+'px -'+30*baseRatio+'px'}, missileMove+'+='+(2400+(300*baseRatio)));
      tl.set('#missileMain', {backgroundPosition: '-'+588*baseRatio+'px -'+30*baseRatio+'px'}, missileMove+'+='+(2500+(300*baseRatio)));


      tl.to('#scene2layer4', 3600, {backgroundPosition: '-'+720*baseRatio+'px 0px', ease: eas2}, missileMove);
      tl.to('#scene2layer5', 3600, {backgroundPosition: '-'+1021*baseRatio+'px 0px', ease: eas2}, missileMove);
      tl.to('#scene2layer6', 3600, {backgroundPosition: '-'+1621*baseRatio+'px 0px', ease: eas2}, missileMove);
      tl.to('#scene2layer7', 3600, {backgroundPosition: '-'+13662*baseRatio+'px 0px', ease: eas2}, missileMove);
      tl.to('#scene2layer8', 3600, {backgroundPosition: '-'+13662*baseRatio+'px 0px', ease: eas2}, missileMove);

      tl.to('#missile', 800, {left: '+='+1560*baseRatio+'px', delay: 2800, ease: eas2}, missileMove);

      tl.to('#scene2layer8back', 300, {left: 1400*baseRatio, ease: eas2, delay: 3300}, missileMove);
      tl.to('#scene2layer8front', 300, {left: 1600*baseRatio, ease: eas2, delay: 3300}, missileMove);

      tl.call(function(){
        setScene(2);
      });
      tl.call(function(){
        setScene(3);
      });


      tl.set('#scene2', {opacity: 1, left: 0, delay: 3600}, missileMove);
      tl.set('#switcher', {opacity: 1, left: '100%', delay: 3600}, missileMove);
      tl.set('#switcherAbove', {opacity: 1, left: '100%', delay: 3600}, missileMove);

      tl.to('#scene2', 300, {left: '-100%', delay: 3600}, missileMove);
      tl.to('#switcher', 300, {left: 0, delay: 3600}, missileMove);
      tl.to('#switcherAbove', 300, {left: 0, delay: 3600}, missileMove);

      tl.set('#scene3', {opacity: 1, left: '100%', delay: 3900}, missileMove);

      tl.to('#switcher', 320, {left: '-100%', delay: 3900}, missileMove);
      tl.to('#switcherAbove', 320, {left: '-100%', delay: 3900}, missileMove);
      tl.to('#scene3', 320, {left: 0, delay: 3900}, missileMove);

      tl.set('#spacecraft', {opacity: 1, left: 3000*baseRatio});
      tl.set('#missileCloneMain', {backgroundPosition: '-'+588*baseRatio+'px -'+30*baseRatio+'px'});
      tl.set('#missileCloneFire', {autoAlpha: 1});
      tl.set('#missileClone', {autoAlpha: 1});

      var eas3 = Linear.easeNone,
        missileMove = Bella.createId(30);

      tl.to('#mountain', 3000, {backgroundPosition: '-'+1700*baseRatio+'px 0px', ease: eas3}, missileMove);
      tl.to('#scene3layer6', 3000, {backgroundPosition: '-'+1700*baseRatio+'px 0px', ease: eas3}, missileMove);
      tl.to('#scene3layer7', 3000, {backgroundPosition: '-'+12400*baseRatio+'px 0px', ease: eas3}, missileMove);
      tl.to('#scene3layer8', 3000, {backgroundPosition: '-'+16100*baseRatio+'px 0px', ease: eas3}, missileMove);
      tl.to('#scene3layer8back', 300, {left: '-='+600*baseRatio, ease: eas3}, missileMove);
      tl.to('#scene3layer8front', 300, {left: '-='+600*baseRatio, ease: eas3}, missileMove);

      tl.to('#missileClone', 400, {left: 520*baseRatio, ease: eas3}, missileMove);
      tl.to('#spacecraft', 600, {left: 1150*baseRatio, delay: 2400, ease: eas3}, missileMove);


      // ufo comes and meets the cow
      tl.to('#ufo', 400, {scale: 1.2, bezier:{curviness: 1, values:[{x:600*baseRatio, y:200*baseRatio}, {x:1150*baseRatio, y:0*baseRatio}]}, ease: eas3}, missileMove);
      tl.to('#cow', 400, {left: 1245*baseRatio}, missileMove);

      tl.set('#ufoLight', {autoAlpha: 1, delay: 400}, missileMove);
      tl.set('#ufoAnimal', {autoAlpha: 1, backgroundPosition: '0px -2px', scale: 0.5, left: 81*baseRatio, top: 458*baseRatio, width: 942*baseRatio, height: 590*baseRatio, delay: 400}, missileMove);
      tl.set('#cow', {autoAlpha: 0, delay: 400}, missileMove);
      tl.set('#ufo', {zIndex: 1, opacity: 1, delay: 400}, missileMove);

      tl.to('#ufoAnimal', 200, {top: '-=100', delay: 400}, missileMove);
      tl.to('#ufo', 400, {top: -5000*baseRatio, left: -3000*baseRatio, scale: 8, delay: 400}, missileMove);
      tl.to('#ufo', 300, {top: -12000*baseRatio, left: -4000*baseRatio, scale: 15, delay: 700}, missileMove);

      // reset ufo state
      tl.set('#ufo', {zIndex: 0, opacity: 1, scale: 0.3, left: 900*baseRatio, top: 300*baseRatio, x: 0, y: 0, delay: 1200}, missileMove);
      tl.set('#ufoAnimal', {autoAlpha: 0, backgroundPosition: '-4px -1240px', scale: 0.5, left: 150*baseRatio, top: 525*baseRatio, width: 551*baseRatio, height: 520*baseRatio, delay: 1200}, missileMove);
      tl.set('#ufoLight', {autoAlpha: 0, delay: 1200}, missileMove);
      tl.set('#mountain', {autoAlpha: 1, delay: 1200}, missileMove);


      // trex comes
      tl.to('#trex', 400, {left: 1191*baseRatio, delay: 1200}, missileMove);

      // ufo moves
      tl.to('#ufo', 400, {scale: 1.6, bezier:{curviness: 1, values:[{left:1200*baseRatio, top:200*baseRatio}, {left:1300*baseRatio, top:0*baseRatio}, {left:950*baseRatio, top:-240*baseRatio}]}, ease: eas1, delay: 1200}, missileMove);


      // ufo meets the t-rex
      tl.set('#ufoAnimal', {autoAlpha: 1, delay: 1600}, missileMove);
      tl.set('#ufoLight', {autoAlpha: 1, delay: 1600}, missileMove);
      tl.set('#trex', {autoAlpha: 0, delay: 1600}, missileMove);
      tl.set('#ufo', {zIndex: 1, delay: 1600}, missileMove);

      tl.to('#ufo', 200, {top: -6000*baseRatio, left: -2100*baseRatio, scale: 10, delay: 1600}, missileMove);
      tl.to('#ufo', 300, {top: -14200*baseRatio, left: -5000*baseRatio, scale: 20, delay: 1800}, missileMove);
      tl.to('#ufo', 100, {opacity: 0, top: -19000*baseRatio, left: -7500*baseRatio,  scale: 25, delay: 2100}, missileMove);

      // reset ufo state
      tl.set('#ufo', {zIndex: 1, opacity: 1, scale: 5, left: 100*baseRatio, top: 1200*baseRatio, x: 0, y: 0, delay: 2350}, missileMove);
      tl.set('#ufoAnimal', {autoAlpha: 1, backgroundPosition: '-'+(8*baseRatio)+'px -'+(2324*baseRatio)+'px', scale: 0.5, left: 112*baseRatio, top: 625*baseRatio, width: 778*baseRatio, height: 298*baseRatio, delay: 2350}, missileMove);
      tl.set('#ufoLight', {autoAlpha: 1, delay: 2350}, missileMove);

      // ufo moves
      tl.to('#ufo', 200, {scale: 4, left: -200*baseRatio, top: -2100*baseRatio, delay: 2400}, missileMove);
      tl.to('#ufo', 200, {scale: 1.5, left: 1000*baseRatio, top: -800*baseRatio, delay: 2600}, missileMove);
      tl.to('#ufo', 300, {scale: 0.1, zIndex:0, bezier:{curviness: 1, values:[{left:800*baseRatio, top:-700*baseRatio}, {left:300*baseRatio, top:-400*baseRatio}, {left:-2150*baseRatio, top:-500*baseRatio}]}, delay: 2800}, missileMove);


      tl.to('#missileClone', 30, {left: '+='+50*baseRatio+'px', ease: eas3});
      tl.set('#missileCloneFire', {autoAlpha: 0});
      tl.set('#missileCloneMain', {delay: 4, backgroundPosition: '0px -'+30*baseRatio+'px'}, 'openDoor');
      tl.set('#robotScene3', {opacity: 1, left: '+='+100*baseRatio});

      // robot move to spacecraft door
      tl.set('#robotScene3', {left: '+=0', backgroundPosition: '-'+681*baseRatio+'px '+8*baseRatio+'px', width: 348*baseRatio});
      tl.set('#robotScene3', {left: '+='+20*baseRatio, delay: stepDelay, backgroundPosition: '-'+1040*baseRatio+'px 0px', width: 340*baseRatio});
      tl.set('#robotScene3', {left: '+='+180*baseRatio, delay: stepDelay, backgroundPosition: '-'+1430*baseRatio+'px 0px', width: 310*baseRatio});
      tl.set('#robotScene3', {left: '+='+110*baseRatio, delay: stepDelay, backgroundPosition: '-'+1820*baseRatio+'px 0px', width: 340*baseRatio});
      tl.set('#robotScene3', {left: '+='+20*baseRatio, delay: stepDelay, backgroundPosition: '-'+2170*baseRatio+'px 0px', width: 330*baseRatio});
      tl.set('#robotScene3', {left: '+='+150*baseRatio, delay: stepDelay, backgroundPosition: '0px 0px', width: 240*baseRatio});

      // spacecraftDoor opens
      tl.set('#robotScene3', {opacity: 0, delay: 10});
      tl.to('#spacecraftDoor', 60, {left: '+='+160*baseRatio, skewX: '-8deg', rotationY: '100deg', ease: Power0.easeIn}, 'openDoor');
      tl.set('#spacecraftFully', {opacity: 1});
      tl.to('#spacecraftDoor', 60, {left: '-='+160*baseRatio, skewX: '0deg', rotationY: '0deg', ease: Power0.easeIn, delay: 5});
      tl.set('#spacecraftFully', {opacity: 0}, '-=0.2');

      tl.set('#spacecraft', {backgroundPosition: '-'+536*baseRatio+'px -'+8*baseRatio+'px', width: 260*baseRatio, scale: 2.60, delay: 12});
      tl.set('#spacecraftDoor', {opacity: 0});
      tl.set('#spacecraftFire', {opacity: 1});

      tl.set('#scene3layer3', {autoAlpha: 0, backgroundPosition: '0px 0px'});
      tl.set('#scene3layer4', {backgroundPosition: 'center -'+2000*baseRatio+'px'});
      // spacecraft start
      tl.call(spacecraftFly);
      tl.to('#spacecraft', 40, {top: '-='+30*baseRatio, delay: 4});

      // rooming

      tl.to('#scene3layer2', 600, {backgroundPosition: '0px -'+1600*baseRatio+'px'}, 'roomin');
      tl.to('#scene3layer6', 600, {scale: 1, top: -10*baseRatio, left: '+='+928*baseRatio}, 'roomin');
      tl.to('#scene3layer7', 600, {scale: 0.7, y: '+='+350*baseRatio, width: '+='+900*baseRatio}, 'roomin');
      tl.to('#scene3layer8', 600, {scale: 0.7, y: '+='+350*baseRatio, width: '+=0'}, 'roomin');
      tl.to('#missileClone', 600, {scale: 0.5, left: '-='+110*baseRatio, top: '+='+230*baseRatio}, 'roomin');
      tl.to('#spacecraft', 600, {scale: 1, top: '+='+650*baseRatio, left: '-='+300*baseRatio}, 'roomin');
      tl.set('#spacecraft', {height: 400*baseRatio});

      tl.set('#scene3layer3', {autoAlpha: 0, backgroundPosition: '0px 0px'});
      tl.set('#scene3layer4', {backgroundPosition: 'center -'+2000*baseRatio+'px'});
      // cloud and smoke

      tl.set('#cloudBase', {opacity: 1});
      tl.set('#spacecraftCloud', {opacity: 1});

      // start moving up
      tl.to('#cloudBase', 80, {scale: 0.3, top: 954*baseRatio, left: 786*baseRatio}, 'startMoveUp');
      tl.to('#spacecraft', 80, {top: '-='+200*baseRatio}, 'startMoveUp');

      // spacecraft fly up

      tl.set('#scene3layer3', {autoAlpha: 0, backgroundPosition: '0px 0px'});
      tl.set('#scene3layer4', {backgroundPosition: 'center -'+2000*baseRatio+'px'});
      tl.set('#scene3layer3', {autoAlpha: 1, delay:50}, 'spacecraftUp');

      var eas = Power1.easeInOut;
      tl.to('#scene3layer1', 900, {top: 1125*baseRatio, ease: eas}, 'spacecraftUp');
      tl.to('#scene3layer2', 900, {backgroundPosition: '0px 0px', ease: eas}, 'spacecraftUp');
      tl.to('#scene3layer3', 900, {bezier:{curviness: 1, values:[{x:300*baseRatio, y:400*baseRatio}, {x:0, y:0}, {x:-400*baseRatio, y:-900*baseRatio}]}}, 'spacecraftUp');
      tl.to('#scene3layer4', 900, {backgroundPosition: '0px -'+300*baseRatio+'px', ease: eas}, 'spacecraftUp');
      tl.to('#scene3layer6', 900, {top: 1125*baseRatio, ease: eas}, 'spacecraftUp');
      tl.to('#scene3layer7', 900, {top: 1125*baseRatio, ease: eas}, 'spacecraftUp');
      tl.to('#scene3layer8', 900, {top: 1125*baseRatio, ease: eas}, 'spacecraftUp');
      tl.to('#missileClone', 900, {top: '+='+1125*baseRatio, ease: eas}, 'spacecraftUp');
      tl.to('#spacecraft', 450, {top: '-='+1625*baseRatio, ease: eas, delay: 450}, 'spacecraftUp');
      tl.to('#cloudBase', 900, {scale: 1.4, top: '-='+800*baseRatio, left: '-='+780*baseRatio, ease: eas}, 'spacecraftUp');
      tl.to('#logoAtomic', 480, {autoAlpha: 1, scale: 1.8, top: '-='+250*baseRatio, left: '-='+120*baseRatio, ease: eas, delay: 420}, 'spacecraftUp');

      tl.to('#cloudBase', 360, {scale: 1.9, opacity: 0.3, top: '-='+300*baseRatio, left: '-='+500*baseRatio, ease: eas}, 'lastScene');

    tl.call(function(){
      setScene(3);
    });

    var tt = Math.max(10, wsize.th-(wsize.h-wsize.oh)/2);

    tl.call(function(){
      setScene(4);
    });

    tl.to('#panel', 360, {top: -tt*baseRatio, autoAlpha: 1}, 'displayingForm');
    tl.to('#logoAtomic', 280, {scale: 0.6, bezier:{curviness: 1, values:[{top: 200*baseRatio, left: 1000*baseRatio}, {top: 50*baseRatio, left: -550*baseRatio}]}, ease: eas}, 'displayingForm');
    tl.to('#cloudBase', 280, {scale: 2.4, opacity: 0, top: '-='+300*baseRatio, left: '-='+500*baseRatio, ease: eas}, 'displayingForm');

    tl.call(function(){
      setScene(4);
    });

    //tl.progress(0.6);
    //tl.play();
  }


  // helpers
  var s1timer1, s1timer2;
  var missileRunTimer;
  var floatableScene3;

  function animScene1Start(){
    var ranLights = Bella.dom.all('.ran-light');
    var baseRatio = app.getBaseRatio();
    var boardSize = app.getBoardSize();
    var arr1 = [
      [-70, 246, 301],
      [-60, 238, 300],
      [-50, 230, 302],
      [-40, 222, 306],
      [-30, 215, 310],
      [-20, 210, 315],
      [-10, 204, 322],
      [0, 200, 330],
      [10, 197, 338],
      [20, 197, 346],
      [30, 197, 355],
      [40, 198, 362],
      [50, 199, 371],
      [60, 205, 377],
      [70, 211, 382]
    ];
    var arr2 = [
      [-70, 329, 285],
      [-60, 322, 288],
      [-50, 314, 291],
      [-40, 306, 296],
      [-30, 301, 302],
      [-20, 296, 310],
      [-10, 292, 317],
      [0, 289, 326],
      [10, 290, 334],
      [20, 290, 342],
      [30, 292, 350],
      [40, 296, 358],
      [50, 300, 365],
      [60, 306, 371],
      [70, 313, 375]
    ];
    var m1 = arr1.length, m2 = arr2.length;
    var l1 = 0, l2 = 0, b1 = 0, b2 = 0;
    var a=5*baseRatio, b=20*baseRatio, c = 0, t = 0;
    var f1  = function(){
      if(s1timer1){
        clearTimeout(s1timer1);
      }
      c++;
      t++;
      a+=5;
      b+=2;
      b1++;
      b2++;
      if(t==45){
        t = 0;
        a = 10*baseRatio;
        b = 22*baseRatio;
      }

      TweenLite.set('#com1', {backgroundPosition: '0px -'+a*baseRatio+'px'});
      TweenLite.set('#com2', {backgroundPosition: '0px -'+b*baseRatio+'px'});

      l1=b1+Math.round(Math.random()*(m1-1));
      l2=b2+Math.round(Math.random()*(m2-1));
      if(l1>=m1){
        l1=7;
        b1 = Math.round(Math.random()*m1);
      }
      if(l2>=m2){
        l2=7;
        b2 = Math.round(Math.random()*m2);
      }

      var ox = baseRatio, ow = boardSize.width;

      var c1 = arr1[l1] || false;
      var c2 = arr2[l2] || false;
      if(!!c1){
        TweenLite.set('#needle1', {rotationZ: c1[0]+'deg', top: c1[1]*ox, left: c1[2]*ox});
      }
      else{
        console.log(l1);
      }
      if(!!c2){
        TweenLite.set('#needle2', {rotationZ: c2[0]+'deg', top: c2[1]*ox, left: c2[2]*ox});
      }
      else{
        console.log(l2);
      }

      if(!!c1 && !!c2){
        var o1 = c1[0], o2 = c2[0];
        if(o1*o2>0){
          $clearLight.removeClass('off');
          $dimLight.addClass('off');
        }
        else if(o1*o2<0){
          $clearLight.addClass('off');
          $dimLight.removeClass('off');
        }
      }
      s1timer1 = setTimeout(f1, 300);
    }
    f1();

    var lights = [], k = -1;
    if(ranLights.length>0){
      ranLights.forEach(function(el){
        lights.push({
          el: el,
          isOn: false,
          turnOn: function(){
            this.el.removeClass('off');
            this.isOn = true;
          },
          turnOff: function(){
            this.el.addClass('off');
            this.isOn = false;
          }
        });
      });

      var h = lights.length;
      var f2 = function(){
        if(s1timer2){
          clearTimeout(s1timer2);
        }
        var m = k-1, n = k+1;
        var l1, l2;

        if(n>h){
          n=0;
        }

        l1=lights[m];
        l2=lights[n];

        if(!!l1&&!!l1.isOn){
          l1.turnOff();
        }
        if(!!l2&&!l2.isOn){
          l2.turnOn();
        }

        k=n;
        s1timer2 = setTimeout(f2, 500);
      }
      f2();
    }
  }

  function animScene1Stop(){
    if(s1timer1){
      clearTimeout(s1timer1);
    }
    if(s1timer2){
      clearTimeout(s1timer2);
    }
  }


  var Sky = {
    flights : [],
    clouds : [],
    timer : null,
    makeFlight : function(pos){
      var ran = Math.random;
      var k = Math.round(ran()*14);
      if(k>=0&&k<=14){
        var sk = this.container;
        var d = Bella.dom.add('DIV', sk);
        d.addClass('flight flight-'+k);

        var wide = d.offsetWidth;
        var maxWidth = presentation.offsetWidth;
        var maxHeight = presentation.offsetHeight/4;

        var boardSize = app.getBoardSize();

        var ob = {
          id: Bella.createId(32),
          el: d,
          direction: -1, // -1 = left to right, 1 = right to left
          x: 0,
          y:0,
          wide: wide,
          speed: ran()*100+200,
          type : 'flight'
        }
        if(!!pos){
          ob.x = pos.x;
          ob.y = pos.y;
        }
        else{
          ob.x = ran()*20+maxWidth;
          ob.y = ran()*maxHeight;
        }

        if(k%2===0){
          ob.direction = 1;
          ob.endX = -1*(wide+10);
        }
        else{
          ob.x=-1*(d.offsetWidth+10);
          ob.endX = boardSize.width+wide+10;
        }
        TweenLite.set(d, {top: ob.y, left: ob.x});

        Sky.flights.push(ob);

        TweenLite.to(d, ob.speed, {left: ob.endX, onComplete: function(){
          Sky.remove(ob);
        }});

        return ob;
      }
      return false;
    },
    makeCloud : function(pos){
      var ran = Math.random;
      var k = Math.round(ran()*4);
      var sk = this.container;
      var d = Bella.dom.add('DIV', sk);
      d.addClass('cloud cloud-'+k);

      var wide = d.offsetWidth;
      var maxWidth = presentation.offsetWidth;
      var maxHeight = presentation.offsetHeight/6;
      var ob = {
        id: Bella.createId(32),
        el: d,
        direction: 1,
        x: 0,
        y:0,
        wide: wide,
        speed: ran()*100+200,
        type : 'cloud'
      }
      if(!!pos){
        ob.x = pos.x;
        ob.y = pos.y;
      }
      else{
        ob.x = ran()*20+(maxWidth+5);
        ob.y = ran()*maxHeight;
      }
      ob.endX = -1*(wide+20);

      TweenLite.set(d, {top: ob.y, left: ob.x});

      Sky.clouds.push(ob);

      TweenLite.to(d, ob.speed, {top: ob.y, left: ob.endX, onComplete: function(){
        Sky.remove(ob);
      }});

      return ob;
    },
    remove : function(ob){
      var id = ob.id, type = ob.type, el = ob.el;
      if(type=='cloud'){
        var ls = Sky.clouds;
        for(var i=ls.length-1;i>=0;i--){
          if(ls[i].id==id){
            Sky.clouds.splice(i, 1);
                        el.remove();
            break;
          }
        }
      }
      else if(type=='flight'){
        var ls = Sky.flights;
        for(var i=ls.length-1;i>=0;i--){
          if(ls[i].id==id){
            Sky.flights.splice(i, 1);
                        el.remove();
            break;
          }
        }
      }
    },
    init : function(){
      Sky.stop();
      var ran = Math.random;
      var num = Math.round(ran()*3)+5;
      var maxWidth = presentation.offsetWidth;
      var maxHeight = presentation.offsetHeight/3;
      var x1 = ran()*(maxWidth/4), x2 = ran()*(maxWidth/4);
      for(var i=0;i<num;i++){
        if(i%2==0){
          x1+=ran()*(maxWidth/4)+(i*100);
          var y1 = ran()*maxHeight;
          Sky.makeCloud({x: x1, y: y1});
        }
        else{
          x2+=ran()*(maxWidth/4)+(i*100);
          var y2 = ran()*maxHeight+ran()*100;
          Sky.makeFlight({x: x2, y: y2});
        }
      }
      Sky.timer = setInterval(Sky.update, 3e4);
    },
    update : function(){
      var boardSize = app.getBoardSize();
      var ls1 = Sky.flights;
      var ls2 = Sky.clouds;

      var fViewable = 0;
      for(var i=ls1.length-1;i>=0;i--){
        var flight = ls1[i];
        var x = flight.el.offsetLeft;
        if(x>0 && x<boardSize.width){
          fViewable++;
        }
      }

      var cViewable = 0;
      for(var i=ls2.length-1;i>=0;i--){
        var cloud = ls2[i];
        var x = cloud.el.offsetLeft;
        if(x>0 && x<boardSize.width){
          cViewable++;
        }
      }
      if(fViewable<4){
        Sky.makeFlight();
      }
      if(cViewable<3){
        Sky.makeCloud();
      }
    },
    stop : function(){
      if(!!Sky.timer){
        clearInterval(Sky.timer);
      }
    }
  }

  function missileRun(){
    var mf = Bella.dom.all('.missile-fire');
    var ob = Bella.dom.all('.missile-main');
    if(!!missileRunTimer){
      clearInterval(missileRunTimer);
    }

    var t = 0;
    missileRunTimer = setInterval(function(){

      var baseRatio = app.getBaseRatio();
      var k = Math.random()+0.4;

      t++;
      if(t>=3){
        t = 0;
      }
      if(t==1){
        TweenLite.set(mf, {backgroundPosition: '-'+260*baseRatio+'px 0px'});
      }
      else if(t==2){
        TweenLite.set(mf, {backgroundPosition: '-'+517*baseRatio+'px 0px'});
      }
      else{
        TweenLite.set(mf, {backgroundPosition: '0px 0px'});
      }

      var slic = 0;
      if(k>0.75){
        slic-=3*k;
      }
      else if(k<0.75){
        slic+=3*k;
      }
      slic+=k;
      TweenLite.to(ob, 2, {y: slic*baseRatio});
      TweenLite.to(mf, 2, {y: slic*baseRatio});
    }, 200);
  }

  function stopRunningMissile(){
    if(!!missileRunTimer){
      clearInterval(missileRunTimer);
      var mf = Bella.dom.all('.missile-fire');
      var ob = Bella.dom.all('.missile-main');
      TweenLite.to(ob, 2, {y: 0});
      TweenLite.to(mf, 2, {y: 0});
    }
  }

  function spacecraftFly(){
    var baseRatio = app.getBaseRatio();
    if(!!_nested){
      _nested.kill();
    }
    var k = Math.random()/10;
    _nested = new TimelineMax({repeat: -1, yoyo: true});
    _nested.set('#spacecraftFire', {backgroundPosition: '-'+959*baseRatio+'px -'+29*baseRatio+'px', delay: k});
    _nested.set('#spacecraftFire', {backgroundPosition: '-'+1056*baseRatio+'px -'+29*baseRatio+'px', delay: k});
    _nested.set('#spacecraftFire', {backgroundPosition: '-'+863*baseRatio+'px -'+29*baseRatio+'px', delay: k});
  }

  function moveScene1Layers(e){
    var mp = Bella.getMousePosition(e);
    var ms = Bella.getWindowSize();
    var me = ms.w/2, my = ms.h/2;
    var x = mp.x, y = mp.y;
    var offset = x-me, oy = y-my;
    var t = offset/me, ty = oy/my;

    var baseRatio = app.getBaseRatio();
    var cross = -132*baseRatio;

    TweenLite.to('#layer2Scene1', 1, {backgroundPosition: (cross+offset/15)+'px 0px'});
    TweenLite.to('#layer3Scene1', 1, {backgroundPosition: (cross+offset/25)+'px 0px'});
    TweenLite.to('#layer4Scene1', 1, {backgroundPosition: (cross+offset/35)+'px 0px'});
    TweenLite.to('#layer7Scene1', 1, {backgroundPosition: (cross-offset/40)+'px 0px'});

    if(!!floatableScene3){
      TweenLite.to('#scene3layer3', 3, {backgroundPosition: (offset/20)+'px 0px'});
      TweenLite.to('#scene3layer4', 3, {backgroundPosition: (offset/10)+'px 0px'});
    }
  }

  function animScene4Start(){
    floatableScene3 = true;
  }
  function animScene4Stop(){
    floatableScene3 = false;
  }

  function loadPanelContent(section){
    var s = app.getPanelData(section);
    Bella.element('panelContent').innerHTML = s;
    _panelScroll.refresh();
    return s;
  }

  function activateMenuItem(el, section){
    resetMenuItem(section);
    el.addClass('active');
    loadPanelContent(section);
  }

  function resetMenuItem(active){
    Bella.dom.all('.btn-panel').forEach(function(el){
      var section = el.getAttribute('section');
      if(section!=active){
        el.removeClass('active');
      }
    });
  }

  function getDefaultSection(){
    if(!!_defaultSection){
      return _defaultSection;
    }
    var ls = Bella.dom.all('.btn-panel');
    return ls[0].getAttribute('section');
  }

  function loadPanel(){
    var hasDone, ls = Bella.dom.all('.btn-panel');
    for(var i=0;i<ls.length;i++){
      var el = ls[i];
      if(el.hasClass('active')){
        hasDone = true;
        break;
      }
    }
    if(!hasDone){
      for(var i=0;i<ls.length;i++){
        var el = ls[i], t = el.getAttribute('isDefault');
        if(!!t){
          hasDone = true;
          var sec = el.getAttribute('section');
          activateMenuItem(el, sec);
          break;
        }
      }
    }
    if(!hasDone){
      var el = ls[0], sec = el.getAttribute('section');
      activateMenuItem(el, sec);
    }
  }

  function _scrollTo(p, delay){
    var el = $wrapper;
    var x = el.scrollTop;
    var h = el.scrollHeight;
    var o = el.offsetHeight;
    var g = h-o;
    TweenLite.to(el, delay, {scrollTop: p*g});
  }

  function moveTo(k){
    if(!!Timeline){
      var p = Breaks[k];
      _scrollTo(p, Math.abs(k-_scene));
    }
  }

  // output
  function init(container){

    $wrapper = Bella.element('wrapper');

    $clearLight = Bella.element('clearLight');
    $dimLight = Bella.element('dimLight');

    $freeFight = Bella.element('freeFight');

    Sky.container = $freeFight;

    container.onscroll = function(e){
      if(!_automatic){
        var x = this.scrollTop;
        var h = this.scrollHeight;
        var ws = Bella.getWindowSize(), o = ws.h;
        var size = h-o;
        var percent = x*100/size;
        if(percent<0){
          percent = 0;
        }
        if(percent>100){
          percent = 100;
        }
        onScroll(percent, 1);
      }
    }

    var ws = Bella.getWindowSize();
    var oh = 580;
    var th = 220;
    if(ws.h>900){
      oh = 780;
      th = 245;
    }
    else if(ws.h<600){
      oh = 490;
      th = 200;
    }
    ws.oh = oh;
    ws.th = th;

    makeScenario(ws);

    _panelScroll = new IScroll('#panelScroller', {
      scrollbars: 'custom',
      mouseWheel: true,
      interactiveScrollbars: true,
      shrinkScrollbars: 'scale',
      fadeScrollbars: true
    });

    Bella.dom.all('.btn-panel').forEach(function(el){
      var ids = el.getAttribute('isDefault');
      if(!!ids){
        _defaultSection = el.getAttribute('section');
      }
      el.click(function(){
        if(!el.hasClass('active')){
          var section = el.getAttribute('section');
          activateMenuItem(el, section);
        }
      });
    });

    Bella.event.listen(document, 'mousemove', moveScene1Layers);

    if(window['Mousetrap']){
      Mousetrap.bind('a t o m i c', function(e){
        Bella.event.exit(e);
        if(!!Timeline && !_automatic){
          Timeline.progress(_progress || 0);
          Timeline.timeScale(60);
          Timeline.play();
          _automatic = true;
        }
      });

      var stop = function(e){
        Bella.event.exit(e);
        if(!!Timeline && !!_automatic){
          Timeline.pause();
          Timeline.timeScale(TIMESCALE);
          _progress = Timeline.progress();
          _automatic = false;
        }
      }

      Mousetrap.bind('s t o p', stop);

      Bella.event.listen(document, 'click', stop);
    }

    moveTo(1);
    Timeline.progress(_progress || 0);
    Timeline.timeScale(90);
    Timeline.play();
    _automatic = true;
  }

  var P = {
    init : init,
    scrollTo : moveTo,
    makeScenario : makeScenario
  }

  window['Presenter'] = P;

})();
