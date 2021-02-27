// version 1.0 release

function constrolInputs(q_inputs) { //
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
    <input type="number" name="book_id_${x}" placeholder="ID ${x}" min="0">`;
        cont_input_book.append(input_book);
    }

    // Удаление нужного количества элементов
    for (let x = 0; x < real_q_inputs - q_inputs; x++) {
        cont_input_book.lastElementChild.remove();
    }
    heightIllusion("i");
}

function showGroup(checkbox, changeable, need_check = true, illusion = true) { //

    function toggle(a, b) {
        vis_box.classList.add(a);
        vis_box.classList.remove(b);
    }

    function add_show() {
        vis_box.classList.add("fading");
        setTimeout(() => {
            toggle("show", "fading");
            heightIllusion(mode);
        }, 1);
    }

    function del_show() {
        toggle("fading", "show");
        vis_box.style.position = "absolute";

        if (illusion) {
            if (mode == "q") {
                heightIllusion(mode, "0px");
                heightIllusion("i", "0px", "0px");
            } else {
                heightIllusion(mode, undefined, "0px");
            }
        } else { heightIllusion(mode); }
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

function heightIllusion(mode, height, width) { //
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

function ready() { //
    heightIllusion("i");
    heightIllusion("q");

    document.querySelector("#quantity").addEventListener("change", () => constrolInputs());
    document.querySelector("#auto_id" ).addEventListener("change", () => constrolInputs());
}

function submit() { // Отправляет запрос на создание ученика/книги
    if (!isBook) { // Если читатель
        let firstname = document.querySelector("input[name=firstname]");
        let surname   = document.querySelector("input[name=surname]");
        let lastname  = document.querySelector("input[name=lastname]");
        let classNum  = document.querySelector("input[name=class]");
        let classLtr  = document.querySelector("input[name=letter]");

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
            error('Некоректный ввод!');
            return;
        }

        let id = table.INSERT([firstname.value, surname.value, lastname.value, classNum.value, classLtr.value]);
        success(`acc.html?type=user&id=${id}`, 'Ученик успешно добавлен!');
    } else { // Если книга
        let name    = document.querySelector("input[name=name]");
        let genre   = document.querySelector("input[name=genre]");
        let count   = document.querySelector("input[name=quantity]");
        let author  = document.querySelector("input[name=author]");
        let bookID  = document.querySelector("input[name=id]");
        let comment = document.querySelector("textarea[name=comment]");

        let isAutoID = document.getElementById("auto_id").checked;
        let isGroup = document.getElementById('group_checkbox').checked;

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
            error('Некоректный ввод');
            return;
        }

        let InvNum = bookID.value|0;
        bookID.value = InvNum;

        if (isGroup) { // Если группа книг
            if (!_count) {
                error('Ошибка в вводе количества книг!');
                return;
            } else if (count.value > 500) {
                error('Невозможно создать группу с более 500 книгами!');
                return;
            } else if (count.value < 2) {
                error(`Группа книг не может состоять из менее 2-х книг!`);
                return;
            }

            let groups = [];
            let MaxGroupID = table.nextGroupID;
            let booksID  = document.querySelectorAll(".list_id input");
            let bookNum;

            for (i = 0; i < count.value; i++){
                if (isAutoID) {
                    bookNum = InvNum + i;
                } else if (i==0 && !booksID[0].value) {
                    bookNum = InvNum;
                } else {
                    bookNum = Number(booksID[i].value);
                    if (!bookNum) bookNum = groups[i-1] + 1;
                }
                if (isNaN(bookNum) || !Number.isInteger(bookNum)) {
                    error(`В ${i+1}-ой книге неверно введен инвентарный номер!`);
                    return;
                }
                else if (table.isSameID(bookNum)) {
                    error(`Книга под номером ${bookNum} уже существует!`);
                    return;
                }
                else if (groups.includes(bookNum)) {
                    error(`Книга под номером ${bookNum} уже записана в эту группу!`);
                    return;
                }
                groups.push(bookNum);
            }

            for (let IN of groups) {
                table.INSERT([name.value, author.value, genre.value, comment.value, IN, null, null, MaxGroupID]);
            }
            success(`search.html?type=books&group=${MaxGroupID}`, 'Группа успешно добавлена!');
        } else { // Если одна книга
            if (table.isSameID(InvNum)) {
                error(`Книга под номером ${InvNum} уже существует!`);
                return;
            }

            let id = table.INSERT([name.value, author.value, genre.value, comment.value, InvNum, null, null, null]);
            success(`acc.html?type=book&id=${id}`, 'Книга успешно добавлена!');
        }
    }
}

function success(url, text) { // Запускается при успешном создании читателя/книги
    msgSuccess.set_body = text;
    msgSuccess.link_buttons[0].onclick = () => { window.location = url; }
    msgSuccess.show_message();

    inputs = document.querySelectorAll('input[type="text"], input[type="number"], textarea');
    for (let x = 0; x < inputs.length; x++) {
        inputs[x].value = '';
    }
    fullCheck();
}

function error(text) { // Вылезает в случае ошибки
    msgError.set_body = text;
    msgError.show_message();
}

// Константы
const isBook = parseURL()['type'] == 'book'; // Проверяет, является ли страница книжной
const table = new Table((isBook) ? 'books': 'users'); // Инициализируем таблицу под одну из страниц

// Вывод тела main
if (!isBook) { // Если ученик
    setTitle('Добавление Ученика');

    document.forms[0].innerHTML = `<h1>Добавить Ученика</h1>
                                            <div class="line">
                                                <input type="text" name="surname" id="surname" placeholder="Фамилия" class="necessary_input">
                                            </div>
                                            <div class="line">
                                                <input type="text" name="firstname" id="firstname" placeholder="Имя" class="necessary_input">
                                            </div>
                                            <div class="line">
                                                <input type="text" name="lastname" id="lastname" placeholder="Отчество">
                                            </div>
                                            <div class="line">
                                                <input type="number" name="class" id="class" placeholder="Класс" class="necessary_input" min="1" max="11">
                                            </div>
                                            <div class="line">
                                                <input type="text" name="letter" id="letter" placeholder="Буква" class="necessary_input" maxlength="1">
                                            </div>
                                            <div>
                                                <input type="button" id="submit" value="Создать" message="create" disabled>
                                            </div>`;
} else { // Если книга
    setTitle('Добавление Книги');

    document.forms[0].innerHTML = `<h1>Добавить Книгу</h1>
                                    <div class="all_inputs">
                                        <div class="main_inputs">
                                            <div class="line">
                                                <input type="number" name="id" id="id" placeholder="ID: 001" class="necessary_input" min="0" autocomplete="off" autofocus>
                                            </div>
                                            <div class="line">
                                                <input type="text" name="name" id="name" placeholder="Название" class="necessary_input" autocomplete="off">
                                            </div>
                                            <div class="line">
                                                <input type="text" name="author" id="author" placeholder="Автор" class="necessary_input" autocomplete="off">
                                            </div>
                                            <div class="line">
                                                <input type="text" name="genre" id="genre" placeholder="Жанр" autocomplete="off">
                                            </div>
                                            <div class="line">
                                                <textarea type="text" name="comment" id="comment" placeholder="Комментарий" autocomplete="off"></textarea>
                                            </div>
                                            <div class="line">
                                                <input type="checkbox" name="group" id="group_checkbox" onchange="showGroup(this, '.for_group', true, true)" value="Создать группу книг">
                                                <label for="group_checkbox" class="group_checkbox">Создать Группу книг</label>
                                            </div>
                                            <div class="illusion" id="for_group_il">
                                                <div class="for_group">
                                                    <div class="line">
                                                        <input type="number" name="quantity" id="quantity" placeholder="Количество копий" min="0" autocomplete="off">
                                                        <span class="single_checkbox">
                                                            <input type="checkbox" name="auto_id" id="auto_id" value="auto_id" onchange="showGroup(this, '.list_id', false)" checked>
                                                            <label for="auto_id">Авто ID</label>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="illusion" id="list_id_il">
                                            <div class="list_id">
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <input type="button" id="submit" value="Создать" message="create" disabled>
                                    </div>`;
    ready();
}

let msgError = new Message(['Ок'], "Ошибка", "Произошла ошибка", {cancel:0, type: "conf"});
let msgSuccess = new Message(['Перейти в личный кабинет', 'Ок'], 'Успешно', 'Изменение прошло успешно', {cancel:1, type: 'conf', focus:1});

msgSuccess.create_message();
msgError.create_message();

document.querySelector('#submit').onclick = submit; // Выполняем процесс создания ученика/книги в случае валидности
readyAdd(); // Запускает проверку полей в add.js