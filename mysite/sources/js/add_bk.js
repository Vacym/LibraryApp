// version 1.0 release

window.onload = function() {
    var name    = document.querySelector("input[name=name]");
    var genre   = document.querySelector("input[name=genre]");
    var count   = document.querySelector("input[name=quantity]");
    var author  = document.querySelector("input[name=author]");
    var book_id = document.querySelector("input[name=id]");
    var comment = document.querySelector("textarea[name=comment]");

    document.querySelector('#submit').onclick = function() {
        var is_auto_id = document.getElementById("auto_id").checked;
        var is_group = document.getElementById('group_checkbox').checked;
        var books = document.querySelectorAll(".list_id input");
        var query = `name=${name.value}&author=${author.value}&genre=${genre.value}&comment=${comment.value}&id=${book_id.value}`;

        if (books.length > 0 && is_group) {
            if (!is_auto_id) {
                var book_value = books[0].value
                if (book_value) query += `&book_1=${book_value}`;
                else            query += `&book_1=${book_id.value}`;

                for (var i = 1; i < books.length; i++) {
                    book_value = books[i].value
                    if (book_value) query += `&book_${i+1}=${book_value}`
                }
            } else {
                query += `&book_1=${book_id.value}`;
            }
            query += `&count=${count.value}`
        }

        ajaxGet(query);
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
                document.querySelector('#result').innerHTML = req['msg'];
                document.querySelector('#link').parentElement.classList.add("mes_dis");
            }
        }
    }

    request.open('POST', 'sources/php/check_bk.php');
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    request.send(params);
}