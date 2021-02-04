// version 1.0 release

window.onload = function() {
    if (!isBook) { // Создание ученика
        let firstname = document.querySelector("input[name=firstname]");
        let surname   = document.querySelector("input[name=surname]");
        let lastname  = document.querySelector("input[name=lastname]");
        let classNum  = document.querySelector("input[name=class]");
        let classLtr  = document.querySelector("input[name=letter]");

        let table = new Table('users');

        document.querySelector('#submit').onclick = function () {
            firstname.value = firstname.value.trim();
            surname.value = surname.value.trim();
            lastname.value = lastname.value.trim();
            classNum.value = classNum.value.trim();
            classLtr.value = classLtr.value.trim();

            let _firstname = valid('username', firstname.value);
            let _surname   = valid('username', surname.value);
            let _lastname  = valid('username', lastname.value) || lastname.value == '';
            let _classNum  = valid('class', classNum.value);
            let _classLtr  = valid('letter', classLtr.value);

            if (!_firstname || !_surname || !_lastname || !_classNum || !_classLtr) {
                send('Некоректный ввод!');
                return;
            }

            let id = table.INSERT([firstname.value, surname.value, lastname.value, classNum.value, classLtr.value]);
            successS(`acc.html?type=user&id=${id}`, 'Ученик успешно добавлен!');
        };
    } else { // Создание книги
        let name    = document.querySelector("input[name=name]");
        let genre   = document.querySelector("input[name=genre]");
        let count   = document.querySelector("input[name=quantity]");
        let author  = document.querySelector("input[name=author]");
        let bookID  = document.querySelector("input[name=id]");
        let comment = document.querySelector("textarea[name=comment]");

        let table = new Table('books');

        document.querySelector('#submit').onclick = function() {
            let isAutoID = document.getElementById("auto_id").checked;
            let is_group = document.getElementById('group_checkbox').checked;

            name.value = name.value.trim();
            genre.value = genre.value.trim();
            author.value = author.value.trim();
            comment.value = comment.value.trim();

            let _name    = valid('name', name.value);
            let _author  = valid('name', author.value);
            let _genre   = valid('name', genre.value) || genre.value == '';
            let _comment = valid('comment', comment.value) || comment.value == '';
            let _bookID  = valid('num', bookID.value);
            let _count   = valid('num', count.value);

            if (!_name || !_genre || !_author || !_bookID || !_comment) {
                send('Некоректный ввод');
                return;
            }

            if (is_group) {
                if (!_count) {
                    send('Ошибка в вводе количества книг!');
                    return;
                } else if (count.value > 500) {
                    send('Невозможно создать группу с более 500 книгами!');
                    return;
                } else if (count.value < 2) {
                    send(`Группа книг не может состоять из менее 2-х книг!`);
                    return;
                }

                let groups = [];
                let MaxGroupID = table.nextGroupID;
                let booksID  = document.querySelectorAll(".list_id input");
                let j;

                for (i = 0; i < count.value; i++){
                    if (isAutoID) {
                        j = Number(bookID.value) + i;
                    } else if (i==0 && !booksID[0].value) {
                        j = Number(bookID.value);
                    } else {
                        j = Number(booksID[i].value);
                        if (!j) j = groups[i-1] + 1;
                    }
                    if (isNaN(j) || !Number.isInteger(j)) {
                        send(`В ${i+1}-ой книге допущена ошибка в написании числа`);
                        return;
                    }
                    else if (table.isSameID(j)) {
                        send(`Книга под номером '${j}' уже существует!`);
                        return;
                    }
                    else if (groups.includes(j)) {
                        send(`Книга под номером '${j}' уже записана в эту группу!`);
                        return;
                    }
                    groups.push(j);
                }

                for (let IN of groups) {
                    table.INSERT([name.value, author.value, genre.value, comment.value, IN, null, null, MaxGroupID]);
                }
                successS(`search.html?type=books&group=${MaxGroupID}`, 'Группа успешно добавлена!');
            } else {
                if (table.isSameID(bookID.value)) {
                    send(`Книга под номером '${bookID.value}' уже существует!`);
                    return;
                }

                let id = table.INSERT([name.value, author.value, genre.value, comment.value, parseInt(bookID.value), null, null, null]);
                successS(`acc.html?type=book&id=${id}`, 'Книга успешно добавлена!');
            }
        };
    }
};

