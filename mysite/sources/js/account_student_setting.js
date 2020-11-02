function ready() {
    toggle = (a, b) => {
        window.classList.add(a)
        window.classList.remove(b)
    }

    function add_show() {
        window.classList.add("fading")
        setTimeout(() => toggle("show", "fading"), 1)
    }

    function del_show() {
        toggle("fading", "show")
        setTimeout(() => window.classList.remove("fading"), 250);
    }

    let window = document.querySelector("#w_del")

    document.querySelector("#del").addEventListener("click", add_show)
    document.querySelector("#cansel").addEventListener("click", del_show)

}


document.addEventListener("DOMContentLoaded", ready)