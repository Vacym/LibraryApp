// version 1.0 release

window.onload = function() {
    var name    = document.querySelector("input[name=name]");
    var genre   = document.querySelector("input[name=genre]");
    var count   = document.querySelector("input[name=quantity]");
    var author  = document.querySelector("input[name=author]");
    var book_id = document.querySelector("input[name=id]");
    var comment = document.querySelector("textarea[name=comment]");
    var books   = document.querySelectorAll(".books");

    document.querySelector('#submit').onclick = function() {
        console.log(books.value);

        var params = `name=${name.value}&author=${author.value}&genre=${genre.value}&comment=${comment.value}&id=${book_id.value}&count=${count.value}`;
        ajaxGet(params);
    }
}

function ajaxGet(params) {
    var request = new XMLHttpRequest();

    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            var req = JSON.parse(request.responseText);
            if (req['success']) {
                document.querySelector('#result').innerHTML = 'Книга успешно добавлена!';
                document.querySelector('#link').parentElement.classList.remove("mes_dis");
                document.querySelector("#link").setAttribute('href', `books.php/${req['id']}`);
                inputs = document.querySelectorAll('input[type="text"], input[type="number"], textarea')
                for (let x = 0; x < inputs.length; x++) {
                    inputs[x].value = ''
                }
                full_check()
            } else {
                document.querySelector('#result').innerHTML = 'Неправильный ввод!';
                document.querySelector('#link').parentElement.classList.add("mes_dis");
            }
        }
    }

    request.open('POST', 'sources/php/check_bk.php');
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    request.send(params);
}