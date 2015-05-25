/**
 * Модуль для кроссбраузерной подписки на DOM события
 * - Современные браузеры - addEventListener/removeEventListener
 * - IE8 - attachEvent/detachEvent
 *
 * Пример использования:
 * var func = function() { alert('Ничоси');
 * addEvent(elem, 'click', func});
 * removeEvent(elem, 'click', func });
 */

var isSupportModernEvent = !!document.addEventListener;

module.exports = {
    /**
     * Подписка на DOM событие
     * @param elem {HTMLElement} - DOM нода (document.getElementBy ...)
     * @param type {Object} - тип события (click, mouseout, focus, ...)
     * @param handler {Function} - обработчик события
     */
    addEvent: function (elem, type, handler) {
        return isSupportModernEvent ?
            elem.addEventListener(type, handler, false) :
                elem.attachEvent('on' + type, handler);
    },

    /**
     * Отписка от DOM события
     * @param elem {HTMLElement} - DOM нода (document.getElementBy ...)
     * @param type {Object} - тип события (click, mouseout, focus, ...)
     * @param handler {Function} - обработчик события
     */
    removeEvent: function (elem, type, handler) {
        return isSupportModernEvent ?
            elem.removeEventListener(type, handler, false) :
            elem.detachEvent('on' + type, handler);
    },

    domReady: function (handler) {
        return isSupportModernEvent ?
            document.addEventListener('DOMContentLoaded', handler, false) :
                document.attachEvent('onreadystatechange', handler);
    }
};
