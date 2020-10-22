//version 1.0

function validation_text(element) {
    var element = element.currentTarget
    var regex = /^[а-яё-]+$/i

    var is_valid = element.value.match(regex)
    var static = "bad"

    //если ничего не введено
    if (element.value == "") { static = "empty" } else if (is_valid) { static = "good" }

    change_border(element, static)
}

function change_border(element, type, check = true) {
    var default_value = element.classList

    if (type == "bad") {
        //если был хорошим
        default_value.remove("good_input")

        //если не был плохим
        if (!default_value.contains("bad_input")) {
            default_value.add("bad_input")
        }
    } else if (type == "good") {

        //если был плохим
        default_value.remove("bad_input")

        //если не был хорошим
        if (!default_value.contains("good_input")) {
            default_value.add("good_input")
        }
    } else if (type == "empty") {
        //удаляем доп стилизацию
        default_value.remove("bad_input")
        default_value.remove("good_input")
    }

    // запускаем общую проверку на корректность данных
    if (check) { button_control() }
}

function button_control() {
    var all_good = full_validation()
    if (all_good) {
        document.querySelector("#submit").removeAttribute("disabled")
    } else {
        document.querySelector("#submit").setAttribute("disabled", "disabled")
    }
}

function full_validation() {
    var bads = document.querySelectorAll('.form input[type="text"].bad_input, .form input[type="number"].bad_input')

    if (bads.length > 0) {
        change_border(document.querySelector("#submit"), "bad", false)
        return false
    }

    var required = document.querySelectorAll('.necessary_input')
    for (var x = 0; x < required.length; x++) {
        if (!required[x].classList.contains("good_input")) {
            change_border(document.querySelector("#submit"), "empty", false)
            return false
        }
    }
    change_border(document.querySelector("#submit"), "good", false)
    return true
}

function ready() {
    var text_inputs = document.querySelectorAll('input[type="text"], input[type="number"], textarea')
        // запуск прослушивания событий для текстовых полей
    for (var x = 0; x < text_inputs.length; x++) {
        //console.log(text_inputs[x])
        text_inputs[x].addEventListener("change", validation_text)
    }

    document.querySelector('textarea').addEventListener('input', function(e) {
        e.target.style.height = 'auto'
        e.target.style.height = e.target.scrollHeight + 2 + "px"
    })

}

document.addEventListener("DOMContentLoaded", ready);