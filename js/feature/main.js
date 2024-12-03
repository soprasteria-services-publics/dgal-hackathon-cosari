
document.addEventListener("DOMContentLoaded", function () {
    Page.init();
});

function openFullscreen() {
    elem = document.querySelector("html")
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
    }
}
openFullscreen();