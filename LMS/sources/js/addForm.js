if (!isBook) {
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
} else {
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
                                                            <input type="checkbox" name="group" id="group_checkbox" onchange="show_group(this, '.for_group', true, true)" value="Создать группу книг">
                                                            <label for="group_checkbox" class="group_checkbox">Создать Группу книг</label>
                                                        </div>
                                                        <div class="illusion" id="for_group_il">
                                                            <div class="for_group">
                                                                <div class="line">
                                                                    <input type="number" name="quantity" id="quantity" placeholder="Количество копий" min="0" autocomplete="off">
                                                                    <span class="single_checkbox">
                                                                        <input type="checkbox" name="auto_id" id="auto_id" value="auto_id" onchange="show_group(this, '.list_id', false)" checked>
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
}

let msgError = new Message(['Ок'], "Ошибка", "Произошла ошибка", {cancel:0, type: "conf"});
let msgSuccess = new Message(['Перейти в личный кабинет', 'Ок'], 'Успешно', 'Изменение прошло успешно', {cancel:1, type: 'conf'});

msgSuccess.create_message();
msgError.create_message();

const success = (url, text) => {
    msgSuccess.set_body = text;
    msgSuccess.link_buttons[0].onclick = () => { window.location = url; }
    msgSuccess.show_message();

    inputs = document.querySelectorAll('input[type="text"], input[type="number"], textarea');
    for (let x = 0; x < inputs.length; x++) {
        inputs[x].value = '';
    }
    full_check();
}
	const error = (text) => {
    msgError.set_body = text;
    msgError.show_message();
}