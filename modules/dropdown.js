var helpers = require('./helpers'),
    $ = helpers.$,
    setText = helpers.setText,
    events = require('./events'),
    classList = require('./classList'),
    text = require('./text');

function Dropdown (options) {
    var self = this;

    this.options = options || {};

    if (!this.options.id) {
        throw new Error('dropdown-ui: В опциях не указан id');
    }

    // Здесь будут хранится id выбранных элементов
    self.selectedItems = [];

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

    // 1. Получаем html элемент дропдауна
    getDropdownElem();

    // 2. Строим шаблон
    buildTemplate();

    // 3. Слушаем события
    listenEvents();

    function getDropdownElem () {
        var id = self.options.id;

        self.selector = '[data-dropdown-id=' + self.options.id + ']';
        self.$dropdown = $(self.selector);

        if (!self.$dropdown.length) {
            throw new Error('dropdown-ui: Добавьте html разметку c id: ' + id);
        } else {
            self.$dropdown = self.$dropdown[0];
        }
    }

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
        self.$input.setAttribute('placeholder', 'Введите имя друга или email');

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
        fillList(items);

        fragment.appendChild(self.$inputHidden);
        fragment.appendChild(self.$control);
        fragment.appendChild(self.$popup);

        // Вставляем содержимое dropdown
        self.$dropdown.appendChild(fragment);
    }

    function fillList (items) {
        var cls = self.cls,
            fragment = document.createDocumentFragment();

        // Если массив состоит из 1 элемента и передана ошибка - выводим ее
        if (items.length === 1 && items[0].errorMessage) {
            var $item = createElem('div', [cls.item, cls.itemError]);

            setText($item, items[0].errorMessage);
            fragment.appendChild($item);
        } else {
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
                if (self.options.showImage) {
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
    }

    function resetList () {
        self.options.items.forEach(function (item) {
            if (item.hide) {
                item.hide = false;
            }
        });

        self.selectedItems = [];
    }

    /**
     *
     * @param tag
     * @param [cls]
     * @returns {Element}
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

    function listenEvents () {
        // Focus в инпуте – открываем дропдаун
        events.addEvent(self.$input, 'focus', open);

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
     * @param e
     */
    function onKeyUp (e) {
        var target = e.target || e.srcElement,
            value = target.value,
            items = self.options.items,
            filtered = [];

        // 1. Фильтруем в обычном порядке, предпологая, что пользователь ввел текст правильно рого
        filtered = filter(items, value);

        // 2. Если не нашли – фильтруем на случай ввода транслита rogo -> рого
        if (!filtered.length) {
            filtered = filter(items, text.translit('en', 'ru', value));
        }

        // 3. Если не нашли – Фильтруем на случай ввода hjuj -> рого
        if (!filtered.length) {
            filtered = filter(items, text.replace('en', 'ru', value));
        }

        // 4. Если не нашли – Фильтруем на случай ввода кщпщ -> rogo
        if (!filtered.length) {
            // кщпщ -> rogo
            var newValue = text.replace('ru', 'en', value);
            // rogo -> рого
            newValue = text.translit('en', 'ru', newValue);
            filtered = filter(items, newValue);
        }

        function filter (items, searchValue) {
            return items.filter(function (item) {
                var title = item.title;

                title = title.toLowerCase();
                searchValue = searchValue.toLowerCase();

                return title.indexOf(searchValue) !== -1;
            })
        }

        if (!filtered.length) {
            filtered.push({ errorMessage: 'Пользователь не найден' });
        }

        fillList(filtered);
    }

    function onListClick (e) {
        var event = e || window.event,
            target = event.target || event.srcElement;

        /*
            Перебираем DOM ноды, пока событие не всплывет до элемента списка
        */
        while (target !== this) {
            if (classList.has(target, self.cls.item)) {
                // Нашли элемент списка, готовим его к вставке __tokens
                addToken(e, target);

                // Выходим из цикла
                return;
            }

            target = target.parentNode;
        }
    }

    function onTokensClick (e) {
        var event = e || window.event,
            target = event.target || event.srcElement;

        if (classList.has(target, self.cls.tokenDelete)) {
            removeToken(e, target);
        }
    }

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
        fillList(items);

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

    function removeToken (e, target) {
        var $token = target.parentNode,
            tokenId = $token.getAttribute('data-dropdown-token'),
            items = self.options.items,
            selectedItems = self.selectedItems;

        items.forEach(function (item) {
            if (item.id === +tokenId) {
                item.hide = false;

                selectedItems.splice(selectedItems.indexOf(item.id), 1);
            }
        });

        $token.parentNode.removeChild($token);

        /*
         Если уже добавлен хотя бы один токен
         и выбрана опция мультиселекта – показываем кнопку добавить
         */
        if (options.multiSelect && !self.selectedItems.length) {
            classList.remove(self.$tokenAdd, self.cls.tokenAddShow);
        }

        // Убираем значени удаленного элемента из скрытого инпута для формы
        self.$inputHidden.value = self.selectedItems.join(',');

        // Обновляем список, добавляем удаленный элементы
        fillList(items);
    }
}

module.exports = Dropdown;
