// version 1.0 release

document.addEventListener('click', (e) => { // Отключаем ссылки
    let el = e.target;
    console.log(el);


    while (el && !el.href) { // Идем вверх по дереву, пока не найдем элемент с href
        if (["LABEL", "INPUT"].includes(el.nodeName)){ el = null; break;} // Если тег входит в исключения, не обрабатывем
        el = el.parentNode;
    }

    if (el) {
        e.preventDefault(); // Блокируем действие по умолчанию
        console.log(`${e.target} Поведение заблокировано`);
        history.pushState(null, null, el.href); // Меняем историю
        change_page();
        return false;
    }
});

function load_page(url) { // Загружаем нужную страницу
    return fetch(url, {
        method: 'GET'
    }).then(function (response) {
        console.log(response);
        return response.text();
    });
}

function change_page() {
    console.log("changePage");
    // URL уже изменился
    let url = window.location.href;
    console.log(url);

    load_page(url).then(function(responseText) {
        console.log(responseText);
        var wrapper = document.createElement('html'); // Создаём копию нужной нам страницы
        wrapper.innerHTML = responseText;

        console.log(wrapper);
        modify_css(wrapper.querySelector('head'));
        modify_other(wrapper.querySelector('body'));

        var oldContent = document.querySelector('main');
        console.log(oldContent);
        var newContent = wrapper.querySelector('body main');
        console.log(newContent);

        oldContent.before(newContent); // Вставляем новый main перед старым

        animate(newContent, oldContent); // Анимируем
        modify_script(wrapper.querySelector('head'));
    }, function(error) {
        console.log(error);
    }
    );
}

function animate(newContent, oldContent) { // Анимация исчезновения и появления
    if(oldContent){
        if (oldContent.nodeName == "MAIN"){
            oldContent.style.position = 'absolute';
            // oldContent.style.width = "calc(100% - 16px)";
            oldContent.style.top = "8px";
            oldContent.style.right = "8px";
            oldContent.style.left = "8px";
        }
    
        var fadeOut = oldContent.animate({
            opacity: [1, 0]
        }, load_time);

        fadeOut.onfinish = () => {
            oldContent.remove();
        };
    }
    if (newContent){
        var fadeIn = newContent.animate({
            opacity: [0, 1]
        }, load_time);
    }    
}

function modify_css(head_new){ // Модифицирует шапку с css
    let head_old = document.head; // Определяем текущую голову
    console.log(head_old);

    let links_new = head_new.querySelectorAll("link"); // Находим все ссылки с другой страницы
    let links_old = head_old.querySelectorAll("link"); // Находим все ссылки с этой страницы

    console.log(links_new);
    console.log(links_old);

    links_new.forEach((link, index, arr) => {
        console.log(link);

        let aft; // Элемент, после которого нужно вставлять
        if(index > 0){
            aft = arr[index -1];
        } else {
            aft = links_old[links_old.length - 1];
        }
        aft.after(link);
    });

    setTimeout(() => {for(let link of links_old){ // Убираем старые ссылки
        link.remove();
    }}, load_time);
    

}

function modify_other(body_new){ // Добавляет другие элементы кроме main
    elements_new = body_new.children;
    elements_old = Array.from(document.body.children);

    console.log(elements_new);
    console.log(elements_old);
    let ignore_names = ["META", "SCRIPT", "MAIN", "MESSAGES"];
    for (let element of elements_new){
        console.log(element);

        if (!ignore_names.includes(element.nodeName)){ // Если элеиент не находится в исключениях
            console.log("appending...");
            console.log(generate_selector(element, true));

            let twin_element = document.body.querySelector(generate_selector(element, true)); // Ищем такой же элемент
            if (!twin_element) { // Если не нашли,
                twin_element = element.cloneNode(true); // То клонируем,
                document.body.append(twin_element); // Вставляем
                animate(twin_element); // И анимируем
            } else { // А если нашли,
                console.log(elements_old[1], twin_element);
                console.log(elements_old[1] == twin_element);
                elements_old.splice(elements_old.indexOf(twin_element), 1); // То удаляем из списка старых
            }
        } else {
            console.log("ignoring");
            continue;
        }
    }
    for(let element of elements_old){ // Смотрим все оставшиеся неудалённые элементы
        if (!ignore_names.includes(element.nodeName)){ // если не в исключениях,
            animate(null, element); // То удаляем
        }
    }
}

function modify_script(head_new){ // Подключает новые скрипты
    let scripts_new = Array.from(head_new.querySelectorAll("script"));
    let scripts_old = Array.from(document.head.querySelectorAll("script"));
    let scripts_src = []; // Массив с ссылками на нужные скрипты

    for (let script of scripts_new){ // Выделяем название скрипта
        src = script.src;
        position = src.lastIndexOf("/");
        scripts_src.push(src.slice(position + 1));
    }

    console.log(scripts_new);
    console.log(scripts_old);

    let find = false; // Найден ли такой же скрипт?
    for(let script_new of scripts_new){

        for(var x = 0; x < scripts_old.length; x++){
            if(script_new.src == scripts_old[x].src){ // Как только нащли такой же скрипт
                find = true;
                break; // Бросаем дальнейший поиск
            }
        }

        if(find){ // Если нашли
            scripts_old.splice(x, 1); // То удаляем его из списка
        } else { // Если не нашли
            let script = document.createElement('script');
            script.src = script_new.src;
            document.head.append(script); // ДДобавляем его на страницу
        }
        find = false;
    }

    start_scripts(scripts_src);
}

let generate_selector = (el, short = false) => { // Генерирует css селектор
    if (el.tagName.toLowerCase() == "html")
        return "HTML";
    let str = el.tagName;
    str += (el.id != "") ? "#" + el.id : "";
    if (el.className) {
        var classes = el.className.split(/\s/);
        for (var i = 0; i < classes.length; i++) {
            str += "." + classes[i];
        }
    }
    if (short){ return str;}
    return generate_selector(el.parentNode) + " > " + str;
};

function start_scripts(scripts_src){ // Запуск события старта всех скриптов
    console.log("Попытка запуска");
    setTimeout(() => {
        document.dispatchEvent(new CustomEvent("contentLoaded", {
            detail: {need_scripts: scripts_src}
        }));
        console.log("Запуск окончен");
    }, 15);
}

function finish_scripts(scripts_src){ // Запуск события ухода со страницы
    console.log("Попытка запуска");
    setTimeout(() => {
        document.dispatchEvent(new CustomEvent("contentUnload", {
            detail: {need_scripts: scripts_src}
        }));
        console.log("Запуск окончен");
    }, 15);
}


// window.addEventListener('popstate', change_page);

const load_time = 100; // Время анимации загрузки страницы (в миллисекундах)
// document.addEventListener("DOMContentLoaded", () => {
//     users = new Table('users');
//     books = new Table('books');
// });