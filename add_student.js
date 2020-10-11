//version 0.1

function validation_text(element) {
    var element  = element.currentTarget
    var regex    = /^[а-яё-]+$/i

    if (element.id == "class_letter") {
        element.value = element.value.toUpperCase(); 
        regex = /^[А-Я-]$/ 
    } else if (element.id == "class_number") {
        regex = /^([1-9]|1[01])$/
    }

    var is_valid = element.value.match(regex)
    var static   = "bad";

    //если ничего не введено
    if (element.value == "") { static = "empty" }  
    else if (is_valid)       { static = "good" }
    
    change_shadow(element, static)
}

function change_shadow(element, type, check = true) {
    var default_value = element.classList
    
    if (type == "bad") {
        //если был хорошим
        if (default_value.contains("good_input")) {
            default_value.remove("good_input")
        }
        //если не был плохим
        if (!default_value.contains("bad_input")) {
            default_value.add("bad_input")
        }
    } else if (type == "good") {

        //если был плохим
        if (default_value.contains("bad_input")) {
            default_value.remove("bad_input")
        }
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
    var bads_submit = document.querySelectorAll('.bad_input')
    var bads = []
    for (var x = 0; x < bads_submit.length; x++) {
        if (bads_submit[x].getAttribute("id") != "submit") {
            bads.push(bads_submit[x])
        }
    }

    if (bads.length > 0) {
        change_shadow(document.querySelector("#submit"), "bad", false)
        return false
    }

    var required = document.querySelectorAll('.necessary_input')
    for (var x = 0; x < required.length; x++) {
        if (!required[x].classList.contains("good_input")) {
            change_shadow(document.querySelector("#submit"), "empty", false)
            return false
        }
    }
    change_shadow(document.querySelector("#submit"), "good", false)
    return true
}

function ready() {
    var text_inputs = document.querySelectorAll('input[type="text"], input[type="number"]')
        // запуск прослушивания событий для текстовых полей
    for (var x = 0; x < text_inputs.length; x++) {
        text_inputs[x].addEventListener("change", validation_text)
    }
}

document.addEventListener("DOMContentLoaded", ready);
