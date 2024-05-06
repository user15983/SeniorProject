function onButtonClick(number) {
    if(number == -1) {
        window.location.href = "./index.html";
        window.electronAPI.buttonClick(number);
    } else if(number >= 0) {
        window.location.href = "./browser.html";
        window.electronAPI.buttonClick(number);
    } else {
        window.electronAPI.buttonClick(number);
    }
}

document.getElementById("browser-box").addEventListener('animationend', (event) => {
    window.electronAPI.animationReady();
});