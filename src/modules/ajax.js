/**
 * Базовый модуль для Ajax запросов на сервер.
 * ВАЖНО! На данный момент поддерживаем только POST запросы с Content-Type: json,
 * необходимые для полноценной работы дропдауна
 *
 * Поддержка браузеров: современные браузеры firefox, chrome, а также opera 12+, IE8+
 *
 * Пример использования:
 *
    var AJAX = require('ajax'),
       sendAjaxRequest = new Ajax();

    sendAjaxRequest({
        method: 'POST',
        url: '/api/users',
        type: 'json',
        data: { text: 'Mega text' }
    }, function (err, result) {
        if (err) {
            return console.log('err', err);
        }

        console.log('result', result);
    });
*/
module.exports = function Ajax () {
    var xhr = getXhrObject(),
        defaultHeaders = {
            contentType: {
                formData: 'application/x-www-form-urlencoded',
                json: 'application/json'
            },
            accept: {
                '*':  'text/javascript, text/html, application/xml, text/xml, */*',
                'html': 'text/html',
                'text': 'text/plain',
                'json': 'application/json, text/javascript'
            }
        };

    /**
     * Получаем инстанс для XHR запросов в зависимости от поддержки браузеров
     * Для IE10- используем ActiveXObject, для всех остальных XMLHttpRequest
     * @returns {Object} - инстанс xhr класса
     */
    function getXhrObject () {
        if(typeof XMLHttpRequest === 'undefined'){
            XMLHttpRequest = function() {
                try { return new window.ActiveXObject('Microsoft.XMLHTTP'); }
                catch(e) {}
            };
        }

        return new XMLHttpRequest();
    }

    /**
     * Устанавливаем заголовки запроса в зависимости от переданных опций
     * @param xhr {Object} - xhr объект для работы с ajax запросами
     * @param options {Object} - опции запроса переданные в аргументы
     */
    function setHeaders(xhr, options) {
        var reqHeaders = options.headers || {},
            type = options.type,
            headers = defaultHeaders,
            accept = headers.accept,
            contentType = headers.contentType;

        // Accept
        reqHeaders['Accept'] = reqHeaders['Accept'] || accept[type] || accept['*'];

        // Сontent-Type
        if (!reqHeaders['Content-Type'] && options.method !== 'GET') {
            reqHeaders['Content-Type'] = contentType[type] || contentType.formData;
        }

        for (var h in reqHeaders) {
            if (reqHeaders.hasOwnProperty(h) && xhr.setRequestHeader) {
                xhr.setRequestHeader(h, reqHeaders[h]);
            }
        }

        return reqHeaders;
    }

    /**
     * Обработчик для ответов сервера с кодом 20x
     * @param xhr {Object} - xhr объект для работы с ajax запросами
     * @param cb {Function} - callback функция, которая будет вызвана с аргументом результата
     */
    function onSuccess (xhr, cb) {
        var result = JSON.parse(xhr.responseText);

        result.meta = {
            statusCode: xhr.status,
            statusText: xhr.statusText
        };

        return cb(null, result);
    }

    /**
     * Обработчик для ответов сервера, статус которых можно считать ошибкой, (400 - 500)
     * @param xhr {Object} - xhr объект для работы с ajax запросами
     * @param cb {Function} - callback функция, которая будет вызвана с аргументом результата
     */
    function onError (xhr, cb) {
        var error = {
            message: xhr.responseText,
            statusCode: xhr.status,
            statusText: xhr.statusText
        };

        return cb(error);
    }

    /**
     *  Создание инстанса класса возвращает новую фукнцию с двумя параметрами
     * @param options {Object} - опции запроса
     * @param cb {Function} - callback функция, которая будет вызвана с аргументами результата или ошибки
     */
    return function (options, cb) {

        // Проверяем наличие обязательных аргументов и их тип
        if(!options || getClass(options) !== 'Object') {
            throw new Error('ajax: add options object argument');
        }

        if(!cb || getClass(cb) !== 'Function'){
            throw new Error('ajax: add callback function argument');
        }

        var method = options.method || 'GET',
            url = options.url || window.location.toString(),
            data = options.data

        // 1. Всегда открываем ассинхронное соединение
        xhr.open(method, url, true);

        // 2. Ставим заголовки
        setHeaders(xhr, options);

        if (options.type === 'json') {
            data = JSON.stringify(options.data);
        }

        // 3. Проверяем состояние запроса
        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4) {
                // IE может прислать код ответа 1223
                (/^(20\d|1223)$/.test(xhr.status)) ? onSuccess(xhr, cb) : onError(xhr, cb);
            }
        };

        // 4. Финал: Отправляем запрос
        xhr.send(data);

        return xhr;
    }
};

function getClass(obj) {
    return {}.toString.call(obj).slice(8, -1);
}
