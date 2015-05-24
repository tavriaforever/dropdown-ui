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
     * @returns {Array} - массив найденных элементов по селектору
     */
    $: function(elem) {
        return document.querySelectorAll(elem);
    }
};
