$(document).ready(function () {
    // Mobile Menu Toggle
    $('.menu-toggle').on('click', function () {
        $('.main-nav').toggleClass('active');
    });

    // Smooth Scroll for anchor links (optional)
    $('a[href^="#"]').on('click', function (event) {
        if (this.hash !== "") {
            event.preventDefault();
            var hash = this.hash;
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 800, function () {
                window.location.hash = hash;
            });
        }
    });
});
