$(function() {
    // 轮播
    bannerRotate.bannerInit();
});

//官网查询的兼容代码段
// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.io/#x15.4.4.18
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(callback /*, thisArg*/ ) {

        var T, k;

        if (this == null) {
            throw new TypeError('this is null or not defined');
        }

        // 1. Let O be the result of calling toObject() passing the
        // |this| value as the argument.
        var O = Object(this);

        // 2. Let lenValue be the result of calling the Get() internal
        // method of O with the argument "length".
        // 3. Let len be toUint32(lenValue).
        var len = O.length >>> 0;

        // 4. If isCallable(callback) is false, throw a TypeError exception. 
        // See: http://es5.github.com/#x9.11
        if (typeof callback !== 'function') {
            throw new TypeError(callback + ' is not a function');
        }

        // 5. If thisArg was supplied, let T be thisArg; else let
        // T be undefined.
        if (arguments.length > 1) {
            T = arguments[1];
        }

        // 6. Let k be 0.
        k = 0;

        // 7. Repeat while k < len.
        while (k < len) {

            var kValue;

            // a. Let Pk be ToString(k).
            //    This is implicit for LHS operands of the in operator.
            // b. Let kPresent be the result of calling the HasProperty
            //    internal method of O with argument Pk.
            //    This step can be combined with c.
            // c. If kPresent is true, then
            if (k in O) {

                // i. Let kValue be the result of calling the Get internal
                // method of O with argument Pk.
                kValue = O[k];

                // ii. Call the Call internal method of callback with T as
                // the this value and argument list containing kValue, k, and O.
                callback.call(T, kValue, k, O);
            }
            // d. Increase k by 1.
            k++;
        }
        // 8. return undefined.
    };
}
/*
 * 添加事件处理程序
 * @param object object 要添加事件处理程序的元素
 * @param string type 事件名称，如click
 * @param function handler 事件处理程序，可以直接以匿名函数的形式给定，或者给一个已经定义的函数名。匿名函数方式给定的事件处理程序在IE6 IE7 IE8中可以移除，在标准浏览器中无法移除。
 * @param boolean remove 是否是移除的事件，本参数是为简化下面的removeEvent函数而写的，对添加事件处理程序不起任何作用
 */
function addEvent(object, type, handler, remove) {
    if (typeof object != 'object' || typeof handler != 'function') return;
    try {
        object[remove ? 'removeEventListener' : 'addEventListener'](type, handler, false);
    } catch (e) {
        var xc = '_' + type;
        object[xc] = object[xc] || [];
        if (remove) {
            var l = object[xc].length;
            for (var i = 0; i < l; i++) {
                if (object[xc][i].toString() === handler.toString()) object[xc].splice(i, 1);
            }
        } else {
            var l = object[xc].length;
            var exists = false;
            for (var i = 0; i < l; i++) {
                if (object[xc][i].toString() === handler.toString()) exists = true;
            }
            if (!exists) object[xc].push(handler);
        }
        object['on' + type] = function() {
            var l = object[xc].length;
            for (var i = 0; i < l; i++) {
                object[xc][i].apply(object, arguments);
            }
        }
    }
}
/*
 * 移除事件处理程序
 */
function removeEvent(object, type, handler) {
    addEvent(object, type, handler, true);
}

// banner rotating
var bannerRotate = {
    _time: 5000,
    _fade: 200,
    _i: 0,
    _interval: null,
    _navId: "#mb-inav",
    _navBox: "#mb-ibox",
    _navTxt: "#mb-itxt",
    bannerShow: function() {
        $(this._navId).find("li .item-li").removeClass("cur");
        $(this._navId).find("li:eq(" + this._i + ")").find(".item-li").addClass("cur");

        //$(this._navBox).find("a").hide();
        $(this._navBox).find("a:eq(" + this._i + ")").fadeIn(this._fade);

        $(this._navBox).find("a").removeClass("move");
        $(this._navBox).find("a[class='cur']").removeClass("cur").addClass("move");

        $(this._navBox).find("a:eq(" + this._i + ")").removeClass("move").addClass("cur");
        $(this._navTxt).find(".slide-itxt").hide();
        $(this._navTxt).find(".slide-itxt:eq(" + this._i + ")").fadeIn(this._fade);
    },
    bannerStart: function() {
        var _this = this;
        _this._interval = setInterval(function() {
            if (_this._i >= $(_this._navId).children().length - 1) {
                _this._i = 0;
            } else {
                _this._i++;
            }
            _this.bannerShow();
        }, _this._time);
    },
    bannerInit: function() {
        var _this = this;
        _this.bannerStart();
        $(_this._navId).find("li .item-li").bind("click", function() {
            if ($(this).hasClass("cur")) {
                return;
            }
            clearInterval(_this._interval);
            _this._i = $(this).parent().index();
            _this.bannerShow();
            _this.bannerStart();
        });
    }
};