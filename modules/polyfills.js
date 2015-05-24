// indexOf IE8-
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(str /*, from*/) {
        var length = this.length >>> 0,
            from = Number(arguments[1]) || 0;

        from = (from < 0) ? Math.ceil(from) : Math.floor(from);

        if (from < 0) {
            from += length;
        }

        for (; from < length; from++) {
            if (from in this && this[from] === str) {
                return from;
            }
        }

        return -1;
    };
}

// isArray
if (!Array.isArray) {
    Array.isArray = function(arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };
}

// forEach
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(callback){
        for (var i = 0; i < this.length; i++){
            callback.apply(this, [this[i], i, this]);
        }
    };
}

// filter
if (!Array.prototype.filter) {
    Array.prototype.filter = function(callback/*, thisArg*/) {
        if (this === void 0 || this === null) {
            throw new TypeError();
        }

        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof callback !== 'function') {
            throw new TypeError();
        }

        var res = [];
        var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
        for (var i = 0; i < len; i++) {
            if (i in t) {
                var val = t[i];
                if (callback.call(thisArg, val, i, t)) {
                    res.push(val);
                }
            }
        }

        return res;
    };
}

// textContent
if (Object.defineProperty
        && Object.getOwnPropertyDescriptor
            && Object.getOwnPropertyDescriptor(Element.prototype, 'textContent')
                && !Object.getOwnPropertyDescriptor(Element.prototype, 'textContent').get) {
    (function() {
        var innerText = Object.getOwnPropertyDescriptor(Element.prototype, 'innerText');
        Object.defineProperty(Element.prototype, 'textContent',
            {
                get: function() {
                    return innerText.get.call(this);
                },
                set: function(s) {
                    return innerText.set.call(this, s);
                }
            }
        );
    })();
}



