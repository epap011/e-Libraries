let showBooks = 0;

function createBookBoxes(books) {
    let count = Object.keys(books).length;
    let prevGenre = "";

    let html = '<div class="container-fluid">';
    for (let i = 0; i < count; i++) {
        if(books[i]['genre'] !== prevGenre) {
            prevGenre = books[i]['genre'];
            if(i  > 0) html += '</div>';
            html += '<br><br><h1>'+books[i]['genre']+'</h1>';
            html += '<div class="row">';
        }
        html += '<div class="col-sm-4">';
        html += '<article class="book-box container-fluid">\n' +
            ' <div class="row">' +
            ` <div class='col'><img src=${books[i]['photo']} height="300px" width="200px"></div>`+
            ' <div class="col"> <b>'+books[i]['title']+'</b>\n' +
            ' <br><br><b>isbn: </b>'+books[i]['isbn']+'\n' +
            ' <br><b>genre: </b> '+books[i]['genre']+'\n' +
            ' <br><b>pages: </b> '+books[i]['pages']+'\n' +
            ' <br><b>publicationYear: </b> '+books[i]['publicationyear']+'\n' +
            ` <br><a href=${books[i]['url']}>book link</a>`+'\n' +
            ` <br><br><button type="button" class="btn btn-outline-primary borrowBookButton" onclick="alert('working on it..')">Borrow Book</button></div>` +
            '</div></article>';
        html += '</div>';
    }
    html += '</div>';

    return html;
}

function getAllBooks() {
    if (showBooks === 1) {
        $("#userInfos").hide();
        $("#librarianResults").hide();

        let borrowBookButtons = document.getElementsByClassName("borrowBookButton");
        if(isStudent) {
            Array.from(borrowBookButtons).forEach((b) => {
                b.style.visibility = 'visible';
            });
        } else {
            Array.from(borrowBookButtons).forEach((b) => {
                b.style.visibility = 'hidden';
            });
        }
        $("#bookList").show();
        return;
    }

    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            showBooks = 1;
            let obj = JSON.parse(xhr.responseText);
            document.getElementById("bookList").innerHTML = createBookBoxes(obj);
            $("#userInfos").hide();
            $("#librarianResults").hide();
            let borrowBookButtons = document.getElementsByClassName("borrowBookButton");
            if(isStudent) {
                Array.from(borrowBookButtons).forEach((b) => {
                    b.style.visibility = 'visible';
                });
            } else {
                Array.from(borrowBookButtons).forEach((b) => {
                    b.style.visibility = 'hidden';
                });
            }
            $("#bookList").show();
        } else if (xhr.status !== 200) {
            document.getElementById('bookList').innerHTML = 'Request failed. Returned status of ' + xhr.status + "<br>";
        }
    };

    xhr.open("GET", "http://localhost:8080/eLibraries/resource/books/all");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}