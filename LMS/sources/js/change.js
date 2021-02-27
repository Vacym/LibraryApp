// version 1.0 release

let GET = [];
let users = new Table('users');
let books = new Table('books');

for (let item of window.location.search.replace('?','').split('&')) {
    item = item.split('=');
    GET[decodeURIComponent(item[0])] = decodeURIComponent(item[1]);
}

let isGive = (GET.type == 'give'); // Является ли эта страница сдачи книги
let del = (isGive) ? '&del=1' : ''; // Добавляет параметр к ссылке, если это необходимо
let choose = (isGive) ? 'откреплена' : 'привязана'; // Дополнение к тексту из всплывающего окна
let changeUser = (isGive) ? '' : `<td class="td_edit"><a href="search.html?type=users&im=${GET.bk}" class="but" id="edit"></a></td>`;

let user = users.equal(users.translate(), 'id', GET.us, true); // Получаем ученика из БД по ID
let book = books.equal(books.translate(), 'id', GET.bk, true); // Получаем книгу из БД по ID

if (!user || !book || (book.userid && !isGive) || (!book.userid && isGive)) { // В случае, если страница неккоректна
    sendErr(); // Вывод ошибки
} else {
    let info = document.getElementsByClassName('head_information')[0];
    info.innerHTML = `<tr>
                        <td class="td_head">Книга: </td>
                        <td class="td_value">${book.name}<div class="little">${book.author}</div></td>
                        <td class="td_edit"><a href="search.html?type=books&im=${GET.us}${del}" class="but" id="edit"></a></td>
                    </tr>
                    <tr>
                        <td class="td_head">Ученик: </td>
                        <td class="td_value">${user.surname} ${user.firstname} ${user.lastname}
                            <div class="little">${user.class} ${user.letter}</div>
                        </td>
                        ${changeUser}
                    </tr>
                    <tr>
                        <td class="td_head">Дата: </td>
                        <td class="td_value"><input type='date' name="date" id="date"></td>
                    </tr>`;

    document.getElementById('date').valueAsDate = new Date(); // Добавляет в поле с датой сегодняшнюю дату
  
    let msgSuccess = new Message(['Ок'], 'Успешно', 'Изменение прошло успешно', {type: 'conf', esc: false}); // Инициализируем окно для вывода успеха
    msgSuccess.create_message(); // Создаем окно

    function success(url, text) { // Вызывается при успешной обработке
        msgSuccess.set_body = text;
        msgSuccess.link_buttons[0].onclick = () => { window.location = url; }
        msgSuccess.show_message();
    };

    let submit = document.querySelector('#submit'); // Инициализируем кнопку для сдачи/получения книги
    submit.value = (isGive) ? 'Сдать' : 'Получить';
    submit.onclick = () => { // Сохраняем изменения в книге
        let params = books.SELECT();
        let data = params.id.users;
        let id;

        for (let item in data) {
            if (data[item] == GET.bk) {
                id = item;
                break;
            }
        }
        params.userid.users[id] = (isGive) ? null : parseInt(GET.us);
        params.dateofissue.users[id] = (isGive) ? null : new Date(document.getElementById('date').value).toLocaleDateString();

        books.write(params);
        
        success(`acc.html?type=user&id=${GET.us}`, `Книга успешно ${choose}!`);
    };
}