updateText(document.querySelector("#text"))

document.querySelector("#text").addEventListener('input', function(event) {
    let origin = event.target;
    text = origin.textContent

    let pattern = /^\[\{"duration":\d+,"speed":\d+\}(,\{"duration":\d+,"speed":\d+\})*]$/

    result = pattern.test(text)
    origin.classList.toggle("invalid", !result)
    if (result) {

    }
    updateText(origin)

});

function updateText(target) {
    let text = target.innerText;
    let res = text
        .replaceAll("duration", "<span class='key'>duration</span>")
        .replaceAll("speed", "<span class='key'>speed</span>")
        .replace(/\d+/g, "<span class='value'>$&</span>")
    target.innerHTML = res;
}

function insertData(textarea) {
    var start = textarea.selectionStart;
    var end = textarea.selectionEnd;
    var sel = textarea.value.substring(start, end);
    var finText = textarea.value.substring(0, start) + "\"duration\":,\"speed\":}" + textarea.value.substring(end);
    textarea.value = finText;
    textarea.focus();
    textarea.selectionEnd= end + 11;
}