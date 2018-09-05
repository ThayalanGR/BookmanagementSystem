//firebase initialisation


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



// alert(0)
const notifyRef = document.getElementById('notify')
const notifyContentRef = document.getElementById('notifyContent')
const regFormRef = document.getElementById('regForm')
const logFormRef = document.getElementById('logForm')
regFormRef.addEventListener('submit', (event) => {
    event.preventDefault()
    // console.log("success")
    let name = event.target.elements["name"].value
    let email = event.target.elements["email"].value
    let mobile = event.target.elements["mobile"].value
    let password = event.target.elements["password"].value
    let gender = event.target.elements["gender"].value
    console.log(name, email, mobile, password, gender)
    if(name != '' && email != '' && mobile.length >=10 && password != '') {
        console.log("passed")
        firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code
        var errorMessage = error.message
        notifyContentRef.innerHTML = `<div class="alert alert-danger">${errorMessage}</div>`
        $('#notify').modal("show")
        })
        notifyContentRef.innerHTML = `<div class="alert alert-success">Registration Success! please verify your email address</div>`
        $('#notify').modal("show")
        var user = firebase.auth().currentUser
        user.sendEmailVerification().then(function() {
                console.log("email sent")
        }).catch(function(error) {
        // An error happened.
            notifyContentRef.innerHTML = `<div class="alert alert-success">${error}</div>`
            $('#notify').modal("show")

        })

    }else { 
        console.log("failed")
        notifyContentRef.innerHTML = `<div class="alert alert-danger">please fill all the fields with correct values</div>`
        $('#notify').modal("show")
    }
})


logFormRef.addEventListener('submit', (event) => {
    event.preventDefault()
    // console.log("success")
    let email = event.target.elements["email"].value
    let password = event.target.elements["password"].value
    console.log(email, password)
    if(email != '' && password != '') {
        console.log("passed")
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code
            var errorMessage = error.message
            notifyContentRef.innerHTML = `<div class="alert alert-danger">${errorMessage}</div>`
            $('#notify').modal("show")
        })
       var user = firebase.auth().currentUser

        if(user != null) {
            name = user.displayName
            email = user.email
            photoUrl = user.photoURL
            emailVerified = user.emailVerified
            
            console.log(emailVerified)
            if(emailVerified == true) {
                notifyContentRef.innerHTML = `<div class="alert alert-success">Login Success</div>`
                $('#notify').modal("show")
            }
             else {
                notifyContentRef.innerHTML = `<div class="alert alert-danger">please verify your email address.</div>`
               $('#notify').modal("show")

           }

    }
    
    } else { 
        console.log("failed")
        notifyContentRef.innerHTML = `<div class="alert alert-danger">please fill the login fields</div>`
        $('#notify').modal("show")
    }
})