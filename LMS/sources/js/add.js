// version 1.0 release

function validation_text(element) {
    if (element.currentTarget) {
        element = element.currentTarget;
    }
    let id = element.id;
    let param = id;

    switch (id) {
        case 'letter':    element.value = element.value.toUpperCase(); break;
        case 'id':        case 'quantity':                 param = 'num'; break;
        case 'author':    case 'genre':                    param = 'name'; break;
        case 'firstname': case 'surname': case 'lastname': param = 'username'; break;
    }

    if (element.value.match(/^\s/)){ // Если первый символ - пробельный
        element.value = element.value.trim();
        element.setSelectionRange(0, 0);
    }

    let is_valid = valid(param, element.value);
    let static = "bad";

    //если ничего не введено
    if (element.value == "") { static = "empty"; } else if (is_valid) { static = "good"; }

    change_border(element, static);
}

function change_border(element, type, check = true) {
    var default_value = element.classList;

    if (type == "bad") {
        //если был хорошим
        default_value.remove("good_input");

        //если не был плохим
        if (!default_value.contains("bad_input")) {
            default_value.add("bad_input");
        }
    } else if (type == "good") {

        //если был плохим
        default_value.remove("bad_input");

        //если не был хорошим
        if (!default_value.contains("good_input")) {
            default_value.add("good_input");
        }
    } else if (type == "empty") {
        //удаляем доп стилизацию
        default_value.remove("bad_input");
        default_value.remove("good_input");
    }

    // запускаем общую проверку на корректность данных
    if (check) { button_control(); }
}

function button_control() {
    var all_good = full_validation();
    if (all_good) {
        document.querySelector("#submit").removeAttribute("disabled");
    } else {
        document.querySelector("#submit").setAttribute("disabled", "disabled");
    }
}

function full_check() {
    text_inputs = document.querySelectorAll('input[type="text"], input[type="number"], textarea');
    for (let x = 0; x < text_inputs.length; x++) {
        validation_text(text_inputs[x]);
    }
    full_validation();
}

function full_validation() {
    var bads = document.querySelectorAll('input[type="text"].bad_input, input[type="number"].bad_input, textarea.bad_input');

    if (bads.length > 0) {
        change_border(document.querySelector("#submit"), "bad", false);
        return false;
    }

    var required = document.querySelectorAll('.necessary_input');
    for (var x = 0; x < required.length; x++) {
        if (!required[x].classList.contains("good_input")) {
            change_border(document.querySelector("#submit"), "empty", false);
            return false;
        }
    }
    change_border(document.querySelector("#submit"), "good", false);
    return true;
}

function ready() {
    function textarea_size(e) {

        e.style.height = 'auto';
        e.style.height = e.scrollHeight + 2 + "px";
    }

    var text_inputs = document.querySelectorAll('input[type="text"], input[type="number"], textarea');
        // запуск прослушивания событий для текстовых полей
    for (let x = 0; x < text_inputs.length; x++) {
        text_inputs[x].addEventListener("input", validation_text);
        validation_text(text_inputs[x]);
    }
    textarea_list = document.querySelectorAll('textarea');
    for (let x = 0; x < textarea_list.length; x++) {
        textarea_list[x].addEventListener('input', function(e) { textarea_size(e.target); });
        textarea_size(textarea_list[x]);
    }
}

document.addEventListener("DOMContentLoaded", ready);

// Код Djacon
function valid(i, value) { // Проверяет на правильность введенных данных
    let re = {
        'username': /^[а-я-]+$/i,
        'name'    : /^([a-zа-яё-]|[\.,?! ]|\d)+$/i,
        'num'     : /^\d+$/,
        'class'   : /^([1-9]|1[01])$/,
        'letter'  : /^[А-Я]$/,
        'comment' : /^([a-zа-яё-]|[\.,?!\(\) ]|[\d\n])+$/i,
    };
    
    return value.match(re[i]);
}

function parseURL() { // Парсер ссылки на страницу
    let params = {};
    for (let item of window.location.search.replace('?','').split('&')) { // Парсим ссылку для получения id ученика
        let value = item.split('=');
        params[decodeURIComponent(value[0])] = decodeURIComponent(value[1]);
    }

    return params;
}

function send(msg) { // Выводит в всплывающем окне сообщение
    document.querySelector('#result').innerHTML = msg;
    document.querySelector('#link').parentElement.classList.add("mes_dis");
}

function successS(url, msg) { // Выводит успешное сообщение и добавляет ссылку на профиль ученика/книги
    document.querySelector('#result').innerHTML = msg;
    document.querySelector('#link').parentElement.classList.remove("mes_dis");
    document.querySelector("#link").setAttribute('href', url);
    inputs = document.querySelectorAll('input[type="text"], input[type="number"], textarea');
    for (let x = 0; x < inputs.length; x++) {
        inputs[x].value = '';
    }
    full_check();
}

function setTitle(title) {
    document.title = title;
}