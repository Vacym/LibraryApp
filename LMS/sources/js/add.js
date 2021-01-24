// version 1.0 release

function validation_text(element) {
    if (element.currentTarget) {
        var element = element.currentTarget
    }
    var id = element.id
    var regex = /^[а-яё-]+$/i
    if (id == "letter") {
        element.value = element.value.toUpperCase();
        regex = /^[А-Я]$/
    } else if (id == "class") {
        regex = /^([1-9]|1[01])$/
    } else if (id == "id" || id == "quantity" || element.name.includes("book_id_")) {
        regex = /^\d+$/
    } else if (id == "name" || id == "comment" || id == "author" || id == "genre") {
        regex = /^([а-яё-]|[\., ]|\d)+$/i
    }

    var is_valid = element.value.match(regex)
    var static = "bad";

    //если ничего не введено
    if (element.value == "") { static = "empty" } else if (is_valid) { static = "good" }

    change_border(element, static)
}

function change_border(element, type, check = true) {
    var default_value = element.classList

    if (type == "bad") {
        //если был хорошим
        default_value.remove("good_input")

        //если не был плохим
        if (!default_value.contains("bad_input")) {
            default_value.add("bad_input")
        }
    } else if (type == "good") {

        //если был плохим
        default_value.remove("bad_input")

        //если не был хорошим
        if (!default_value.contains("good_input")) {
            default_value.add("good_input")
        }
    } else if (type == "empty") {
        //удаляем доп стилизацию
        default_value.remove("bad_input")
        default_value.remove("good_input")
    }

    // запускаем общую проверку на корректность данных
    if (check) { button_control() }
}

function button_control() {
    var all_good = full_validation()
    if (all_good) {
        document.querySelector("#submit").removeAttribute("disabled")
    } else {
        document.querySelector("#submit").setAttribute("disabled", "disabled")
    }
}

function full_check() {
    text_inputs = document.querySelectorAll('input[type="text"], input[type="number"], textarea')
    for (let x = 0; x < text_inputs.length; x++) {
        validation_text(text_inputs[x])
    }
    full_validation()
}

function full_validation() {
    var bads = document.querySelectorAll('input[type="text"].bad_input, input[type="number"].bad_input, textarea.bad_input')

    if (bads.length > 0) {
        change_border(document.querySelector("#submit"), "bad", false)
        return false
    }

    var required = document.querySelectorAll('.necessary_input')
    for (var x = 0; x < required.length; x++) {
        if (!required[x].classList.contains("good_input")) {
            change_border(document.querySelector("#submit"), "empty", false)
            return false
        }
    }
    change_border(document.querySelector("#submit"), "good", false)
    return true
}

function ready() {
    function textarea_size(e) {

        e.style.height = 'auto'
        e.style.height = e.scrollHeight + 2 + "px"
    }

    var text_inputs = document.querySelectorAll('input[type="text"], input[type="number"], textarea')
        // запуск прослушивания событий для текстовых полей
    for (let x = 0; x < text_inputs.length; x++) {
        text_inputs[x].addEventListener("input", validation_text)
        validation_text(text_inputs[x])
    }
    textarea_list = document.querySelectorAll('textarea')
    for (let x = 0; x < textarea_list.length; x++) {
        textarea_list[x].addEventListener('input', function(e) { textarea_size(e.target) })
        textarea_size(textarea_list[x])
    }
}


document.addEventListener("DOMContentLoaded", ready)

// Мой код
// class Table { // Класс для работы с библиотекой
//     constructor(name) {
//         this.name = name + '.json';
//     }

//     equal(traspose, param, value) { // Возвращает массив с столбцами, где параметр равен определонному значению (Н-ер где name = Иван)
//         let result = [];
//         for (let item in traspose) { // Перебираем значения таблицы
//             if (value == traspose[item][param]) { // Если значение столбца удовлетворяет условию...
//                 result.push(traspose[item]); // Добавить в массив
//             }
//         }
//         return result;
//     }

//     SELECT(value) { // Возвращает таблицу с данными
//         try {
//             return JSON.parse(fs.readFileSync(this.name, 'utf8'));
//         } catch (err) {
//             console.log('ОШИБКА ЧТЕНИЯ ТАБЛИЦЫ', err);
//         }
//     }

//     DELETE(id) { // Удаляет стобец через его ID
//         let data = this.translate();
//         let params = this.SELECT();
        
//         for (let item in data) {
//             if (data[item]['id'] == id) {
//                 id = item;
//                 break;
//             }
//         }

//         for (let item in params) {
//             params[item]['users'].splice(id,1);
//         }

//         this.write(params); // Записываем изменения в таблицу
//     }

//     UPDATE(id, values) { // Обновляем значения столбца на значения из словаря values
//         let data = this.SELECT();
//         for (item in values) {
//             data[item]['users'][id] = values[item];
//         }

//         this.write(data); // Записываем изменения в таблицу
//     }

//     isSameID(otherItem) { // Проверяем, существует ли такой инвентарный номер в базе
//         for (let item of this.SELECT()['inventoryno']['users']) {
//             if (otherItem == item) {
//                 return true;
//             }
//         }
//         return false;
//     }

//     write(params) { // Переписывает данные таблицы на свои
//         try {
//             fs.writeFileSync(this.name, JSON.stringify(params));
//         } catch (err) {
//             console.log('ОШИБКА ИЗМЕНЕНИЯ ТАБЛИЦЫ', err);
//         }
//     }

//     translate(data=this.SELECT()) { // Возвращает данные таблицу в человеческом виде
//         let result = [];
//         for (let i = 0; i < data['id']['users'].length; i++) {
//             result[i] = {};
//             for (let item in data) {
//                 result[i][item] = data[item]['users'][i];
//             }
//         }
//         return result;
//     }

//     getIndexFromID(ID) { // Возвращает индекс столбца, исходя из его id
//         let data = this.SELECT()['id']['users']; // Сохраняем значения всех id, чтобы идентифицировать нашего ученика или книгу

//         for (let index in data) {
//             if (data[index] == ID) {
//                 return index;
//             }
//         }
//     }
// }

function valid(i, value) { // Проверяет на правильность введенных данных
    let re = {'username': /^[а-я-]+$/i, 'name': /^([а-яё-]|[\., ]|\d)+$/i, 'num': /^\d+$/, 'class': /^([1-9]|1[01])$/, 'letter': /^[А-Я]$/};
    return value.match(re[i]);
}

function send(msg) { // Здесь должна будет быть функция для вывода на экран окна ошибки
    console.log(msg)
}

function parseURL() { // Парсер ссылки на страницу
    let params = {};
    for (item of window.location.search.replace('?','').split('&')) { // Парсим ссылку для получения id ученика
        let value = item.split('=');
        params[decodeURIComponent(value[0])] = decodeURIComponent(value[1]);
    }

    return params;
}