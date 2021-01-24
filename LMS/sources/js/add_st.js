// version 1.0 release

window.onload = function() {
    let firstname = document.querySelector("input[name=firstname]");
    let surname   = document.querySelector("input[name=surname]");
    let lastname  = document.querySelector("input[name=lastname]");
    let classNum  = document.querySelector("input[name=class]");
    let classLtr  = document.querySelector("input[name=letter]");

    let fs = require("fs");

    // Мой код, принимающий массив с данными и преобразующий его в блоки
    class Table {
        constructor(name) {
            this.name = name + '.json';
        }

        SELECT() {
            try {
                return JSON.parse(fs.readFileSync(this.name, 'utf8'));
            } catch (err) {
                console.log('ОШИБКА ЧТЕНИЯ ТАБЛИЦЫ', err);
            }
        }

        INSERT(values) {
            let params = this.SELECT();

            for (let i = 0; i < Object.keys(params).length-1; i++) {
                if(values[i] === null) values[i] = null;
            }

            let len = params['id']['users'].length;
            let i = -1;

            let nextID = len ? params['id']['users'][len-1]+1 : 1;

            for (let item in params) {
                if (item == 'id') {
                    params[item]['users'][len] = nextID;
                } else {
                    params[item]['users'][len] = values[i];
                }
                i++;
            }

            this.write(params);
            return nextID;
        }

        write(params) {
            try {
                fs.writeFileSync(this.name, JSON.stringify(params));
            } catch (err) {
                console.log('ОШИБКА ИЗМЕНЕНИЯ ТАБЛИЦЫ', err);
            }
        }
    }

    let users = new Table('users');

    document.querySelector('#submit').onclick = function () {
        let _firstname = firstname.value.match(/^[а-я-]+$/i);
        let _surname   = surname.value.match(/^[а-я-]+$/i);
        let _lastname  = lastname.value.match(/^[а-я-]+$/i) || lastname.value == '';
        let _classNum  = classNum.value.match(/^([1-9]|1[01])$/);
        let _classLtr  = classLtr.value.match(/^[А-Я]$/);

        if (!_firstname || !_surname || !_lastname || !_classNum || !_classLtr) {
            document.querySelector('#result').innerHTML = 'Неправильный ввод!';
            document.querySelector('#link').parentElement.classList.add("mes_dis");

            console.log('Ошибка');
        } else {
            let id = users.INSERT([firstname.value, surname.value, lastname.value, classNum.value, classLtr.value]);
            
            document.querySelector('#result').innerHTML = 'Ученик успешно добавлен!';
            document.querySelector('#link').parentElement.classList.remove("mes_dis");
            document.querySelector("#link").setAttribute('href', `account.html?id=${id}`);
            inputs = document.querySelectorAll('input[type="text"], input[type="number"], textarea');
            for (let x = 0; x < inputs.length; x++) {
                inputs[x].value = '';
            }
            full_check();
        }
    }
}