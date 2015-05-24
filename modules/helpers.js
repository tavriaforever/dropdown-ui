function polyfillGetElementsByClassName() {
    if ( !document.getElementsByClassName ) {
        document.getElementsByClassName = function(cl, tag) {
            var els, matches = [],
                i = 0, len,
                regex = new RegExp('(?:\\s|^)' + cl + '(?:\\s|$)');

            // Если не задано имен тегов,
            // мы будем получать все элементы из DOM
            els = document.getElementsByTagName(tag || "*");
            if ( !els[0] ) return false;

            for ( len = els.length; i < len; i++ ) {
                if ( els[i].className.match(regex) ) {
                    matches.push( els[i]);
                }
            }
            return matches; // массив элементов, которые имеют определённое имя класса
        };
    }
}

function bind(func, context /*, args*/) {
    var bindArgs = [].slice.call(arguments, 2);
    function wrapper() {
        var args = [].slice.call(arguments);
        var unshiftArgs = bindArgs.concat(args);
        return func.apply(context, unshiftArgs);
    }
    return wrapper;
}

module.exports = {
    init: function () {
        polyfillGetElementsByClassName();
    },

    $: function(el, tag) {
        var firstChar = el.charAt(0);

        if ( document.querySelectorAll ) return document.querySelectorAll(el);

        switch ( firstChar ) {
            case "#":
                return document.getElementById( el.slice(1) );
            case ".":
                return document.getElementsByClassName( el.slice(1), tag );
            default:
                return document.getElementsByTagName(el);
        }
    },

    on: function (el, type, fn) {
        var addEvent = (function () {
            var filter = function(el, type, fn) {
                for ( var i = 0, len = el.length; i < len; i++ ) {
                    addEvent(el[i], type, fn);
                }
            };
            if ( document.addEventListener ) {
                return function (el, type, fn) {
                    if ( el && el.nodeName || el === window ) {
                        el.addEventListener(type, fn, false);
                    } else if (el && el.length) {
                        filter(el, type, fn);
                    }
                };
            }

            return function (el, type, fn) {
                if ( el && el.nodeName || el === window ) {
                    el.attachEvent('on' + type, function () { return fn.call(el, window.event); });
                } else if ( el && el.length ) {
                    filter(el, type, fn);
                }
            };
        })();
    },

    un: function () {

    }
};


// Очень простая реализация. Проверяем id, класс и имя тега.
var $ = function(el, tag) {
    var firstChar = el.charAt(0);

    if ( document.querySelectorAll ) return document.querySelectorAll(el);

    switch ( firstChar ) {
        case "#":
            return document.getElementById( el.slice(1) );
        case ".":
            return document.getElementsByClassName( el.slice(1), tag );
        default:
            return document.getElementsByTagName(el);
    }
};
