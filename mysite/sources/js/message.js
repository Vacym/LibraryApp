//version 1.1

function ready() {
    class But_message {
        constructor(button) {
            this.button = button
            this.window = document.querySelector(`#${button.getAttribute("message")}`)
            this.cancel = document.querySelector(`#${button.getAttribute("message")} #cancel`)
            this.start_hear()
        }
        start_hear() {
            this.button.addEventListener("click", () => this.add_show())
            this.cancel.addEventListener("click", () => this.del_show())
        }
        toggle(a, b) {
            this.window.classList.add(a)
            this.window.classList.remove(b)
        }
        add_show() {
            this.window.classList.add("fading")
            setTimeout(() => this.toggle("show", "fading"), 1)
        }
        del_show() {
            this.toggle("fading", "show")
            setTimeout(() => this.window.classList.remove("fading"), 250);
        }
    }

    let button_list = document.querySelectorAll("[message]")
    let button_class_list = []
    for (let x = 0; x < button_list.length; x++) {
        button_class_list.push(new But_message(button_list[x]))
    }
}




document.addEventListener("DOMContentLoaded", ready)