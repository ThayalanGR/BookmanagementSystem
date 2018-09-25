function _$(elementId) {
    return document.getElementById(elementId)
}



//main header and container reference

const mainHeadingRef = _$("main-heading")
const mainContentRef = _$("main-content")
const unameContainerRef = _$("uname-container")



// alert notification container // modal
const notifyRef = _$("notify")
const notifyContentRef = _$("notifyContent")

const logoutRef = _$("logout")



///firebase initialisation
var config = {
    apiKey: "AIzaSyCCcNJtYhXmDKzYqPR_UnrnVGSa2n1hPMU",
    authDomain: "bookmanagementsystem-46d5d.firebaseapp.com",
    databaseURL: "https://bookmanagementsystem-46d5d.firebaseio.com",
    projectId: "bookmanagementsystem-46d5d",
    storageBucket: "bookmanagementsystem-46d5d.appspot.com",
    messagingSenderId: "95314198753"
}

firebase.initializeApp(config)
var user = firebase.auth().currentUser

// Get a reference to the database service
var database = firebase.database()



//login validation section
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        name = user.displayName
        email = user.email
        photoUrl = user.photoURL
        emailVerified = user.emailVerified
        console.log(emailVerified)
        if (user) {
            // User is signed in.
            name = user.displayName
            email = user.email
            photoUrl = user.photoURL
            userId = user.uid
            emailVerified = user.emailVerified
            console.log(emailVerified)
            if (emailVerified == true && email != "suhailtry@yahoo.com") {
                notifyContentRef.innerHTML = `<div class="alert alert-success">Loging you in</div>`
                $('#notify').modal("show")
                window.location.href = '../../user/home/'
            } else if (emailVerified == true && email == "suhailtry@yahoo.com") {
                // notifyContentRef.innerHTML = `<div class="alert alert-success">Loging you in</div>`
                // $('#notify').modal("show")
                // window.location.href = 'http://localhost/book/admin/home/'
                firebase.database().ref('/users/' + userId).once('value').then(function (snapshot) {
                    var username = (snapshot.val() && snapshot.val().username) || 'Anonymous'
                    // ...
                    unameContainerRef.innerHTML = username
                    localStorage.setItem("userName", username)
                })
                manageUsersHandler()
                collectionCountHandler()

            } else {
                // notifyContentRef.innerHTML = `<div class="alert alert-danger">please verify your email address.</div>`
                // $('#notify').modal("show")
                window.location.href = '../../'


            }
        } else {
            // No user is signed in.
            window.location.href = '../../'

        }
    } else {
        // No user is signed in.
        window.location.href = '../../'

    }
})




//logout section
logoutRef.addEventListener("click", function logout() {
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
        window.location.href = 'http://localhost/book/index.html'
        console.log("logout success")
    }).catch(function (error) {
        // An error happened.
        notifyContentRef.innerHTML = `<div class="alert alert-danger">${error}</div>`
        $('#notify').modal("show")
    });
})





//manage-users
const manageUsersRef = _$("manage-users")
manageUsersRef.addEventListener("click", manageUsersHandler)



// book-history
const bookHistoryRef = _$("book-history")
bookHistoryRef.addEventListener("click", bookHistoryHandler)

// add-book
const addBookRef = _$("add-book")
addBookRef.addEventListener("click", addBookHandler)



// all-books
const allBooksRef = _$("all-books")
allBooksRef.addEventListener("click", allBooksHandler)


// edit-profile
const requestedBookRef = _$("requested-book")
requestedBookRef.addEventListener("click", requestedBookHandler)



////collection count setter

function collectionCountHandler() {

    const collectionCountRef = _$("collection-count")

    firebase.database().ref('/requestbook/').once('value').then(function (snapshotinside) {
        let arrCollection = []

        snapshotinside.forEach(function (childSnapshotinside) {
            console.log(childSnapshotinside.key)
            arrCollection.push(childSnapshotinside.key)
        })

    collectionCountRef.innerHTML = arrCollection.length

    })

}





//request handler

function requestedBookHandler() {
    mainContentRef.innerHTML = ``

    mainHeadingRef.innerHTML = `<div class="text-Primary font-weight-bold h4 mt-2 mb-0">Manage Users</div>
                                <br>
                                <div class="row text-primary font-weight-bold">
                                    <div class="col-1">S.no</div>
                                    <div class="col-3">Bookname</div>
                                    <div class="col-1">AuthorName</div>
                                    <div class="col-4">category</div>
                                    <div class="col-3">Requested by</div>
                                </div>
    `
    firebase.database().ref('/requestbook/').once('value').then(function (snapshot) {
        // var username = (snapshot.val() && snapshot.val().username) || 'Anonymous'
        console.log(snapshot)
        let count = 1
        let output = ``
        snapshot.forEach(function (childSnapshot) {
            var childData = childSnapshot.val();;
            console.log(childSnapshot.val())
            output = `<div class="row text-success">
                        <div class="col-1">${count} .</div>
                        <div class="col-3">${childSnapshot.val().authorname}</div>
                        <div class="col-1">${childSnapshot.val().bookcategory}</div>
                        <div class="col-4">${childSnapshot.val().bookname}</div>
                        <div class="col-3">${childSnapshot.val().requestedby}</div>
                      </div> <hr>`
            mainContentRef.innerHTML += output
            count++
        })

    })


}





