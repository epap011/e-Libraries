map         = new OpenLayers.Map("Map");
var mapnik  = new OpenLayers.Layer.OSM();
map.addLayer(mapnik);
setMapZoom(setPosition(35.2322, 24.8511), 8);
var markers        = new OpenLayers.Layer.Markers("Markers");

let usernameFreeToUse  = false;
let emailFreeToUse     = false;
let studentIDFreeToUse = false;

let lat;
let lon;

function sendAjaxPOST() {
    let myForm   = document.getElementById('myForm');
    let formData = new FormData(myForm);
    let data = {};

    formData.forEach((value, key) => (data[key] = value));
    data["lat"] = lat;
    data["lon"] = lon;

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("form sent without error :)");
            document.getElementById("ajaxResult").innerHTML = registrationCompletedMessage(JSON.parse(xhr.responseText));
        } else if (xhr.status !== 200) {
            console.log("form sent but with error :(");
        }
    };

    xhr.open('POST', 'PostUser?user_type='+data["userType"]);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.send(JSON.stringify(data));
}

function registrationCompletedMessage(data) {
    var html;
    html = "<p>Η εγγραφή σας πραγματοποιήθηκε επιτυχώς</p>"
    html += "<table><tr><th>Category</th><th>Value</th></tr>";
    for (const x in data) {
        var category = x;
        var value = data[x];
        html += "<tr><td>" + category + "</td><td>" + value + "</td></tr>";
    }
    html += "</table>";
    return html;
}

function isUsernameAvailable() {
    let username = document.getElementById("username").value;
    let xhr      = new XMLHttpRequest();
    let usernameMessage = document.getElementById("invalidUsernameMessage");

    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("username: received from server: " + xhr.responseText);
            usernameFreeToUse = true;
            usernameMessage.style.display = 'block';
            usernameMessage.innerHTML     = "username is available";
            usernameMessage.style.color   = "green";
        } else if(xhr.status !== 200) {
            console.log("username: received from server: " + xhr.responseText);
            usernameFreeToUse = false;
            usernameMessage.style.display = 'block';
            usernameMessage.innerHTML     = "username is taken";
            usernameMessage.style.color   = "red";
        }
    };

    xhr.open("GET", "Validator?username="+username);
    xhr.send();
}

function isEmailAvailable() {
    let email = document.getElementById("email").value;
    let xhr   = new XMLHttpRequest();
    let emailMessage = document.getElementById("invalidUniversityEmailMessage");

    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("email: received from server: " + xhr.responseText);
            emailFreeToUse = true;
            emailMessage.style.display = 'block';
            emailMessage.innerHTML     = "email is available";
            emailMessage.style.color   = "green";
        } else if(xhr.status !== 200) {
            console.log("email: received from server: " + xhr.responseText);
            emailFreeToUse = false;
            emailMessage.style.display = 'block';
            emailMessage.innerHTML     = "email is taken";
            emailMessage.style.color   = "red";
        }
    };

    xhr.open("GET", "Validator?email="+email);
    xhr.send();
}

function isStudentIdAvailable() {
    let studentID = document.getElementById("academicIdInput").value;
    let xhr       = new XMLHttpRequest();
    let studentIDMessage = document.getElementById("invalidStudentIDMessage");

    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("student_id: received from server: " + xhr.responseText);
            studentIDFreeToUse = true;
            studentIDMessage.style.display = 'block';
            studentIDMessage.innerHTML     = "studentID is available";
            studentIDMessage.style.color   = "green";
        } else if(xhr.status !== 200) {
            console.log("student_id: received from server: " + xhr.responseText);
            studentIDFreeToUse = false;
            studentIDMessage.style.display = 'block';
            studentIDMessage.innerHTML     = "studentID is taken";
            studentIDMessage.style.color   = "red";
        }
    };

    xhr.open("GET", "Validator?student_id="+studentID);
    xhr.send();
}

function validateForm() {
    cleanPreviousErrorMessages();
    
    if(!checkPasswordMissmatch() || !checkPasswordStrength() || !isPolicyCheckboxChecked()) return false;
    if(!usernameFreeToUse || !emailFreeToUse) return false;
    
    if(document.getElementById("user_type_student").checked) {  
        if(!isStudentEmailValid() || !isCardExpiredDateValid() || !checkStudentCardYearsActive()) {
            return false;
        }
        if(!studentIDFreeToUse) return false;
    }

    sendAjaxPOST();
    return true;
}

function librarianHandler() {
    hideStudentFields();
    setHomeAddress2LibraryAddress();
    showLibraryNameField();
    showLibraryInfo();
    addLibrarianRequiredAttributes();
    removeStudentRequiredAtributed();
}

