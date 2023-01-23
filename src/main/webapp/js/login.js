let isStudent = 0;
let isLibrarian = 0;
let showInfos = 0;
$(document).ready(function () {
    showLogin();
    isLoggedIn();
    console.log("isLoggedIn invoked!");
});

function isLoggedIn() {
    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("Session exists, you are already logged in");
            // document.getElementById("login-messages").innerHTML = "You are Logged in :)";
            showUserInfo();
        } else if (xhr.status !== 200) {
            console.log("Session not exists, you are logged out");
            // document.getElementById("login-messages").innerHTML = "Welcome stranger";
            hideUserInfo();
        }
    };
    xhr.open('GET', 'Login');
    xhr.send();
}

function login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("loginPassword").value;

    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("Successful Login");
            document.getElementById("loginMessage").innerHTML   = "Successful Login\n";
            document.getElementById("loginMessage").style.color = "green";
            let loggedInUsername = username;
            document.getElementById("loginMessage").innerHTML += "You are Logged in " + loggedInUsername;

            showInfos = 1;
            getUserInfo();
            document.getElementById('dropdownLoginRegister').setAttribute('hidden' , 'true');
            document.getElementById('divLogin').setAttribute('hidden' , 'true');
            document.getElementById('divIntoNav').innerHTML += '<button id="buttonLogout" onclick="logout()">Logout</button>'
            // if(isStudent){
            //     console.log("show extra buttons student");
            //     document.getElementById('extraButtons').innerHTML = "\t\t\t\t<label for=\"genre5\">Genre:</label>\n" +
            //         "\t\t\t\t<input id=\"genre5\" type=\"text\"><br>\n" +
            //         "\t\t\t\t<label for='toYear5'>To Year:</label>\n" +
            //         "\t\t\t\t<input id=\"toYear5\" type=\"text\"> <br>\n" +
            //         "\t\t\t\t<button type=\"button\" onclick=\"getBooksGenreToYear()\" class=\"button\">Get Books with genre/toYear</button> "
            // }
        } else if (xhr.status !== 200) {
            console.log("Login Failed");
            hideUserInfo();
            document.getElementById("loginMessage").innerHTML   = "username or password is incorrect";
            document.getElementById("loginMessage").style.color = "red";
        }
    };

    xhr.open('POST', 'Login?username='+username+'&password='+password);
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send();
}

function logout(){
    let xhr = new XMLHttpRequest();

    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("Successful Logout");
            document.getElementById('dropdownLoginRegister').removeAttribute('hidden');
            document.getElementById('buttonLogout').remove();
            hideUserInfo();
            showInfos = 0;
        } else if (xhr.status !== 200) {
            alert('Request failed. Returned status of ' + xhr.status);
            console.log("Unsuccessful Logout");
        }
    };

    xhr.open('POST', 'Logout');
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send();
}

function showLogin() {
    $("#login-box").show();
    $("#login-box").load("login.html");
}

function showUserInfo() {
    if (showInfos) {
        $("#userInfos").show();
        $("#bookList").hide();
    }
}

function hideUserInfo() {
    $("#userInfos").hide();
}

function getUserInfo() {
    let xhr = new XMLHttpRequest();

    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("user info retrieved from server!");
            document.getElementById("userInfos").innerHTML = createUserUpdateForm(JSON.parse(xhr.responseText));
        } else if (xhr.status !== 200) {
            console.log("user info didnt retrieve from server!");
        }
    };
    xhr.open('GET', 'Login');
    xhr.send();
}
function createUserUpdateForm(data) {
    let html = "<form id='userUpdateForm' name='userUpdateForm' onsubmit='updateUser(); return false;'>";
    for (const x in data) {
        let category = x;
        let value1 = data[x];

        if(category === "user_id" || category === "library_id") continue;

        html += `<label for=${category}>` + category + '</label>';
        if(category === "username" || category === "email" || category === "student_id" || category === "university" ||
            category === "student_id_from_date" || category === "student_id_to_date" || category === "department") {
            let inp = `<input id=${category} name=${category} value=${value1} disabled="true">`;
            html += inp + '<br>';
            continue;
        }

        let inp = `<input type="text" id=${category} name=${category} value=${value1}>`;
        html += inp + '<br>';
    }
    html += "<input type='submit' id='changes_submit_button' value='Apply Changes'></form>";
    return html;
}

function createTableFromJSON(data) {
    let html = "<table><tr><th>ISBN</th><th>TITLE</th><th>Authors</th><th>Genre</th><th>URL</th>" +
        "<th>Photo</th><th>Pages</th><th>Pub.Year</th></tr>";
    for (const book in data) {
        html += "<tr>";
        for(const attribute in data[book]) {
            html += "<td>" + data[book][attribute] + "</td>";
        }
        html += "</tr>";
    }
    html += "</table>";
    return html;
}


function updateUser() {
    let form     = document.getElementById('userUpdateForm');
    let formData = new FormData(form);
    let data = {};

    formData.forEach((value, key) => (data[key] = value));
    console.log("data retrieved from form: " + JSON.stringify(data));

    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("user updates form sent without error :)");
            document.getElementById('changes_submit_button').style.backgroundColor = 'green';
        } else if (xhr.status !== 200) {
            console.log("form sent but with error :(");
            document.getElementById('changes_submit_button').style.backgroundColor = 'red';
        }
    };

    xhr.open('POST', 'UpdateUser');
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.send(JSON.stringify(data));
}

function studentLogin(){
    var divLogin = document.getElementById('divLogin')
    if (!divLogin.hasAttribute('hidden')){
        if(divLogin.innerHTML != '') {
            divLogin.setAttribute('hidden', 'true');
        }
    }
    else{
        divLogin.removeAttribute('hidden');
    }
    let login = $('#divLogin').load('login.html');
    console.log(login);
    divLogin.innerHTML += login;
    isStudent = 1;
    isLibrarian = 0;
}

function librarianLogin(){
    var divLogin = document.getElementById('divLogin')
    if (!divLogin.hasAttribute('hidden')){
        if(divLogin.innerHTML != '') {
            divLogin.setAttribute('hidden', 'true');
        }
    }
    else{
        divLogin.removeAttribute('hidden');
    }
    let login = $('#divLogin').load('login.html');
    console.log(login);
    divLogin.innerHTML += login;
    isStudent = 0;
    isLibrarian = 1;
}