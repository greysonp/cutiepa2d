this.cutie = this.cutie || {};
this.cutie.Behavior = this.cutie.Behavior || {};

/**
 * @submodule Behavior
 */
(function(module){
    /**
     * This behavior allows an object to shoot projectiles.
     * @class Shoot
     * @extends Behavior
     * @constructor
     * @param {Object} props The properties being passed in.
     * @param {Object} props.bullet The object to render on a fire.
     * @param {Number} [props.speed=300] The speed of fired bullets in px/s.
     * @param {Number} [props.max=100] The maximum number of bullets before they are recycled. (0) indicates 
     *                                 no recycling (bullets last forever).
     * @param {Number} [props.duration=0] The maximum bullet's lifetime before it get's removed. (0) indicates infinite.
     * @param {Object[]} [props.origin] The x and y position from which to fire the bullet, relative to an unrotated 
     *                                  object object's x and y position.
     * @param {Number} [props.angleOffset=90] This is the orientation where 90 is straight up, the zero point is the 
     *                                        cartesian positive x axis and degrees rotate counter-clockwise up from this x axis.
     * @param {Number} [props.fireKey=SPACE] The keycode to be used for firing.
     * @param {Number} [props.delay=0] The delay in seconds between shots.
     * @param {Boolean} [props.useMouse=true] If set to true, use a mouse click to fire. If false the key will be set to fireKey.
     * @param {Boolean} [props.fireContinuous=false] If set, firing will be continuous while key/mouse is pressed.
     * @param {Number} [props.fireRate=5] Number of bullets to fire per second. Used only if fireContinuous is set to true. 
     *                                    Default is 5.
     */
    var Shoot = function(props) {
        // ================================================
        // VARIABLE DECLARATIONS
        // ================================================
        var props = props || {};
        var _bullet = props.bullet || new module.BitmapText('none');
        var _key = props.fireKey || cutie.KeyCodes.SPACE;
        var _rate = 1/props.fireRate || 1/5; //seconds per bullet
        var _origin = props.origin ? new cutie.Vector(props.origin.x, props.origin.y) : new cutie.Vector(0, 0);

        var _angOffset = ('angleOffset' in props)?props.angleOffset:90;
        var _delay = ('delay' in props)? props.delay:0;
        var _speed = ('speed' in props)? props.speed:300;
        var _max = ('max' in props)? props.max:10;
        var _useMouse = ('useMouse' in props)? props.useMouse:true;
        var _cont = ('fireContinuous' in props)? props.fireContinuous:false;

        var _fired = false;
        var _pressTime = 0;
        var _firePressed = false;
        var _bullets = [];
        var _bulletPool = [];
        var _scene = cutie.getActiveScene(); //needed to add bullets, consider replacing with a factory
        var _stage = cutie.getStage();

        // ================================================
        // PUBLIC METHODS
        // ================================================
        this.init = function(obj) {
            if(_useMouse) {
                document.addEventListener('mousedown', mouseDown, false);
                document.addEventListener('mouseup', mouseUp, false);
            }
            else {
                document.addEventListener('keydown', keyPress, false);
                document.addEventListener('keyup', keyRelease, false);
            }

            obj.getBullets = getBullets;
        };

        this.clean = function(obj) {
            obj.getBullets = null;
        };

        this.tick = function(obj, e) {
            var time = e.delta/1000;

            updateBullets(time);

            if(_firePressed) {
                if(_cont) {
                    _pressTime += time;
                    while(_pressTime > 0) {
                        _pressTime -= _rate;
                        addBullet(obj);
                    }
                }
                else if(!_fired) {
                    _fired = true;
                    addBullet(obj);
                }
            }
        };

        // ================================================
        // PRIVATE METHODS
        // ================================================
        function mouseDown(e) {
            _firePressed = true;
            _pressTime = 0;
        }

        function mouseUp(e) {
            _firePressed = false;
            _fired = false;
        }

        function keyPress(e) {
            if(e.which == _key && !_firePressed) {
                _firePressed = true;
                _pressTime = 0;
            }
        }

        function keyRelease(e) {
            if(e.which == _key) {
                _firePressed = false;
                _fired = false;
            }
        }

        function getBullets() {
            return _bullets;
        }

        function addBullet(obj) {
            if(_max !== 0 && _bullets.length >= _max) {
                removeBullet(_bullets[0]);
                _bullets.splice(0, 1);
            }

            var rotation = (obj.rotation - _angOffset)*Math.PI/180;

            var nb;
            if(_bulletPool.length > 0) {
                nb = _bulletPool[0]; //first bullet to recycle
                _bulletPool.splice(0, 1); //remove first
                nb.obj.x = obj.x;
                nb.obj.y = obj.y;
                nb.obj.rotation = obj.rotation;
                nb.pos = _origin.rotate(obj.rotation).add(new cutie.Vector(obj.x, obj.y));
                nb.dir = new cutie.Vector(_speed*Math.cos(rotation), _speed*Math.sin(rotation));
            }
            else {
                var clone = _bullet.clone();
                clone.x = obj.x;
                clone.y = obj.y;
                clone.rotation = obj.rotation;
                clone.regX = clone.image.width/2;
                nb = {
                    "obj": clone, 
                    "pos": _origin.rotate(obj.rotation).add(new cutie.Vector(obj.x, obj.y)), 
                    "dir": new cutie.Vector(_speed*Math.cos(rotation), _speed*Math.sin(rotation))
                };
                clone.regY = clone.image.height/2;
            }
            _bullets.push(nb);
            _scene.addChild(nb.obj);
        }

        function updateBullets(time) {
            var _stageWidth = _stage.canvas.width;
            var _stageHeight = _stage.canvas.height;
            var i = _bullets.length;
            while(--i >= 0) {
                var b = _bullets[i];
                b.pos = b.pos.add(b.dir.scale(time));
                if((b.pos.x + b.obj.image.width/2) < 0 || (b.pos.x - b.obj.image.width/2) > _stageWidth || (b.pos.y + b.obj.image.height/2) < 0 || (b.pos.y - b.obj.image.height/2) > _stageHeight) {
                    removeBullet(_bullets[i]);
                    _bullets.splice(i, 1);
                }

                b.obj.x = b.pos.x;
                b.obj.y = b.pos.y;
            }
        }

        function removeBullet(bullet) {
            _bulletPool.push(bullet);
            _scene.removeChild(bullet.obj);
        }

    };

    module.Shoot = Shoot;
})(this.cutie.Behavior);