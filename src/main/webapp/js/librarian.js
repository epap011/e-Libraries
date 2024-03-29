function addBook() {
    let myForm = document.getElementById('addBookForm');
    let formData = new FormData(myForm);
    const data = {};
    formData.forEach((value, key) => (data[key] = value));
    let jsonData=JSON.stringify(data);

    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            console.log('book successfully added to the database');

        } else if (xhr.status != 200) {
            console.log('ERROR: book not added to the database');

        }
    };

    xhr.open('POST', 'http://localhost:8080/eLibraries/resource/book');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(jsonData);
}

function showAddBookForm() {
    $("#bookList").hide();
    $("#librarianResults").show();
    let html =
        '<h3>Record Book Information</h3>\n' +
        '<form id="addBookForm" name="myForm" onsubmit=\'addBook();return false;\'>\n' +
        '<label for=\'isbn\'>Book ISBN:</label>\n' +
        '<input id=\'isbn\' type=\'text\' name=\'isbn\' value="1234567890123" required><br>\n' +
        '<label for=\'title\'>Book Title:</label>\n' +
        '<input id=\'title\' type="text" name=\'title\' value="The Holy Grail" required><br>\n' +
        '<label for=\'authors\'>Book Authors:</label>\n' +
        '<input id=\'authors\' type="text" name=\'authors\' value="Arthur" required><br>\n' +
        '<label for=\'genre\'>Book Genre:</label>\n' +
        '<input id=\'genre\' type="text" name=\'genre\' value="Fantasy" required><br>\n' +
        '<label for=\'pages\'>Book Pages:</label>\n' +
        '<input id=\'pages\' type="text" name=\'pages\' value="254" required><br>\n' +
        '<label for=\'publicationyear\'>Publication Year:</label>\n' +
        '<input id=\'publicationyear\' type="text" name=\'publicationyear\' value="2012" required><br>\n' +
        '<label for=\'url\'>Book URL:</label>\n' +
        '<input id=\'url\' type="text" name=\'url\' value="http://url-link.com" required><br>\n' +
        '<label for=\'photo\'>Book PhotoURL:</label>\n' +
        '<input id=\'photo\' type="text" name=\'photo\' value="http://photo-link.com"required><br>\n' +
        '<input type=\'submit\' class="button" value="Add Book">\n' +
        '</form>';

    document.getElementById("librarianResults").innerHTML = html;
}

function showBookAvailability() {
    $("#bookList").hide();
    $("#librarianResults").show();
    let html =
        '<h3>Change the availability of a Book</h3>\n' +
        '<form id="availabilityForm" name="myForm" onsubmit=\'setBookAvailability();return false;\'>\n' +
        '<br><label for=\'isbn\'>Book ISBN:</label><br>\n' +
        '<input id=\'isbn\' type=\'text\' name=\'isbn\' required><br><br>\n' +
        '<label>Set the availability</label><br>'+
        '<input type="radio" id="availableRadioButton1" name="availability" value="true">' +
        '<label htmlFor="availableRadioButton">available</label>'+
        '<input type="radio" id="notAvailableRadioButton2" name="availability" value="false">'+
        '<label htmlFor="notAvailableRadioButton">not available</label><br><br>'+
        '<input type=\'submit\' class="button" value="Change Availability">\n' +
        '</form>';

    document.getElementById("librarianResults").innerHTML = html;
}

function setBookAvailability() {
    let isbn = document.getElementById("isbn").value;
    let availability = document.querySelector('input[name="availability"]:checked').value;

    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log('book\'s availability successfully changed');

        } else if (xhr.status !== 200) {
            console.log('ERROR: book\' availability didnt change');

        }
    };

    xhr.open('PUT', 'http://localhost:8080/eLibraries/resource/availability/?isbn='+isbn+'&availability='+availability);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
}

function showBooksStatus(){
    $("#bookList").hide();
    $("#librarianResults").show();
    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let data = JSON.parse(xhr.responseText);
            document.getElementById('librarianResults').innerHTML = createBorrowTable(data);
        } else if (xhr.status !== 200) {
            console.log("showBooksStatus error :(");
        }
    };
    xhr.open('GET', 'http://localhost:8080/eLibraries/resource/borrowings/all');
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}

function createBorrowTable(data, show="yes"){
    var html = "<table><tr><th>user_id</th><th>bookcopy_id</th><th>status</th><th></th></tr>"
    console.log(data);
    for(let i=0; i<data.length; i++){
        let borrow = data[i];
        console.log(borrow);
        let userId = `<label>${borrow['user_id']}</label>`
        let bookcopyId = `<label>${borrow['bookcopy_id']}</label>`
        let status = `<label>${borrow['status']}</label>`
        let bt;
        if(show === 'yes') {
            bt = `<button onclick='changeStatus(${borrow['borrowing_id']})'>change status</button>`
            html += "<tr><td>" + userId + "</td><td>" + bookcopyId + "</td><td>" + status + "</td><td>" + bt + "</td></tr>";
        }
        else {
            html += "<tr><td>" + userId + "</td><td>" + bookcopyId + "</td><td>" + status + "</td></tr>";
        }
    }
    html += "</table>";
    return html;
}

function changeStatus(id ){
    console.log('borrow id= ' , id);
    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let data = JSON.parse(xhr.responseText);
            // document.getElementById('librarianResults').innerHTML = createBorrowTable(data);
        } else if (xhr.status !== 200) {
            console.log("changeStatus error :(");
        }
    };
    xhr.open('PUT', 'http://localhost:8080/eLibraries/resource/borrowings/status?id='+id);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}

function getBorrowedBooks(){
    $("#bookList").hide();
    $("#librarianResults").show();
    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let html = createBorrowTable(JSON.parse(xhr.responseText), "no")
            document.getElementById('librarianResults').innerHTML = html;
        } else if (xhr.status !== 200) {
            console.log(xhr.responseText);
        }
    };
    xhr.open('GET', 'http://localhost:8080/eLibraries/resource/borrowings/all');
    xhr.send();
}