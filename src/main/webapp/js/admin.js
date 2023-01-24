function getAllStudents() {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            document.getElementById('operationResult').innerHTML = createTableFromJSON(JSON.parse(xhr.responseText), "user_id");
        }
        else {
            console.log("error");
        }
    }

    xhr.open("GET", "http://localhost:8080/eLibraries/resource/user/student");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}

function getAllLibrarians() {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            document.getElementById('operationResult').innerHTML = createTableFromJSON(JSON.parse(xhr.responseText), "library_id");
        }
        else {
            console.log("error");
        }
    }

    xhr.open("GET", "http://localhost:8080/eLibraries/resource/user/librarian");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}

function deleteStudent(id) {
    const xhr = new XMLHttpRequest();

    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log('user deleted successfully');
        }
        else {
            console.log('[ERROR] user deletion failed');
        }
    }

    xhr.open("DELETE", "http://localhost:8080/eLibraries/resource/user/student/"+id);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}

function createTableFromJSON(list, idName) {
    let html = "<table><tr><th>ID</th><th>Username</th><th>First Name</th><th>Last Name</th></tr>";
    for (const student in list) {
        html += "<tr><td>" +
            list[student][idName]   + "</td><td>" +
            list[student]['username']  + "</td><td>" +
            list[student]['firstname'] + "</td><td>" +
            list[student]['firstname'] + "</td>" +
            `<td><input type='button' class='DeleteButton' value='Delete User' onclick='deleteStudent(${list[student][idName]})'></td></tr>`;
    }
    html += "</table>";
    return html;
}