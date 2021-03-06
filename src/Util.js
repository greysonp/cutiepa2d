this.cutie = this.cutie || {};

/**
 * @module cutie
 * @class Util
 * @static
 */
(function(module) {
    var Util = {};

    /**
     * Finds the distance between two points.
     * @memberof cutie.Util
     * @method distance
     * @public
     * @static
     * @param  {Object} obj1 An object with properties x and y. This includes DisplayObjects.
     * @param  {Object} obj2 An object with properties x and y. This includes DisplayObjects.
     * @return {Number}      The distance between the two points.
     */
    Util.distance = function(obj1, obj2) {
        var dx = obj1.x - obj2.x;
        var dy = obj1.y - obj2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Finds the angle between two points.
     * @memberof cutie.Util
     * @method angle
     * @public
     * @static
     * @param  {Object} obj1 An object with properties x and y. This includes DisplayObjects.
     * @param  {Object} obj2 An object with properties x and y. This includes DisplayObjects.
     * @return {Number}      The angle made between the two points.
     */
    Util.angle = function(obj1, obj2) {
        var dx = obj1.x - obj2.x;
        var dy = obj1.y - obj2.y;
        return Math.atan2(dy, dx);
    }

    module.Util = Util;
})(this.cutie);