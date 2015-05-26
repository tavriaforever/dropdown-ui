var text = require('./text-transform');

module.exports = {
    get: function (items, value, field) {
        var sourceL = field.lang,
            possibleL = sourceL === 'ru' ? 'en' : 'ru',
            tmpValue;

        // 1. Фильтруем в обычном порядке, предпологая,
        // что пользователь ввел текст корректно
        // и в правильной раскладке клавиатуры, например рого
        var filtered = filter(items, value, field);

        // 2. Фильтруем на случай ввода транслита rogo -> рого
        if (!filtered.length) {
            filtered = filter(items, text.translit(possibleL, sourceL, value), field);
        }

        // 3. Если не нашли – фильтруем на случай ввода hjuj -> рого
        if (!filtered.length) {
            filtered = filter(items, text.replace(possibleL, sourceL, value), field);
        }

        // 4. Если не нашли – фильтруем на случай ввода кщпщ -> rogo
        if (!filtered.length) {
            // кщпщ -> rogo
            tmpValue = text.replace(sourceL, possibleL, value);
            // rogo -> рого
            tmpValue = text.translit(possibleL, sourceL, tmpValue);
            filtered = filter(items, tmpValue, field);
        }

        return filtered;
    }
};

function filter (items, value, field) {
    return items.filter(function (item) {
        var title = item[field.name];

        title = title.toLowerCase();
        value = value.toLowerCase();

        return title.indexOf(value) !== -1;
    })
}