function studentHandler() {
    showStudentFields();
    setLibraryAddress2setHomeAddress();
    hideLibraryNameField();
    hideLibraryInfo();
    addStudentRequiredAtributed();
    removeLibrarianRequiredAttributes();
}

function hideShowPassword(showHidePasswordId) {
    var inputPassword;
    var image;

    if (showHidePasswordId === "showHidePasswordButton") {
        inputPassword = document.getElementById("password");
        image         = document.getElementById("showHidePasswordImage");
    }        
    if (showHidePasswordId === "showHideReTypedPasswordButton") {
        inputPassword = document.getElementById("inputReTypedPassword");
        image         = document.getElementById("showHideReTypedPasswordImage");
    }

    if (inputPassword.type==="text") {
        inputPassword.type="password";
        image.src = "resources/images/hide.png";
    }
    else {
        inputPassword.type = "text";
        image.src = "resources/images/show.png";
    }
}

function passwordStrengthAndMissmatchHandler() {
    checkPasswordStrength();
    checkPasswordMissmatch();
}

function checkPasswordStrength() {
    var inputPassword               = document.getElementById("password");
    var passwordStrengthnessMessage = document.getElementById("passwordStrengthMessage");

    var bannedPasswordKeywords        = ['helmepa', 'uoc', 'tuc'];
    var passwordIncludesBannedKeyword = bannedPasswordKeywords.some(keyword => inputPassword.value.includes(keyword));

    if (passwordIncludesBannedKeyword) {
        passwordStrengthnessMessage.innerHTML   = "illegal sub-sequences: helmepa, uoc, tuc";
        passwordStrengthnessMessage.style.color = "red";
        return false;
    }

    var count = 0;
    for (let i = 0; i < inputPassword.value.length; i++) {
        if (!isNaN(inputPassword.value[i])) count += 1;
    }
    
    var weakPasswordExists = false;
    if (count/inputPassword.value.length >= 0.50) {
        weakPasswordExists = true;
        passwordStrengthnessMessage.innerHTML   = "weak password";
        passwordStrengthnessMessage.style.color = "orange";
        return false;
    }

    var strongPasswordExists             = false;
    var upperCaseCharExists              = false;
    var lowerCaseCharExists              = false;
    var atLeastTwoDifferentSymbolsExists = false;
    var firstSymbolRead                  = '';
    for(let i = 0; i < inputPassword.value.length; i++) {

        if(!upperCaseCharExists && inputPassword.value.toUpperCase() != inputPassword.value) upperCaseCharExists = true;
        if(!lowerCaseCharExists && inputPassword.value.toLowerCase() != inputPassword.value) lowerCaseCharExists = true;
        
        if((inputPassword.value.charCodeAt(i) >= 33  && inputPassword.value.charCodeAt(i) <= 47) ||
           (inputPassword.value.charCodeAt(i) >= 58  && inputPassword.value.charCodeAt(i) <= 64) ||
           (inputPassword.value.charCodeAt(i) >= 91  && inputPassword.value.charCodeAt(i) <= 96) ||
           (inputPassword.value.charCodeAt(i) >= 123 && inputPassword.value.charCodeAt(i) <= 126)) {

           if(firstSymbolRead === '') firstSymbolRead = inputPassword.value.charAt(i);

           if(inputPassword.value.charAt(i) != firstSymbolRead) atLeastTwoDifferentSymbolsExists = true;
        }

        if(upperCaseCharExists && lowerCaseCharExists && atLeastTwoDifferentSymbolsExists) {
            strongPasswordExists                    = true;
            passwordStrengthnessMessage.innerHTML   = "strong password";
            passwordStrengthnessMessage.style.color = "green";
            break;
       }
    }

    if(!weakPasswordExists && !strongPasswordExists) {
        passwordStrengthnessMessage.innerHTML   = "medium password";
        passwordStrengthnessMessage.style.color = "#FCDA00";
    }

    return true;
}

function checkPasswordMissmatch() {
    var password             = document.getElementById("password");
    var confirmPassword      = document.getElementById("inputReTypedPassword");
    var passwordMatchMessage = document.getElementById("passwordMatchMessage");

    if(confirmPassword.value.length === 0) return false;

    if (password.value != confirmPassword.value) {
        passwordMatchMessage.innerHTML   = "Οι κωδικοί δεν ταιριάζουν";
        passwordMatchMessage.style.color = "red";
        return false;
    } else {
        passwordMatchMessage.innerHTML   = "Οι κωδικοί ταιριάζουν";
        passwordMatchMessage.style.color = "green";
    }
    return true;
}

