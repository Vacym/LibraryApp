function scroll_control() {
    function check_scroll() {
        let scroll = window.pageYOffset;
        let screen_height = document.documentElement.clientHeight / 4;

        if (scroll > screen_height) {
            but_up.classList.remove('hidden');
        } else {
            but_up.classList.add('hidden');
        }
    }

    function go_top() {
        function scrolling() {
            if (window.pageYOffset > 0) {
                window.scrollBy(0, -iterations);
                setTimeout(scrolling, 1000 / fps);
            }
        }
        // Можно настроить
        let fps = 60
        let need_time = 150 //в милисекундах

        let iterations = (window.pageYOffset / (need_time / 1000) / fps)
        scrolling()
    }

    let but_up = document.querySelector('#up');
    window.addEventListener('scroll', check_scroll)
    but_up.addEventListener('click', go_top)
}

class Toolbar_control {
    constructor() {
        this.toolbar = document.querySelector(".toolbar")
        this.dedicated = document.querySelector("#summ_checked>span")
        this.append_listener_for_new_change()
        document.querySelector("#remove").onclick = () => this.remove()
    }

    append_listener_for_new_change(how_mach) {
        this.inputs = document.querySelectorAll(".choice input[type='checkbox']")
        if (!how_mach) { how_mach = this.inputs.length }
        for (let i = this.inputs.length - how_mach; i < this.inputs.length; i++) {
            this.inputs[i].addEventListener("change", () => this.move_control())
        }
    }

    move_control() {
        let show_tool = false
        let counter = 0
        for (let i = 0; i < this.inputs.length; i++) {
            if (this.inputs[i].checked) {
                show_tool = true
                counter += 1
            }
        }
        this.dedicated.innerHTML = counter.toString()
        this.toolbar_show(show_tool)
    }

    toolbar_show(show) {
        if (show) {
            this.toolbar.classList.add("show")
        } else {
            this.toolbar.classList.remove("show")
        }
    }

    remove() {
        for (let i = 0; i < this.inputs.length; i++) {
            this.inputs[i].checked = 0
        }
        this.move_control()
    }

}

function ready_search() {
    scroll_control()
    let tool = new Toolbar_control()
    console.log(tool)
    return tool
}


document.addEventListener("DOMContentLoaded", () => { tool = ready_search() })