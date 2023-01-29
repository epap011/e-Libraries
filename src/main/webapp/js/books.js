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
            ` <br><br><button type="button" class="btn btn-outline-primary borrowBookButton" onclick="geBookBorrowingPageBasedOnIsbn(${books[i]['isbn']})">More Info</button></div>` +
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
            let request = new XMLHttpRequest();
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

            document.getElementById("reviewForm").addEventListener("submit",
                function(){sendReview(isbn);}, false);

            let temp = isBookAlreadyBorrowed(isbn);
            let bookStatus = temp[0];
            let bookcopyId = temp[1];
            console.log("bookcopyId= " , bookcopyId);
            console.log("bookStatus= " , bookStatus);
            if(bookStatus == 'available'){
                document.getElementById("borrowButton").textContent = 'request for borrow';
                document.getElementById("borrowButton").addEventListener("click",
                    function(){borrowRequest(isbn)}, false);
            }else if(bookStatus === 'requested'){
                document.getElementById("borrowButton").textContent = 'you already request to borrow the book';
            }else if(bookStatus === 'borrowed'){
                document.getElementById("borrowButton").textContent = 'return the book';
                document.getElementById("borrowButton").addEventListener("click",
                    function(){returnRequest(isbn)}, false);
            }else if(bookStatus === 'returned' || bookStatus === 'successEnd'){
                document.getElementById("borrowButton").textContent = 'you already borrow this book';
            }


            let destinations = '';
            let dest_libraries = [];
            //Getting all the available libraries for this book & Update the map
            let librarians = JSON.parse(xhr.responseText);
            let libraries = document.getElementById("availableLibraries");
            let html = '<br><br><h1>Available Libraries</h1><div class="container-fluid"> <div class="row">'
            for (let i = 0; i < librarians.length; i++) {
                let lat = librarians[i]["lat"];
                let lon = librarians[i]["lon"];
                destinations += lat + ',' + lon + ';';
                dest_libraries.push(librarians[i]["libraryname"]);
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
                    '</div></article><br><br>';
            }

            html += "</div></div><br><br>";
            libraries.innerHTML = html;

            //Getting lat lon of user
            let user_lat;
            let user_lon;
            request = new XMLHttpRequest();
            request.open('GET', 'http://localhost:8080/eLibraries/resource/user/info', false);
            request.send();
            if(request.status === 200) {
                let data = JSON.parse(request.responseText);
                user_lat = data['lat'];
                user_lon = data['lon'];
                console.log(data);
            }else {
                console.log(request.responseText);
            }
            console.log(user_lon + ' ' +user_lat);

            request = new XMLHttpRequest();
            request.open('GET', 'http://localhost:8080/eLibraries/resource/borrowings/userId', false);
            request.send();
            if(request.status === 200) {
                let reviewFormVisibility = false;
                let data = JSON.parse(request.responseText);
                console.log("borrowings/userid = " + data);
                for(let i = 0; i < data.length; i++) {
                    let bor = data[i];
                    console.log(bor);
                    let bookId = bor['bookcopy_id'];
                    if(bor['status'] === 'successEnd') {
                        let request2 = new XMLHttpRequest();
                        request2.open('GET', 'http://localhost:8080/eLibraries/resource/availability/copyId?id=' + bookId, false);
                        request2.send();
                        let data2 = JSON.parse(request2.responseText);
                        console.log('data2:' + data2['isbn']);
                        let dataIsbn = data2['isbn']
                        console.log(typeof dataIsbn);
                        console.log(typeof isbn);
                        if(dataIsbn == isbn) {
                            console.log('isbn: ' + dataIsbn + ' | status: ' + bor['status'] + ' ..  show reviews!');
                            reviewFormVisibility = true;
                            break;
                        }
                    }
                }
                if(reviewFormVisibility) {
                    console.log('showing review form');
                    $("#review-box").show();
                }
                else {
                    console.log('hiding review form');
                    $("#review-box").hide();
                }
            }else{
                console.log("error in borrowings/userid resource");
            }

            request = new XMLHttpRequest();
            request.withCredentials = true;

            let origin = user_lat + ',' + user_lon;
            let librariesDistance = document.getElementById("availableLibrariesBasedOnMeter");
            html = '';
            request.addEventListener("readystatechange", function () {
                if (this.readyState === this.DONE) {
                    console.log(this.responseText);
                    let data = JSON.parse(this.responseText);
                    let distances = data['distances'];
                    let durations = data['durations'];
                    for (let i = 0; i < dest_libraries.length; i++) {
                        console.log(dest_libraries[i]);
                        html += '<h2>'+dest_libraries[i]+'</h2><br>';
                        html += '<h4>Distance: ' + distances[0][i] + ' Duration: ' + durations[0][i] + '</h4><br><br>'
                    }
                    librariesDistance.innerHTML = html;
                }
            });

            request.open("GET", "https://trueway-matrix.p.rapidapi.com/CalculateDrivingMatrix?origins="+origin+"&destinations="+destinations);
            request.setRequestHeader("X-RapidAPI-Key", "7517e2e8f3msh250bed78beeb753p121e90jsna52c21fdbf03");
            request.setRequestHeader("X-RapidAPI-Host", "trueway-matrix.p.rapidapi.com");
            request.send();

            document.getElementById("borrowBookSection").style.visibility = 'visible';
        }
        else {
            console.log("error in borrow-info/isbn resource");
        }
    };

    xhr.open("GET", "http://localhost:8080/eLibraries/resource/borrow-info/"+isbn);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}

