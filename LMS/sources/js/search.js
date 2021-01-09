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
        console.log(this.inputs)
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


// Мой код, принимающий массив с данными и преобразующий его в блоки

var page = 1;
var allowLoading = true; // Check, if request is free
var is_end_of_books = false; // Check, if books is finished in database
var site = document.documentElement; // All html document

function create_block(data) {

    a = document.createElement('a');

    if (data['Username']) { // If user

        a.className = 'result valid';
        a.href = data['href'];

        var innerHTML = `<div class="left_part">\
                            <div class="choice">\
                                <input type="checkbox" id="${data['ID']}">\
                                <label for="${data['ID']}"></label>\
                            </div>`;

        data['books'].forEach((book) => {

            innerHTML += `\
                <div class="book">\
                    <span class="name_book">${book['Name']}</span>\
                    <span class="autor_book">${book['Author']}</span>\
                    <span class="date">${book['Date']}</span>\
                </div>`;
        })

        innerHTML += `</div>
                <div class="right_part">\
                    <div class="information">${data['Class']}</div>\
                    <div class="FCS">${data['Username']}</div>\
                </div>`;

    } else if (data['Group_ID'] > 0) { // If group
        
        a.className = "result valid group"; // Add parameter class
        a.href = data['href'] // Add parameter href

        var innerHTML = `<div class="left_part">\
                            <div class="choice">\
                                <input type="checkbox" id="-${data['Group_ID']}">\
                                <label for="-${data['Group_ID']}"></label>\
                            </div>\
                            <div class="information">${data['Inventory_NO']}</div>\
                            <div class="FCS">\
                                <span class="name_book">${data['Name']}</span>\
                                <span class="autor_book">${data['Author']}</span>\
                            </div>\
                        </div>`;

    } else { // If book
        
        a.className = data['Class']; // Add parameter class
        if (data['href']) a.href = data['href']; // Add parameter href

        div_class_date = data['Date_of_issue'] ? `<div class="date">${data['Date_of_issue']}</div>` : ''; //Init date parameter
        span_username  = data['User_id'] ? `<span>${data['Owner']}</span>` : 'Свободна'; // Init username if exist

        var innerHTML = `<div class="left_part">\
                            <div class="choice">\
                                <input type="checkbox" id="${data['ID']}">\
                                <label for="${data['ID']}"></label>\
                            </div>\
                            <div class="FCS">\
                                <span class="name_book">${data['Name']}</span>\
                                <span class="autor_book">${data['Author']}</span>\
                                ${div_class_date}\
                            </div>\
                        </div>\
                        <div class="right_part">\
                            <div class="information">${data['Inventory_NO']}</div>
                            <div class="FCS">${span_username}</div>\
                        </div>`;
    }

    a.innerHTML = innerHTML;
    list_books.append(a); // Add new block
}

function add(data) {
    console.log("New stack...")
    if (data != "Ничего не найдено") {
        data = JSON.parse(data);

        for (let i = 0; i < data.length; i++) {
            create_block(data[i]);
        }
        tool.append_listener_for_new_change();
        page += 20;
            
    } else {
        if (page === 1) list_books.innerHTML = "Ничего не найдено";

        is_end_of_books = true;
    }
}

function result(data) {
    document.querySelector('.alert_message').innerHTML = data;
    document.querySelector(".but_window_space").remove();

    cancel_button = document.getElementById("cancel");
    cancel_button.innerHTML = 'Ок';
    cancel_button.onclick = () => { window.location = ''; }
}

function ajax(url, success, method, data="") { // Send and Get Ajax-request
    if (!allowLoading) return
    allowLoading = false;

    var request = new XMLHttpRequest();

    request.onreadystatechange = function() { // If request is comeback
        if (request.readyState == 4 && request.status == 200) {
            var req = request.responseText;
            success(req); // If success request, call function
            allowLoading = true;
        }
    }
    request.open(method, url);
    
    if (method == 'GET') request.setRequestHeader('Content-Type', 'application/x-www-form-url');
    else                 request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    
    request.send(data); // Send ajax request
}

function ready() {
    if (!is_end_of_books && (site.scrollTop + site.clientHeight) * 1.04 >= site.scrollHeight) {
        ajax(url + page, add, 'GET');
    }
}

document.addEventListener('scroll', ready); // Event for listen your scroll in site
document.addEventListener("DOMContentLoaded", () => { tool = ready_search() })