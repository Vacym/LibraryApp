// version 1.0 release

class Message { // Класс для работы с плывающими окнами
    constructor(buttons, head, body, {activate = null, cancel = -1, focus = 0, type = "notice", esc = true, home = "esc"} ){
        this._head    = head;     // Заголовок
        this._body    = body;     // Описание
        this.buttons  = buttons;  // Список кнопок
        this.activate = activate; // Кнопка для активации
        this.cancel   = cancel;   // Индекс кнопки для закрытия уведомления
        this.focus    = focus;    // Индекс кнопки, которая должна находиться в фокусе
        this.type     = type;     // Тип уведомления
        this.esc      = esc;      // Возможность закрытия уведомления
        this.home     = home;     // Возможность перейти домой (disable)
        if (home == "esc") this.home = this.esc;
    }

    classCreate(){ // Создаём класс для уведомления в зависимости от типа
        let fullСlass = "mes-";

        if (this.type == "conf")        fullСlass += "confirmation";
        else if (this.type == "notice") fullСlass += "notice";
        else                            fullСlass += this.type;

        return fullСlass;
    }

    addListeners(){
        if (this.activate) { // activate - должен быть css селектор на элемент или сам элемент
            if (typeof this.activate == "string"){
                this.activate = document.querySelector(this.activate);
            }
            this.activate.addEventListener("click", () => this.show());
        }

        if (this.cancel != -1) { // close - должен быть индекс кнопки в переданном списке
            this.linkButtons[this.cancel].addEventListener("click", () => this.close());
        }
        if (this.esc){ // Закрытие на кнопку крестика
            this.linkClose.addEventListener("click", () => this.close());
        }
    }

    create(){ // Создаем и добавляем уведомление на страницу
        // Ищем тег <messages>
        let space = document.querySelector("messages");

        if (!space){
            space = document.createElement("messages");
            document.body.append(space);
        }

        // Генерируем наш dialog
        let dialog = document.createElement("dialog");
        dialog.className = `message ${this.classCreate()}`;

        let inner = '';
        
        if (this._head){ // Если есть заголовок
            inner += `<h3 class="modal-header">${this._head}</h3>`;
        }
        if (this._body){ // Если есть описание
            inner += `<div class="modal-body">${this._body}</div>`;
        }
        if (this.buttons){ // Если есть кнопки
            inner += `<footer class="modal-footer">`;
            for (let x = 0; x < this.buttons.length; x++) {
                inner += `<button type="button">${this.buttons[x]}</button>`;   
            }
            inner += `</footer>`;
        }
        if (this.esc){ // Если уведомление можно закрыть
            inner += `<button class="modal-close" type="button" tabindex="-1">&times;</button>`; // крестик
        }


        dialog.innerHTML = inner;
        space.append(dialog); // Добавляем элемент на страницу
        
        this.dialog = dialog;
        this.addListeners();

        return dialog;

    }

    remove(){ // Удаление этого сообщения
        this.dialog.remove();
    }

    escControl(){ // Контроль нажатия клавиши Esc для плавного закрытия уведомления
        if (this.dialog.open){
            let selfMes = this;

            document.querySelector('body').onkeydown = (e) => {
                if (e.code == "Escape") {
                    e.preventDefault();
                    if (selfMes.esc){ selfMes.close(); }
                }
                // else if (e.key == "Home" && e.altKey){ // Если это alt + home
                //     e.preventDefault();
                // }
            };
        } else {
            document.querySelector('body').onkeydown = null;
        }
    }

    show(){ // Показать уведомление
        if (this.dialog.open){return false;}
        this.lastFocus = document.activeElement; // Элемент, на котором был фокус
        this.dialog.showModal();
        this.linkButtons[this.focus].focus();
        this.dialog.classList.add("show");
        this.escControl();
    }

    close(){ // Закрыть уведомление
        this.dialog.classList.remove("show");
        setTimeout(() => {
            this.dialog.close();
            this.escControl();
            this.lastFocus.focus(); // Возвращаем фокус
        }, 250);
    }

    // Геттеры

    get linkButtons(){ // Массив кнопок
        return this.dialog.querySelectorAll(".modal-footer button");
    }
    get linkButtonsBox(){ // Область с кнопками
        return this.dialog.querySelectorAll(".modal-footer");
    }
    get linkClose(){ // Крестик закрытия
        return this.dialog.querySelector(".modal-close");
    }
    get linkHead(){ // Заголовок сообщения
        return this.dialog.querySelector(".modal-header");
    }
    get linkBody(){ // Тело сообщения
        return this.dialog.querySelector(".modal-body");
    }
    get self(){ // Блок с диалогом
        return this.dialog;
    }

    get body(){ return this._body; }

    get head(){ return this._head; }

    // Сеттеры

    set head(value){ // Изменить заголовок
        this._head = value;
        this.linkHead.innerHTML = value;
    }

    set body(value){ // Изменить тело
        this._body = value;
        this.linkBody.innerHTML = value;
    }
}

function sendErr() { // Вызывается при возникновении ошибки
    document.body.innerHTML = `<a class="but" id="home" href="index.html"></a>
                                <a class="but" id="back" onclick="history.back()"></a>
                                <h1>Упс, вас здесь быть не должно 😱!</h1>
                                <h2 align=center>Чтобы продолжить вернитесь на главную страницу</h2>`;
}