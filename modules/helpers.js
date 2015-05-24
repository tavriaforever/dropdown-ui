/**
 * Модуль с набором хелперов для работы с DOM нодами
 */

module.exports = {

    /**
     * Обертка над querySelectorAll
     * для выборки элементов в DOM дереве по селектору.
     * Пример использования:
     * $('.myNode') -> вернем массив элементов с указанным классом
     * @param elem {HTMLElement} - DOM нода
     * @returns {} - массив найденных элементов по селектору
     */
    $: function(elem) {
        return document.querySelectorAll(elem);
    },

    setText: function (elem, text) {
        var hasInnerText = !!document.getElementsByTagName('body')[0].innerText;
        return hasInnerText ? elem.textContent = text : elem.innerText = text;
    }
};
