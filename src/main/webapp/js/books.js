function createBookBoxes(books) {
    let count = Object.keys(books).length;
    var curr_book = 0;
    let html = '<div className="container-fluid">';
    var prevGenre = "";
    for (let i = 0; i <= count/4; i++) { //
        html += '<div class="row">';
        for (let j = 0; j < 4; j++) {
            if(count <= curr_book) {
                continue;
            }
            html += '<div class="col-sm-3">';
            if(books[curr_book]['genre'] !== prevGenre) {
                prevGenre = books[curr_book]['genre'];
                html += '</div></div>';
                html += '<h2>'+books[curr_book]['genre']+'</h2>';
                html += '<div class="row">';
                html += '<div class="col-sm-4">';
            }
            html += '<article class="article-box">\n' +
                ' <h4>'+books[curr_book]['title']+'</h4>\n' +
                ' <p> isbn: '+books[curr_book]['isbn']+'</p>\n' +
                ' <p> genre: '+books[curr_book]['genre']+'</p>\n' +
                ' <p> pages: '+books[curr_book]['pages']+'</p>\n' +
                ' <p> pubYear: '+books[curr_book]['publicationyear']+'</p>\n' +
                ' <p> photo: '+books[curr_book]['photo']+'</p>\n' +
                ' <p> url: '+books[curr_book]['url']+'</p>\n' +
                '</article>';
            html += '</div>';
            curr_book++;
        }
        if(count <= curr_book) {
            break;
        }
        html += '</div>';
    }

    return html;
}

function getAllBooks() {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var obj = JSON.parse(xhr.responseText);
            let i = 1;
            let count= Object.keys(obj).length;
            let html = createBookBoxes(obj);
            document.getElementById("bookList").innerHTML = html;
        } else if (xhr.status !== 200) {
            document.getElementById('bookList').innerHTML = 'Request failed. Returned status of ' + xhr.status + "<br>";
        }
    };

    xhr.open("GET", "http://localhost:8080/eLibraries/aaa/books/all");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}