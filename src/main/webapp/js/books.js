var map     = new OpenLayers.Map("Map");
var mapnik  = new OpenLayers.Layer.OSM();

map.addLayer(mapnik);

setMapZoom(setPosition(35.2322, 24.8511), 8);
var markers = new OpenLayers.Layer.Markers("Markers");

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
            ` <br><br><button type="button" class="btn btn-outline-primary borrowBookButton" onclick="geBookBorrowingPageBasedOnIsbn(${books[i]['isbn']})">Borrow Book</button></div>` +
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
        $("#borrowBookSection").hide();

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

function geBookBorrowingPageBasedOnIsbn(isbn) {
    console.log("borrow book .." + isbn);
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("borrow book info retrieved");
            $("#bookList").hide();
            $("#borrowBookSection").show();
            clearMapMarkers();

            //Getting & Setting Book Information
            let bookInfoDiv = document.getElementById("borrowBookInfo");
            const request = new XMLHttpRequest();
            request.open('GET', 'http://localhost:8080/eLibraries/resource/books/isbn/'+isbn, false);
            request.send();
            if (request.status === 200) {
                console.log(request.responseText);
                let book = JSON.parse(request.responseText);
                let html = '<article class="book-box container-fluid">\n' +
                    ' <div class="row">' +
                    ` <div class='col'><img src=${book['photo']} height="300px" width="200px"></div>`+
                    ' <div class="col"> <b>'+book['title']+'</b>\n' +
                    ' <br><br><b>isbn: </b>'+book['isbn']+'\n' +
                    ' <br><b>genre: </b> '+book['genre']+'\n' +
                    ' <br><b>pages: </b> '+book['pages']+'\n' +
                    ' <br><b>publicationYear: </b> '+book['publicationyear']+'\n' +
                    ` <br><a href=${book['url']}>book link</a></div>` +
                    '</div></article>';

                bookInfoDiv.innerHTML = html;
            }

            //Getting all the available libraries for this book & Update the map
            let librarians = JSON.parse(xhr.responseText);
            let libraries = document.getElementById("availableLibraries");
            let html = '<br><br><h1>Available Libraries</h1><div class="container-fluid"> <div class="row">'
            for (let i = 0; i < librarians.length; i++) {
                let lat = librarians[i]["lat"];
                let lon = librarians[i]["lon"];
                let message = "Library Name: " + librarians[i]["libraryname"] +
                    "\nInfo: " + librarians[i]["libraryinfo"] +
                    "\n telephone: " + librarians[i]["telephone"] +
                    "\nemail: " + librarians[i]["email"] +
                    "\n Site: " + librarians[i]["personalpage"];

                setMarkerOnPosition(lat, lon, message);

                html += '<article class="library-box container-fluid">\n' +
                    ' <div class="row">' +
                    ' <div class="col">' +
                    ' <b>Library: </b>'+librarians[i]['libraryname']+'\n' +
                    ' <br><b>phone: </b> '+librarians[i]['telephone']+'\n' +
                    ' <br><b>email: </b> '+librarians[i]['email']+'\n' +
                    ' <br><b>Info: </b> '+librarians[i]['libraryinfo']+'\n' +
                    ` <br><a href=${librarians[i]['personalpage']}>web page</a></div>` +
                    '</div></article><br>';
            }

            html += "</div></div><br><br>";
            libraries.innerHTML = html;
            document.getElementById("borrowBookSection").style.visibility = 'visible';
        }
        else {
            console.log("Error");
        }article-box
    };

    xhr.open("GET", "http://localhost:8080/eLibraries/resource/borrow-info/"+isbn);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}

function clearMapMarkers() {
    markers.clearMarkers();
}

function setPosition(lat, lon){
    var fromProjection = new OpenLayers.Projection("EPSG:4326");
    var toProjection   = new OpenLayers.Projection("EPSG:900913");
    var position       = new OpenLayers.LonLat(lon, lat).transform(fromProjection,toProjection);

    return position;
}

function setMarkerOnPosition(lat, lon, message) {
    map.addLayer(markers);

    var position = setPosition(lat, lon);
    var mark     = new OpenLayers.Marker(position);

    markers.addMarker(mark);
    mark.events.register('mousedown', mark, function(evt) {
        handler(position,message);
    } );

    //setMapZoom(position, 14);
}

function setMapZoom(position, zoom) {
    map.setCenter(position, zoom);
}

function handler(position, message){
    var popup = new OpenLayers.Popup.FramedCloud("Popup", position, null, message, null, true);
    map.addPopup(popup);
}