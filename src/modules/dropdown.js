/**
 * Модуль ui компонента dropdown, реализованный на Vanilla Javascript
 * Скриншот: https://raw.githubusercontent.com/tavriaforever/dropdown-ui/master/example/example.png
 * Реализует следующие возможности:
 * - отображение пунктов списка с картинкой и без
 * - автокомплит для фильтрации пунктов списка с учетом транслитерации текста
 * и не правильной раскладки клавиатуры
 * - запрос данных на сервер автокомплита фильтрации пунктов списка
 * - Выбор одного пункта или multiSelect
 * - коллбеки на открытие/закрытие дропдауна и выбор пункта списка
 *
 * ВАЖНО! Создает input type="hidden", который содержит id текущих выбранных пунктов для сабмита формы
 * Браузерная поддержка: Современные браузеры firefox, yandex, chrome, opera 12.16+, IE8+
 * Репозиторий с исходным кодом: https://github.com/tavriaforever/dropdown-ui/
 *
 * Пример использования:
 * ВАЖНО! Код компонента используется модульную систему CommonJS,
 * для работы в браузере предпологается сборка кода с помощью webpack.github.io
 *
 * // html
 * <div class="dropdown-ui" data-dropdown-id="first"></div>
 *
 * // javascript + styles
 * var Dropdown = require('../src/modules/dropdown.js'),
 *     dropdownStyles = require('../src/styles/dropdown.js');
 *
 * var dropdown = new Dropdown({
        id: 'first',
        showImage: true,
        multiSelect: true,
        server: {
            method: 'POST',
            url: '/api/users',
            type: 'json',
            data: { field: { name: 'domain', lang: 'en' } }
        },
        onOpen: function () {
            // обработчик на открытие дропдауна
        },
        onClose: function () {
            // обработчик на закрытие дропдауна
        },
        onSelect: function (item) {
            // обработчик на выбор элемента
        },
        items: [
            { id: 1, title: 'Андрей Рогозов', addition: 'rogozov', image: 'images/rogozov.jpg' },
            { id: 2, title: 'Николай Ильченко', addition: 'tavriaforever', image: 'images/tavriaforever.jpg' },
            { id: 3, title: 'Татьяна Неземная', addition: 'ЕУФИМБ (КФ) \'14', image: 'images/nezemnaya.jpg' }
        ]
    });

    // Если нужно перезаполнить список:
    dropdown.fillList([
         { id: 4, title: 'Сергей Жиленков', addition: 'zila', image: 'images/zila.jpg' },
         { id: 5, title: 'Борис Сапак', addition: 'ЮФ НУБиП Украины "КАТУ" (бывш. ЮФ НАУ)', image: 'images/baklan.jpg' },
         { id: 6, title: 'Дарья Обер', addition: 'dasha', image: 'images/dasha.jpg' }
    ], true);
 *
 * @type {Class}
 */

var helpers = require('./helpers'),
    $ = helpers.$,
    setText = helpers.setText,
    events = require('./events'),
    classList = require('./classList'),
    polyfills = require('./polyfills'),
    smartFilter = require('./smartFilter'),
    Ajax = require('./ajax');

/**
 * Класс ui компонента dropdown
 * @param options {Object}
 * - id {String|Number} - id дропдауна, в html указывает в атрибуте data-dropdown-id="first"
 * - showImage {Boolean} - показывать или нет изображение для пункта списка
 * - multiSelect {Boolean} - если true, можно выбрать более одного пункта
 * - server {Object} - опции для запроса данные с сервера
 * - onOpen {Function} - обработчик на открытие дропдауна
 * - onClose {Function} - обработчик на закрытие дропдауна
 * - onSelect {Function} - обработчик на выбор пункта списка, в аргумент передается объект выбранного пункта
 * - items {Array} - массив пунктов списка, содержит поля title(например имя пользователя),
 * addition(доп информация) и image(путь до картинки пункта, например аватар пользователя)
 * @constructor
 */
