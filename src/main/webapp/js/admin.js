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

function deleteLibrarian(id) {
    const xhr = new XMLHttpRequest();

    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log('user deleted successfully');
        }
        else {
            console.log('[ERROR] user deletion failed');
        }
    }

    xhr.open("DELETE", "http://localhost:8080/eLibraries/resource/user/librarian/"+id);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}

function createTableFromJSON(list, idName) {
    let onclickFunction;
    if (idName === "user_id") onclickFunction = "deleteStudent";
    else onclickFunction = "deleteLibrarian"

    let html = "<table><tr><th>ID</th><th>Username</th><th>First Name</th><th>Last Name</th></tr>";
    for (const student in list) {
        html += "<tr><td>" +
            list[student][idName]   + "</td><td>" +
            list[student]['username']  + "</td><td>" +
            list[student]['firstname'] + "</td><td>" +
            list[student]['firstname'] + "</td>" +
            `<td><input type='button' class='DeleteButton' value='Delete User' onclick='${onclickFunction}(${list[student][idName]})'></td></tr>`;
    }
    html += "</table>";
    return html;
}

function showStatistics() {
    const xhr = new XMLHttpRequest();

    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.responseText);
            let statistics = JSON.parse(xhr.responseText);
            let numberOfStudentsPerTypeStatistics = statistics["statistics"]["numberOfStudentsPerType"];
            let numberOfBooksPerGenre             = statistics["statistics"]["numberOfBooksPerGenre"];
            let numberOfBooksPerLibrary           = statistics["statistics"]["numberOfBooksPerLibrary"];

            createPieChart("pie", numberOfStudentsPerTypeStatistics, "chart1", "Students Per Qualification");
            createPieChart("bar", numberOfBooksPerGenre, "chart2", "Books Per Genre");
            createPieChart("pie", numberOfBooksPerLibrary, "chart3", "Books Per Libraries");

        }
        else {
            console.log('[ERROR] something went wrong with statistics');
        }
    }

    xhr.open("GET", "http://localhost:8080/eLibraries/resource/statistics");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}

function createPieChart(chart_type, studentsPerType, chart_id, message) {
    var xValues = [];
    var yValues = [];
    for (const [key, value] of Object.entries(studentsPerType)) {
        xValues.push(key);
        yValues.push(value);
    }

    console.log(xValues);
    console.log(yValues);

    var barColors = ["#b91d47", "#00aba9", "#2b5797", "#e8c3b9", "#1e7145"];

    new Chart(document.getElementById(chart_id), {
        type: chart_type,
        data: {
            labels: xValues,
            datasets: [{
                backgroundColor: barColors,
                data: yValues
            }]
        },
        options: {
            title: {
                display: true,
                text: message
            }
        }
    });
}