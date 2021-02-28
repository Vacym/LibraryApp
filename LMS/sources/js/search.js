// version 1.0 release

class ToolbarControl { // Класс для работы с тулбаром
    constructor() {
        this.inputs = []; // Массив с checkbox'ами
        this.toolbar = document.querySelector(".toolbar"); //Определяем тулбар
        this.dedicated = document.querySelector("#summ_checked>span"); //Определяем число с количеством выделенных элементов
        this.box_element = document.querySelector(".search_result"); //Определяем блок со всеми элементами

        let observer = new MutationObserver( (m) => this.appendListenerForNewChange(m) );
        observer.observe(this.box_element, {childList: true}); // Прослушка на добавление блоков

        document.querySelector("#remove").onclick = () => this.remove(); // Кнопка отключения всех галочек
    }

    //Добавление прослушивания для новых элементов (которые создаются при прокрутке страницы)
    appendListenerForNewChange(mutations) {
        for(let mutation of mutations){
            for (let node of mutation.addedNodes){ // Каждый элеиент из добавленных
                if (node.classList.contains("notification")) continue; // Если это уведомление, пропускаем
                this.inputs.push(node); //Добавляем в список и начинаем прослушивать
                node.querySelector(".choice input[type='checkbox']").addEventListener("change", () => this.moveControl());
                node.addEventListener("click", checkChoiceClick);
            }
            for (let node of mutation.removedNodes){ // Каждый элемент из удалённых
                if (node.classList.contains("notification")) continue;
                node.removeEventListener("click", checkChoiceClick); // Удаляем прослушку
                this.inputs.splice(this.inputs.indexOf(node), 1); // Удаляем из списка
            }
        }
        this.moveControl();
    }

    //Движение тулбара
    moveControl() {
        let counter = 0;
        let edit = this.toolbar.querySelector("#edit"); // Кнопка редактирования

        for (let input of this.inputs) {
            if (input.querySelector(".choice input[type='checkbox']").checked) { // Если галочка поставлена
                input.classList.add("selected"); // указывем это
                counter += 1; // И считаем
            }
            else { // Если галочки нет
                input.classList.remove("selected"); // Удаляем ненужный класс
            }
        }

        let show_tool = false;
        if (counter > 0) show_tool = true; // Если что-то выбрано, показывем панель

        if(counter > 1){ // Если выбрано больше одного
            edit.classList.add("deactiv"); // Отключаем редактирование
        }else{
            edit.classList.remove("deactiv");
        }

        this.dedicated.innerHTML = counter.toString(); // Устанавливаем количество выделенных элементов
        this.toolbarShow(show_tool);
    }

    //Переключение видимости
    toolbarShow(show) {
        if (show) {
            this.box_element.classList.add("selecting");
            this.toolbar.classList.add("show");
        } else {
            this.box_element.classList.remove("selecting");
            this.toolbar.classList.remove("show");
        }
    }

    //Отмена выделения для всех элементов
    remove() {
        for (let input of this.inputs) {
            input.querySelector(".choice input[type='checkbox']").checked = false;
        }
        this.moveControl();
    }
}

function scrollControl() { // Инициализируем контроль над кнопкой для скролла наверх
    function checkScroll() {
        let scroll = window.pageYOffset;
        let screen_height = document.documentElement.clientHeight / 4;

        if (scroll > screen_height) {
            but_up.classList.remove('hidden');
        } else {
            but_up.classList.add('hidden');
        }
    }

    function goTop() {
        function scrolling() {
            if (window.pageYOffset > 0) {
                window.scrollBy(0, -iterations);
                setTimeout(scrolling, 1000 / fps);
            }
        }
        // Можно настроить
        let fps = 60;
        let need_time = 150; //в милисекундах

        let iterations = (window.pageYOffset / (need_time / 1000) / fps);
        scrolling();
    }

    let but_up = document.querySelector('#up');
    window.addEventListener('scroll', checkScroll);
    but_up.addEventListener('click', goTop);
}

function checkChoiceClick(e){ // Проверяет нажатие ctrl+click
    if (e.which == 1 && e.ctrlKey && e.isTrusted){ // Если правая кнопка мыши и удерживается ctrl
        e.preventDefault(); // Блокируем поведение по умолчанию
        
        let result;
        for (result of e.path) {
            if (result.classList.contains("result")) break; // Находим материнский блок
        }

        result.querySelector(".choice input[type='checkbox']").click(); // Имитируем клик на checkbox
    }
}

