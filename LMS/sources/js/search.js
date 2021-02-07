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

function ready_search() {
    scroll_control();
    let tool = new Toolbar_control();
    return tool;
}

document.addEventListener('scroll', send_control); // Event for listen your scroll in site
document.addEventListener("DOMContentLoaded", () => { tool = ready_search(); });

// Код Djacon
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
                    <div class="information">${data['fullclass']}</div>\
                    <div class="FCS">${data['username']}</div>\
                </div>`;

    } else if (data['groupid'] > 0) { // If group
        
        a.className = data['class']; // Add parameter class
        if (data['href']) a.href = data['href']; // Add parameter href

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
            break;
        }

        if (data[i]['firstname']) {
            let href = (GET['im']) ? `change.html?type=get&bk=${GET['im']}&us=`: 'acc.html?type=user&id=';
            
            data[i]['fullclass'] = data[i]['class'] + data[i]['letter'];
            data[i]['username'] = data[i]['surname'] + ' ' + data[i]['firstname'] + ' ' + data[i]['lastname'];
            data[i]['books'] = books.equal(books.translate(), 'userid', data[i]['id']);
            data[i]['href'] = href + data[i]['id'];

        } else {
            data[i]['groupid'] = (GET['group'] || GET['del'] || GET['order'] == 'inventoryno') ? false : data[i]['groupid'];

            if (data[i]['groupid']) {
                let count = books.COUNT(books.translate(), 'groupid', data[i]['groupid']);

                data[i]['class'] = 'result group';
                if (!(GET['im'] && !GET['del'] && count[0] == count[1])) { // Если все книги в группе незаняты
                    data[i]['class'] += ' valid';
                    data[i]['href'] = `search.html?type=books&q=${GET['q']}&im=${GET['im']}&del=${GET['del']}&order=${GET['order']}&group=${data[i]['groupid']}`;
                }

                data[i]['inventoryno'] = `${count[0]}/${count[1]}`;

            } else {
                if (data[i]['userid']) {
                    let user = users.equal(users.translate(), 'id', data[i]['userid'])[0];

                    data[i]['owner'] = `${user['surname']} ${user['firstname']} ${user['lastname']}`;
                }

                let href = "acc.html?type=book&id=";

                if (GET['im'] && GET['del']) { 
                    href = `change.html?type=give&us=${GET['im']}&bk=`;
                } else if (GET['im']) { 
                    href = `change.html?type=get&us=${GET['im']}&bk=`;
                }

                if (GET['im'] && !GET['del'] && data[i]['userid'] !== null) {
                    data[i]['class'] = 'result';
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

    for (item of window.location.search.replace('?','').split('&')) {
        let value = item.split('=');
        params[decodeURIComponent(value[0])] = decodeURIComponent(value[1]);
    }

    // params['q']  = params['q'].match(regex);

    if (params['type'] == 'users') {
        params['order'] = (['firstname', 'lastname', 'class', 'letter'].includes(params['order'])) ? params['order']: 'surname';
    } else {
        params['order'] = (['author', 'genre', 'inventoryno'].includes(params['order']) ) ? params['order']: 'name';
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

function send_control() { // Функция, которая вызывает другую функцию когда пользователь доходит до конца страницы
    if (!is_end_of_table && (site.scrollTop + site.clientHeight) * 1.04 >= site.scrollHeight) {
        send();
    }
}