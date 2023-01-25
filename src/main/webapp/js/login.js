let isStudent   = 0;
let isLibrarian = 0;
let isAdmin     = 0;
let showInfos   = 0;

$(document).ready(function () {
    showLogin();
    isLoggedIn();
});

function footerAlign() {
    $('footer').css('display', 'block');
    $('footer').css('height', 'auto');
    var footerHeight = $('footer').outerHeight();
    $('body').css('padding-bottom', footerHeight);
    $('footer').css('height', footerHeight);
}


$(document).ready(function(){
    footerAlign();
});

$( window ).resize(function() {
    footerAlign();
});

function isLoggedIn() {
    console.log('checking if session exists..');
    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("session exists :)");
            if(xhr.responseText === "admin") {
                isAdmin = 1;
            }
            showUserInfo();
        } else if (xhr.status !== 200) {
            console.log("session not exists :(");
            $("#userInfos").hide();
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
            console.log("Successful Login :)");
            if(xhr.responseText === "admin") {
                console.log("redirect to eLibraries Administration Page >>");
                window.location.replace("/eLibraries/admin.html");
                isAdmin = 1;
            }
            else {
                document.getElementById('dropdownLoginRegister').setAttribute('hidden' , 'true');
                document.getElementById('divLogin').setAttribute('hidden' , 'true');
                document.getElementById('divIntoNav').innerHTML += '<button type="button" id="buttonLogout" class="btn btn-outline-primary" onclick="logout()">Logout</button>'
                if(isLibrarian) {
                    console.log("librarian.html loaded!");
                    $('#librarianDashboard').load('librarian.html');
                    $("#librarianDashboard").show();
                }
                else if(isStudent) {
                    console.log("student.html loaded!")
                    console.log("show extra buttons student");
                    $('#studentDashboard').load('student.html');
                    $("#studentDashboard").show();
                }
            }
        } else if (xhr.status !== 200) {
            console.log("Unsuccessful  Login :(");
        }
    };

    xhr.open('POST', 'Login?username='+username+'&password='+password);
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send();
}

function loginAsStudent(){
    console.log("studentLogin() invoked");
    let divLogin = document.getElementById('divLogin')
    if (!divLogin.hasAttribute('hidden')){
        if(divLogin.innerHTML !== '') {
            divLogin.setAttribute('hidden', 'true');
        }
    }
    else{
        divLogin.removeAttribute('hidden');
    }
    let login = $('#divLogin').load('login.html');
    console.log(login);
    divLogin.innerHTML += login;
    isStudent   = 1;
    isLibrarian = 0;
}

function loginAsLibrarian(){
    console.log("librarianLogin() invoked");
    let divLogin = document.getElementById('divLogin')
    if (!divLogin.hasAttribute('hidden')){
        if(divLogin.innerHTML !== '') {
            divLogin.setAttribute('hidden', 'true');
        }
    }
    else{
        divLogin.removeAttribute('hidden');
    }
    let login = $('#divLogin').load('login.html');
    divLogin.innerHTML += login;
    isStudent   = 0;
    isLibrarian = 1;
}

function logout(){
    let xhr = new XMLHttpRequest();

    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("Successful Logout :)");
            console.log(isAdmin);
            if(isAdmin === 1) {
                console.log("redirect to eLibraries Guest Page >>");
                window.location.replace("/eLibraries/");
            }
            else {
                document.getElementById('dropdownLoginRegister').removeAttribute('hidden');
                document.getElementById('buttonLogout').remove();
                $("#studentDashboard").hide();
                $("#librarianDashboard").hide();
            }
            isAdmin     = 0;
            showInfos   = 0;
            isLibrarian = 0;
            isStudent   = 0;
        } else if (xhr.status !== 200) {
            console.log("Unsuccessful Logout :(");
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

function showUserInfo(info) {
    $("#bookList").hide();
    $("#userInfos").show();
    if (showInfos === 1)
        document.getElementById("userInfos").innerHTML = createUserUpdateForm(info);
}

function getUserInfo() {
    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("user info retrieved from server! :)");
            showUserInfo(JSON.parse(xhr.responseText));
            showInfos = 1;
        } else if (xhr.status !== 200) {
            console.log("user info didn't retrieve from server! :(");
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

function showHome() {
    $("#userInfos").hide();
    $("#bookList").hide();
}

function  showExtraButtons(){
    $("#extraButtons").show();
}

function hideExtraButtons(){
    $("#extraButtons").hide();
}