function hideStudentFields() {
    studentInfo = document.getElementById("student_info");

    studentInfo.style.display = 'none';
}

function showStudentFields() {
    studentInfo = document.getElementById("student_info");

    studentInfo.style.display = 'block';
}

function isStudentEmailValid() {
    email             = document.getElementById("email");
    emailErrorMessage = document.getElementById("invalidUniversityEmailMessage");
    universityUoc     = document.getElementById("university_uoc");
    universityTuc     = document.getElementById("university_tuc");
    universityHelmepa = document.getElementById("university_helmepa");

    if(universityUoc.checked) {
        if(!email.value.endsWith(".uoc.gr")) {
            emailErrorMessage.style.display = 'block';
            emailErrorMessage.innerHTML   = "wrong domain.Do you mean .uoc.gr ?";
            emailErrorMessage.style.color = "red";
            return false;
        }
    } else if (universityTuc.checked) {
        if(!email.value.endsWith(".tuc.gr")){
            emailErrorMessage.style.display = 'block';
            emailErrorMessage.innerHTML   = "wrong domain.Do you mean .tuc.gr ?";
            emailErrorMessage.style.color = "red";
            return false;
        }
    } else if (universityHelmepa.checked) {
        if(!email.value.endsWith(".helmepa.gr")){
            emailErrorMessage.style.display = 'block';
            emailErrorMessage.innerHTML   = "wrong domain.Do you mean .helmepa.gr ?";
            emailErrorMessage.style.color = "red";
            return false;
        }
    }

    return true;
}

function isCardExpiredDateValid() {
    startDate          = Date.parse(document.getElementById("student_card_start_date").value);
    expireDate         = Date.parse(document.getElementById("student_card_end_date").value);
    expiredDateMessage = document.getElementById("invalidCardExpiredDateMessage");

    if(startDate > expireDate) {
        expiredDateMessage.innerHTML   = "Expired date must be after the start date!";
        expiredDateMessage.style.color = "red";
        expiredDateMessage.style.display = "block";

        return false;
    }
    return true;
}

function checkStudentCardYearsActive() {
    startDate          = new Date(document.getElementById("student_card_start_date").value);
    expireDate         = new Date(document.getElementById("student_card_end_date").value);
    activeYearsMessage = document.getElementById("invalidYearsActiveMessage");

    postgraduate = document.getElementById("student_type_postgraduate");
    graduate     = document.getElementById("student_type_graduate");
    postDoc      = document.getElementById("student_type_doc");

    if(postgraduate.checked) {
        if(expireDate.getFullYear()-6 > startDate.getFullYear()) {
            expiredDateMessage.innerHTML   = "time-limit for postgraduate students is 6 years!";
            expiredDateMessage.style.color = "red";
            expiredDateMessage.style.display = "block";

            return false;
        }

    } else if(graduate.checked) {
        if(expireDate.getFullYear()-2 > startDate.getFullYear()) {
            expiredDateMessage.innerHTML   = "time-limit for graduate students is 2 years!";
            expiredDateMessage.style.color = "red";
            expiredDateMessage.style.display = "block";

            return false;
        }

    } else if(postDoc.checked) {
        if(expireDate.getFullYear()-5 > startDate.getFullYear()) {
            expiredDateMessage.innerHTML   = "time-limit for doc students is 5 years!";
            expiredDateMessage.style.color = "red";
            expiredDateMessage.style.display = "block";

            return false;
        }
    }

    return true;
}

function isPolicyCheckboxChecked() {
    policyCheckboxErrorMessage = document.getElementById("checkbocErrorMessage");
    policyCheckbox             = document.getElementById("policyCheckbox");

    if(!policyCheckbox.checked) {
        policyCheckboxErrorMessage.innerHTML = "Πρέπει να δεχτείτε τους όρους για να συνεχίσετε";
        policyCheckboxErrorMessage.style.color = "red";
        policyCheckboxErrorMessage.style.display = "block";
        return false;
    }

    return true;
}

function cleanPreviousErrorMessages() {
    emailErrorMessage               = document.getElementById("invalidUniversityEmailMessage");
    emailErrorMessage.innerHTML     = "";
    emailErrorMessage.style.display = 'none';

    expiredDateMessage = document.getElementById("invalidCardExpiredDateMessage");
    expiredDateMessage.innerHTML = "";
    expiredDateMessage.style.display = "none";

    activeYearsMessage = document.getElementById("invalidYearsActiveMessage");
    activeYearsMessage.innerHTML = "";
    activeYearsMessage.style.display = "none";

    policyCheckboxErrorMessage = document.getElementById("checkbocErrorMessage");
    policyCheckboxErrorMessage.innerHTML = "";
    policyCheckboxErrorMessage.style.display = "none";  

    message = document.getElementById("addressValidationMessage");
    message.innerHTML = "";
    message.style.display = "none";

    usernameErrorMessage               = document.getElementById("invalidUsernameMessage");
    usernameErrorMessage.innerHTML     = "";
    usernameErrorMessage.style.display = 'none';
}

