// Define function to update necessary functions
export function updateDataAndUI(chart) {
  // Update the first element
  updateFirstElement(chart);
  // Update the text area with the chart data
  updateChartDataText(chart);
  // Adjust the text area size according to the content
  updateTextareaSize();
}

// Define function to keep the first element level with the second
function updateFirstElement(chart) {
  const { data } = chart.data.datasets[0];
  data[0].y = data[1].y;
}

// Define function to update the text area
function updateChartDataText(chart) {
  const { data } = chart.data.datasets[0];
  const output = data.slice(1).map((point, index) => ({
    duration: point.x - data[index].x,
    speed: point.y,
  }));
  const chartText = document.getElementById('chartData');
  chartText.innerText = JSON.stringify(output);
  updateText(chartText);
}

const chartDataTextarea = document.getElementById('chartData');

chartDataTextarea.addEventListener('input', updateTextareaSize);

function updateTextareaSize() {
  chartDataTextarea.style.height = 'auto';
  chartDataTextarea.style.height = `${chartDataTextarea.scrollHeight + 5}px`;
}

export function updateChartFromText(event, chart, saveChartData) {
  const origin = event.target;
  const text = origin.innerText.replace(/ /g, '');

  if (event.data === '{') {
    insertTextSegment(origin);
  }

  const pattern = /^\[\{"duration":[1-9]\d*,"speed":[1-9]\d*\}(,\{"duration":[1-9]\d*,"speed":[1-9]\d*\})*]$/;
  const result = pattern.test(text);
  origin.classList.toggle('invalid', !result);
  const offset = Cursor.getCurrentCursorPosition(origin);

  updateText(origin);
  Cursor.setCurrentCursorPosition(offset, origin);
  if (!result) return;

  const newData = JSON.parse(text);

  let sum = 0;
  const res = newData.map((parameter) => {
    sum += parameter.duration;
    return { x: sum, y: parameter.speed };
  });

  // update chart

  chart.data.datasets[0].data = [{ x: 0, y: res[0].y }, ...res];
  chart.update();
  saveChartData(chart);
}

export function updateText(target) {
  const text = target.innerText;
  const res = text
    .replaceAll('duration', '<span class="key">duration</span>')
    .replaceAll('speed', '<span class="key">speed</span>')
    .replace(/\d+/g, '<span class="value">$&</span>');
  target.innerHTML = res;
}

function insertTextSegment(textarea) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const sel = textarea.innerText.substring(start, end);
  const finText = `${textarea.innerText.substring(0, start)}"duration":,"speed":}${textarea.innerText.substring(end)}`;
  textarea.innerText = finText;
  textarea.focus();
  textarea.selectionEnd = end + 11;
}

// move to next data point on tab in the textarea
export function tabNavigation(event) {
  var origin = event.target;
  var text = origin.innerText;
  if (event.key != "Tab") return;
  event.preventDefault();
  var start = origin.selectionStart;
  var end = origin.selectionEnd;
  var nextColon = text.indexOf(":", end);
  if (nextColon == -1) {
    nextColon = text.length - 1;
  } else {
    nextColon += 1;
  }
  origin.selectionEnd = origin.selectionStart = nextColon;
}

// Credit to Liam (Stack Overflow)
// https://stackoverflow.com/a/41034697/3480193
class Cursor {
  static getCurrentCursorPosition(parentElement) {
    const selection = window.getSelection();
    let charCount = -1;
    let node;

    if (selection.focusNode) {
      if (Cursor._isChildOf(selection.focusNode, parentElement)) {
        node = selection.focusNode;
        charCount = selection.focusOffset;

        while (node) {
          if (node === parentElement) {
            break;
          }

          if (node.previousSibling) {
            node = node.previousSibling;
            charCount += node.textContent.length;
          } else {
            node = node.parentNode;
            if (node === null) {
              break;
            }
          }
        }
      }
    }

    return charCount;
  }

  static setCurrentCursorPosition(chars, element) {
    if (chars >= 0) {
      const selection = window.getSelection();

      const range = Cursor._createRange(element, { count: chars });

      if (range) {
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }

  static _createRange(node, chars, range) {
    if (!range) {
      range = document.createRange()
      range.selectNode(node);
      range.setStart(node, 0);
    }

    if (chars.count === 0) {
      range.setEnd(node, chars.count);
    } else if (node && chars.count >0) {
      if (node.nodeType === Node.TEXT_NODE) {
        if (node.textContent.length < chars.count) {
          chars.count -= node.textContent.length;
        } else {
          range.setEnd(node, chars.count);
          chars.count = 0;
        }
      } else {
        for (var lp = 0; lp < node.childNodes.length; lp++) {
          range = Cursor._createRange(node.childNodes[lp], chars, range);

          if (chars.count === 0) {
            break;
          }
        }
      }
    } 

    return range;
  }
  
  static _isChildOf(node, parentElement) {
    while (node !== null) {
      if (node === parentElement) {
        return true;
      }
      node = node.parentNode;
    }

    return false;
  }
}