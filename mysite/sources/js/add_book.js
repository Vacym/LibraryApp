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

    height_illusion()

}


function show_group(checkbox, changeable, need_check = true, illusion = false) {

    function toggle(a, b) {
        vis_box.classList.add(a)
        vis_box.classList.remove(b)
    }

    function add_show() {
        vis_box.classList.add("fading")
        setTimeout(() => {
            toggle("show", "fading");
            height_illusion()
        }, 1)
    }

    function del_show() {
        toggle("fading", "show")
        vis_box.style.position = "absolute"
        height_illusion()
        if (illusion) { height_illusion("0px") }
        vis_box.style.position = ""
        setTimeout(() => vis_box.classList.remove("fading"), 250);
    }

    let vis_box = document.querySelector(changeable)
    if (checkbox.checked == need_check) {
        add_show()
    } else {
        del_show()
    }
}

function height_illusion(height) {
    let illusion = document.querySelector(".illusion")
    let vis_box = document.querySelector(".for_group")
    if (!height) {
        height = getComputedStyle(vis_box).height
        if (height == "auto") { height = "0px" }
    }
    illusion.style.height = height

}

function ready() {
    height_illusion()
    document.querySelector("#quantity").addEventListener("change", () => control_inputs())
}


document.addEventListener("DOMContentLoaded", ready)