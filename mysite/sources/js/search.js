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


function check_contol() {
    function toolbar_contol(choise_box) {
        choise_box = choise_box.currentTarget
        show_tool = false
        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].checked) {
                show_tool = true
                break
            }
        }
        toolbar_show(show_tool)
    }

    function toolbar_show(show) {
        if (show) {
            toolbar.classList.add("show")
        } else {
            toolbar.classList.remove("show")
        }

    }

    inputs = document.querySelectorAll(".сhoice input[type='checkbox']")
    toolbar = document.querySelector(".toolbar")

    for (let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener("change", toolbar_contol)

    }
}


function ready() {
    scroll_control()
    check_contol()
}



document.addEventListener("DOMContentLoaded", ready)