module.exports = {
    add: function (elem, className) {
        if (elem.classList) {
            elem.classList.add(className);
        } else {
            if (!this.has(elem, className)) {
                elem.className += ' ' + className;
            }
        }
    },

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

    has: function (elem, className) {
        if (elem.classList) {
            return elem.classList.contains(className);
        } else {
            return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
        }
    }
};
