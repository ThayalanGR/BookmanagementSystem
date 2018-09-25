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
firebase.initializeApp(config)
// Get a reference to the database service
var database = firebase.database()

var user = firebase.auth().currentUser
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        name = user.displayName
        email = user.email
        photoUrl = user.photoURL
        emailVerified = user.emailVerified
        userId = user.uid
        localStorage.setItem("userId", userId)
        console.log(emailVerified)
        if (emailVerified == true && email != "suhailtry@yahoo.com") {
            // notifyContentRef.innerHTML = `<div class="alert alert-success">Loging you in</div>`
            // $('#notify').modal("show")
            // window.location.href = 'http://localhost/book/user/home/'

            firebase.database().ref('/users/' + userId).once('value').then(function (snapshot) {
                var username = (snapshot.val() && snapshot.val().username) || 'Anonymous'
                // ...
                unameContainerRef.innerHTML = username
                localStorage.setItem("userName", username)

            })
            allBooksHandler()
            collectionCountHandler()
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


const allBooksRef = _$("all-books")

allBooksRef.addEventListener("click", allBooksHandler)



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
        firebase.database().ref('/bookhistory/' + localStorage.getItem("userId")).once('value').then(function (snapshotinside) {
            let arrCollection = []

            snapshotinside.forEach(function (childSnapshotinside) {
                console.log(childSnapshotinside.key)
                arrCollection.push(childSnapshotinside.key)
            })

            console.log(arrCollection)
            snapshot.forEach(function (childSnapshot) {
                // console.log(childSnapshot.val())
                const bookKey = arrCollection.includes(childSnapshot.key)
                const decideString = bookKey ? "disabled" : ""
                const decideString2 = bookKey ? "Added to Collection" : "Add to Collection"

                console.log(bookKey)
                console.log(decideString)
                console.log(childSnapshot.key)
                output = `<div class="row text-success">
                            <div class="col-1 font-weight-bold text-danger">${count} .</div>
                            <div class="col-7 text-left" style="overflow-wrap:break-word;">
                                <span class="text-primary font-weight-bold">Book Name:</span>${childSnapshot.val().bookname}<br>
                                <span class="text-primary font-weight-bold">Author Name:</span>${childSnapshot.val().authorname}<br>
                                <span class="text-primary font-weight-bold">Category:</span> ${childSnapshot.val().bookcategory}<br>
                                <span class="text-primary font-weight-bold">Quantity:</span> ${childSnapshot.val().bookcount}<br>
                                <span class="text-primary font-weight-bold">Description:</span> ${childSnapshot.val().bookdescription}<br>
                                <span class="text-primary font-weight-bold">ImageUrl:</span> ${childSnapshot.val().bookimageurl} <br>
                                <button class="btn btn-primary mt-2 " ${decideString} id="collection-${childSnapshot.key}" onclick="addToCollection('${childSnapshot.key}');">${decideString2}</button>
                            </div>
                            <div class="col-4" >
                                <img src="${childSnapshot.val().bookimageurl}" style="max-height: 300px; " class="img-thumbnail img-fluid  rounded"><br>
                            </div>
                        </div> <hr>`

                mainContentRef.innerHTML += output
                count++
            })


        })



    })

}



function addToCollection(bookId) {
    console.log(bookId)
    const collectionButtonRef = _$(`collection-${bookId}`)
    collectionButtonRef.classList.add("disabled")
    // var attr = document.createAttribute("disabled")
    // attr.value = "disabled"
    collectionButtonRef.setAttribute("disabled", "disabled")
    collectionButtonRef.innerHTML = `Added to Collection`
    const userId = localStorage.getItem("userId")
    // var postsRef = firebase.database().ref("books");
    // var newPostRef = postsRef.push({
    //     bookid: bookId
    // });


    // // Get the unique ID generated by push() by accessing its key
    // var postID = newPostRef.key;

    firebase.database().ref("bookhistory/" + userId + "/" + bookId).set({
            status: true
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
                collectionCountHandler()

                setTimeout(function () {
                    notifyContentRef.innerHTML = ``
                    // notifyRef.modal("hide")
                    $('#notify').modal("hide")

                }, 3000)
            }
        }

    )


}








//my collection

const myCollectionRef = _$("my-collection")

myCollectionRef.addEventListener("click", myCollection)



