document.addEventListener('click', (e) => { // Отключаем ссылки
    let el = e.target;

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
        return response.text();
    });
}

function change_page() {
    console.log("changePage");
    // URL уже изменился
    let url = window.location.href;
    console.log(url);

    load_page(url).then(function(responseText) {
        var wrapper = document.createElement('div');
            wrapper.innerHTML = responseText;
        console.log(wrapper);

        
        var oldContent = document.querySelector('main');
        console.log(oldContent);
        var newContent = wrapper.querySelector('main');
        console.log(newContent);

        oldContent.before(newContent);
        animate(oldContent, newContent);
    });
}

function animate(oldContent, newContent) {
    oldContent.style.position = 'absolute';
    oldContent.style.width = "calc(100% - 16px)";
    oldContent.style.top = "8px";
    oldContent.style.right = "8px";
    oldContent.style.left = "8px";
  
    var fadeOut = oldContent.animate({
      opacity: [1, 0]
    }, load_time);
  
    var fadeIn = newContent.animate({
      opacity: [0, 1]
    }, load_time);
  
    fadeIn.onfinish = () => {
      oldContent.parentNode.removeChild(oldContent);
    };
}

window.addEventListener('popstate', change_page);

const load_time = 1000; // Время анимации загрузки страницы (в миллисекундах)