// version 1.0 release

class Table { // Класс для работы с Таблицей
    constructor(name) { // Инициализируем класс
        this.name = name; // Название таблицы
        this.src = `C:/NeDB/${name}.json`; // Путь к ней
        this.table = this.SELECT(); // Сохранение таблицы в переменную
    }

    CREATE() { // Создает таблицу
        let params = {
            'users': {
                'id':           {'option': 'num',  'users': []}, 
                'firstname':    {'option': 'text', 'users': []}, 
                'surname':      {'option': 'text', 'users': []}, 
                'lastname':     {'option': 'text', 'users': []},
                'class':        {'option': 'num',  'users': []},
                'letter':       {'option': 'text', 'users': []},
            },
            'books': {
                'id':           {'option': 'num',  'users': []}, 
                'name':         {'option': 'text', 'users': []}, 
                'author':       {'option': 'text', 'users': []}, 
                'genre':        {'option': 'text', 'users': []},
                'comment':      {'option': 'text', 'users': []},
                'inventoryno':  {'option': 'num',  'users': []},
                'userid':       {'option': 'num',  'users': []},
                'dateofissue':  {'option': 'date', 'users': []},
                'groupid':      {'option': 'num',  'users': []},
            }};
        try {
            fs.writeFileSync(this.src, JSON.stringify(params[this.name]));
        } catch (err) {
            console.log('ОШИБКА СОЗДАНИЯ ТАБЛИЦЫ', err);
            if (err.code == 'ENOENT') {
                console.log(`%cСоздаем Мини-СУБД`, "font-size:x-large");
                fs.mkdirSync("C:/NeDB");
                fs.writeFileSync('C:/NeDB/users.json', JSON.stringify(params.users));
                fs.writeFileSync('C:/NeDB/books.json', JSON.stringify(params.books));
            }
        }
    }

    SELECT() { // Возвращает таблицу с данными
        try {
            if (this.table) {
                return this.table;
            } else {
                console.log(`%cИнициализирована ${this.name}`, " font-size:x-large");
                return JSON.parse(fs.readFileSync(this.src, 'utf8'));
            }
        } catch (err) {
            console.log('ОШИБКА ЧТЕНИЯ ТАБЛИЦЫ', err);
            this.CREATE();
        }
    }

    ORDER_BY(data, param) { // Сортировка по определенному параметру столбца
        let type = this.SELECT()[param].option;

        switch (type) {
            case 'num':  data.sort((a,b) => a[param] - b[param]); break;
            case 'text': 
                data.sort((a,b) => { return (a[param] < b[param]) ? -1: (a[param] > b[param]) ? 1: 0; } );

                if (!isUsers) {
                    data = this.ORDER_BY(data, 'userid'); // Отсортировка по инвентарному номеру
                }
                break;
            case 'date': data.sort((a,b) => this.getDays(b[param]) - this.getDays(a[param])); break;
        }
        return data;
    }

    LIKE(data, value, query) { // Выводит те книги, чьи значения совпали со значением, введенным пользователем
        query = query.toLowerCase();
        let result = [];

        for (let item of data) {
            if (value == 'class' && (item.class + item.letter).toLowerCase().includes(query)) {
                result.push(item);
            } else if (String(item[value]).toLowerCase().includes(query)) {
                result.push(item);
            }
        }
        return result;
    }

    DELETE(id) { // Удаляет стобец через его ID
        let data = this.translate();
        let params = this.SELECT();

        if (id < 0) { // Если эта группа...
            let groups = [];
            for (let item in data) {
                if (data[item].groupid == -id) {
                    groups.push(item);
                }
            }

            let arr = [];
            let values = [];

            for (let item in params) {
                values = params[item].users;
                for (let i in values) {
                    if (!groups.includes(i)) {
                        arr.push(values[i]);
                    }
                }
                params[item].users = arr;
                arr = [];
            }
        } else {
            for (let item in data) {
                if (data.hasOwnProperty(item)) {
                    if (data[item].id == id) {
                        id = item;
                    }
                }
            }

            for (let item in params) {
                if (params.hasOwnProperty(item)) {
                    params[item].users.splice(id,1);
                }
            }
        }
        
        this.write(params);
    }

    UPDATE(id, values) { // Обновляем значения столбца на значения из словаря values
        let data = this.SELECT();
        
        for (let item in values) {
            if (values.hasOwnProperty(item)) {
                data[item].users[id] = values[item];
            }
        }

        this.write(data); // Записываем изменения в таблицу
    }

