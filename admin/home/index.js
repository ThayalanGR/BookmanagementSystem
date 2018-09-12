
// alert(0)
const notifyRef = document.getElementById('notify')
const notifyContentRef = document.getElementById('notifyContent')
const logoutRef = document.getElementById('logout')

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
    var user = firebase.auth().currentUser
firebase.auth().onAuthStateChanged(function(user) {
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
        emailVerified = user.emailVerified 
        console.log(emailVerified)
        if(emailVerified == true && email != "suhailtry@yahoo.com") {
            notifyContentRef.innerHTML = `<div class="alert alert-success">Loging you in</div>`
            $('#notify').modal("show")
            window.location.href = 'http://80-hammerdottedcougar.cdr.co/book/user/home/'
        }
        else if(emailVerified == true && email == "suhailtry@yahoo.com") {
            // notifyContentRef.innerHTML = `<div class="alert alert-success">Loging you in</div>`
            // $('#notify').modal("show")
            // window.location.href = 'http://80-hammerdottedcougar.cdr.co/book/admin/home/'
        }
        else {
        // notifyContentRef.innerHTML = `<div class="alert alert-danger">please verify your email address.</div>`
        // $('#notify').modal("show")
            window.location.href = 'http://80-hammerdottedcougar.cdr.co/book/'            
        

        }
  } else {
    // No user is signed in.
        window.location.href = 'http://80-hammerdottedcougar.cdr.co/book/'            
    
  }
  } else {
    // No user is signed in.
        window.location.href = 'http://80-hammerdottedcougar.cdr.co/book/'            
    
  }
});




logoutRef.addEventListener("click", function logout() {
    firebase.auth().signOut().then(function() {
    // Sign-out successful.
    window.location.href = 'http://80-hammerdottedcougar.cdr.co/book/index.html'
    console.log("logout success")
    }).catch(function(error) {
    // An error happened.
        notifyContentRef.innerHTML = `<div class="alert alert-danger">${error}</div>`
        $('#notify').modal("show")
    });
} )