//all handlers goes under here

function manageUsersHandler() {

    mainContentRef.innerHTML = ``

    mainHeadingRef.innerHTML = `<div class="text-Primary font-weight-bold h4 mt-2 mb-0">Manage Users</div>
                                <br>
                                <div class="row text-primary font-weight-bold">
                                    <div class="col-1">S.no</div>
                                    <div class="col-3">Username</div>
                                    <div class="col-1">Gender</div>
                                    <div class="col-4">Email</div>
                                    <div class="col-3">Mobile</div>
                                </div>
    `
    firebase.database().ref('/users/').once('value').then(function (snapshot) {
        // var username = (snapshot.val() && snapshot.val().username) || 'Anonymous'
        console.log(snapshot)
        let count = 1
        let output = ``
        snapshot.forEach(function (childSnapshot) {
            var childData = childSnapshot.val();;
            console.log(childSnapshot.val())
            output = `<div class="row text-success">
                        <div class="col-1">${count} .</div>
                        <div class="col-3">${childSnapshot.val().username}</div>
                        <div class="col-1">${childSnapshot.val().gender}</div>
                        <div class="col-4">${childSnapshot.val().email}</div>
                        <div class="col-3">${childSnapshot.val().mobile}</div>
                      </div> <hr>`
            mainContentRef.innerHTML += output
            count++
        })

    })

}



function bookHistoryHandler() {
    mainContentRef.innerHTML = ``

    mainHeadingRef.innerHTML = `<div class="text-Primary font-weight-bold h4 mt-2 mb-0">Book History</div>
                                <br>
                                <div class="row text-primary font-weight-bold">
                                    <div class="col-1"> s.no</div>
                                    <div class="col-3">UserName</div>
                                    <div class="col-4">BookName</div>
                                    <div class="col-4">AuthorName</div>
                                </div>`
    firebase.database().ref('/bookhistory/').once('value').then(function (snapshot) {
        // var username = (snapshot.val() && snapshot.val().username) || 'Anonymous'
        console.log(snapshot)
        let count = 1

        snapshot.forEach(function (childSnapshot) {


            console.log(childSnapshot.key)

            childSnapshot.forEach(function (childSnapshotinside) {
                var childData = childSnapshotinside.key
                let output = `<div class="row text-success">
                                    <div class="col-1"> ${count} </div>
                                    <div class="col-3" id="user-${childData}-${snapshot}">#</div>
                                    <div class="col-4" id="book-${childData}-${snapshot}">#</div>
                                    <div class="col-4" id="author-${childData}-${snapshot}">#</div>
                                </div> <hr>
                                `
                mainContentRef.innerHTML += output
                firebase.database().ref('/users/' + childSnapshot.key).once('value').then((snapshot) => {
                    console.log(snapshot.val().username)
                    _$(`user-${childData}-${snapshot}`).innerHTML = snapshot.val().username 
                })
                firebase.database().ref('/books/' + childData).once('value').then((snapshot) => {
                    console.log(snapshot.val().authorname)
                    _$(`book-${childData}-${snapshot}`).innerHTML = snapshot.val().bookname
                    _$(`author-${childData}-${snapshot}`).innerHTML = snapshot.val().authorname
                })
                count++

            })
        })

    })



}




//add books handler