function listenerControl(){ // Инициализируем прослушку различных объектов экрана
    document.querySelector('#edit').onclick = function() { // Запускается когда пользователь нажимает на карандашик
        let checkboxes = document.querySelectorAll(".choice input[type='checkbox']:checked");
        let count = checkboxes.length;

        if (count != 1) {
            console.log('Пока что невозможно редактирование нескольких книг!');
            return;
        }

        let ID = checkboxes[0].id|0; // Сохраняем ID книги/читателя

        if (isUsers) { // Если читатель
            window.location = `acc.html?type=user&id=${ID}&choose=edit`;
        } else {
            if (ID < 0) { // Если эта группа
                window.location = `acc.html?type=group&id=${-ID}&choose=edit`;
            } else {
                window.location = `acc.html?type=book&id=${ID}&choose=edit`;
            }
        }
    };

    document.querySelector('#input').addEventListener('input', (e) => { // Обновляет результаты поиска при написании запроса
        if (!e.target.value.startsWith(' ')) {
            GET.q = e.target.value; // Призваиваем запросу новое значение
            changeDB(GET.q); // Меняем значение поиска исходя из запроса
        }
    });

    document.querySelector("select").addEventListener('change', (e) => { // Обновляет результаты поиска при изменении категории 
        GET.order = e.target.value; // Призваиваем списку новое значение
        changeDB(GET.q); // Меняем результаты поиска
    });
}

function messageControl(){ // Инициализуем контроль над всплывающими окнами
    function deleteMessage(){  // Запускается, когда пользователь нажимает на кнопку удалить или на клавишу <del>
        let count = document.querySelectorAll(".choice input[type='checkbox']:checked").length;
        if (count < 1) return;

        function get_i(count) {
            let i;
            if (count%10 >= 5 || count%10 == 0 || count%100 > 10 && count%100 <= 20) i = 0;
            else if (count%10 >= 2 && count%10 < 5)                                  i = 1;
            else                                                                     i = 2;
            return i;
        }
    
        if (!isUsers) { // Если книга/группа
            let count_group = document.querySelectorAll(".group .choice input[type='checkbox']:checked").length;
            let count_books = count - count_group;

            let valid_1 = ['Будут удалены', 'Будет удалено', 'Будет удалена'];
            let valid_2 = ['г', 'ги', 'га'];
            let valid_3 = ['п', 'пы', 'па'];

            let a = get_i(count_books); // Индекс окончания для книги
            let b = get_i(count_group); // Индекс окончания для группы

            msgDelete.setBody = `${valid_1[a]} ${count_books} кни${valid_2[a]} и ${count_group} груп${valid_3[b]} книг<br>Продолжить?`;
            msgDelete.show();
            return;
        }

        let valid_1 = ['Будут удалены', 'Будет удалено', 'Будет удален'];
        let valid_2 = ['иков', 'ика', 'ик'];

        let i = get_i(count);

        msgDelete.setBody = `${valid_1[i]} ${count} учен${valid_2[i]}<br>Продолжить?`;
        msgDelete.show();
    }

    function deleteBlock() {
        let checkboxes = document.querySelectorAll(".choice input[type='checkbox']:checked"); // Получаем массив из ID тех, кого нужно удалить

        if (!isUsers) { // Если это книга/группа книг
            for (let item of checkboxes) {
                books.DELETE(item.id);
            }
        } else { // Если читатель
           for (let item of checkboxes) {
                users.DELETE(item.id);
                let userBooks = books.equal(books.translate(), 'userid', item.id);

                if (userBooks) {
                    let values = {
                        'userid': null,
                        'dateofissue': null
                    };

                    let ID;
                    for (let value of userBooks) {
                        ID = books.getIndexFromID(value.id);
                        books.UPDATE(ID, values);
                    }
                }
     
            }
        
        }
        window.location = '';
    }

    let msgDelete = new Message(['Удалить', 'Отменить'], 'Предупреждение', 'Удаление', {cancel:1, type: 'conf'});
    msgDelete.create();
    msgDelete.linkButtons[0].onclick = deleteBlock;

    document.querySelector('#del').onclick = deleteMessage;
    document.addEventListener("keydown", (e) => { if (e.key == "Delete") deleteMessage(); });
}