    COUNT(data, param, value) { // Уникальная функция, возращает количество занятых книг и общее количество книг
        let all = 0;
        let busy = 0;

        for (let item of data) {
            if (item[param] == value) {
                if (item.userid) {
                    busy++;
                }
                all++;
            }
        }
        return [busy, all];
    }

    INSERT(values) {
        let params = this.SELECT();

        for (let i = 0; i < Object.keys(params).length-1; i++) {
            if(values[i] === null) values[i] = null;
        }

        let len = params.id.users.length;
        let i = -1;

        let nextID = len ? params.id.users[len-1]+1 : 1;

        for (let item in params) {
            if (item == 'id') {
                params[item].users[len] = nextID;
            } else {
                params[item].users[len] = values[i];
            }
            i++;
        }

        this.write(params);
        return nextID;
    }

    get(query='') { // Возращает таблицу измененную под определенные настройки
        let result = [];

        if (GET.im && GET.del) { // Если это страница с откреплением книги от ученика
            let data = this.ORDER_BY(this.translate(), GET.order);
            
            for (let item of data) {
                if (item.userid == GET.im) {
                    result.push(item)
                }
            }
        } else if (GET.group) { // Если это страница с развернутой группой книг
            let data = this.ORDER_BY(this.translate(), 'inventoryno');

            for (let item of data) {
                if (item.groupid == GET.group) {
                    result.push(item);
                }
            }
        } else if (GET.order == 'dateofissue') {
            let data = this.ORDER_BY(this.translate(), GET.order);

            for (let item of data) {
                if (item.userid) {
                    result.push(item);
                }
            }
        } else { // Если это обычная страница
            let data = this.ORDER_BY(this.translate(), GET.order);
            let groups = [];

            for (let item of data) {
                if (GET.order != 'inventoryno' && item.groupid > 0) {
                    if (!groups.includes(item.groupid)) {
                        result.push(item);
                        groups.push(item.groupid);
                    }
                } else {
                    result.push(item);
                }
            }
        }
        return this.LIKE(result, GET.order, query);
    }

    equal(traspose, param, value, onlyOne=false) { // Возвращает массив с столбцами, где параметр равен определонному значению
        let result = [];
        for (let item in traspose) {
            if (value == traspose[item][param]) {
                if (onlyOne) return traspose[item];
                result.push(traspose[item]);
            }
        }
        return result;
    }

    write(params) { // Переписывает данные таблицы на свои
        try {
            fs.writeFileSync(this.src, JSON.stringify(params));
        } catch (err) {
            console.log('ОШИБКА ИЗМЕНЕНИЯ ТАБЛИЦЫ', err);
        }
    }

    translate(data=this.SELECT()) { // Возвращает данные таблицу в "человеческом виде"
        let result = [];
        for (let i = 0; i < data.id.users.length; i++) {
            result[i] = {};
            for (let item in data) {
                result[i][item] = data[item].users[i];
            }
        }
        return result;
    }

    isSameID(otherItem) { // Проверяет наличие инвентарного номера в БД 
        for (let item of this.SELECT().inventoryno.users) {
            if (otherItem == item) {
                return true;
            }
        }
        return false;
    }

    getIndexFromID(ID) { // Возвращает индекс столбца, исходя из его id
        let data = this.SELECT().id.users; // Сохраняем значения всех id, чтобы идентифицировать нашего ученика или книгу

        for (let index in data) {
            if (data[index] == ID) {
                return index;
            }
        }
    }

    getDays(date) { // Преобразует дату в количество дней
        if (date) {
            date = date.split('.'); // Перевод из русской даты в английскую
            [date[0], date[1]] = [date[1], date[0]];
            date = date.join('.');

            return ((Date.now() - new Date(date).getTime())/3600000/24)|0;
        } 
        return -1;
    }

    get length() {
        return this.table.id.users.length;
    }

    get nextGroupID() { // Возвращает следующий свободный групповой ID
        let MaxGroupID = 0;
        for (let item of this.SELECT().groupid.users) {
            if (item && item > MaxGroupID) {
                MaxGroupID = item;
            }
        }
        return MaxGroupID+1;
    }
}

let fs = require("fs"); // Подключаем библиотеку для работы с файловой системой