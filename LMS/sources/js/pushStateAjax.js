document.addEventListener('click', (e) => { // Отключаем ссылки
    let el = e.target;

    if (["LABEL"].includes(el.nodeName)){ el = null; }

    while (el && !el.href) { // Идем вверх по дереву, пока не найдем элемент с href
        el = el.parentNode;
    }

    if (el) {
        e.preventDefault();
        console.log(`${e.target} Поведение заблокировано`);
        history.pushState(null, null, el.href);
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
        var wrapper = document.createElement('html');
        wrapper.innerHTML = responseText;

        console.log(wrapper);
        modify_css(wrapper.querySelector('head'));
        modify_other(wrapper.querySelector('body'));

        var oldContent = document.querySelector('main');
        console.log(oldContent);
        var newContent = wrapper.querySelector('body main');
        console.log(newContent);

        oldContent.before(newContent);

        animate(newContent, oldContent);
        modify_script(wrapper.querySelector('head'));
    }, function(error) {
        console.log(error);
    }
    );
}

function animate(newContent, oldContent) {
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
    // for (let x = 0; x < elements_old.length; x++) {
    //     elements_old[x] = generate_selector(elements_old[x], true);
    // }
    console.log(elements_new);
    console.log(elements_old);
    let ignore_names = ["META", "SCRIPT", "MAIN", "MESSAGES"];
    for (let element of elements_new){
        console.log(element);
        if (!ignore_names.includes(element.nodeName)){
            console.log("appending...");
            console.log(generate_selector(element, true));
            let twin_element = document.body.querySelector(generate_selector(element, true));
            if (!twin_element) {
                twin_element = element.cloneNode(true);
                document.body.append(twin_element);
                animate(twin_element);
            } else {
                console.log(elements_old[1], twin_element);
                console.log(elements_old[1] == twin_element);
                elements_old.splice(elements_old.indexOf(twin_element), 1);
            }
        } else {
            console.log("ignoring");
            continue;
        }
    }
    for(let element of elements_old){
        if (!ignore_names.includes(element.nodeName)){
            animate(null, element);
        }
    }
}

function modify_script(head_new){
    let scripts_new = Array.from(head_new.querySelectorAll("script"));
    let scripts_old = Array.from(document.head.querySelectorAll("script"));
    let scripts_src = [];
    for (let scr of scripts_new){
        src = scr.src;
        position = src.lastIndexOf("/");
        scripts_src.push(src.slice(position + 1));
    }

    console.log(scripts_new);
    console.log(scripts_old);

    let find = false;
    for(let script_new of scripts_new){
        for(var x = 0; x < scripts_old.length; x++){
            if(script_new.src == scripts_old[x].src){
                find = true;
                break;
            }
            else{

            }
        }
        if(find){
            scripts_old.splice(x, 1);
        } else {
            let script = document.createElement('script');
            script.src = script_new.src;
            document.head.append(script);
        }
        find = false;
    }
    for(let script_old of scripts_old){
        // script_old.remove();
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

// document.dispatchEvent(new CustomEvent("contentLoaded"));

function start_scripts(scripts_src){
    console.log("Попытка запуска");
    setTimeout(() => {
        document.dispatchEvent(new CustomEvent("contentLoaded", {
            detail: {need_scripts: scripts_src}
        }));
        console.log("Запуск окончен");
    }, 15);
}


window.addEventListener('popstate', change_page);

const load_time = 100; // Время анимации загрузки страницы (в миллисекундах)
document.addEventListener("DOMContentLoaded", () => {
    users = new Table('users');
    books = new Table('books');
});