function setHomeAddress2LibraryAddress() {
    address = document.getElementById("addressLabel");
    address.innerHTML = "Διεύθυνση Βιβλιοθήκης";
}

function setLibraryAddress2setHomeAddress() {
    address = document.getElementById("addressLabel");
    address.innerHTML = "Διεύθυνση Οικίας";
}

function showLibraryNameField() {
    libraryName = document.getElementById("libraryName");

    libraryName.style.display = "block";
}

function hideLibraryNameField() {
    libraryName = document.getElementById("libraryName");

    libraryName.style.display = "none";
}

function showLibraryInfo() {
    libraryInfo = document.getElementById("libraryInfo");

    libraryInfo.style.display = "block";
}

function hideLibraryInfo() {
    libraryInfo = document.getElementById("libraryInfo");

    libraryInfo.style.display = "none";
}

function removeStudentRequiredAtributed() {
    academicIdInput = document.getElementById("academicIdInput");
    academicIdInput.removeAttribute("required");

    departmentNameInput = document.getElementById("departmentNameInput");
    departmentNameInput.removeAttribute("required");
}

function addStudentRequiredAtributed() {
    academicIdInput = document.getElementById("academicIdInput");
    academicIdInput.setAttribute("required", "");

    departmentNameInput = document.getElementById("departmentNameInput");
    departmentNameInput.setAttribute("required", "");
}

function removeLibrarianRequiredAttributes() {
    libraryNameInput = document.getElementById("libraryNameInput");
    libraryInfoInput = document.getElementById("libraryInfoInput");

    libraryNameInput.removeAttribute("required");
    libraryInfoInput.removeAttribute("required");

}

function addLibrarianRequiredAttributes() {
    libraryNameInput = document.getElementById("libraryNameInput");
    libraryInfoInput = document.getElementById("libraryInfoInput");

    libraryNameInput.setAttribute("required", "");
    libraryInfoInput.setAttribute("required", "");
}

function validateAddress() {
    //TODO check CORS
    var addressName = document.getElementById("inputAddressName").value;
    var number      = document.getElementById("inputAddressNumber").value;
    var street      = addressName + " " + number;
    var postalCode  = document.getElementById("inputAddressPostalCode").value;
    var city        = document.getElementById("inputCity").value;
    var country     = document.getElementById("country").value;

    message = document.getElementById("addressValidationMessage");
    message.innerHTML = "";
    message.style.display = "none";

    const data = null;

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (xhr.readyState === xhr.DONE) {
            const response = JSON.parse(xhr.responseText);

            console.log(this.responseText);

            message.style.display = "block";
            if(Object.keys(response).length === 0) {
                message.style.color   = "red";
                message.innerHTML     = "validation failed: location doesn't exists!";
            } else {
                if(response[0]["display_name"].includes("Crete")) {
                    message.style.color   = "green";
                    message.innerHTML     = "validation succeded";
                    lat = response[0]["lat"];
                    lon = response[0]["lon"];
                    clearMapMarkers();
                    setMarkerOnPosition(lat, lon);
                } else {
                    message.style.color   = "red";
                    message.innerHTML     = "Currently, the service is available only for Crete";
                }
            }
        }
    });

    xhr.open("GET", "https://forward-reverse-geocoding.p.rapidapi.com/v1/forward?street="+street+"&city="+city+"&county="+country+"&postalcode="+postalCode+"&accept-language=en&polygon_threshold=0.0");
    xhr.setRequestHeader("X-RapidAPI-Key", "65ce0ddb4emsh65f5478af26d81bp196590jsn409e84a87d0e");
    xhr.setRequestHeader("X-RapidAPI-Host", "forward-reverse-geocoding.p.rapidapi.com");
    //xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhr.send(data);
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

function setMarkerOnPosition(lat, lon) {
    map.addLayer(markers);
    
    var position = setPosition(lat, lon);
    var mark     = new OpenLayers.Marker(position);
    
    markers.addMarker(mark);
    mark.events.register('mousedown', mark, function(evt) { handler(position,'Your home address'); } );
    
    setMapZoom(position, 14);
}

function setMapZoom(position, zoom) {
    map.setCenter(position, zoom);
}

function handler(position, message){
    var popup = new OpenLayers.Popup.FramedCloud("Popup", position, null, message, null, true);
    map.addPopup(popup);
}