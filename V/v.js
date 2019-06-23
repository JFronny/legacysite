if (window.addEventListener) { window.addEventListener('load', initialize, false); } else if (window.attachEvent) { window.attachEvent('onload', initialize); }
function initialize() {
    elements = document.getElementsByClassName('fwindow');
    var i;
    for (i = 0; i < elements.length; i++) {
        fwndSetup(elements[i]);
    }
}

function fwndSetup(elmnt) {
    if (elmnt.size != null) {
        elmnt.width = elmnt.size.split(";")[0];
        elmnt.height = elmnt.size.split(";")[1];
    }
    dragElement(elmnt);
    resizeElement(elmnt);
    selectElement(elmnt);
    menuBars(elmnt);
    updateElement(elmnt);
}

function menuBars(elmnt) {
    var MENU = "";
    //close
    MENU += '<div class="fmenu"><a href="#" class="fmenubutton fredbackground" style="right: 0px;" onclick="fCloseWnd(event)"><center><svg aria-hidden="true" version="1.1" width="10" height="10"><path d="M 0,0 0,0.7 4.3,5 0,9.3 0,10 0.7,10 5,5.7 9.3,10 10,10 10,9.3 5.7,5 10,0.7 10,0 9.3,0 5,4.3 0.7,0 Z"></path></svg></center></a>';
    //maximize
    MENU += '<a href="#" class="fmenubutton" style="right: 20px;" onclick="toggleFullscreen(event.target.closest(\'.fwindow\'))"><center><svg aria-hidden="true" version="1.1" width="10" height="10" class="fmenubuttonsvg"><path d="M 0,0 0,10 10,10 10,0 Z M 1,1 9,1 9,9 1,9 Z" class="fmenubuttonsvg"></path></svg></center></a>';
    //minimize
    MENU += '<a href="#" class="fmenubutton" style="right: 40px;"><center><svg aria-hidden="true" version="1.1" width="10" height="10" class="fmenubuttonsvg"><path d="M 0,5 10,5 10,6 0,6 Z" class="fmenubuttonsvg"></path></svg></center></a></div>';
    elmnt.getElementsByClassName('fheader')[0].innerHTML += MENU;
}

function fCloseWnd(e) { e.target.closest('.fwindow').parentNode.removeChild(e.target.closest('.fwindow')); }

function updateElement(elmnt) {
    elmnt.onchange = updateVars;
    function updateVars() {
        var tmp = elmnt.getElementsByClassName('fheader')[0].innerHTML.split(String.fromCharCode(173));
        elmnt.getElementsByClassName('fheader')[0].innerHTML = String.fromCharCode(173) + tmp[1] + String.fromCharCode(173) + elmnt.title + String.fromCharCode(173) + tmp[3];
    }
}

function resizeElement(elmnt) {
    var resizer = document.createElement('div');
    resizer.className = 'fresizer';
    elmnt.appendChild(resizer);
    resizer.addEventListener('mousedown', initResize, false);
    function initResize(e) {
        window.onmousemove = Resize;
        window.onmouseup = stopResize;
    }
    
    function Resize(e) {
        elmnt.style.width = Math.min(Math.max(e.clientX - elmnt.offsetLeft, parseInt(elmnt.getAttribute('minsize').split(";")[0])), parseInt(elmnt.getAttribute('maxsize').split(';')[0])) + 'px';
        elmnt.style.height = Math.min(Math.max(e.clientY - elmnt.offsetTop, parseInt(elmnt.getAttribute('minsize').split(";")[1])), parseInt(elmnt.getAttribute('maxsize').split(';')[1])) + 'px';
    }
    
    function stopResize(e) {
        window.onmousemove = null;
        window.onmouseup = null;
    }
}

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0, header = document.createElement('div');
    header.className = 'fheader';
    elmnt.insertBefore(header, elmnt.firstChild);
    header.onmousedown = dragMouseDown;
    header.innerHTML = '&shy; <img src="https://i.stack.imgur.com/vY5dQ.png" alt="" style="width:10px;height:10px;"> &shy;' + elmnt.getAttribute('title') + '&shy;';
    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }
    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elmnt.style.top = Math.min(Math.max((elmnt.offsetTop - pos2), 0), elmnt.parentElement.clientHeight - elmnt.clientHeight) + 'px';
        elmnt.style.left = Math.min(Math.max((elmnt.offsetLeft - pos1), 0), elmnt.parentElement.clientWidth - elmnt.clientWidth) + 'px';
    }
    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function selectElement(elmnt) {
    elmnt.onmousedown = moveToEnd;
    function moveToEnd(e) {
        var tmp = elmnt;
        for (var i=0; (tmp=tmp.previousSibling); i++);
        if (i < elmnt.parentNode.childNodes.length - 1) {
            var element = e.target.closest('.fwindow');
            element.parentElement.appendChild(element);
        }
    }
}

function toggleFullscreen(elmnt) {
    if (!document.isFullScreen && !document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
        if (elmnt.requestFullscreen) {
            elmnt.requestFullscreen();
        } else if (elmnt.mozRequestFullScreen) {
            elmnt.mozRequestFullScreen();
        } else if (elmnt.webkitRequestFullscreen) {
            elmnt.webkitRequestFullscreen();
        } else if (elmnt.msRequestFullscreen) {
            elmnt.msRequestFullscreen();
        }
    } else {
        elmnt.parentElement.appendChild(elmnt);
    }
}

function createWindowFromHTML(html, wndContainer) {
    var wnd = document.createElement('div'), iframe = document.createElement('iframe');
    wnd.className = 'fwindow';
    wnd.setAttribute('maxsize', '500;500');
    wnd.setAttribute('minsize', '100;100');
    wnd.size = '200;200';
    wnd.style.width = 200;
    wnd.style.height = 200;
    iframe.className = 'fwindow';
    iframe.style = 'bottom: 0; left: 0; right: 0; position: absolute; margin: auto; height: calc(100% - 20px); width: 100%;';
    wnd.appendChild(iframe);
    wndContainer.appendChild(wnd);
    fwndSetup(wnd);
    iframe.onload = setupHTMLWindow;
    function setupHTMLWindow(e) {
        iframe.onload = updateT;
        iframe.onchange = updateT;
        iframe.contentWindow.document.open();
        iframe.contentWindow.document.write(html);
        iframe.contentWindow.document.close();
        updateT(e);
    }
    
    function updateT(e) {
        wnd.title = iframe.contentWindow.document.head.title;
    }
}
