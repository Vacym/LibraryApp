function scroll_control() {
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

class Toolbar_control {
    constructor() {
        this.toolbar = document.querySelector(".toolbar"); //Определяем тулбар
        this.dedicated = document.querySelector("#summ_checked>span"); //Определяем число с количеством выделенных элементов
        this.box_element = document.querySelector(".search_result"); //Определяем блок со всеми элементами
        this.append_listener_for_new_change();
        document.querySelector("#remove").onclick = () => this.remove();
    }

    //Добавление прослушивания для новых элементов (которые создаются при прокрутке страницы)
    append_listener_for_new_change(how_mach) {
        this.inputs = document.querySelectorAll(".choice input[type='checkbox']");
        if (!how_mach) { how_mach = this.inputs.length; }
        for (let i = this.inputs.length - how_mach; i < this.inputs.length; i++) {
            this.inputs[i].addEventListener("change", () => this.move_control());
        }
    }

    //Движение тулбара
    move_control() {
        let show_tool = false;
        let counter = 0;
        let edit = document.querySelector(".toolbar #edit");

        for (let i = 0; i < this.inputs.length; i++) {
            if (this.inputs[i].checked) {
                this.inputs[i].parentNode.parentNode.parentNode.classList.add("selected");
                show_tool = true;
                counter += 1;
            }
            else{
                this.inputs[i].parentNode.parentNode.parentNode.classList.remove("selected");
            }
        }
        if(counter > 1){
            edit.classList.add("deactiv");
        }else{
            edit.classList.remove("deactiv");
        }

        this.dedicated.innerHTML = counter.toString();
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
        for (let i = 0; i < this.inputs.length; i++) {
            this.inputs[i].checked = false;
        }
        this.move_control();
    }

}

function listener_control(){


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

    document.querySelector('#input').addEventListener('input', function (e) { // Обновляет результаты поиска при написании кода
        GET.q = e.target.value;
        changeDB(GET.q);
    });

    document.querySelector("select").addEventListener('change', function (e) { // Обновляет результаты поиска при изменении категории 
        GET.order = e.target.value; // Призваиваем списку новое значение
        changeDB(GET.q); // Меняем результаты поиска
    });
}

function message_control(){
    var msgDelete = new Message(['Удалить', 'Отменить'], 'Предупреждение', 'Удаление', {cancel:1, type: 'conf'});
    msgDelete.create_message();

    document.querySelector('#del').onclick = function() { // Запускается, когда пользователь нажимает на кнопку удалить
        let count = document.querySelectorAll(".choice input[type='checkbox']:checked").length;

        if (!isUsers) {
            let count_group = document.querySelectorAll(".group .choice input[type='checkbox']:checked").length;
            let count_books = count - count_group;

            let valid_1 = ['Будут удалены', 'Будет удалено', 'Будет удалена'];
            let valid_2 = ['г', 'ги', 'га'];
            let valid_3 = ['п', 'пы', 'па'];

            function get_i(count) {
                if (count%10 >= 5 || count%10 == 0 || count%100 > 10 && count%100 <= 20) i = 0;
                else if (count%10 >= 2 && count%10 < 5)                                  i = 1;
                else                                                                     i = 2;
                return i;
            }
            let a = get_i(count_books); // index of count_books
            let b = get_i(count_group); // index of count_groups

            msgDelete.set_body = `${valid_1[a]} ${count_books} кни${valid_2[a]} и ${count_group} груп${valid_3[b]} книг<br>Продолжить?`;
            msgDelete.show_message();
            return;
        }

        let valid_1 = ['Будут удалены', 'Будет удалено', 'Будет удален'];
        let valid_2 = ['иков', 'ика', 'ик'];

        if (count%10 >= 5 || count%10 == 0 || count%100 > 10 && count%100 <= 20) i = 0;
        else if (count%10 >= 2 && count%10 < 5)                                  i = 1;
        else                                                                     i = 2;

        msgDelete.set_body = `${valid_1[i]} ${count} учен${valid_2[i]}<br>Продолжить?`;
        msgDelete.show_message();
    };

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

function ready_search() {
    definition_variables();
    create_input();
    message_control();
    listener_control();
    scroll_control();
    send();

    let tool = new Toolbar_control();
    return tool;
}


document.addEventListener("contentLoaded", (event) => {
    if (event.detail.need_scripts.includes("search.js")){
        tool = ready_search();
    }
});

document.addEventListener('scroll', send_control); // Event for listen your scroll in site
document.addEventListener("DOMContentLoaded", () => { tool = ready_search(); });

// Код Djacon
var page = 0; // Так сказать, значение, с которого идет отсчет о 20 новых книгах / учениках
var allowLoading = true; // Check, if request is free
var is_end_of_table = false; // Check, if table is finished in database
var site = document.documentElement; // All html document

function create_input(){
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

function create_block(data, list_table) { // Создает блок с книгой/группой книг/учеником
    let a = document.createElement('a');
    let innerHTML;

    if (data.username) { // If user
        a.className = 'result valid';
        a.href = data.href;

        innerHTML = `<div class="left_part">\
                            <div class="choice">\
                                <input type="checkbox" id="${data.id}">\
                                <label for="${data.id}"></label>\
                            </div>`;

        data.books.forEach((book) => {
            innerHTML += `\
                <div class="book">\
                    <span class="name_book">${book.name}</span>\
                    <span class="autor_book">${book.author}</span>\
                    <span class="date">${book.dateofissue}</span>\
                </div>`;
        });

        innerHTML += `</div>
                <div class="right_part">\
                    <div class="information">${data.fullclass}</div>\
                    <div class="FCS">${data.username}</div>\
                </div>`;

    } else if (data.groupid > 0) { // If group
        
        a.className = data['class']; // Add parameter class
        if (data.href) a.href = data.href; // Add parameter href

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

    } else { // If book
        
        a.className = data['class']; // Add parameter class
        if (data.href) a.href = data.href; // Add parameter href

        div_class_date = data.dateofissue ? `<div class="date">${data.dateofissue}</div>` : ''; //Init date parameter
        span_username  = data.userid ? `<span>${data.owner}</span>` : 'Свободна'; // Init username if exist

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
            create_block(data[i], list_table);
        }
        if (page != 0) tool.append_listener_for_new_change();

        page += 20;

    } else {
        if (page == 0) list_table.innerHTML = 'Ничего не найдено';

        console.log('THE END');
        is_end_of_table = true;
    }
}

function send_control() { // Функция, которая вызывает другую функцию когда пользователь доходит до конца страницы
    if (!is_end_of_table && (site.scrollTop + site.clientHeight) * 1.04 >= site.scrollHeight) {
        send();
    }
}

// Часть кода, отвечающая за верхний тулбар


function changeDB(query) { // Меняем результаты поиска
    document.querySelector('.search_result').innerHTML = ''; // Стираем значение поиска

    db = (isUsers) ? users.get(query) : books.get(query); // Изменяем результаты поиска
    
    is_end_of_table = false;
    page = 0;
    send(); // Выводим результаты на экран
    tool.append_listener_for_new_change();
}

function definition_variables(){
    GET = parseURL();
    isUsers = (GET.type == 'users');

    db = isUsers ? users.get(): books.get();
}

let GET;
let isUsers;
let db;