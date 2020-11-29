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

function toolbar_control() {
    let show_tool = false
    let inputs = document.querySelectorAll(".choice input[type='checkbox']")
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].checked) {
            show_tool = true
            break
        }
    }
    toolbar_show(show_tool)
}

function toolbar_show(show) {
    let toolbar = document.querySelector(".toolbar")
    if (show) {
        toolbar.classList.add("show")
    } else {
        toolbar.classList.remove("show")
    }
}

function check_control() {


    append_listener_for_new_change()
}

function append_listener_for_new_change(how_mach) {
    let inputs = document.querySelectorAll(".choice input[type='checkbox']")
    if (!how_mach) { how_mach = inputs.length }
    for (let i = inputs.length - how_mach; i < inputs.length; i++) {
        inputs[i].addEventListener("change", toolbar_control)
    }
}

function ready() {
    scroll_control()
    check_control()
}



document.addEventListener("DOMContentLoaded", ready)