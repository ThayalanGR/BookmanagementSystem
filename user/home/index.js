function _$(elementId) {
    return document.getElementById(elementId)
}


// alert(0)
const notifyRef = _$('notify')
const notifyContentRef = _$('notifyContent')
const logoutRef = _$('logout')



//main header and container reference

const mainHeadingRef = _$("main-heading")
const mainContentRef = _$("main-content")
const unameContainerRef = _$("uname-container")


///firebase initialisation


// Initialize Firebase
var config = {
    apiKey: "AIzaSyCCcNJtYhXmDKzYqPR_UnrnVGSa2n1hPMU",
    authDomain: "bookmanagementsystem-46d5d.firebaseapp.com",
    databaseURL: "https://bookmanagementsystem-46d5d.firebaseio.com",
    projectId: "bookmanagementsystem-46d5d",
    storageBucket: "bookmanagementsystem-46d5d.appspot.com",
    messagingSenderId: "95314198753"
};
firebase.initializeApp(config);
// Get a reference to the database service
var database = firebase.database();

var user = firebase.auth().currentUser
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        name = user.displayName
        email = user.email
        photoUrl = user.photoURL
        emailVerified = user.emailVerified
        userId = user.uid
        console.log(emailVerified)
        if (emailVerified == true && email != "suhailtry@yahoo.com") {
            // notifyContentRef.innerHTML = `<div class="alert alert-success">Loging you in</div>`
            // $('#notify').modal("show")
            // window.location.href = 'http://localhost/book/user/home/'

            firebase.database().ref('/users/' + userId).once('value').then(function (snapshot) {
                var username = (snapshot.val() && snapshot.val().username) || 'Anonymous'
                // ...
                unameContainerRef.innerHTML = username
            })
            allBooksHandler()
        } else if (emailVerified == true && email == "suhailtry@yahoo.com") {
            notifyContentRef.innerHTML = `<div class="alert alert-success">Loging you in</div>`
            $('#notify').modal("show")
            window.location.href = 'http://localhost/book/admin/home/'
        } else {
            // notifyContentRef.innerHTML = `<div class="alert alert-danger">please verify your email address.</div>`
            // $('#notify').modal("show")
            window.location.href = 'http://localhost/book/'


        }
    } else {
        // No user is signed in.
        window.location.href = 'http://localhost/book/'

    }
});




logoutRef.addEventListener("click", function logout() {
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
        window.location.href = 'http://localhost/book/'
        console.log("logout success")
    }).catch(function (error) {
        // An error happened.
        notifyContentRef.innerHTML = `<div class="alert alert-danger">${error}</div>`
        $('#notify').modal("show")
    });
})





// all content goes under here

function allBooksHandler() {



    mainHeadingRef.innerHTML = `<div class="text-Primary font-weight-bold h4 mt-2 mb-0">All Books</div>`
    firebase.database().ref('/books/').once('value').then(function (snapshot) {
        // var username = (snapshot.val() && snapshot.val().username) || 'Anonymous'
        console.log(snapshot)
        let count = 1
        let output = ``
        mainContentRef.innerHTML = ``
        // console.log()
        snapshot.forEach(function (childSnapshot) {
            console.log(childSnapshot.val())
            output = `<div class="row text-success">
                        <div class="col-1 font-weight-bold text-danger">${count} .</div>
                        <div class="col-7 text-left" style="overflow-wrap:break-word;">
                            <span class="text-primary font-weight-bold">Book Name:</span>${childSnapshot.val().bookname}<br>
                            <span class="text-primary font-weight-bold">Author Name:</span>${childSnapshot.val().authorname}<br>
                            <span class="text-primary font-weight-bold">Category:</span> ${childSnapshot.val().bookcategory}<br>
                            <span class="text-primary font-weight-bold">Quantity:</span> ${childSnapshot.val().bookcount}<br>
                            <span class="text-primary font-weight-bold">Description:</span> ${childSnapshot.val().bookdescription}<br>
                            <span class="text-primary font-weight-bold">ImageUrl:</span> ${childSnapshot.val().bookimageurl} <br>
                            <button class="btn btn-primary mt-2" onclick="addToCollection('${childSnapshot.key}');">Add to Collection</button>
                        </div>
                        <div class="col-4" >
                            <img src="${childSnapshot.val().bookimageurl}" style="max-height: 300px; " class="img-thumbnail img-fluid  rounded"><br>
                        </div>
                    </div> <hr>`

            mainContentRef.innerHTML += output
            count++
        })

    })

}



function addToCollection(bookId) {
    console.log(bookId)
}