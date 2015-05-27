/**
 * Модуль для умной фильтрации массивов данных
 * с учетом передачи некорректного запрос: транслитерация и не правильняа раскладка клавиатуры
 * На данных момент поддерживаем 2 языка (русский и английский)
 * @type {*|exports|module.exports}
 */

var text = require('./text-transform');

module.exports = {
    /**
     * Получение результатов фильтрации
     * @param items {Array} - массив данных
     * @param value {String} - запрос для фильтрации
     * @param field {Object}
     * - name: Название поля по которому нужно искать данные в массиве
     * - lang: Язык поля, по которому осуществляется поиск.
     * Необхом для правильной трасформации текста запроса.
     * @returns {Array} - массив отфильтрованных данных
     */
    get: function (items, value, field) {
        var fieldName = field.name,
            sourceL = field.lang,
            possibleL = sourceL === 'ru' ? 'en' : 'ru',
            tmpValue;

        // 1. Фильтруем в обычном порядке, предпологая,
        // что пользователь ввел текст корректно
        // и в правильной раскладке клавиатуры, например рого
        var filtered = filter(items, value, fieldName);

        // 2. Фильтруем на случай ввода транслита rogo -> рого
        if (!filtered.length) {
            filtered = filter(items, text.translit(possibleL, sourceL, value), fieldName);
        }

        // 3. Если не нашли – фильтруем на случай ввода hjuj -> рого
        if (!filtered.length) {
            filtered = filter(items, text.replace(possibleL, sourceL, value), fieldName);
        }

        // 4. Если не нашли – фильтруем на случай ввода кщпщ -> rogo
        if (!filtered.length) {
            // кщпщ -> rogo
            tmpValue = text.replace(sourceL, possibleL, value);
            // rogo -> рого
            tmpValue = text.translit(possibleL, sourceL, tmpValue);
            filtered = filter(items, tmpValue, fieldName);
        }

        return filtered;
    }
};

/**
 * Простая оберка для ECMAScript 5 методом для фильтрации данных
 * @param items {Array} - массив данных
 * @param value {String} - запрос для фильтрации
 * @param fieldName {String} - Название поля по которому нужно искать данные в массиве
 * @returns {Array} - массив отфильтрованных данных
 */
function filter (items, value, fieldName) {
    return items.filter(function (item) {
        var title = item[fieldName];

        title = title.toLowerCase();
        value = value.toLowerCase();

        return title.indexOf(value) !== -1;
    })
}