function Dropdown (options) {
    var self = this;

    this.options = options || {};

    // id обязательное поле опций
    if (!this.options.id) {
        throw new Error('dropdown-ui: В опциях не указан id');
    }

    if (this.options.server) {
        var sendAjaxRequest = new Ajax();
    }

    // Задаем плейсхолдер для инпута
    this.placeholder = this.options.placeholder || 'Введите имя друга';
    this.tabIndex = this.options.tabIndex || 0;

    // Здесь будут хранится id выбранных элементов
    this.selectedItems = [];

    // Дефайним css классы для возможной смены верстки
    this.cls = {
        root: 'dropdown-ui',
        open: 'dropdown-ui_open',
        arrow: 'dropdown-ui__arrow',
        input: 'dropdown-ui__input',
        control: 'dropdown-ui__control',
        controlItem: 'dropdown-ui__control-item',
        tokens: 'dropdown-ui__tokens',
        token: 'dropdown-ui__token',
        tokenDelete: 'dropdown-ui__token-delete',
        tokenAdd: 'dropdown-ui__token-add',
        tokenAddShow: 'dropdown-ui__token-add_show',
        popup: 'dropdown-ui__popup',
        list: 'dropdown-ui__list',
        item: 'dropdown-ui__item',
        itemError: 'dropdown-ui__item_error',
        itemInfo: 'dropdown-ui__item-info',
        itemTitle: 'dropdown-ui__item-title',
        itemAddition: 'dropdown-ui__item-addition',
        itemImageWrap: 'dropdown-ui__item-image-wrap',
        itemImage: 'dropdown-ui__item-image'
    };

    /**
     * Публичный метод для заполнения списка пунктами
     * В зависимости от опций:
     * - может показывать картинку для пункта списка
     * - скрывать часть элементов
     * - отображать ошибку поиска пункта
     * @param items [Array] - массив пунктов для отображения в списка
     * Пример: [{ id: 1, title: 'Андрей Рогозов', addition: 'rogozov', image: 'images/rogozov.jpg' }]
     * @param isResetOptionItems [Boolean] - указывает, нужно ли обновить items, объявленные при создании,
     * необходимо для случаев, когда нужно заменить содержимое дропдауна после его создания
     */
    this.fillList = function (items, isResetOptionItems) {
        var cls = self.cls,
            options = self.options,
            fragment = document.createDocumentFragment();

        // Если массив состоит из 1 элемента и передана ошибка - выводим ее
        if (items.length === 1 && items[0].errorMessage) {
            var $item = createElem('div', [cls.item, cls.itemError]);

            setText($item, items[0].errorMessage);
            fragment.appendChild($item);
        } else {

            // Обновляем список опций, переданных при создании дропдауна
            if (isResetOptionItems) {
                options.items = items;
            }

            // Генерируем список
            items.forEach(function (item) {

                // Если поле hide === true – не вставляем элемент в список
                if (item.hide) return;

                var $item = createElem('div', [cls.item, 'clearfix']),
                    $info = createElem('div', cls.itemInfo),
                    $title = createElem('div', cls.itemTitle),
                    $addition = createElem('div', cls.itemAddition);

                // Вставляем текст для составных частей
                setText($title, item.title);
                setText($addition, item.addition);

                // Настраиваем картинки
                if (options.showImage) {
                    var $imageWrap = createElem('div', cls.itemImageWrap),
                        $image = createElem('img', cls.itemImage);

                    $image.src = item.image;
                    $image.setAttribute('width', '32');
                    $image.setAttribute('height', '32');
                    $imageWrap.appendChild($image);
                    $item.appendChild($imageWrap);
                }

                // Добавляем для элемента data атрибут с id
                $item.setAttribute('data-dropdown-item', item.id);

                // Вставляем составные части в элемент
                $info.appendChild($title);
                $info.appendChild($addition);
                $item.appendChild($info);

                // Вставляем элемент во фрагмент
                fragment.appendChild($item);
            });
        }

        // Очищаем список и Вставляем элементы
        self.$list.innerHTML = '';
        self.$list.appendChild(fragment);
    };

    // 1. Получаем html элемент дропдауна
    getDropdownElem();

    // 2. Строим шаблон
    buildTemplate();

    // 3. Слушаем события
    listenEvents();

    /**
     * Получаем объект HTMLElement корневого элемента dropdown
     * при помощи указанного в опциях id
     */
    function getDropdownElem () {
        var id = self.options.id;

        self.selector = '[data-dropdown-id=' + id + ']';
        self.$dropdown = $(self.selector);

        if (!self.$dropdown.length) {
            throw new Error('dropdown-ui: Добавьте html разметку c id: ' + id);
        } else {
            self.$dropdown = self.$dropdown[0];
        }
    }

    /**
     * Весь шаблон, кроме корневого элемента создаем на клиенте. 
     * Все css классы описаны в объекте класса Dropdown this.cls
     */
    function buildTemplate () {
        var fragment = document.createDocumentFragment(),
            options = self.options,
            cls = self.cls;

        self.$control = createElem('div', [cls.control, 'clearfix']);
        self.$arrow = createElem('i', cls.arrow);
        self.$input = createElem('input', [cls.input, cls.controlItem]);
        self.$inputHidden = createElem('input');
        self.$tokens = createElem('div', [cls.tokens, cls.controlItem, 'clearfix']);
        self.$popup = createElem('div', cls.popup);
        self.$list = createElem('div', cls.list);

        // Настраиваем input
        self.$input.setAttribute('type', 'text');
        self.$input.setAttribute('placeholder', self.placeholder);
        self.$input.setAttribute('tabindex', self.tabindex);

        // Настраиваем скрытый input хранения данных для отправки формы
        self.$inputHidden.setAttribute('type', 'hidden');
        self.$inputHidden.setAttribute('name', options.inputName || 'dropdown');
            // Если передан id для инпута – добавлен его
            options.inputId && self.$inputHidden.setAttribute('id', options.inputId);


        // Если выбрана опции 'мультивыбора' генерируем кнопку добавления
        if (options.multiSelect) {
            var $tokenAddIcon = createElem('div', ['token__add', 'token__icon']);

            self.$tokenAdd = createElem('div', [cls.tokenAdd, 'token', 'token_theme_light']);
            self.$tokenAdd.textContent = 'Добавить';

            // Вставляем иконку
            self.$tokenAdd.appendChild($tokenAddIcon);

            // Добавляем кнопку к __tokens
            self.$tokens.appendChild(self.$tokenAdd);
        }

        // Заполняем __control
        self.$control.appendChild(self.$tokens);
        self.$control.appendChild(self.$arrow);
        self.$control.appendChild(self.$input);

        // Заполняем __popup
        self.$popup.appendChild(self.$list);

        // Заполняем список
        var items = self.options.items;
        if (!items || !items.length) {
            throw new Error('dropdown-ui: Добавьте элементы для выбора')
        }
        self.fillList(items);

        fragment.appendChild(self.$inputHidden);
        fragment.appendChild(self.$control);
        fragment.appendChild(self.$popup);

        // Вставляем содержимое dropdown
        self.$dropdown.appendChild(fragment);
    }

    /**
     * Хелпер для создания html элемент и добавление ему css классов
     * @param tag {String} - название тега
     * @param [cls] {Array|String} - классы, которые нужно добавить элементу,
     * можно передать сразу несколько в виде массива
     * @returns {HTMLElement}
     */
    function createElem (tag, cls) {
        var elem = document.createElement(tag);

        if (cls) {
            if (Array.isArray(cls)) {
                cls.forEach(function (classItem) {
                    classList.add(elem, classItem)
                });
            } else {
                classList.add(elem, cls);
            }
        }

        return elem;
    }

    /**
     * Все подписки на DOM события в одной функции.
     */
    function listenEvents () {
        // Focus в инпуте – открываем дропдаун
        events.addEvent(self.$input, 'focus', open);

        // Закрытие дропдауна при клике клавиш на tab
        events.addEvent(self.$input, 'keydown', function (e) {
            if (e.keyCode === 9) {
                close(e);
            }
        });

        // Если выбрана опция мультиселекта и есть кнопка 'Добавить' - клик по ней открывает дропдаун
        self.$tokenAdd && events.addEvent(self.$tokenAdd, 'click', open);

        // Закрываем dropdown по клику вне блока
        events.addEvent(document, 'click', function (e) {
            var target = e.target || e.srcElement,
                $dropdown = self.$dropdown,
                cls = self.cls;

            if (classList.has($dropdown, cls.open)) {
                if (classList.has(target, cls.root) || !$dropdown.contains(target)) {
                    close(e);
                }
            }
        });

        // Клик по стрелке – тоглим дропдаун
        events.addEvent(self.$arrow, 'click', toggle);

        // Клик по элементу списка
        events.addEvent(self.$list, 'click', onListClick);

        // Клик по крестику токена для удаления
        events.addEvent(self.$tokens, 'click', onTokensClick);
    }

    /**
     * Обработчик открытия дропдауна
     * @param e {Object}
     */
    function open (e) {
        classList.add(self.$dropdown, self.cls.open);

        // Вызываем callback при открытии
        options.onOpen && options.onOpen();

        // Подписываем на ввод данных в инпут
        events.addEvent(self.$input, 'keyup', onKeyUp);
    }

    /**
     * Обработчик закрытия дропдауна
     * @param e {Object}
     */
    function close (e) {
        classList.remove(self.$dropdown, self.cls.open);

        // Вызываем callback при закрытии
        options.onClose && options.onClose();

        // Отписываемся от ввода данных в инпут
        events.removeEvent(self.$input, 'keyup', onKeyUp);
    }

    /**
     * Обработчик 'тоглера' открытия/закрытия дропдаура
     * @param e {Object}
     */
    function toggle (e) {
        classList.has(self.$dropdown, self.cls.open) ? close(e) : open(e);
    }

    /**
     * Обработчик ввода данных в инпут
     * @param e {Object}
     */
    function onKeyUp (e) {
        var target = e.target || e.srcElement,
            value = target.value,
            options = self.options,
            items = options.items,
            server = options.server,

            // 1. Сначало фильтруем данные по полю title (содержит имя/фамилию пользователя)
            filtered = smartFilter.get(items, value, { name: 'title', lang: 'ru' });

        /*
            2. Если ничего не нашли и переданы опции для поиска на сервере - отправляем запрос,
            если нет - завершаем фильтрацию
         */
        (!filtered.length && server) ? searchDataOnServer(server, value) : setFilterResults(filtered);
    }

    /**
     * Обработчик фильтрации пунктов меню, если передан пустой массив,
     * заполнит список ошибкой, если нет, просто вызовет обновления списка
     * @param filtered
     */
    function setFilterResults (filtered) {
        // Если ничего так и не нашли возвращаем ошибку
        if (!filtered.length) {
            filtered.push({ errorMessage: 'Пользователь не найден' });
        }

        self.fillList(filtered);
    }

    /**
     * Отправка запроса на сервер
     * Используем модуль-обертку для ajax запросов
     * В случае успешного ответа сервера вызовет обработчик фильтрации пунктов меню,
     * в случае ошибки бросит ошибку с указание err.message или текста статуса ответа
     * @param server {Object} - объект с опциями запроса к серверу, указываются при создании инстанса дропдауна
     * @param value {String} - текущее значение запроса по которому нужно искать сопадение данных
     */
    function searchDataOnServer (server, value) {
        // Добавляем в отправляемую дату текущее значение value
        server.data.value = value;

        // Делаем запрос на сервер
        sendAjaxRequest({
            method: server.method,
            url: server.url,
            type: server.type,
            data: server.data
        }, function (err, result) {
            if (err) {
                console.log('err', err);
                throw new Error('dropdown-ui: Ошибка сервера: ', err.message || err.statusText);
            }

            setFilterResults(result.items);
        });
    }

    /**
     * Обработчик кликов по списку дропдауна,
     * используем делегирование для пунктов списка
     * @param e {Object} - event object
     */
    function onListClick (e) {
        var event = e || window.event,
            target = event.target || event.srcElement;

        // Перебираем DOM ноды, пока событие не всплывет до пункта списка
        while (target !== this) {
            if (classList.has(target, self.cls.item)) {
                // Нашли пункт списка, готовим его к вставке в __tokens
                addToken(e, target);

                // Выходим из цикла
                return;
            }

            // Если таргет оказался не пунктов списка, берем следующего родителя
            target = target.parentNode;
        }
    }

    /**
     * Обработчик кликов по выбранному токену,
     * если таргет имеет класс token__delete, клик по нему удаляет токен
     * @param e {Object} - event object
     */
    function onTokensClick (e) {
        var event = e || window.event,
            target = event.target || event.srcElement;

        if (classList.has(target, self.cls.tokenDelete)) {
            removeToken(e, target);
        }
    }

    /**
     * Добавления выбранного пункта списка в токены.
     * 1. Если выбрана функция мультиселекта позволяем добавлять несколько.
     * 2. Создает и вставляет в __tokens htmlElement __token
     * 3. Фиксирует выбранные пункты
     * 4. Вызывает функцию обновления списка
     * 5. После успешного добавления вызывает callback onSelect
     * @param e
     * @param target
     */
    function addToken (e, target) {
        var targetId = target.getAttribute('data-dropdown-item'),
            targetItem,
            options = self.options,
            items = options.items;

        /*
            Если не выбрана опция мультиселекта:
            1. Делаем все элементы списка видимыми
            2. Очищаем __tokens перед вставкой
        */
        if (!options.multiSelect) {
            resetList();
            self.$tokens.innerHTML = '';
        }

        /*
         Перебираем элементы и если id совпадает c data-id элемента по которому кликнули –
         сохраняем элемент в переменную и ставим ему hide:true, чтобы скрыть из списка,
         так как он уже выбран
         */
        items.forEach(function (item) {
            if (item.id === +targetId) {
                targetItem = item;
                item.hide = true;
                self.selectedItems.push(item.id);
            }
        });

        // Обновляем список, чтоб в нем уже не было выбранных элементов
        self.fillList(items);

        // Добавляем токен
        if (targetItem) {
            buildToken(targetItem);

            /*
                Если уже добавлен хотя бы один токен
                и выбрана опция мультиселекта – показываем кнопку добавить
            */
            if (options.multiSelect && self.selectedItems.length >= 1) {
                classList.add(self.$tokenAdd, self.cls.tokenAddShow);
            }

            // Заполняем input для отправки формы
            self.$inputHidden.value = self.selectedItems.join(',');

            // Закрываем дропдаун
            close(e);

            // Вызываем обработчик на выбор элемента
            options.onSelect && options.onSelect.call(null, targetItem);
        }
    }

    /**
     * Создает и вставляет в __tokens htmlElement __token
     * @param item
     */
    function buildToken (item) {
        var cls = self.cls,
            $token = createElem('div', [cls.token, 'token', 'token_theme_dark']),
            $tokenDelete = createElem('div', [cls.tokenDelete, 'token__delete', 'token__icon']);

        setText($token, item.title);
        $token.appendChild($tokenDelete);
        $token.setAttribute('data-dropdown-token', item.id);

        // Вставляем токен перед кнопкой 'Добавить'
        self.$tokens.insertAdjacentElement('afterBegin', $token);
    }

    /**
     * Удаление выбранного пункта списка из __tokens
     * 1. Удаляет htmlElement токена
     * 2.
     * 3. Обновляем список
     * @param e
     * @param target
     */
    function removeToken (e, target) {
        var $token = target.parentNode,
            tokenId = $token.getAttribute('data-dropdown-token'),
            items = self.options.items,
            selectedItems = self.selectedItems;

        items.forEach(function (item) {
            if (item.id === +tokenId) {
                // Убираем поле hide у скрытых пунктов
                item.hide = false;
                // Удаляем id выбранного пункта списка из памяти
                selectedItems.splice(selectedItems.indexOf(item.id), 1);
            }
        });

        // Удалем html элемент
        $token.parentNode.removeChild($token);

        /*
            Если выбрана опция мультиселекта и не выбрано ни одного пункта списка
            – скрываем кнопку 'Добавить'
         */
        if (options.multiSelect && !self.selectedItems.length) {
            classList.remove(self.$tokenAdd, self.cls.tokenAddShow);
        }

        // Убираем значение удаленного пункта из скрытого инпута для формы
        self.$inputHidden.value = self.selectedItems.join(',');

        // Обновляем список
        self.fillList(items);
    }


    /**
     * Сбрасываем выбранные пункты списка
     * - показываем все пункты
     * - очищаем выбранные id из памяти
     */
    function resetList () {
        self.options.items.forEach(function (item) {
            if (item.hide) {
                item.hide = false;
            }
        });

        self.selectedItems = [];
    }
}

module.exports = Dropdown;