// Код Koe-kto
function control_inputs(q_inputs) {
    //Определяем открыто ли это окно
    if (document.querySelector("#auto_id").checked) { return; }

    // Определяем сколько елемнтов нужно
    if (!q_inputs) { q_inputs = parseInt(document.querySelector("#quantity").value); }
    if (!q_inputs) { q_inputs = 0; }
    let cont_input_book = document.querySelector(".list_id");

    // Определяем сколько элементов в реальности
    let real_q_inputs = cont_input_book.lastElementChild;
    if (real_q_inputs) {
        real_q_inputs = real_q_inputs.querySelector("input").name;
        real_q_inputs = parseInt(real_q_inputs.match(/\d+$/)[0]);
    } else {
        real_q_inputs = 0;
    }

    // Добавление нужного количества элементов
    for (let x = 1 + real_q_inputs; x < q_inputs + 1; x++) {
        if (x > 500) { break; }
        let input_book = document.createElement('div');
        input_book.className = "line";
        input_book.innerHTML = `<span>${x}. </span>
    <input type="number" name="book_id_${x}" placeholder="ID ${x}" min="0" autocomplete="off">`;
        cont_input_book.append(input_book);
    }

    // Удаление нужного количества элементов
    for (let x = 0; x < real_q_inputs - q_inputs; x++) {
        cont_input_book.lastElementChild.remove();
    }
    height_illusion("i");
}

function show_group(checkbox, changeable, need_check = true, illusion = true) {

    function toggle(a, b) {
        vis_box.classList.add(a);
        vis_box.classList.remove(b);
    }

    function add_show() {
        vis_box.classList.add("fading");
        setTimeout(() => {
            toggle("show", "fading");
            height_illusion(mode);
        }, 1);
    }

    function del_show() {
        toggle("fading", "show");
        vis_box.style.position = "absolute";

        if (illusion) {
            if (mode == "q") {
                height_illusion(mode, "0px");
                height_illusion("i", "0px", "0px");
            } else {
                height_illusion(mode, undefined, "0px");
            }
        } else { height_illusion(mode); }
        vis_box.style.position = "";
        setTimeout(() => vis_box.classList.remove("fading"), 250);
    }

    if (changeable == '.for_group') { mode = "q"; } else { mode = "i"; }
    let vis_box = document.querySelector(changeable);
    if (checkbox.checked == need_check) {
        add_show();
    } else {
        del_show();
    }
}

function height_illusion(mode, height, width) {
    let illusion;
    let vis_box;
    if (mode == "q") { //quantity
        illusion = document.querySelector("#for_group_il");
        vis_box  = document.querySelector(".for_group");
    } else if (mode == "i") { //inputs
        illusion = document.querySelector("#list_id_il");
        vis_box  = document.querySelector(".list_id");
    }
    if (!height && mode == "q") {
        height = getComputedStyle(vis_box).height;
        if (height == "auto") { height = "0px"; }
    }
    if (!width && mode == "i") {
        width = getComputedStyle(vis_box).width;
        if (width == "auto")  { width = "0px"; }
        height = getComputedStyle(document.querySelector(".main_inputs")).height;

    }
    illusion.style.height = height;
    illusion.style.width  = width;
}

function ready() {
    height_illusion("i");
    height_illusion("q");

    document.querySelector("#quantity").addEventListener("change", () => control_inputs());
    document.querySelector("#auto_id" ).addEventListener("change", () => control_inputs());
}

let isBook = parseURL()['type'] == 'book'; // Проверяет, является ли страница книжной

if (isBook) { // Если эта книга...
    document.addEventListener("DOMContentLoaded", ready);
}