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

function ready() { height_illusion() }


document.addEventListener("DOMContentLoaded", ready)