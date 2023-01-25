function getBookByTitle(){
    $("#bookList").hide();
    $("#userInfos").show();
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const obj = JSON.parse(xhr.responseText);
            document.getElementById('userInfos').innerHTML = createTableFromJSONMultiple(obj);

        } else if (xhr.status !== 200) {
            document.getElementById('userInfos').innerHTML = 'Request failed. Returned status of ' + xhr.status + "<br>";
        }
    };
    let name=document.getElementById('title').value;
    xhr.open("GET", "http://localhost:8080/eLibraries/resource/books/title?name="+name);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}

function getBookByAuthor(){
    $("#bookList").hide();
    $("#userInfos").show();
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const obj = JSON.parse(xhr.responseText);
            document.getElementById('userInfos').innerHTML = createTableFromJSONMultiple(obj);

        } else if (xhr.status !== 200) {
            document.getElementById('userInfos').innerHTML = 'Request failed. Returned status of ' + xhr.status + "<br>";
        }
    };
    let name=document.getElementById('author').value;
    xhr.open("GET", "http://localhost:8080/eLibraries/resource/books/author?name="+name);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}

function getBookByPages(){
    $("#bookList").hide();
    $("#userInfos").show();
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const obj = JSON.parse(xhr.responseText);
            document.getElementById('userInfos').innerHTML = createTableFromJSONMultiple(obj);

        } else if (xhr.status !== 200) {
            document.getElementById('userInfos').innerHTML = 'Request failed. Returned status of ' + xhr.status + "<br>";
        }
    };

    let from=document.getElementById('fromPages').value;
    let to=document.getElementById('toPages').value;
    xhr.open("GET", "http://localhost:8080/eLibraries/resource/books/pages?fromPages="+from+"&toPages="+to);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}

function createTableFromJSONMultiple(data) {
    var html = "<table><tr><th>Category</th><th>ISBN</th><th>title</th><th>author</th><th>year</th><th>pages</th><th>photo</th><th>bookurl</th><th>reviews</th><th>score</th></tr>";
    for(let i=0; i<data.length; i++){
        console.log(JSON.parse(data[i]));
        let data2 = JSON.parse(data[i]);
        var category = `<label>${data2['genre']}</label>`
        var isbn = `<label>${data2['isbn']}</label>`;
        var title = `<label >${data2['title']}</label>`;
        var author = `<label>${data2['authors']}</label>`;
        var year = `<label>${data2['publicationyear']}</label>`;
        var pages = `<label>${data2['pages']}</label>`;
        var photo = `<img src=${data2['photo']} width="100px" height="100px">`;
        var bookurl = `<label>${data2['url']}</label>`;
        let temp = data2['reviews'];
        var revText ="";
        var revScore="";
        if(temp.length != 0) {
            for (let j = 0; j < temp.length; j++) {
                let temp2 = JSON.parse(temp[j]);
                revText += `<label>${temp2['reviewText']}</label><br>`;
                revScore += `<label>${temp2['reviewScore']}</label><br>`;
                console.log(temp2);
            }
        }
        html += "<tr><td>" + category + "</td><td>" + isbn + "</td><td>" + title + "</td><td>" + author + "</td><td>" + year + "</td><td>" + pages + "</td><td>" + photo + "</td><td>" + bookurl + "</td><td>" + revText + "</td><td>" + revScore + "</td></td></tr>";
    }

    html += "</table>";
    return html;
}