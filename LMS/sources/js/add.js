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
    let default_value = element.classList;

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
    let all_good = full_validation();
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
    let bads = document.querySelectorAll('input[type="text"].bad_input, input[type="number"].bad_input, textarea.bad_input');

    if (bads.length > 0) {
        change_border(document.querySelector("#submit"), "bad", false);
        return false;
    }

    let required = document.querySelectorAll('.necessary_input');
    for (let x = 0; x < required.length; x++) {
        if (!required[x].classList.contains("good_input")) {
            change_border(document.querySelector("#submit"), "empty", false);
            return false;
        }
    }
    change_border(document.querySelector("#submit"), "good", false);
    return true;
}

function ready_add() {
    function textarea_size(e) {
        e.style.height = 'auto';
        e.style.height = e.scrollHeight + 2 + "px";
    }

    let text_inputs = document.querySelectorAll('input[type="text"], input[type="number"], textarea');
    // Запуск прослушивания событий для текстовых полей
    for (let input of text_inputs) {
        input.addEventListener("input", validation_text);
        validation_text(input);
    }

    let textarea = document.querySelector('textarea');
    if (textarea) {
        textarea.addEventListener('input', (e) => { textarea_size(e.target); });
        textarea_size(textarea);
    }
}

document.addEventListener("DOMContentLoaded", ready_add);

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

function setTitle(title) {
    document.title = title;
}