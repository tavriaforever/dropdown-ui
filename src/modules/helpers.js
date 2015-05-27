/**
 * Модуль с набором хелперов для работы с DOM нодами
 */

module.exports = {

    /**
     * Обертка над querySelectorAllдля выборки элементов в DOM дереве по селектору.
     *
     * Пример использования:
     * $('.myNode') -> вернется массив HTML элементов с указанным классом
     *
     * @param elem {HTMLElement} - html элемент, который ищем в DOM дереве
     * @returns {NodeList} - массив найденных элементов по селектору
     */
    $: function(elem) {
        return document.querySelectorAll(elem);
    },

    /**
     * Установка текст для html элемента
     * @param elem {HTMLElement} - html элемент, который устанавливаем текст
     * @param text {String} - устанавливаемый текст
     * @returns {*}
     */
    setText: function (elem, text) {
        return elem.textContent = text;
    }
};
