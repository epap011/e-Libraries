$(document).ready(function () {
    showLogin();
    isLoggedIn();
    console.log("isLoggedIn invoked!");
});

function xssUnpatchedExample() {
    let xssInput = document.getElementById("xssInput").value;

    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            document.getElementById("xssResponseMessage").innerHTML = xhr.responseText;
        } else if (xhr.status !== 200) {
            document.getElementById("xssResponseMessage").innerHTML = "something went wrong!";
        }
    };

    xhr.open('POST', 'XSS');
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send(xssInput);
}

function xssPatchedExample() {
    let xssInput = document.getElementById("patchesXssInput").value;
    const obj = {}
    obj["input"] = xssInput;

    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            document.getElementById("patchesXssResponseMessage").innerHTML = xhr.responseText;
        } else if (xhr.status !== 200) {
            document.getElementById("patchesXssResponseMessage").innerHTML = "something went wrong!";
        }
    };

    xhr.open('POST', 'XSS_PATCH');
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send(JSON.stringify(obj));
}

function isLoggedIn() {
    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("Session exists, you are already logged in");
            document.getElementById("login-messages").innerHTML = "You are Logged in :)";
            showUserInfo();
        } else if (xhr.status !== 200) {
            console.log("Session not exists, you are logged out");
            document.getElementById("login-messages").innerHTML = "Welcome stranger";
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
            document.getElementById("loginMessage").innerHTML   = "Successful Login";
            document.getElementById("loginMessage").style.color = "green";
            document.getElementById("login-messages").innerHTML = "You are Logged in :)";

            loggedInUsername = username;
            loggedInPassword = password;
            showUserInfo();
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
            document.getElementById("loginMessage").innerHTML   = "Successful Logout";
            console.log("Successful Logout");
            document.getElementById("login-messages").innerHTML = "Welcome stranger";
            hideUserInfo();
            //showLogin();
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
    $("#user_info-box").show();
}

function hideUserInfo() {
    $("#user_info-box").hide();
}

function getUserInfo() {
    let xhr = new XMLHttpRequest();

    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("user info retrieved from server!");
            document.getElementById("user-info").innerHTML = createUserUpdateForm(JSON.parse(xhr.responseText));
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

function getAllBooks() {
    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.responseText);
            document.getElementById("user-info").innerHTML = createTableFromJSON(JSON.parse(xhr.responseText));
        } else if (xhr.status !== 200) {

        }
    };

    xhr.open('GET', 'Books');
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send();
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
        } else if (xhr.status !== 200) {
            console.log("form sent but with error :(");
        }
    };

    xhr.open('POST', 'UpdateUser');
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.send(JSON.stringify(data));
}