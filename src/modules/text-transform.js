/**
 * Модуль для трансформации текста при фильтрации массивов данных
 * @type {{translit: Function, replace: Function}}
 */

module.exports = {
    /**
     * Транслитерация текста
     * Например: Kolya -> Коля и наоборот Коля -> Kolya
     * @param from {String} - язык исходного текста
     * @param to {String} - язык для замены
     * @param text {String} - текст для замены
     * @returns {String}
     */
    translit: function (from, to, text) {
        var words = {
            ru: [
                'Я','я','Ю','ю','Ч','ч','Ш','ш','Щ','щ','Ж','ж','А','а','Б','б','В','в','Г','г','Д','д',
                'Е','е','Ё','ё','З','з','И','и','Й','й','К','к','Л','л','М','м','Н','н', 'О','о','П','п',
                'Р','р','С','с','Т','т','У','у','Ф','ф','Х','х','Ц','ц','Ы','ы','Ь','ь','Ъ','ъ','Э','э'
            ],
            en: [
                'Ya','ya','Yu','yu','Ch','ch','Sh','sh','Sh','sh','Zh','zh','A','a','B','b','V','v',
                'G','g','D','d','E','e','E','e','Z','z','I','i','J','j','K','k','L','l','M','m','N','n',
                'O','o','P','p','R','r','S','s','T','t','U','u','F','f','H','h','C','c','Y','y','`','`',
                '\'','\'','E', 'e'
            ]
        };

        return replaceText(words[from], words[to], text);
    },

    /**
     * Заменяет буквы с одного языка на другой
     * Например: hjuj -> рого, кщпщ -> rogo
     * @param from {String} - язык исходного текста
     * @param to {String} - язык для замены
     * @param text {String} - текст для замены
     * @returns {String}
     */
    replace: function (from, to, text) {
        var words = {
            ru: [
                'й','ц','у','к','е','н','г','ш','щ','з',
                'ф','ы','в','а','п','р','о','л','д',
                'я','ч','с','м','и','т','ь'
            ],
            en: [
                'q','w','e','r','t','y','u','i','o','p',
                'a','s','d','f','g','h','j','k','l',
                'z','x','c','v','b','n','m'
            ]
        };

        return replaceText(words[from], words[to], text);
    }
};

/**
 * Функция для замены букв/символов
 * @param fromWords {Array} - Буквы/символы исходного текста
 * @param toWords {Array} - Буквы/символы для замены в тексте
 * @param text {String} - текст для замены
 * @returns {*}
 */
function replaceText(fromWords, toWords, text) {
    fromWords.forEach(function (word, idx) {
        var reg = new RegExp(word, 'g');
        text = text.replace(reg, toWords[idx]);
    });

    return text;
}
