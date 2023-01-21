function createBookBoxes(books) {
    let count = Object.keys(books).length;
    var curr_book = 0;
    let html = '<div className="container-fluid">';

    alert('1'+ books[curr_book]['title']);
    console.log(typeof(books[curr_book]['title']));
    for (let i = 0; i < count/4; i++) {
        html += '<div class="row">';
        for (let j = 0; j < 4; j++) {

            html += '<div class="col-sm-3">';
            html += '<article class="article-box">\n' +
                ' <h4>'+books[curr_book]['title']+'</h4>\n' +
                ' <h5>'+books[curr_book]['isbn']+'</h5>\n' +
                ' <h6>'+books[curr_book]['genre']+'</h6>\n' +
                ' <h6>'+books[curr_book]['pages']+'</h6>\n' +
                '</article>';
            html += '</div>';
            curr_book++;
        }
        html += '</div>';
    }
    html += '</div>';

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