function createInput(){ // Добавляет панель поиска сверху
    let mainBlock = document.querySelector("main"); // Блок main
    let header = document.createElement('h2');      // Блок для заголовка

    if (GET.group) { // Если группа
        let data = books.translate();
        let name = books.equal(data,'groupid',GET.group, true).name;

        if (name) { // Если у группы есть название (и такое бывает)
            header.innerHTML = `Поиск книг по группе «${name}»`; // Вывод названия группы на экран
        }
    } else { // Если книга/читатель
        header.innerHTML = (isUsers) ? 'Поиск учеников': 'Поиск книг';
    }

    let div = document.createElement('div'); // Блок с параметрами поиска
    div.className = 'find_input';

    let text = `<input type='search' name='q' id='input' autofocus><select name="order">`;

    let arr = {'surname': 'Фамилия', 'firstname': 'Имя', 'lastname': 'Отчество', 'class': 'Класс'}; // Параметры поиска
    if (!isUsers) { // Если не читатель
        arr = {'name': 'Название', 'author': 'Автор', 'inventoryno': 'ID', 'genre': 'Жанр', 'dateofissue': 'Дата'}; // Параметры поиска
    }

    for (let item in arr) { // Конструируем параметры поиска
        text += `<option value='${item}'>${arr[item]}</option>`;
    }
    text += '</select>';

    if (GET.group) text += `<input type='hidden' name='group' value='${GET.group}'>`; // Если страница группы
    if (GET.im)    text += `<input type='hidden' name='im' value='${GET.im}'>`;       // Если страница бронирования
    if (GET.del)   text += "<input type='hidden' name='del' value=1>";                // Если страница сдачи

    text += `<input type='hidden' name='type' value=${GET.type}>`;
    text += '<button type="button" id="submit" tabindex="-1"></button></div>';

    div.innerHTML = text;
    mainBlock.append(header);
    mainBlock.append(div);

    let searchResult = document.createElement("div");
    searchResult.className = "search_result";
    mainBlock.append(searchResult);
}

function createBlock(data, resultArray) { // Создает блок с книгой, читателем или группой
    let a = document.createElement('a');
    let innerHTML;

    if (data.username) { // Если читатель
        a.className = 'result valid';
        a.href = data.href;

        innerHTML = `<div class="left_part">\
                            <div class="choice">\
                                <input type="checkbox" id="${data.id}">\
                                <label for="${data.id}"></label>\
                            </div>`;

        data.books.forEach((book) => {
        	let date = book.dateofissue.split('.'); // Перевод из русской даты в английскую
        	[date[0], date[1]] = [date[1], date[0]];
        	date = date.join('.');

        	let days = 31 - ((Date.now() - new Date(date).getTime())/3600000/24)|0;
        	days += ' дней';
            
            innerHTML += `\
                <div class="book">\
                    <span class="name_book">${book.name}</span>\
                    <span class="autor_book">${book.author}</span>\
                    <span class="date">${days}</span>\
                </div>`;
        });

        innerHTML += `</div>
                <div class="right_part">\
                    <div class="information">${data.fullclass}</div>\
                    <div class="FCS">${data.username}</div>\
                </div>`;

    } else if (data.groupid > 0) { // Если группа
        a.className = data['class']; // Добавляем параметр класс
        if (data.href) a.href = data.href; // Добавляем параметр ссылки

        innerHTML = `<div class="left_part">\
                            <div class="choice">\
                                <input type="checkbox" id="-${data.groupid}">\
                                <label for="-${data.groupid}"></label>\
                            </div>\
                            <div class="information">${data.inventoryno}</div>\
                            <div class="FCS">\
                                <span class="name_book">${data.name}</span>\
                                <span class="autor_book">${data.author}</span>\
                            </div>\
                        </div>`;
    } else { // Если книга   
        a.className = data['class']; // Добавляем параметр класс
        if (data.href) a.href = data.href; // Добавляем параметр ссылки

        let days = 31 - books.getDays(data.dateofissue) + ' дней';

        div_class_date = data.dateofissue ? `<div class="date">${days}</div>` : ''; // Инициализируем дату
        span_username  = data.userid ? `<span>${data.owner}</span>` : 'Свободна'; // Инициализируем читателя, если есть

        innerHTML = `<div class="left_part">
                            <div class="choice">
                                <input type="checkbox" id="${data.id}">
                                <label for="${data.id}"></label>
                            </div>\
                            <div class="FCS">
                                <span class="name_book">${data.name}</span>
                                <span class="autor_book">${data.author}</span>
                                ${div_class_date}
                            </div>
                        </div>
                        <div class="right_part">
                            <div class="information">${data.inventoryno}</div>
                            <div class="FCS">${span_username}</div>\
                        </div>`;
    }

    a.innerHTML = innerHTML;
    resultArray.append(a); // Add new block
}

