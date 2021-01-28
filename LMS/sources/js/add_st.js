// version 1.0 release

window.onload = function() {
    let firstname = document.querySelector("input[name=firstname]");
    let surname   = document.querySelector("input[name=surname]");
    let lastname  = document.querySelector("input[name=lastname]");
    let classNum  = document.querySelector("input[name=class]");
    let classLtr  = document.querySelector("input[name=letter]");

    let users = new Table('users');

    document.querySelector('#submit').onclick = function () {
        let _firstname = valid('username', firstname.value);
        let _surname   = valid('username', surname.value);
        let _lastname  = valid('username', lastname.value) || lastname.value == '';
        let _classNum  = valid('class', classNum.value);
        let _classLtr  = valid('letter', classLtr.value);

        if (!_firstname || !_surname || !_lastname || !_classNum || !_classLtr) {
            send('Некоректный ввод!');
            return;
        }

        let id = users.INSERT([firstname.value, surname.value, lastname.value, classNum.value, classLtr.value]);
        successS(`account.html?id=${id}`, 'Ученик успешно добавлен!');
    }
}