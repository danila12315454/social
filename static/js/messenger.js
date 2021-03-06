function putNewLine() {
    for (msg of document.querySelectorAll("div.message h4")) {
        msg.innerHTML = msg.innerHTML.split("\n").join("<br>");
    }
}

putNewLine();

var chats = [];
var user_id = '';
var user_login = '';
var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
function print(arg)
{
    console.log(arg);
}
function load_data()
{
    let script = document.getElementById('messenger_script');
    chats = script.getAttribute('chats').split(",");
    user_id = script.getAttribute('user_id');
    user_login = script.getAttribute('user_login');
    chats.pop();
}
var arr = [];
var idBtn = -1
var unreadmessages = []
var sliders = Array.from(document.querySelectorAll("div.dialog"));

function connect_to_socket()
{
    let url = `${ws_scheme}://${window.location.host}/ws/messenger/${user_login}`;
    let urls = []
    for (i of arr)
    {
        urls.push(i.url)
    }
    for(i of Array(chats.length).keys())
    {
        url = `${ws_scheme}://${window.location.host}/ws/messenger/${user_login}/${chats[i].split("'")[1]}`;
        if (!(urls.includes(url)))
        {
           arr.push(new WebSocket(url));
        }
        arr[i].onmessage = function(e)
        {
            let data = JSON.parse(e.data);
            var id = chats.indexOf("'" + String(data.chat) + "'");
            if(data.type === 'message')
            {
                let messages = document.getElementById(`messeges_${id}`);
                let last_message = document.getElementById(`last_message_of_chatid_${id}`);
                my_class = user_login == data.login ? "message sent" : "message received";
                messages.insertAdjacentHTML('beforeend', `
                <div class="${my_class}">
                    <div class="photo">
                        <img src="../media/${data.img}" alt="Image Not Found">
                    </div>
                    <div class="message_block">
                        <a href="/profile/${data.login}">${data.chat_users[data.user_id]}</a>
                        <h4>${data.message.split("\n").join("<br>")}</h4>
                        <h5 class="transparent">${data.time_sent}</h5>
                    </div>
                </div>`);
                var last_message_text = data.message;
                last_message.innerHTML = `<h5 id="msg">${last_message_text}</h5><h5 class="transparent">${data.time_sent}</h5>`;
                let unread_messages_html = document.getElementById(`unread_messages_${id}`);
                let unread_messages = data.unread_messages;
                let ans = 0;
                ans = unread_messages[user_id];
                unread_messages_html.innerHTML = ans;
                if(!(idBtn == -1))
                {
                    unread_messages_html = document.getElementById(`unread_messages_${idBtn}`);
                    unread_messages_html.innerHTML = "";
                    sliders[idBtn].scrollTop = sliders[idBtn].scrollHeight;
                    arr[idBtn].send(JSON.stringify({
                        'type': 'messages_read',
                        'login': user_login
                        }))
                }
            }
            /*else
            {
                if(data.type === 'set_users_online')
                {
                    for(i of Array(data.users_for_chats_online.length).keys())
                    {
                        let chat_to_set_online = document.getElementById(`users_online_${chats[i].slice(1, -1)}`);
                        chat_to_set_online.innerHTML = data.users_for_chats_online[chats[i].slice(1, -1)];
                    }
                }
            }*/
        }
        var form = document.getElementById(`form_${i}`)
        let s = function(e)
        {
            let message = e.target.message.value;
            let splittedMessage = message.split('\n');
            var count = 0
            for (line of splittedMessage) {
                if (line != '') {
                    count += 1
                }
            }
            if (message && count > 0)
            {
                form = document.getElementById(`form_${idBtn}`)
                e.preventDefault();
                arr[idBtn].send(JSON.stringify({
                    'type': 'message',
                    'message':message,
                    'login': user_login
                }))
                form.reset();
            }
            else
            {
                form = document.getElementById(`form_${idBtn}`)
                e.preventDefault();
                arr[idBtn].send(JSON.stringify({
                    'type': 'not_message',
                    'message':message,
                    'login': user_login
                }))
                form.reset();
            }
        }
        document.addEventListener("keydown", keyDown);
        document.addEventListener("keyup", keyUp);
        form.addEventListener('submit', s);
        var shiftPressed = false;
        function keyDown(event) {
            if (event.key == "Shift") {
                shiftPressed = true;
            }
        }
        function keyUp(event) {
            if (event.key == "Shift") {
                shiftPressed = false;
            }
            else if (event.key == "Enter") {
                if (!shiftPressed) {
                    document.querySelector(`form#form_${idBtn} button`).click();
                }
            }
        }
    }
}



load_data();
connect_to_socket();
var radios = Array.from(document.querySelectorAll("input[type=radio][name=chat]"));
var btns = Array.from(document.querySelectorAll("button.chat"));
var dialogs = Array.from(document.querySelectorAll("div.dialogs div.dialog_block"))

document.addEventListener("click", changeRadio);
function changeRadio(event)
{
    if (event.target.closest("button.chat"))
    {
        for (radio of radios) {
            radio.checked = false;
        }

        for (dialog of dialogs) {
            dialog.style.display = 'none';
        }

        idBtn = btns.indexOf(event.target.closest("button.chat"));
        radios[idBtn].checked = true;
        dialogs[idBtn].style.display = 'block';
        openMenu("close menu");

        arr[idBtn].send(JSON.stringify({
        'type': 'messages_read',
        'login': user_login
        }))

        let unread_messages = document.getElementById(`unread_messages_${idBtn}`)
        unread_messages.innerHTML = ""

        sliders[idBtn].scrollTop = sliders[idBtn].scrollHeight;
    }
}

