// version 1.0 release

function validText(element) { // Проверяем валидность введенного текста в поле ввода
    if (element.currentTarget) {
        element = element.currentTarget;
    }

    let id = element.id;
    let param = id;

    switch (id) { // Устанавливаем параметр, для последущей проверки введенного текста
        case 'letter':    element.value = element.value.toUpperCase(); break;
        case 'id':        case 'quantity':                 param = 'num'; break;
        case 'author':    case 'genre':                    param = 'name'; break;
        case 'firstname': case 'surname': case 'lastname': param = 'username'; break;
    }
    
    if (element.value.match(/^\s/)){ // Если первый символ - пробельный
        element.value = element.value.trim();
        element.setSelectionRange(0, 0);
    }

    let isValid = valid(param, element.value); // Булевая переменная проверяет валидность
    let static = "bad";

    //если ничего не введено
    if (element.value == "") { static = "empty"; } else if (isValid) { static = "good"; }

    changeBorder(element, static); // Изменяем цвет рамки в поле ввода
}

function changeBorder(element, type, check = true) { // Меняет цвет рамки в поле ввода
    let defaultValue = element.classList; // Список с текущими классами в инпуты

    if (type == "bad") { // Если текст без ошибок
        defaultValue.remove("good_input"); // Если был хорошим

        if (!defaultValue.contains("bad_input")) { // Если до этого там была ошибка, удаляем ее значение
            defaultValue.add("bad_input");
        }
    } else if (type == "good") { // Если текст содержит ошибку
        defaultValue.remove("bad_input"); // Если была ошибка

        if (!defaultValue.contains("good_input")) { // Если не было ошибки
            defaultValue.add("good_input");
        }
    } else if (type == "empty") { // Если текст пустой, удаляем доп. стилизацию
        defaultValue.remove("bad_input");
        defaultValue.remove("good_input");
    }

    // Запускаем общую проверку на корректность данных
    if (check) { buttonControl(); }
}

function buttonControl() {
    let allGood = fullValidation();
    if (allGood) {
        document.querySelector("#submit").removeAttribute("disabled");
    } else {
        document.querySelector("#submit").setAttribute("disabled", "disabled");
    }
}

function fullCheck() {
    let inputs = document.querySelectorAll('input[type="text"], input[type="number"], textarea');
    for (let x = 0; x < inputs.length; x++) {
        validText(inputs[x]);
    }
    fullValidation();
}

function fullValidation() {
    let bads = document.querySelectorAll('input[type="text"].bad_input, input[type="number"].bad_input, textarea.bad_input');
    if (bads.length > 0) {
        changeBorder(document.querySelector("#submit"), "bad", false);
        return false;
    }

    let required = document.querySelectorAll('.necessary_input');
    for (let x = 0; x < required.length; x++) {
        if (!required[x].classList.contains("good_input")) {
            changeBorder(document.querySelector("#submit"), "empty", false);
            return false;
        }
    }
    changeBorder(document.querySelector("#submit"), "good", false);
    return true;
}

function readyAdd() {
    function textareaSize(e) { // Подстройка высоты textarea
        e.style.height = 'auto';
        e.style.height = e.scrollHeight + 2 + "px";
    }

    let textInputs = document.querySelectorAll('input[type="text"], input[type="number"], textarea');
    for (let input of textInputs) { // Запуск прослушивания событий для текстовых полей
        input.addEventListener("input", validText);
        validText(input);
    }

    let textarea = document.querySelector('textarea');
    if (textarea) {
        textarea.addEventListener('input', (e) => { textareaSize(e.target); });
        textareaSize(textarea);
    }
}

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

document.addEventListener("DOMContentLoaded", readyAdd);