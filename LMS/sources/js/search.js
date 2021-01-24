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
        let fps = 60
        let need_time = 150 //в милисекундах

        let iterations = (window.pageYOffset / (need_time / 1000) / fps)
        scrolling()
    }

    let but_up = document.querySelector('#up');
    window.addEventListener('scroll', check_scroll)
    but_up.addEventListener('click', go_top)
}

class Toolbar_control {
    constructor() {
        this.toolbar = document.querySelector(".toolbar") //Определяем тулбар
        this.dedicated = document.querySelector("#summ_checked>span") //Определяем число с количеством выделенных элементов
        this.box_element = document.querySelector(".search_result") //Определяем блок со всеми элементами
        this.append_listener_for_new_change()
        document.querySelector("#remove").onclick = () => this.remove()
    }

    //Добавление прослушивания для новых элементов (которые создаются при прокрутке страницы)
    append_listener_for_new_change(how_mach) {
        this.inputs = document.querySelectorAll(".choice input[type='checkbox']")
        if (!how_mach) { how_mach = this.inputs.length }
        for (let i = this.inputs.length - how_mach; i < this.inputs.length; i++) {
            this.inputs[i].addEventListener("change", () => this.move_control())
        }
    }

    //Движение тулбара
    move_control() {
        let show_tool = false
        let counter = 0
        for (let i = 0; i < this.inputs.length; i++) {
            if (this.inputs[i].checked) {
                this.inputs[i].parentNode.parentNode.parentNode.classList.add("selected")
                show_tool = true
                counter += 1
            }
            else{
                this.inputs[i].parentNode.parentNode.parentNode.classList.remove("selected")
            }
        }
        this.dedicated.innerHTML = counter.toString()
        this.toolbar_show(show_tool)
    }

    //Переключение видимости
    toolbar_show(show) {
        if (show) {
            this.box_element.classList.add("selecting")
            this.toolbar.classList.add("show")
        } else {
            this.box_element.classList.remove("selecting")
            this.toolbar.classList.remove("show")
        }
    }

    //Отменя выделения для всех элементов
    remove() {
        for (let i = 0; i < this.inputs.length; i++) {
            this.inputs[i].checked = 0
        }
        this.move_control()
    }

}

function ready_search() {
    scroll_control()
    let tool = new Toolbar_control()
    return tool
}

document.addEventListener('scroll', ready); // Event for listen your scroll in site
document.addEventListener("DOMContentLoaded", () => { tool = ready_search() })


// Мой код
class Table { // Класс для работы с библиотекой
    constructor(name) {
        this.name = name + '.json';
    }

    get() { // Возращает таблицу измененную под определенные настройкт
        if (GET['im'] && GET['del']) { // Если это страница с откреплением книги от ученика
            let data = this.LIKE(this.ORDER_BY(this.translate(), GET['order']), GET['order'], GET['q']);
            let result = [];
            
            for (let item of data) {
                if (item['userid'] == GET['im']) {
                    result.push(item)
                }
            }

            return result;
        } else if (GET['group']) { // Если это страница с развернутой группой книг
            let data = this.LIKE(this.translate(), GET['order'], GET['q']);
            let result = [];

            for (let item of data) {
                if (item['groupid'] == GET['group']) {
                    result.push(item);
                }
            }
            return result;
        } else { // Если это обычная страница
            let data = this.LIKE(this.ORDER_BY(this.translate(), GET['order']), GET['order'], GET['q']);
            
            let result = [];
            let groups = [];

            for (let item of data) {
                if (item['groupid'] > 0) {
                    if (!groups.includes(item['groupid'])) {
                        result.push(item);
                        groups.push(item['groupid']);
                    }
                } else {
                    result.push(item)
                }
            }
            return result;
        }
    }

    equal(traspose, param, value) { // Возвращает массив с столбцами, где параметр равен определонному значению (Н-ер где name = Иван)
        let result = [];
        for (let item in traspose) {
            if (value == traspose[item][param]) {
                result.push(traspose[item]);
            }
        }
        return result;
    }

    CREATE(params) { // Создает таблицу
        try {
            fs.writeFileSync(this.name, JSON.stringify(params));
        } catch (err) {
            console.log('ОШИБКА СОЗДАНИЯ ТАБЛИЦЫ', err);
        }
    }

    SELECT(value) { // Возвращает таблицу с данными
        try {
            return JSON.parse(fs.readFileSync(this.name, 'utf8'));
        } catch (err) {
            console.log('ОШИБКА ЧТЕНИЯ ТАБЛИЦЫ', err);
        }
    }

