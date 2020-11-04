window.onload = function() {
    var firstname = document.querySelector("input[name=firstname]");
    var surname   = document.querySelector("input[name=surname]");
    var lastname  = document.querySelector("input[name=lastname]");
    var class_num = document.querySelector("input[name=class]");
    var class_ltr = document.querySelector("input[name=letter]");

    document.querySelector('#submit').onclick = function () {
        var params = `firstname=${firstname.value}&surname=${surname.value}&lastname=${lastname.value}&class=${class_num.value}&letter=${class_ltr.value}`;
        ajaxGet(params);
    }
}

function ajaxGet(params) {
    var request = new XMLHttpRequest();

    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            var req = JSON.parse(request.responseText);
            if (req['success']) {
                document.querySelector('#result').innerHTML = 'Ученик успешно добавлен!';
                document.querySelector('#link').parentElement.classList.remove("mes_dis")
                document.querySelector("#link").setAttribute('href', `account.php/${req['id']}`);
                inputs = document.querySelectorAll('input[type="text"], input[type="number"], textarea')
                for (let x = 0; x < inputs.length; x++) {
                    inputs[x].value = ''
                }
                full_check()
            } else {
                document.querySelector('#result').innerHTML = 'Неправильный ввод!';
                document.querySelector('#link').parentElement.classList.add("mes_dis")
            }

        }
    }

    request.open('POST', 'sources/php/check_st.php');
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    request.send(params);
}