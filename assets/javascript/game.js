// Initialize Firebase
var config = {
  apiKey: "AIzaSyCMp-r1e-q-6gfuaFNEqfbbh6Tze5DXTTc",
  authDomain: "rutgersrpsproject.firebaseapp.com",
  databaseURL: "https://rutgersrpsproject.firebaseio.com",
  projectId: "rutgersrpsproject",
  storageBucket: "rutgersrpsproject.appspot.com",
  messagingSenderId: "367951233429"
};
firebase.initializeApp(config);

var database = firebase.database();

var user = firebase.auth().currentUser;
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    $("#welcome").html("Logged in successfully");
    $(".loginRemove").addClass("d-none");
    $(".loginAdd").removeClass("d-none");
    $("#logoutBtn").removeClass("d-none");
  } else {
    // No user is signed in.
    $("#welcome").html("Sign In or Register to Play!");
    $(".loginRemove").removeClass("d-none");
    $(".loginAdd").addClass("d-none");
    $("#logoutBtn").addClass("d-none");
  }
});

$(document).ready(function(){

var user = false;
var signinOpen = false;
var registerOpen = false;
var displayName;

$("#signin").on("click", function() {
  if (registerOpen == false) {
  $("#signinArea").slideToggle();
  signinOpen ^= true;
  }
})

$("#register").on("click", function() {
  if (signinOpen == false) {
  $("#registerArea").slideToggle();
  registerOpen ^= true;
  }
})

$("#signinBtn").on("click", signIn);
$("#registerBtn").on("click", register);
$("#logoutBtn").on("click", logout);
$("#usernameUpdateBtn").on("click", updateUser);
})

function signIn() {
  email = $("#signinEmail").val().trim();
  password = $("#signinPassword").val().trim();
  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error){
    var errorCode = error.code;
    var errorMessage = error.message;
    if (errorCode == "auth/invalid-email") {
      alert("Invalid Email");
    }
    if (errorCode == "auth/user-not-found") {
      alert("Username Not Found");
    }
    if (errorCode == "auth/wrong-password") {
      alert("Incorrect Password");
    } else {
      alert(errorMessage);
    }
  })
}

function register() {
  email = $("#registerEmail").val().trim();
  password = $("#registerPassword").val().trim();
  firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    if (errorCode == "auth/email-already-in-use") {
      alert("Email already in use");
    }
    if (errorCode == "auth/invalid-email") {
      alert("This does not appear to be a valid email address");
    } else {
      alert(errorMessage);
    }
    console.log(error);
  })
}

function updateUser() {
  var user = firebase.auth().currentUser;
  newName = $("#usernameUpdate").val().trim();
  user.updateProfile({
    displayName: newName
  }).then(function() {
    $("#welcome").html("Logged in successfully as " + newName);
  })
}

function logout() {
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
  }).catch(function(error) {
    // An error happened.
  });
}
