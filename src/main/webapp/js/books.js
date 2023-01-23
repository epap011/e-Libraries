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
                html += '<div class="col-sm-3">';
            }
            html += '<article class="article-box">\n' +
                ` <div class="fixed"><img src=${books[curr_book]['photo']} height="300px" width="200px"></div>`+
                ' <div class="flex-item"> <b>'+books[curr_book]['title']+'</b>\n' +
                ' <br><br><b>isbn: </b>'+books[curr_book]['isbn']+'\n' +
                ' <br><b>genre: </b> '+books[curr_book]['genre']+'\n' +
                ' <br><b>pages: </b> '+books[curr_book]['pages']+'\n' +
                ' <br><b>publicationYear: </b> '+books[curr_book]['publicationyear']+'\n' +
                ` <br><a href=${books[curr_book]['url']}>book link</a></div>`+'\n' +
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