function myCollection() {
    mainHeadingRef.innerHTML = `<div class="text-Primary font-weight-bold h4 mt-2 mb-0">My Collection</div>`
    firebase.database().ref('/books/').once('value').then(function (snapshot) {
        // var username = (snapshot.val() && snapshot.val().username) || 'Anonymous'
        console.log(snapshot)
        let count = 1
        let output = ``
        mainContentRef.innerHTML = ``
        // console.log()
        firebase.database().ref('/bookhistory/' + localStorage.getItem("userId")).once('value').then(function (snapshotinside) {
            let arrCollection = []

            snapshotinside.forEach(function (childSnapshotinside) {
                console.log(childSnapshotinside.key)
                arrCollection.push(childSnapshotinside.key)
            })

            console.log(arrCollection)
            snapshot.forEach(function (childSnapshot) {
                // console.log(childSnapshot.val())
                const bookKey = arrCollection.includes(childSnapshot.key)
                // const decideString = bookKey ? "disabled" : ""
                console.log(bookKey)


                // console.log(decideString)
                // console.log(childSnapshot.key)

                if (bookKey) {
                    output = `<div class="row text-success">
                                                <div class="col-1 font-weight-bold text-danger">${count} .</div>
                                                <div class="col-7 text-left" style="overflow-wrap:break-word;">
                                                    <span class="text-primary font-weight-bold">Book Name:</span>${childSnapshot.val().bookname}<br>
                                                    <span class="text-primary font-weight-bold">Author Name:</span>${childSnapshot.val().authorname}<br>
                                                    <span class="text-primary font-weight-bold">Category:</span> ${childSnapshot.val().bookcategory}<br>
                                                    <span class="text-primary font-weight-bold">Description:</span> ${childSnapshot.val().bookdescription}<br>
                                                    <button class="btn btn-primary mt-2 " id="collection-${childSnapshot.key}" onclick="returnBook('${childSnapshot.key}');">Return Book</button>
                                                </div>
                                                <div class="col-4" >
                                                    <img src="${childSnapshot.val().bookimageurl}" style="max-height: 300px; " class="img-thumbnail img-fluid  rounded"><br>
                                                </div>
                                            </div> <hr>`

                    mainContentRef.innerHTML += output
                    count++

                }
            })
        })
    })
}


//return book function

function returnBook(bookKey) {

    console.log(bookKey)

    const deleteRef = firebase.database().ref('bookhistory/'+localStorage.getItem("userId")+'/'+bookKey)
    // console.log(deleteRef)

    deleteRef.remove(function(error) {
        if (error) {
            // The write failed...
            notifyContentRef.innerHTML = `<div class="alert alert-danger text-center">Something went Wrong.. ${error}</div>`
            // notifyRef.modal("show")
            $('#notify').modal("show")
            setTimeout(function () {
                notifyContentRef.innerHTML = ``
                // notifyRef.modal("hide")
                $('#notify').modal("hide")
                // allBooksHandler()
                myCollection()
                collectionCountHandler()

            }, 3000)
        } else {
            // Data saved successfully!
            notifyContentRef.innerHTML = `<div class="alert alert-success text-center">Book Returned successfully</div>`
            // notifyRef.modal("show")
            $('#notify').modal("show")
            myCollection()
            collectionCountHandler()            
            setTimeout(function () {
                notifyContentRef.innerHTML = ``
                // notifyRef.modal("hide")
                $('#notify').modal("hide")
                // allBooksHandler()
            }, 3000)
        }
    })



}




//collection count setter

function collectionCountHandler() {

    const collectionCountRef = _$("collection-count")
    firebase.database().ref('/bookhistory/' + localStorage.getItem("userId")).once('value').then(function (snapshotinside) {
        let arrCollection = []

        snapshotinside.forEach(function (childSnapshotinside) {
            console.log(childSnapshotinside.key)
            arrCollection.push(childSnapshotinside.key)
        })

    collectionCountRef.innerHTML = arrCollection.length

    })

}


//request book

const reqBookRef = _$("req-book")

reqBookRef.addEventListener("click", reqBookHandler)


function reqBookHandler() {
    
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
                <div class="col">
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
        let reqBy = localStorage.getItem("userName")
       

        console.log(bookName, authorName, bookCategory)
        // Generate a reference to a new location and add some data using push()

        var postsRef = firebase.database().ref("requestbook");

        var newPostRef = postsRef.push({
            author: authorName,
            title: bookName
        });


        // Get the unique ID generated by push() by accessing its key
        var postID = newPostRef.key;

        firebase.database().ref('requestbook/' + postID).set({
            bookname: bookName,
            authorname: authorName,
            bookcategory: bookCategory,
            requestedby: reqBy
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
                notifyContentRef.innerHTML = `<div class="alert alert-success text-center">Request placed we will update you soon..</div>`
                // notifyRef.modal("show")
                $('#notify').modal("show")
                addBookFormRef.reset()
                setTimeout(function () {
                    notifyContentRef.innerHTML = ``
                    // notifyRef.modal("hide")
                    $('#notify').modal("hide")

                }, 3000)
            }
        })
    })

}