function addBookHandler() {


    mainHeadingRef.innerHTML = `<div class="text-Primary font-weight-bold h4 mt-2 mb-0">Add Books</div>`

    let output = `<form onsubmit="return false;" id="add-book-form">
                <div class="row text-success">
                    <div class="col-6">
                        <label for="book-name">Book Name</label>
                        <input type="text" name="book-name" placeholder="eg:- Lord of Rings" class="form-control" required>
                    </div>
                    <div class="col-6">
                        <label for="author-name">Author Name</label>
                        <input type="text" name="author-name" placeholder="eg:- J. R. R. Tolkien" class="form-control" required>
                    </div>
                </div>
                <div class="row text-success">
                <div class="col-6">
                    <label for="book-category">Book category</label>
                    <select name="book-category" class="form-control" required>
                        <option>Science-fiction</option>
                        <option>Satire</option>
                        <option>Drama</option>
                        <option>Action and Adventure</option>
                        <option>Romance</option>
                        <option>Mystery</option>
                        <option>Horror</option>
                        <option>Self help</option>
                        <option>Health</option>
                        <option>Guide</option>
                        <option>Travel</option>
                        <option>Children's</option>
                        <option>Religion, Spirituality & New Age</option>
                        <option>Science</option>
                        <option>History</option>
                        <option>Math</option>
                        <option>Anthology</option>
                        <option>Poetry</option>
                        <option>Encyclopedias</option>
                        <option>Dictionaries</option>
                        <option>Comics</option>
                        <option>Art</option>
                        <option>Cookbooks</option>
                        <option>Diaries</option>
                        <option>Journals</option>
                        <option>Prayer books</option>
                        <option>Series</option>
                        <option>Trilogy</option>
                        <option>Biographies</option>
                        <option>Autobiographies</option>
                        <option>Fantasy</option>
                    </select>
                </div>
                <div class="col-6">
                    <label for="book-count">Book Count</label>
                    <input type="number" name="book-count" placeholder="eg:- 10" class="form-control" required>
                </div>

            </div>

            <div class="row text-priamry" >
                <div class="col">
                    <label for="book-description" class="text-success">Book Description</label>
                    <textarea type="text" placeholder="eg:- The Lord of the Rings is a film series consisting of three fantasy adventure films directed by Peter Jackson. They are based on the novel The Lord of the Rings ...."  name="book-description" class="form-control" rows="3" required></textarea>
                </div>
            </div>
            <div class="row text-priamry" >
                <div class="col">
                    <label for="book-image" class="text-success">Book Image Url</label>
                    <input type="text" placeholder="eg:- https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_.jpg"  name="book-image" class="form-control"  required>
                </div>
            </div>
            <div class="row text-center p-4" >
                <div class="col">
                    <input type="submit" class="btn btn-success text-white" id="submit-button" required>
                </div>
            </div>
            

            </form>
                `

    mainContentRef.innerHTML = output


    const addBookFormRef = _$("add-book-form")

    addBookFormRef.addEventListener("submit", event => {
        console.log(event)
        event.preventDefault()
        let bookName = event.target.elements[0].value
        let authorName = event.target.elements[1].value
        let bookCategory = event.target.elements[2].value
        let bookCount = event.target.elements[3].value
        let bookDescription = event.target.elements[4].value
        let bookImageUrl = event.target.elements[5].value

        console.log(bookName, authorName, bookCategory, bookCount, bookDescription)
        // Generate a reference to a new location and add some data using push()

        var postsRef = firebase.database().ref("books");

        var newPostRef = postsRef.push({
            author: authorName,
            title: bookName
        });


        // Get the unique ID generated by push() by accessing its key
        var postID = newPostRef.key;

        firebase.database().ref('books/' + postID).set({
            bookname: bookName,
            authorname: authorName,
            bookcategory: bookCategory,
            bookcount: bookCount,
            bookdescription: bookDescription,
            bookimageurl: bookImageUrl
        }, function (error) {
            if (error) {
                // The write failed...
                notifyContentRef.innerHTML = `<div class="alert alert-danger text-center">Something went Wrong.. ${error}</div>`
                // notifyRef.modal("show")
                $('#notify').modal("show")
                setTimeout(function () {
                    notifyContentRef.innerHTML = ``
                    // notifyRef.modal("hide")
                    $('#notify').modal("hide")

                }, 3000)
            } else {
                // Data saved successfully!
                notifyContentRef.innerHTML = `<div class="alert alert-success text-center">Book has been added sucessfully</div>`
                // notifyRef.modal("show")
                $('#notify').modal("show")

                setTimeout(function () {
                    notifyContentRef.innerHTML = ``
                    // notifyRef.modal("hide")
                    $('#notify').modal("hide")

                }, 3000)
            }
        })
    })

}


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
                            <button class="btn btn-danger" onclick="deleteBook('${childSnapshot.key}');">Delete</button>
                        </div>
                        <div class="col-4" >
                            <img src="${childSnapshot.val().bookimageurl}" style="max-height: 300px;" class="img-thumbnail img-fluid  rounded"><br>
                        </div>
                    </div> <hr>`

            mainContentRef.innerHTML += output
            count++
        })

    })

}


// /deleteBook function

function deleteBook(bookId) {
    console.log(bookId)
    const deleteRef = firebase.database().ref('books/' + bookId)
    // console.log(deleteRef)

    deleteRef.remove(function (error) {
        if (error) {
            // The write failed...
            notifyContentRef.innerHTML = `<div class="alert alert-danger text-center">Something went Wrong.. ${error}</div>`
            // notifyRef.modal("show")
            $('#notify').modal("show")
            setTimeout(function () {
                notifyContentRef.innerHTML = ``
                // notifyRef.modal("hide")
                $('#notify').modal("hide")
                allBooksHandler()
            }, 3000)
        } else {
            // Data saved successfully!
            notifyContentRef.innerHTML = `<div class="alert alert-success text-center">Book Deleted successfully</div>`
            // notifyRef.modal("show")
            $('#notify').modal("show")

            setTimeout(function () {
                notifyContentRef.innerHTML = ``
                // notifyRef.modal("hide")
                $('#notify').modal("hide")
                allBooksHandler()
            }, 3000)
        }
    })


}