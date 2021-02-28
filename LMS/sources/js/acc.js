// version 1.0 release

const GET = parseURL(); // Массив хранящий значения из параметров ссылки

let isBook; // Переменная, определяющая текущую страницу
switch(GET.type) { // Присваиваем переменной параметр страницы
    case 'user':  isBook = 0; break; // 0 - Страница читателя
    case 'group': isBook = 1; break; // 1 - Страница группы книг
    case 'book':  isBook = 2; break; // 2 - Страница книги
}

let users = new Table('users'); // Создаем таблицу для работы с читателями
let books = new Table('books'); // Создаем таблицу для работы с книгами

let words = ['userid', 'groupid', 'id']; // Маленький словарик с параметрами поиска по БД

let userBooks = books.equal(books.translate(), words[isBook], GET.id, (isBook == 2) ); // Массив с информацией о книге/книгах
let user      = users.equal(users.translate(), 'id', (isBook) ? userBooks.userid: GET.id, true); // Массив с информацией об ученике

let innerHTML = ''; // Переменнв для хранение отдельных кусков кода HTML
let _arr = (isBook) ? userBooks: user; // Инициализиуем переменную для создания массива под определенную страницу

if (user) {
    _arr.fullname  = `${user.surname} ${user.firstname} ${user.lastname}`;
    _arr.fullclass = `${user.class}${user.letter}`;
}