function sendReview(isbn) {
    let reviewForm = document.getElementById('reviewForm');
    let formData = new FormData(reviewForm);
    let data = {};

    formData.forEach((value, key) => (data[key] = value));

    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.responseText);
        } else if (xhr.status !== 200) {

        }
    };

    xhr.open("POST", "http://localhost:8080/eLibraries/resource/review/" + isbn);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(data));
}

function isBookAlreadyBorrowed(isbn) {
    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:8080/eLibraries/resource/borrowings/userId', false);
    request.send();
    if(request.status === 200){
        let data = JSON.parse(request.responseText);
        console.log(data);
        for(let i=0; i<data.length; i++) {
            var bor = data[i];
            let bookId = bor['bookcopy_id'];
            var request2 = new XMLHttpRequest();
            request2.open('GET', 'http://localhost:8080/eLibraries/resource/availability/copyId?id=' + bookId, false);
            request2.send();
            let data2 = JSON.parse(request2.responseText);
            console.log(data2);
            let dataIsbn = data2['isbn']
            if(dataIsbn === isbn){
                return [bor['status'],bor['bookcopy_id']]
            }
        }
        return ["available", isbn]
    }else{
        console.log("error: isBookAlready")
    }

}

function isBorrowOver(isbn) {
    return false;
}

function sendBorrowRequest() {

}

function returnBookRequest() {

}

function clearMapMarkers() {
    markers.clearMarkers();
}

function borrowRequest(isbn){
    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:8080/eLibraries/resource/availability/isbn?isbn='+isbn, false);
    request.send();
    if (request.status == 200) {
        let bookAv = JSON.parse(request.responseText);
        console.log(bookAv);
        if (bookAv == null) {
            alert("All books are already borrowed :(")
        } else {
            let from = new Date();
            let to = new Date();
            to.setMonth(from.getMonth() + 1);
            to = to.toISOString().split('T')[0]
            from = from.toISOString().split('T')[0]
            var request = new XMLHttpRequest();
            console.log(from);
            console.log(to);
            request.open('POST', 'http://localhost:8080/eLibraries/resource/borrowings?bookId=' + bookAv['bookcopy_id'] + '&from=' + from + '&to=' + to, false);
            request.send();
            if(request.status == 200){

            }else{
                console.log("error in borrowReq , 2");
            }
        }
    }else{
        console.log("error in borrowReq , 1");
    }
}

function returnRequest(isbn){

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