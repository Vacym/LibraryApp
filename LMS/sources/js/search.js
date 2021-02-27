function scrollControl() {
    function check_scroll() {
        let scroll = window.pageYOffset;
        let screen_height = document.documentElement.clientHeight / 4;

        if (scroll > screen_height) {
            but_up.classList.remove('hidden');
        } else {
            but_up.classList.add('hidden');
        }
    }

    function go_top() {
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
    window.addEventListener('scroll', check_scroll);
    but_up.addEventListener('click', go_top);
}

function checkChoiceClick(e){
    if (e.which == 1 && e.ctrlKey && e.isTrusted){ // Если правая кнопка мыши и удерживается ctrl
        e.preventDefault(); // Блокируем поведение по умолчанию
        
        for (var result of e.path) if (result.classList.contains("result")) break; // Находим материнский блок

        result.querySelector(".choice input[type='checkbox']").click(); // Имитируем клик на checkbox
    }
}

class ToolbarControl {
    constructor() {
        this.inputs = []; // Массив с checkbox'ами
        this.toolbar = document.querySelector(".toolbar"); //Определяем тулбар
        this.dedicated = document.querySelector("#summ_checked>span"); //Определяем число с количеством выделенных элементов
        this.box_element = document.querySelector(".search_result"); //Определяем блок со всеми элементами

        let observer = new MutationObserver( (m) => this.append_listener_for_new_change(m) );
        observer.observe(this.box_element, {childList: true}); // Прослушка на добавление блоков

        document.querySelector("#remove").onclick = () => this.remove(); // Кнопка отключения всех галочек
    }

    //Добавление прослушивания для новых элементов (которые создаются при прокрутке страницы)
    append_listener_for_new_change(mutations) {
        for(let mutation of mutations){
            for (let node of mutation.addedNodes){ // Каждый элеиент из добавленных
                if (node.classList.contains("notification")) continue; // Если это уведомление, пропускаем
                this.inputs.push(node); //Добавляем в список
                // И начинаем прослушивать
                node.querySelector(".choice input[type='checkbox']").addEventListener("change", () => this.move_control());
                node.addEventListener("click", checkChoiceClick);
            }
            for (let node of mutation.removedNodes){ // Каждый элемент из удлённых
                if (node.classList.contains("notification")) continue;
                node.removeEventListener("click", checkChoiceClick); // Удаляем прослушку
                this.inputs.splice(this.inputs.indexOf(node), 1); // Удаляем из списка
            }
        }
        this.move_control();
    }

    //Движение тулбара
    move_control() {
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
        this.toolbar_show(show_tool);
    }

    //Переключение видимости
    toolbar_show(show) {
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
        this.move_control();
    }
}

function listenerControl(){
    document.querySelector('#edit').onclick = function() { // Запускается когда пользователь нажимает на карандашик
        let checkboxes = document.querySelectorAll(".choice input[type='checkbox']:checked");
        let count = checkboxes.length;

        if (count != 1) {
            console.log('Пока что невозможно редактирование нескольких книг!');
            return;
        }

        let ID = parseInt(checkboxes[0].id);

        if (isUsers) {
            window.location = `acc.html?type=user&id=${ID}&choose=edit`; // Это надо будет исправить
        } else {
            if (ID < 0) { // Если эта группа
                window.location = `acc.html?type=group&id=${-ID}&choose=edit`; // Это надо будет исправить
            } else {
                window.location = `acc.html?type=book&id=${ID}&choose=edit`; // Это надо будет исправить
            }
        }
    };

    document.querySelector('#input').addEventListener('input', (e) => { // Обновляет результаты поиска при написании кода
        GET.q = e.target.value;
        changeDB(GET.q);
    });

    document.querySelector("select").addEventListener('change', (e) => { // Обновляет результаты поиска при изменении категории 
        GET.order = e.target.value; // Призваиваем списку новое значение
        changeDB(GET.q); // Меняем результаты поиска
    });
}

function messageControl(){
    var msgDelete = new Message(['Удалить', 'Отменить'], 'Предупреждение', 'Удаление', {cancel:1, type: 'conf'});
    msgDelete.create();

    document.querySelector('#del').onclick = deleteBlocks;
    document.addEventListener("keydown", (e) => { if (e.key == "Delete") deleteBlocks(); });

    function deleteBlocks(){  // Запускается, когда пользователь нажимает на кнопку удалить или на клавишу delete
        let count = document.querySelectorAll(".choice input[type='checkbox']:checked").length;
        if (count < 1) return;

        function get_i(count) {
            let i;
            if (count%10 >= 5 || count%10 == 0 || count%100 > 10 && count%100 <= 20) i = 0;
            else if (count%10 >= 2 && count%10 < 5)                                  i = 1;
            else                                                                     i = 2;
            return i;
        }
    
        if (!isUsers) {
            let count_group = document.querySelectorAll(".group .choice input[type='checkbox']:checked").length;
            let count_books = count - count_group;

            let valid_1 = ['Будут удалены', 'Будет удалено', 'Будет удалена'];
            let valid_2 = ['г', 'ги', 'га'];
            let valid_3 = ['п', 'пы', 'па'];

            let a = get_i(count_books); // index of count_books
            let b = get_i(count_group); // index of count_groups

            msgDelete.set_body = `${valid_1[a]} ${count_books} кни${valid_2[a]} и ${count_group} груп${valid_3[b]} книг<br>Продолжить?`;
            msgDelete.show();
            return;
        }

        let valid_1 = ['Будут удалены', 'Будет удалено', 'Будет удален'];
        let valid_2 = ['иков', 'ика', 'ик'];

        let i = get_i(count);

        msgDelete.set_body = `${valid_1[i]} ${count} учен${valid_2[i]}<br>Продолжить?`;
        msgDelete.show();
    }

    msgDelete.link_buttons[0].onclick = () => { // Если пользователь решил удалить книги/учеников
        let checkboxes = document.querySelectorAll(".choice input[type='checkbox']:checked"); // Get all values of checkboxes in users

        if (!isUsers) {
            for (let item of checkboxes) {
                books.DELETE(item.id);
            }
            // result("Книги успешно удалены!");
            window.location = '';
        }

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
        // msgDelete.set_body = "Ученики успешно удалены!"
        window.location = '';
    };
}

function readySearch() {
    definition_variables();
    createInput();
    new ToolbarControl();
    messageControl();
    listenerControl();
    scrollControl();

    send();
}

document.addEventListener("contentLoaded", (event) => {
    if (event.detail.need_scripts.includes("search.js")){
        readySearch();
    }
});

document.addEventListener('scroll', checkEndOfPage); // Прослушиваем скролл по странице
document.addEventListener("DOMContentLoaded", () => { readySearch(); });

// Код Djacon
var page = 0; // Так сказать, значение, с которого идет отсчет о 20 новых книгах / учениках
var allowLoading = true; // Check, if request is free
var isEndOfTable = false; // Check, if table is finished in database
var site = document.documentElement; // All html document

function createInput(){ // Доб
    let main_place = document.querySelector("main");
    let header = document.createElement('h2');

    if (GET.group) {
        let data = books.translate();
        let name = books.equal(data,'groupid',GET.group)[0].name;

        if (name) {
            header.innerHTML = `Поиск книг по группе «${name}»`; // Print name of group
        }
    } else {
        header.innerHTML = (isUsers) ? 'Поиск учеников': 'Поиск книг';
    }

    let div = document.createElement('div');
    div.className = 'find_input';

    let text = `<input type='search' name='q' id='input' autofocus>
                <select name="order">`;

    let arr = {'surname': 'Фамилия', 'firstname': 'Имя', 'lastname': 'Отчество', 'class': 'Класс'};

    if (!isUsers) {
        arr = {'name': 'Название', 'author': 'Автор', 'inventoryno': 'ID', 'genre': 'Жанр'};
    }

    for (let item in arr) {
        text += `<option value='${item}'>${arr[item]}</option>`;
    }
    text += '</select>';

    if (GET.group) text += `<input type='hidden' name='group' value='${GET.group}'>`;
    if (GET.im)    text += `<input type='hidden' name='im' value='${GET.im}'>`;
    if (GET.del)   text += "<input type='hidden' name='del' value=1>";

    text += `<input type='hidden' name='type' value=${GET.type}>`;
    text += '<button type="button" id="submit"></button></div>';

    div.innerHTML = text;
    main_place.append(header);
    main_place.append(div);

    sr = document.createElement("div");
    sr.className = "search_result";
    main_place.append(sr);
}

function createBlock(data, list_table) { // Создает блок с книгой/группой книг/учеником
    let a = document.createElement('a');
    let innerHTML;

    if (data.username) { // Если ученик
        a.className = 'result valid';
        a.href = data.href;

        innerHTML = `<div class="left_part">\
                            <div class="choice">\
                                <input type="checkbox" id="${data.id}">\
                                <label for="${data.id}"></label>\
                            </div>`;

        data.books.forEach((book) => {
        	let date = book.dateofissue.split('.'); // Перевод из русской даты в английскую
        	[date[0], date[1]] = [date[1], date[0]]
        	date = date.join('.');

        	let days = ((Date.now() - new Date(date).getTime())/3600000/24)|0
        	days = (days) ? days + ' дней': 'Сегодня';
            
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

        div_class_date = data.dateofissue ? `<div class="date">${data.dateofissue}</div>` : ''; // Инициализируем дату
        span_username  = data.userid ? `<span>${data.owner}</span>` : 'Свободна'; // Инициализируем читателя, если есть

        innerHTML = `<div class="left_part">\
                            <div class="choice">\
                                <input type="checkbox" id="${data.id}">\
                                <label for="${data.id}"></label>\
                            </div>\
                            <div class="FCS">\
                                <span class="name_book">${data.name}</span>\
                                <span class="autor_book">${data.author}</span>\
                                ${div_class_date}\
                            </div>\
                        </div>\
                        <div class="right_part">\
                            <div class="information">${data.inventoryno}</div>
                            <div class="FCS">${span_username}</div>\
                        </div>`;
    }

    a.innerHTML = innerHTML;
    list_table.append(a); // Add new block
}

function send() { // Упакувывает и создает массив при скролле до конца страницы
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
            data[i].groupid = (GET.group || GET.del || GET.order == 'inventoryno') ? false : data[i].groupid;

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
                    let user = users.equal(users.translate(), 'id', data[i].userid)[0];

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

function add(data) { // Добавляет книги/учеников на страницу
    let list_table = document.querySelector('.search_result');

    if (data.length != 0) {
        console.log("New stack...");

        for (let i = 0; i < data.length; i++) {
            createBlock(data[i], list_table);
        }

        page += 20;

    } else {
        if (page == 0) {
            let notice = document.createElement("div");
            notice.classList.add("notification");
            notice.innerHTML = 'Ничего не найдено';
            list_table.append(notice);
        }

        console.log('THE END');
        isEndOfTable = true;
    }
}

function checkEndOfPage() { // Функция, которая вызывает другую функцию когда пользователь доходит до конца страницы
    if (!isEndOfTable && (site.scrollTop + site.clientHeight) * 1.04 >= site.scrollHeight) {
        send();
    }
}

// Часть кода, отвечающая за верхний тулбар
function changeDB(query) { // Меняем результаты поиска
    document.querySelector('.search_result').innerHTML = ''; // Стираем значение поиска

    db = isUsers ? users.get(query) : books.get(query); // Изменяем результаты поиска
    
    isEndOfTable = false;
    page = 0;
    send(); // Выводим результаты на экран
}

function definition_variables(){
    GET = parseURL();
    isUsers = (GET.type == 'users');

    db = isUsers ? users.get(): books.get();
}

let db; // Массив с БД
let GET; // Параметры страницы
let isUsers; // Является ли это страницей ученика
const users = new Table('users'); // Инициализируем таблицу ученика
const books = new Table('books'); // Инициализируем таблицу книги