function send() { // Упаковывает и создает массив при скролле до конца страницы
    if (!allowLoading) return;
    allowLoading = false;

    let data = db.slice(page, page+20);

    for (let i = 0; i < data.length; i++) {
        if (!data[i].id) {
            break;
        }

        if (data[i].firstname) {
            let href = (GET.im) ? `change.html?type=get&bk=${GET.im}&us=`: 'acc.html?type=user&id=';
            
            data[i].fullclass = data[i].class + data[i].letter;
            data[i].username = data[i].surname + ' ' + data[i].firstname + ' ' + data[i].lastname;
            data[i].books = books.equal(books.translate(), 'userid', data[i].id);
            data[i].href = href + data[i].id;

        } else {
            data[i].groupid = (GET.group || GET.del || ['inventoryno', 'dateofissue'].includes(GET.order)) ? false: data[i].groupid;

            if (data[i].groupid) {
                let count = books.COUNT(books.translate(), 'groupid', data[i].groupid);

                data[i].class = 'result group';
                if (!(GET.im && !GET.del && count[0] == count[1])) { // Если все книги в группе незаняты
                    data[i].class += ' valid';
                    data[i].href = `search.html?type=books&q=${GET.q}&im=${GET.im}&del=${GET.del}&order=${GET.orde}&group=${data[i].groupid}`;
                }

                data[i].inventoryno = `${count[0]}/${count[1]}`;

            } else {
                if (data[i].userid) {
                    let user = users.equal(users.translate(), 'id', data[i].userid, true);

                    data[i].owner = `${user.surname} ${user.firstname} ${user.lastname}`;
                }

                let href = "acc.html?type=book&id=";

                if (GET.im && GET.del) { 
                    href = `change.html?type=give&us=${GET.im}&bk=`;
                } else if (GET.im) { 
                    href = `change.html?type=get&us=${GET.im}&bk=`;
                }

                if (GET.im && !GET.del && data[i].userid !== null) {
                    data[i].class = 'result';
                } else { 
                    data[i].class = 'result valid';
                    data[i].href = href + data[i].id;
                }
            }
        }
    }

    add(data);
    allowLoading = true;
}

function parseURL() { // Парсер ссылки на страницу
    let params = {'q':'', 'im': '', 'del': '', 'group': '', 'order': ''};

    for (let item of window.location.search.replace('?','').split('&')) {
        let value = item.split('=');
        params[decodeURIComponent(value[0])] = decodeURIComponent(value[1]);
    }

    // params['q']  = params['q'].match(regex);

    if (params.type == 'users') {
        params.order = (['firstname', 'lastname', 'class', 'letter'].includes(params.order)) ? params.order: 'surname';
    } else {
        params.order = (['author', 'genre', 'inventoryno'].includes(params.order) ) ? params.order: 'name';
    }
    return params;
}

function add(data) { // Добавляет книги/читателей на страницу
    let resultArray = document.querySelector('.search_result');

    if (data.length != 0) {
        for (let i = 0; i < data.length; i++) {
            createBlock(data[i], resultArray);
        }

        page += 20;

    } else {
        if (page == 0) {
            let notice = document.createElement("div");
            notice.classList.add("notification");
            notice.innerHTML = 'Ничего не найдено';
            resultArray.append(notice);
        }
        isEndOfTable = true;
    }
}

function checkEndOfPage() { // Проверяет, дошел ли пользователь до конца страницы
    if (!isEndOfTable && (site.scrollTop + site.clientHeight) * 1.04 >= site.scrollHeight) {
        send();
    }
}

function changeDB(query) { // Меняем результаты поиска
    document.querySelector('.search_result').innerHTML = ''; // Очищаем значения поиска

    db = isUsers ? users.get(query): books.get(query); // Изменяем результаты поиска
    
    isEndOfTable = false;
    page = 0;
    send(); // Выводим результаты на экран
    console.log(`Всего: ${db.length}`)
}

function readySearch() {
    createInput();        // Создаем панель поиска
    new ToolbarControl(); // Создаем новый класс для работы с тулбаром
    messageControl();     // Инициализуем контроль над всплывающими окнами
    listenerControl();    // Инициализируем прослушку различных объектов экрана
    scrollControl();      // Инициализируем контроль над кнопкой для скролла наверх

    send();               // Конструируем первую партию книг
}

// Параметры для работы с скроллом в поиске
let page = 0; // Так сказать, значение, с которого идет отсчет о 20 новых книгах / читателях
let allowLoading = true; // Проверяет, является ли запрос открытым
let isEndOfTable = false; // Проверяет, дошел ли пользователь до конца страницы

// Константы
const site = document.documentElement; // Весь html-документ
const users = new Table('users'); // Инициализируем таблицу читателя
const books = new Table('books'); // Инициализируем таблицу книги

// Параметры для работы с главными компонентами страницы
let GET = parseURL(); // Параметры страницы
let isUsers = (GET.type == 'users'); // Является ли это страницей читателя
let db = isUsers ? users.get(): books.get(); // Массив с БД

document.addEventListener("contentLoaded", (e) => {
    if (e.detail.need_scripts.includes("search.js")){
        readySearch();
    }
});

document.addEventListener('scroll', checkEndOfPage); // Прослушиваем скролл по странице
document.addEventListener("DOMContentLoaded", () => { readySearch(); });