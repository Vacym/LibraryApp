// version 1.0 release

// const { dialog } = require("electron");

class Message {
    constructor(buttons, head, body, {activate = null, cancel = -1, type = "notice"} ){
        this.buttons  = buttons; // Список кнопок
        this.head     = head; // Заголовок
        this.body     = body; // Описание
        this.type     = type; // Тип уведомления
        this.activate = activate; // Кнопка для активации
        this.cancel   = cancel; // Индекс кнопки для закрытия уведомления


    
    }

    class_create(){ // Создаём класс для уведомления в зависимости от типа
        let full_class = "mes-";

        if (this.type == "conf")        {full_class += "confirmation";}
        else if (this.type == "notice") {full_class += "notice";}
        else                            {full_class += this.type;}

        return full_class;
    }

    add_listeners(){
        if (this.activate) { // activate - должен быть css селектор на элемент
            document.querySelector(this.activate).addEventListener("click", () => this.show_message());
        }

        if (this.cancel != -1) {    // close - должен быть индекс кнопки в переданном списке
            this.link_buttons[this.cancel].addEventListener("click", () => this.close_message());
        }

        this.link_close.addEventListener("click", () => this.close_message()); // Закрытие на кнопку крестика
    }

    create_message(){ // Создаем и добавляем уведомление на страницу

        // Ищем тег <messages>
        let space = document.querySelector("messages");

        if (!space){
            space = document.createElement("messages");
            document.body.append(space);
        }
        console.log(space);

        // Генерируем наш dialog
        let dialog = document.createElement("dialog");
        dialog.className = `message ${this.class_create()}`;

        let inner = '';
        
        if (this.head){ // Если есть заголовок
            inner += `<h3 class="modal-header">${this.head}</h3>`;
        }
        if (this.body){ // Если есть описание
            inner += `<div class="modal-body">${this.body}</div>`;
        }
        if (this.buttons){ // Если есть кнопки
            inner += `<footer class="modal-footer">`;
            for (let x = 0; x < this.buttons.length; x++) {
                inner += `<button type="button">${this.buttons[x]}</button>`;   
            }
            inner += `</footer>`;
        }
        inner += `<button class="modal-close" type="button" tabindex="-1">&times;</button>`; // крестик


        dialog.innerHTML = inner;
        space.append(dialog);
        
        this.dialog = dialog;
        this.add_listeners();

        return dialog;

    }

    show_message(){ // Показать уведомление
        this.dialog.showModal();
    }

    close_message(){ // Закрыть уведомление
        this.dialog.close();
    }

    // Геттеры

    get link_buttons(){
        return this.dialog.querySelectorAll(".modal-footer button");
    }
    get link_close(){
        return this.dialog.querySelector(".modal-close");
    }
    get link_head(){
        return this.dialog.querySelector(".modal-header");
    }
    get link_body(){
        return this.dialog.querySelector(".modal-body");
    }
    get self(){
        return this.dialog;
    }

    // Сеттеры


    set set_head(value){
        this.head = value;
        this.link_head.innerHTML = value;
    }

    set set_body(value){
        this.body = value;
        this.link_body.innerHTML = value;
    }
}



function message_ready() {

    // mes_del = new Message(["Удалить", "Отменить"], "Удаление", "Вы уверены, что хотите удалить профиль?", {activate: "#del", cancel: 1, type: "conf"});
    // console.log(mes_del);
    // mes_del.create_message();

    // let button_list = document.querySelectorAll("[message]")
    // let button_class_list = []
    // for (let x = 0; x < button_list.length; x++) {
    //     button_class_list.push(new But_message(button_list[x]))
    // }
    // but_del = document.querySelector('#del')
    // dil = document.querySelector('#demo-modal')
    // but_del.addEventListener("click", () => dil.showModal())
    // dil.showModal()
}

document.addEventListener("DOMContentLoaded", message_ready);

// Код Djacon
function success(url, msg) { // Функция добавляем ссылку кнопке и заменяет текст
    document.querySelector('#result').innerHTML = msg;
    document.querySelector('#cancel').setAttribute('href', url);
}

function error(msg) { // Здесь должна будет быть функция для вывода на экран окна ошибки
    document.querySelector('#result').innerHTML = msg;
}

function sendErr() {
    document.body.innerHTML = `<a class="but" id="home" href="index.html"></a>
                                <a class="but" id="back" onclick="history.back()"></a>
                                <h1>Упс, вас здесь быть не должно 😱!</h1>
                                <h2 align=center>Чтобы продолжить вернитесь на главную страницу</h2>`;
}