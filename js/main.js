/* **************** POLYFILL FOR NEW FUNCTION requestAnimationFrame ****************** */
;(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

/* **************** MAIN CODE ****************** */
$(window).on('load', function(){
/* **************** CONSTRUCTOR FOR SPRITESHEET ANIMATION ****************** */
	function SpriteSheet($elem, path, framesPerRow, framesPerColumn, totalFrames) {

		var image = new Image(),
				frameWidth,
				frameHeight,
				x = 0,// horizontal step
				y = 0,//vertical step
				endFrame = false,
				pause = false,
				counter = 1;// keep track of frame

		image.src = path;

		frameWidth = Math.floor(image.width / framesPerRow);
		frameHeight = Math.floor(image.height / framesPerColumn);

		$elem.width(frameWidth);// set sizes on html
		$elem.height(frameHeight);// set sizes on html

		$elem.hover(function () {
			pause = true;
		},function () {
			pause = false;
		});

		this.nextStep = function () {
			counter++;

			if ( Math.abs(x) < frameWidth * (framesPerRow - 1) ) {
				x -= frameWidth;
			} else {
				x = 0;
				y -= frameHeight;
			}

			if ( counter === totalFrames ) {
				endFrame = true;
			}

		}

		this.prevStep = function () {
			counter--;

			if ( x === 0 ) {
				x = -frameWidth * (framesPerRow - 1);
				y += frameHeight;
			} else {
				x += frameWidth;
			}

			if ( counter === 1 ) {
				endFrame = false;
			}

		}

		this.doAnimation = function () {
			if ( !pause ) {
				this.changeBgPosition();
			}
		}

		this.changeBgPosition = function () {
			if ( endFrame === false ) {
				this.nextStep();
			} else {
				this.prevStep();
			}

			$elem.css({'background-position': x + 'px' + ' ' + y +'px'});
		}

	}

//create animation elements
	var elem1 = new SpriteSheet( $('#anim-item_1'), './img/sprite1.png', 6, 8, 43);
	var elem2 = new SpriteSheet( $('#anim-item_2'), './img/sprite2.png', 7, 8, 55);
	var elem3 = new SpriteSheet( $('#anim-item_3'), './img/sprite3.png', 6, 8, 47);
	var elem4 = new SpriteSheet( $('#anim-item_4'), './img/sprite4.png', 11, 12, 129);

//launch animation
	function animate() {
		requestAnimationFrame( animate );
		elem1.doAnimation();
		elem2.doAnimation();
		elem3.doAnimation();
		elem4.doAnimation();
	}

	animate();


});