    ORDER_BY(data, param) { // Сортировка по определенному параметру столбца
        let choose = this.SELECT()[param]['options'][0];

        switch (choose) {
            case 'num':  return data.sort((a,b) => a[param] - b[param]);
            case 'text': return data.sort((a,b) => { return (a[param] < b[param]) ? -1: (a[param] > b[param]) ? 1: 0 } )
        }
        return data;
    }

    LIKE(data, value, query) { // Выводит те книги, чьи значения совпали со значением, введенным пользователем
        query = query.toLowerCase();
        let result = [];

        for (let item of data) {
            if (String(item[value]).toLowerCase().startsWith(query)) {
                result.push(item);
            }
        }
        return result;
    }

    DELETE(id) { // Удаляет стобец через его ID
        let data = this.translate();
        let params = this.SELECT();

        if (id < 0) { // Если эта группа...
            let groups = [];
            for (let item in data) {
                if (data[item]['groupid'] == -id) {
                    groups.push(item);
                }
            }

            let arr = [];
            let values = [];

            for (let item in params) {
                values = params[item]['users'];
                for (let i in values) {
                    if (!groups.includes(i)) {
                        arr.push(values[i])
                    }
                }
                params[item]['users'] = arr;
                arr = [];
            }
        } else {
            for (let item in data) {
                if (data[item]['id'] == id) {
                    id = item;
                }
            }

            for (let item in params) {
                params[item]['users'].splice(id,1);
            }
        }
        
        this.write(params);
    }

    UPDATE(id, values) { // Обновляем значения столбца на значения из словаря values
        let data = this.SELECT();
        for (item in values) {
            data[item]['users'][id] = values[item];
        }

        this.write(data); // Записываем изменения в таблицу
    }

    COUNT(data, param, value) { // Уникальная функция, возращает количество занятых книг и общее количество книг
        let all = 0;
        let busy = 0;

        for (let item of data) {
            if (item[param] == value) {
                if (item['userid']) {
                    busy++;
                }
                all++;
            }
        }
        return `${busy}/${all}`;
    }

    write(params) { // Переписывает данные таблицы на свои
        try {
            fs.writeFileSync(this.name, JSON.stringify(params));
        } catch (err) {
            console.log('ОШИБКА ИЗМЕНЕНИЯ ТАБЛИЦЫ', err);
        }
    }

    translate(data=this.SELECT()) { // Возвращает данные таблицу в человеческом виде
        let result = [];
        for (let i = 0; i < data['id']['users'].length; i++) {
            result[i] = {};
            for (let item in data) {
                result[i][item] = data[item]['users'][i];
            }
        }
        return result;
    }

    getIndexFromID(ID) { // Возвращает индекс столбца, исходя из его id
        let data = this.SELECT()['id']['users']; // Сохраняем значения всех id, чтобы идентифицировать нашего ученика или книгу

        for (let index in data) {
            if (data[index] == ID) {
                return index;
            }
        }
    }
}

var fs = require("fs"); // Подключаем библиотеку для работы с файловой системой
var page = 0; // Так сказать, значение, с которого идет отсчет о 20 новых книгах / учениках
var allowLoading = true; // Check, if request is free
var is_end_of_table = false; // Check, if table is finished in database
var site = document.documentElement; // All html document

