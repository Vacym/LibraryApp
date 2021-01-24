// version 1.0 release

window.onload = function() {
    let name    = document.querySelector("input[name=name]");
    let genre   = document.querySelector("input[name=genre]");
    let count   = document.querySelector("input[name=quantity]");
    let author  = document.querySelector("input[name=author]");
    let bookID  = document.querySelector("input[name=id]");
    let comment = document.querySelector("textarea[name=comment]");

    let books = new Table('books');

    document.querySelector('#submit').onclick = function() {
        let isAutoID = document.getElementById("auto_id").checked;
        let is_group = document.getElementById('group_checkbox').checked;

        let _name    = valid('name', name.value);
        let _author  = valid('name', author.value);
        let _genre   = valid('name', genre.value) || genre.value == '';
        let _comment = valid('name', comment.value) || comment.value == '';
        let _bookID  = valid('num', bookID.value);
        let _count   = valid('num', count.value);

        if (!_name || !_genre || !_author || !_bookID || !_comment) {
            send('Некоректный ввод');
            return;
        }

        if (is_group) {
            if (count.value > 500) {
                send('Невозможно создать группу с более 500 книгами!');
                return;
            }

            let groups = [];
            let MaxGroupID = books.nextGroupID;
            let booksID  = document.querySelectorAll(".list_id input");
            let j;

            for (i = 0; i < count.value; i++){
                if (isAutoID) {
                    j = parseInt(bookID.value) + i;
                } else if (i==0 && !booksID[0].value) {
                    j = parseInt(bookID.value);
                } else {
                    j = parseInt(booksID[i].value);
                    if (!j) j = groups[i-1] + 1;
                }
                if (isNaN(j)) {
                    send(`В ${i}-ой книге допущена ошибка в написании числа`);
                    return;
                }
                else if (books.isSameID(j)) {
                    send(`Книга под номером '${j}' уже существует!`);
                    return;
                }
                else if (groups.includes(j)) {
                    send(`Книга под номером '${j}' уже записана в эту группу!`);
                    return;
                }
                groups.push(j);
            }

            for (IN of groups) {
                books.INSERT([name.value, author.value, genre.value, comment.value, IN, null, null, MaxGroupID]);
            }
            success(`search_book.html?group=${MaxGroupID}`, true);
        } else {
            if (books.isSameID(bookID.value)) {
                send(`Книга под номером '${bookID.value}' уже существует!`);
                return;
            }

            let id = books.INSERT([name.value, author.value, genre.value, comment.value, parseInt(bookID.value), null, null, null]);
            success(`books.html?id=${id}`);
        }
    }
}

function valid(i, value) {
    let re = {'name': /^([а-яё-]|[\., ]|\d)+$/i, 'num': /^\d+$/};
    return value.match(re[i]);
}

function send(msg) {
    document.querySelector('#result').innerHTML = msg;
    document.querySelector('#link').parentElement.classList.add("mes_dis");
}

function success(url, isGroup=false) {
    let msg = isGroup ? 'Группа' : 'Книга';
    document.querySelector('#result').innerHTML = msg + ' успешно добавлена!';
    document.querySelector('#link').parentElement.classList.remove("mes_dis");
    document.querySelector("#link").setAttribute('href', url);
    inputs = document.querySelectorAll('input[type="text"], input[type="number"], textarea');
    for (let x = 0; x < inputs.length; x++) {
        inputs[x].value = '';
    }
    full_check()
}