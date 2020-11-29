// version 1.0 release

function control_inputs(q_inputs) {
    // Определяем сколько елемнтов нужно
    if (!q_inputs) { q_inputs = parseInt(document.querySelector("#quantity").value) }
    if (!q_inputs) { q_inputs = 0 }
    let cont_input_book = document.querySelector(".list_id")

    // Определяем сколько элементов в реальности
    let real_q_inputs = cont_input_book.lastElementChild
    if (real_q_inputs) {
        real_q_inputs = real_q_inputs.querySelector("input").name
        real_q_inputs = parseInt(real_q_inputs.match(/\d+$/)[0])
    } else {
        real_q_inputs = 0
    }

    // Добавление нужного количества элементов
    for (let x = 1 + real_q_inputs; x < q_inputs + 1; x++) {
        let input_book = document.createElement('div');
        input_book.className = "line";
        input_book.innerHTML = `<span>${x}. </span>
    <input type="number" name="book_id_${x}" placeholder="ID ${x}" min="0" autocomplete="off">`;
        cont_input_book.append(input_book)
    }

    // Удаление нужного количества элементов
    for (let x = 0; x < real_q_inputs - q_inputs; x++) {
        cont_input_book.lastElementChild.remove()
    }
    height_illusion("i")

}


function show_group(checkbox, changeable, need_check = true, illusion = true) {

    function toggle(a, b) {
        vis_box.classList.add(a)
        vis_box.classList.remove(b)
    }

    function add_show() {
        vis_box.classList.add("fading")
        setTimeout(() => {
            toggle("show", "fading");
            height_illusion(mode)
        }, 1)
    }

    function del_show() {
        toggle("fading", "show")
        vis_box.style.position = "absolute"

        if (illusion) {
            console.log(mode)
            if (mode == "q") {
                height_illusion(mode, "0px")
                height_illusion("i", "0px", "0px")
            } else {
                height_illusion(mode, undefined, "0px")
            }
        } else { height_illusion(mode) }
        vis_box.style.position = ""
        setTimeout(() => vis_box.classList.remove("fading"), 250);
    }

    if (changeable == '.for_group') { mode = "q" } else { mode = "i" }
    let vis_box = document.querySelector(changeable)
    if (checkbox.checked == need_check) {
        add_show()
    } else {
        del_show()
    }
}

function height_illusion(mode, height, width) {
    if (mode == "q") {
        var illusion = document.querySelector("#for_group_il")
        var vis_box = document.querySelector(".for_group")
    } else if (mode == "i") {
        var illusion = document.querySelector("#list_id_il")
        var vis_box = document.querySelector(".list_id")
    }
    if (!height && mode == "q") {
        height = getComputedStyle(vis_box).height
        if (height == "auto") { height = "0px" }
    }
    if (!width && mode == "i") {
        width = getComputedStyle(vis_box).width
        if (width == "auto") { width = "0px" }
        height = getComputedStyle(document.querySelector(".main_inputs")).height

    }
    illusion.style.height = height
    illusion.style.width = width
}

function ready() {
    height_illusion("i")
    height_illusion("q")

    document.querySelector("#quantity").addEventListener("change", () => control_inputs())
}


document.addEventListener("DOMContentLoaded", ready)