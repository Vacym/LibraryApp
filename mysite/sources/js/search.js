function ready() {
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



document.addEventListener("DOMContentLoaded", ready)