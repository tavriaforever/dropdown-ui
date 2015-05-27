/**
 * Модуль для кроссбраузерной работой с css классами html элементов
 * Для современных браузеров использует ClassList API, для старых полифилы
 * @type {{add: Function, remove: Function, toggle: Function, has: Function}}
 */

module.exports = {

    /**
     * Добавление css класса
     * @param elem {HTMLElement} - элемент, которому нужно добавить класс
     * @param className {String} - название класса
     */
    add: function (elem, className) {
        if (elem.classList) {
            elem.classList.add(className);
        } else {
            if (!this.has(elem, className)) {
                elem.className += ' ' + className;
            }
        }
    },

    /**
     * Удаление css класса
     * @param elem {HTMLElement} - элемент, которому нужно удалить класс
     * @param className {String} - название класса
     */
    remove: function (elem, className) {
        if (elem.classList) {
            elem.classList.remove(className);
        } else {
            var newClass = ' ' + elem.className.replace( /[\t\r\n]/g, ' ') + ' ';

            if (this.has(elem, className)) {
                while (newClass.indexOf(' ' + className + ' ') >= 0 ) {
                    newClass = newClass.replace(' ' + className + ' ', ' ');
                }
                elem.className = newClass.replace(/^\s+|\s+$/g, '');
            }
        }
    },

    /**
     * Переключение css класса
     * @param elem {HTMLElement} - элемент, которому нужно переключить класс
     * @param className {String} - название класса
     */
    toggle: function (elem, className) {
        if (elem.classList) {
            elem.classList.toggle(className);
        } else {
            var newClass = ' ' + elem.className.replace( /[\t\r\n]/g, ' ' ) + ' ';

            if (this.has(elem, className)) {
                while (newClass.indexOf(' ' + className + ' ') >= 0 ) {
                    newClass = newClass.replace( ' ' + className + ' ' , ' ' );
                }
                elem.className = newClass.replace(/^\s+|\s+$/g, '');
            } else {
                elem.className += ' ' + className;
            }
        }
    },

    /**
     * Проверка наличия css класса
     * @param elem {HTMLElement} - элемент, у которому нужно проверить наличие класса
     * @param className {String} - название класса
     */
    has: function (elem, className) {
        if (elem.classList) {
            return elem.classList.contains(className);
        } else {
            return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
        }
    }
};