function create_block(data) { // Создает блок с книгой/группой книг/учеником
    let a = document.createElement('a');

    if (data['username']) { // If user
        a.className = 'result valid';
        a.href = data['href'];

        var innerHTML = `<div class="left_part">\
                            <div class="choice">\
                                <input type="checkbox" id="${data['id']}">\
                                <label for="${data['id']}"></label>\
                            </div>`;

        data['books'].forEach((book) => {
            innerHTML += `\
                <div class="book">\
                    <span class="name_book">${book['name']}</span>\
                    <span class="autor_book">${book['author']}</span>\
                    <span class="date">${book['dateofissue']}</span>\
                </div>`;
        })

        innerHTML += `</div>
                <div class="right_part">\
                    <div class="information">${data['class']}</div>\
                    <div class="FCS">${data['username']}</div>\
                </div>`;

    } else if (data['groupid'] > 0) { // If group
        
        a.className = "result valid group"; // Add parameter class
        a.href = data['href'] // Add parameter href

        var innerHTML = `<div class="left_part">\
                            <div class="choice">\
                                <input type="checkbox" id="-${data['groupid']}">\
                                <label for="-${data['groupid']}"></label>\
                            </div>\
                            <div class="information">${data['inventoryno']}</div>\
                            <div class="FCS">\
                                <span class="name_book">${data['name']}</span>\
                                <span class="autor_book">${data['author']}</span>\
                            </div>\
                        </div>`;

    } else { // If book
        
        a.className = data['class']; // Add parameter class
        if (data['href']) a.href = data['href']; // Add parameter href

        div_class_date = data['dateofissue'] ? `<div class="date">${data['dateofissue']}</div>` : ''; //Init date parameter
        span_username  = data['userid'] ? `<span>${data['owner']}</span>` : 'Свободна'; // Init username if exist

        var innerHTML = `<div class="left_part">\
                            <div class="choice">\
                                <input type="checkbox" id="${data['id']}">\
                                <label for="${data['id']}"></label>\
                            </div>\
                            <div class="FCS">\
                                <span class="name_book">${data['name']}</span>\
                                <span class="autor_book">${data['author']}</span>\
                                ${div_class_date}\
                            </div>\
                        </div>\
                        <div class="right_part">\
                            <div class="information">${data['inventoryno']}</div>
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
        if (!data[i]['id']) {
            break
        }

        if (data[i]['firstname']) {
            let href = (GET['im']) ? `get.html?bk=${GET['im']}&us=`: 'account.html?id=';
            
            data[i]['class'] = data[i]['class'] + data[i]['letter'];
            data[i]['username'] = data[i]['surname'] + ' ' + data[i]['firstname'] + ' ' + data[i]['lastname'];
            data[i]['books'] = books.equal(books.translate(), 'userid', data[i]['id']);
            data[i]['href'] = href + data[i]['id'];

        } else {
            data[i]['groupid'] = GET['group'] || GET['del'] || (GET['order'] == 'inventoryno' && GET['q']) ? 0: data[i]['groupid'];

            if (data[i]['groupid']) {
                let count = books.COUNT(books.translate(), 'groupid', data[i]['groupid']);

                data[i]['inventoryno'] = count;
                data[i]['href'] = `search_book.html?q=${GET['q']}&im=${GET['im']}&del=${GET['del']}&order=${GET['order']}&group=${data[i]['groupid']}`;

            } else {
                if (data[i]['userid']) {
                    let user = users.equal(users.translate(), 'id', data[i]['userid'])[0];

                    data[i]['owner'] = `${user['surname']} ${user['firstname']} ${user['lastname']}`;
                }

                let href = "books.html?id=";

                if (GET['im'] && GET['del']) { 
                    href = `give.html?us=${GET['im']}&bk=`;
                } else if (GET['im']) { 
                    href = `get.html?us=${GET['im']}&bk=`;
                }

                if (GET['im'] && !GET['del'] && data[i]['userid'] !== null) {
                    data[i]['class'] = 'result';
                    data[i]['href'] = '';
                } else { 
                    data[i]['class'] = 'result valid';
                    data[i]['href'] = href + data[i]['id'];
                }
            }
        }
    }

    add(data)
    allowLoading = true;
}

function parseURL() { // Парсер ссылки на страницу
    let params = {'q':'', 'im': '', 'del': '', 'group': '', 'order': ''};
    let regex = /^([а-яё-]|\d)+|\s*$/i // это надо будет исправить

    for (item of window.location.search.replace('?','').split('&')) {
        let value = item.split('=');
        params[decodeURIComponent(value[0])] = decodeURIComponent(value[1]);
    }

    // params['q']  = params['q'].match(regex);

    if (isUsers) {
        params['order'] = (['firstname', 'lastname', 'class', 'letter'].includes(params['order'])) ? params['order']: 'surname';
    } else {
        params['order'] = (['author', 'genre', 'inventoryno', 'dateofissue'].includes(params['order']) ) ? params['order']: 'name';
    }
    return params
}

function add(data) { // Добавляет книги/учеников на страницу
    if (data.length != 0) {
        console.log("New stack...")

        for (let i = 0; i < data.length; i++) {
            create_block(data[i]);
        }
        if (page != 0) tool.append_listener_for_new_change();

        page += 20;

    } else {
        if (page == 0) list_table.innerHTML = 'Ничего не найдено';

        console.log('THE END')
        is_end_of_table = true;
    }
}

function result(data) {
    document.querySelector('.alert_message').innerHTML = data;
    document.querySelector(".but_window_space").remove();

    cancel_button = document.getElementById("cancel");
    cancel_button.innerHTML = 'Ок';
    cancel_button.onclick = () => { window.location = ''; }
}

function ready() { // Функция, которая вызывает другую функцию когда пользователь доходит до конца страницы
    if (!is_end_of_table && (site.scrollTop + site.clientHeight) * 1.04 >= site.scrollHeight) {
        send();
    }
}