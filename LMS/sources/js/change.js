var GET = [];
var users = new Table('users');
var books = new Table('books');

for (item of window.location.search.replace('?','').split('&')) {
    let value = item.split('=');
    GET[decodeURIComponent(value[0])] = decodeURIComponent(value[1]);
}

let isGive = (GET['type'] == 'give');
let del = (isGive) ? '&del=1' : '';
let choose = (isGive) ? 'откреплена' : 'привязана';
let changeUser = (isGive) ? '' : `<td class="td_edit">
                                <a href="search.html?type=users&im=${GET['bk']}" class="but" id="edit"></a>
                            </td>`;

user = users.equal(users.translate(), 'id', GET['us'])[0];
book = books.equal(books.translate(), 'id', GET['bk'])[0];

if (!user || !book || (book['userid'] && !isGive) || (!book['userid'] && isGive) ) {
    sendErr();
} else {
    let info = document.getElementsByClassName('head_information')[0];
    info.innerHTML = `<tr>
                        <td class="td_head">Книга: </td>
                        <td class="td_value">${book['name']}
                            <div class="little">${book['author']}</div>
                        </td>
                        <td class="td_edit">
                            <a href="search.html?type=books&im=${GET['us']}${del}" class="but" id="edit"></a>
                        </td>
                    </tr>
                    <tr>
                        <td class="td_head">Ученик: </td>
                        <td class="td_value">${user['surname']} ${user['firstname']} ${user['lastname']}
                            <div class="little">${user['class']} ${user['letter']}</div>
                        </td>
                        ${changeUser}
                    </tr>
                    <tr>
                        <td class="td_head">Дата: </td>
                        <td class="td_value"><input type='date' name="date" id="date"></td>
                    </tr>`;

    document.getElementById('date').valueAsDate = new Date();

    let submit = document.querySelector('#submit');
    
    submit.value = (isGive) ? 'Сдать' : 'Получить';
    submit.onclick = function() {
        let params = books.SELECT();
        let data = params['id']['users'];
        let id;

        for (let item in data) {
            if (data[item] == GET['bk']) {
                id = item;
                break;
            }
        }
        params['userid']['users'][id] = (isGive) ? null : parseInt(GET['us']);
        params['dateofissue']['users'][id] = new Date(document.getElementById('date').value).toLocaleDateString();

        books.write(params);
        
        success(`acc.html?type=user&id=${GET['us']}`, `Книга успешно ${choose}!`);
    }

    let msgSuccess = new Message(['Ок'], 'Успешно', 'Изменение прошло успешно', {type: 'conf', esc: false}) 
    msgSuccess.create_message();

    const success = (url, text) => {
        msgSuccess.set_body = text;
        msgSuccess.link_buttons[0].onclick = () => { window.location = url; }
        msgSuccess.show_message();
    }
}