var checkboxes = Array.from(document.querySelectorAll("input[type=checkbox][name=add_users]"));
var divs = Array.from(document.querySelectorAll("div.add_users div.user"));
document.addEventListener("click", putCheckboxes);

function putCheckboxes(event) {
    if (event.target.closest("div.add_users div.user")) {
        idDiv = divs.indexOf(event.target.closest("div.add_users div.user"));
        checkboxes[idDiv].checked = (checkboxes[idDiv].checked + 1) % 2;
    }
}

document.addEventListener("click", openAddChat);

function openAddChat(event) {
    if (event.target.closest("div.search button")) {
        document.querySelector("div.add_chat_block").style.display = "block";
        document.querySelector("div.main").setAttribute("class", "main disabled")
    }
    else if (!event.target.closest("div.add_chat_block") && document.querySelector("div.add_chat_block").style.display == "block") {
        document.querySelector("div.add_chat_block").style.display = "none";
        document.querySelector("div.main").setAttribute("class", "main")
        
        document.querySelector("div.add_chat_block div.info input[type=text]").value = "";
        document.querySelector("div.add_chat_block div.info input[type=file]").value = "";
    }
}

document.addEventListener("click", openEditChat);
var editBtns = Array.from(document.querySelectorAll("div.dialog_block div.headline button"));
var idEditBtn = -1;

function openEditChat(event) {
    if (event.target.closest("div.dialog_block div.headline button")) {
        idEditBtn = editBtns.indexOf(event.target.closest("div.dialog_block div.headline button"));
        document.querySelectorAll("div.add_chat_block")[idEditBtn + 1].style.display = "block";
        document.querySelector("div.main").setAttribute("class", "main disabled");
    }
    else if (!event.target.closest("div.add_chat_block") && idEditBtn != -1) {
        document.querySelectorAll("div.add_chat_block")[idEditBtn + 1].style.display = "none";
        document.querySelector("div.main").setAttribute("class", "main");
        idEditBtn = -1;
    }
}

document.addEventListener("click", openMenu);
menuCheckbox = document.querySelector("div.search input[type=checkbox]");
chats_dialogs = document.querySelector("div.block.messenger div.chats");


function openMenu(event) {
    if (event == "close menu" || event.target.closest("div.search > svg")) {
        menuCheckbox.checked = (menuCheckbox.checked + 1) % 2;
        if (menuCheckbox.checked) {
            if (window.innerHeight > window.innerWidth) {
                chats_dialogs.style.width = '60%';
                document.querySelector("div.dialogs div.close").style.display = 'block';
                for (dialog of dialogs) {
                    dialog.style.pointerEvents = 'none';
                }
            }
        }
        else {
            if (window.innerHeight > window.innerWidth) {
                document.querySelector("div.dialogs div.close").style.display = 'none';
                chats_dialogs.style.width = '0px';
                for (dialog of dialogs) {
                    dialog.style.pointerEvents = 'all';
                }
            }
        }
    }
}

const editChatPhotoDivs = Array.from(document.querySelectorAll("div.add_chat_block form div.info div.choose_photo div.photo_choose"));
document.addEventListener("input", checkPhotoEdit);
function checkPhotoEdit(event, param=false) {
    if (event == "check") {
        for (div of editChatPhotoDivs) {
            checkPhotoEdit({"target": div.children[0]}, param=true);
        }
    }
    else if (param || event.target.closest("div.add_chat_block form div.info div.choose_photo div.photo_choose input[type=file]")) {
        let idEditChat = -1
        for (div of editChatPhotoDivs) {
            idEditChat += 1
            if (div.children[0] == event.target) {
                break;
            }
        }
        let name_format = editChatPhotoDivs[idEditChat].children[0].value.split(".");
        let format = name_format[name_format.length - 1];
        if ((format == "jpg" || format == "jpeg" || format == "png" || format == "gif") && (name_format.length > 1) || editChatPhotoDivs[idEditChat].children[0].value == "") {
            editChatPhotoDivs[idEditChat].children[1].children[0].children[1].children[0].style.fill = "#3ED252";
            editChatPhotoDivs[idEditChat].children[1].children[2].innerHTML = "<h5>your photo satisfies the requirements!</h5>";
        }
        else {
            editChatPhotoDivs[idEditChat].children[1].children[0].children[1].children[0].style.fill = "#D23E3E";
            editChatPhotoDivs[idEditChat].children[1].children[2].innerHTML = `<h5>your photo extension should be <span style="font-weight: 500;">jpg, jpeg, png or gif</span>!</h5>`;
        }
    }
}
checkPhotoEdit("check");

const forms = Array.from(document.querySelectorAll("div.add_chat_block form#apply"));
forms.push(document.querySelector("div.add_chat_block form"))
document.addEventListener("submit", submitForm);
function submitForm(event) {
    if (forms.includes(event.target)) {
        event.preventDefault();
        let photoInput = event.target.querySelector("input[type=file]");
        let name_format = photoInput.value.split(".");
        let format = name_format[name_format.length - 1];
        if ((format == "jpg" || format == "jpeg" || format == "png" || format == "gif") && (name_format.length > 1) || photoInput.value == "") {
            event.target.submit();
        }
        else {
            event.target.querySelector("h4.err").innerHTML = "make sure you chose the correct photo!";
        }
    }
}