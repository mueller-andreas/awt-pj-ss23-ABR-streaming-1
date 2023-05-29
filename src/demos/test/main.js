document.querySelector("#text").addEventListener('input', function(event) {
    let origin = event.target;
    let text = origin.value.replace(/ /g,'');

    if (event.data === "{") {
        insertData(origin)
    }

    let pattern = /^\[\{"duration":\d+,"speed":\d+\}(,\{"duration":\d+,"speed":\d+\})*]$/

    result = pattern.test(text)
    origin.classList.toggle("invalid", !result)
    if (result) {

    }
});

function insertData(textarea) {
    var start = textarea.selectionStart;
    var end = textarea.selectionEnd;
    var sel = textarea.value.substring(start, end);
    var finText = textarea.value.substring(0, start) + "\"duration\":,\"speed\":}" + textarea.value.substring(end);
    textarea.value = finText;
    textarea.focus();
    textarea.selectionEnd= end + 11;
}