if (GET.choose != 'edit') { // Личный кабинет
    setTitle('Личный кабинет'); // Ставим заголовок страницы

    let arr = (isBook) ? {'ID': 'inventoryno', 'Название': 'name', 'Автор': 'author', 'Жанр': 'genre', 'Описание': 'comment'} : // Книга
                        {'ФИО': 'fullname', 'Класс': 'fullclass'}; // Ученик

    for (let item in arr) { // Конструируем блоки
        if (arr.hasOwnProperty(item)) {
          innerHTML += `<tr><td class="td_head">${item}: </td><td class="td_value">${_arr[arr[item]]}</td></tr>`;
        }   
    }

    document.querySelector('.head_information').innerHTML = innerHTML;
    document.querySelector('#edit').href = `acc.html?type=${GET.type}&id=${GET.id}&choose=edit`;

    let information = document.querySelector('.information'); // Инициализируем блок с информацией, чтоб потом туда все поставить
    let nav = document.getElementById('btn'); // Иниуиализируем переменную чтоб в дальнейшем изменить ссылки с кнопками

    let accBlock = document.createElement('table');

    if (isBook) { // Если страница книжная
        accBlock.className = 'books';

        if (user.length) { // Если книга занята
            accBlock.innerHTML = `<tr>
                                    <th class="td_head">Ученик</th>
                                    <th class="td_value">${_arr.fullname} 
                                        <span class="class">${_arr.fullclass}</span>
                                    </th>
                                </tr>
                                <tr>
                                    <td class="td_head">Дата выдачи: </td>
                                    <td class="td_value">${userBooks.dateofissue}</td>
                                </tr>`;

            nav.innerHTML = `<a href="change.html?type=give&bk=${userBooks.id}&us=${user.id}" class="but" id="delete_book"></a>`;
        } else { // Если свободна
            accBlock.innerHTML = '<tr><th class="td_value">Свободна</th></tr>';
            nav.innerHTML = `<a href="search.html?type=users&im=${GET.id}" class="but" id="add_book"></a>`;
        }
    } else { // Если ученик
        accBlock.innerHTML = `<tr><th class="td_head">Книга</th><th class="td_value">Дата выдачи</th></tr>`;

        nav.innerHTML += `<a href="search.html?type=books&im=${GET.id}" class="but" id="add_book"></a>`; // Создаем кнопку с ссылкой на взятие книг в поиске

        if (!userBooks.length) { // Если книг у ученика нет
            accBlock.innerHTML += '<tr><td class="td_head">Нет книг</td><td class="td_value">-</td></tr>';
        } else if (userBooks.length == 1) { // Если есть, добавить кнопку с ссылкой на открепление своей книги
            nav.innerHTML += `<a href="change.html?type=give&us=${GET.id}&bk=${userBooks[0].id}" class="but" id="delete_book"></a>`;
        } else {
            nav.innerHTML += `<a href="search.html?type=books&im=${GET.id}&del=1" class="but" id="delete_book"></a>`;
        }

        for (let book of userBooks) { // Перебираем каждую книгу ученика и создаем под нее блок
            accBlock.innerHTML += `<tr><td class="td_head">${book.name}</td><td class="td_value">${book.dateofissue}</td></tr>`;
        }
    }
    information.append(accBlock); // Добавляем наш созданный блок в главный блок
} else { // Страница редактирования
    let title = 'Редактировать ' + ( (isBook == 2) ? 'книгу' : (isBook == 1) ? 'группу' : 'профиль' );
    setTitle(title);

    innerHTML = `<h1>${title}</h1><div class="but_nav"><div class="but" id="del"></div></div>`;

    let arr = (isBook) ? {'inventoryno': 'ID', 'name': 'Название', 'author': 'Автор', 'genre': 'Жанр', 'comment': 'Комментарий'}:
                         {'surname' : 'Фамилия', 'firstname': 'Имя', 'lastname': 'Отчество', 'class': 'Класс', 'letter': 'Буква'};

    if (isBook == 1) { // Если группа
        let result = {};
        for (let i in _arr) {
            for (let j in _arr[i]) {
                if (i == 0) {
                    result[j] = _arr[i][j];
                } else {
                    if (result[j] != _arr[i][j]) {
                        result[j] = '';
                    }
                }
            }
        }
        _arr = result;
        delete arr.inventoryno;
    }

    for (let item in arr) {
        if (arr.hasOwnProperty(item)) {
            innerHTML += '<div class="line">';
            if (item == 'comment') innerHTML += `<textarea type="text" name="comment" id="comment" class="good_input">${_arr[item]}</textarea>`;
            else                   innerHTML += `<input type="text" name="${item}" id="${item}" value="${_arr[item]}" class="necessary_input good_input">`;
            innerHTML += `<label for="${item}">${arr[item]}</label></div>`;
        }
    }

    innerHTML += '<div><input type="button" id="submit" value="Сохранить" class="good_input" message="w_save"></div';

    let box = document.querySelector('.box');
    box.innerHTML = innerHTML;

    if (!isBook) { // Если читатель
        box.querySelector('#lastname').className = 'good_input'; // Отчетсво писать необязательно
        box.querySelector('#letter').maxLength = 1; // Длина Буквы класса не превышает одной

        let inputClass = box.querySelector('#class');
        inputClass.type = 'number'; // тип номера класса - число
        inputClass.min = 1; // Минимум - 0
        inputClass.max = 11; // Максимум - 11

        document.getElementById('submit').onclick = function () { // Создаем функцию, которая будет выполнятся при нажатии на кнопку `Сохранить`
            let firstname = document.querySelector("input[name=firstname]"); // Имя 
            let surname   = document.querySelector("input[name=surname]"); // Фамилия
            let lastname  = document.querySelector("input[name=lastname]"); // Отчество (если есть)
            let classNum  = document.querySelector("input[name=class]"); // Класс (Число)
            let classLtr  = document.querySelector("input[name=letter]"); // Класс (Буква)

            firstname.value = firstname.value.trim();
            surname.value   = surname.value.trim();
            lastname.value  = lastname.value.trim();

            // Проверяем правильность введенных данных
            let _firstname = valid('username', firstname.value);
            let _surname   = valid('username', surname.value);
            let _lastname  = valid('username', lastname.value) || lastname.value == '';
            let _classNum  = valid('class', classNum.value);
            let _classLtr  = valid('letter', classLtr.value);

            if (!_firstname || !_surname || !_lastname || !_classNum || !_classLtr) { // Если хотя бы один параметр неверен, вернуть ошибку
                error('Некоректный ввод');
                return;
            }

            let params = users.SELECT(); // Сохраняем данные таблицы в переменную
            let ID = users.getIndexFromID(user['id']); // Сохраняем индекс нужного столбца

            let values = { // Создаем словарь, для изменения значений столбца
                'firstname': firstname.value,
                'surname':   surname.value,
                'lastname':  lastname.value,
                'class':     classNum.value,
                'letter':    classLtr.value
            }

            users.UPDATE(ID, values); // Обновляем значения, того самого ученика            
            success(`acc.html?type=${GET.type}&id=${GET.id}`, 'Ученик успешно изменен!');
        }
    } else { // Если книга
        box.querySelector('#genre').className = 'good_input';
        if (isBook == 2) { // Если книга
            box.querySelector('#inventoryno').type = 'number';
        }

        document.getElementById('submit').onclick = function () { // Создаем функцию, которая будет выполнятся при нажатии на кнопку `Сохранить`
            let name    = document.querySelector("input[name=name]"); // Название
            let genre   = document.querySelector("input[name=genre]"); // Жанр
            let author  = document.querySelector("input[name=author]"); // Автор
            let bookID  = document.querySelector("input[name=inventoryno]"); // Инвентарный номер книги
            let comment = document.querySelector("textarea[name=comment]"); // Комментарий к книге

            name.value    = name.value.trim();
            genre.value   = genre.value.trim();
            author.value  = author.value.trim();
            comment.value = comment.value.trim();

            // Проверяем правильность введенных данных
            let _name    = valid('name', name.value);
            let _author  = valid('name', author.value);
            let _genre   = valid('name', genre.value) || genre.value == '';
            let _comment = valid('comment', comment.value) || comment.value == '';
            let _bookID  = (isBook == 2) ? valid('num', bookID.value): 1;

            if (!_name || !_genre || !_author || !_bookID || !_comment) { // Если хотя бы один параметр неверен, вернуть ошибку
                error('Некоректный ввод');
                return;
            }

            if (isBook == 1) { // Если группа
                let IDs = [];
                let data = books.SELECT()['groupid']['users'];

                let values = {
                    'name':    name.value,
                    'author':  author.value,
                    'genre':   genre.value,
                    'comment': comment.value
                }

                for (let item in data) {
                    if (data[item] == _arr['groupid']) {
                        IDs.push(parseInt(item));
                    }
                }

                for (let item in values) { // Убираем те параметры, которые пусты
                    if (values[item] == '') {
                       delete values[item];
                    }
                }

                for (let ID of IDs) {
                    books.UPDATE(ID, values);
                }

                success(`search.html?type=books&group=${GET['id']}`, 'Группа успешно изменена!');
                return;
            }

            if (bookID.value != userBooks['inventoryno'] && books.isSameID(bookID.value)) { // Если выбрана занятая книга, также вернуть ошибку
                error(`Книга под номером '${bookID.value}' уже существует!`);
                return;
            }

            let params = books.SELECT(); // Сохраняем данные таблицы в переменную
            let ID = books.getIndexFromID(userBooks['id']); // Сохраняем индекс нужного столбца

            let values = { // Создаем словарь, для изменения значений столбца
                'name': name.value,
                'author': author.value,
                'genre': genre.value,
                'comment': comment.value,
                'inventoryno': bookID.value
            }

            books.UPDATE(ID, values); // Обновляем значения, того самого ученика
            success(`acc.html?type=book&id=${GET['id']}`, 'Книга успешна изменена!');
        }
    }

    let msgDelete = new Message(["Удалить", "Отменить"], "Удаление", "Вы уверены, что хотите удалить профиль?", {activate: "#del", cancel: 1, type: "conf"});
    msgDelete.create();

    msgDelete.linkButtons[0].onclick = function () {
        if (isBook) { // Если книга/группа
            books.DELETE((isBook == 2) ? userBooks.id: -userBooks[0].groupid); // Удаляем книгу/группу из таблицы с id равным введенному
        } else { // Если читатель
            users.DELETE(user.id); // Удаляем читателя из таблицы с id равным введенному

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
        window.location = 'index.html';
    }

    let msgError = new Message(['Ок'], "Ошибка", "Произошла ошибка", {cancel:0, type: "conf"});
    let msgSuccess = new Message(['Ок'], 'Успешно', 'Изменение прошло успешно', {type: 'conf', esc: false}) 
    msgSuccess.create();
    msgError.create();

    function success(url, text) {
        msgSuccess.setBody = text;
        msgSuccess.linkButtons[0].onclick = () => { window.location = url; }
        msgSuccess.show();
    }
    
    function error(text) {
        msgError.setBody = text;
        msgError.show();
    }
}