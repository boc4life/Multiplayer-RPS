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
    console.log(user);
    $("#welcome").html("Logged in successfully. Please choose a display name to take a seat.");
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

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
  .then(function() {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  })
  .catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
  });

database.ref("activePlayers/").on("value", function(snapshot) {
  var snap = snapshot.val();
    if (snap.player1Btn == true) {
      player1Active = true;
      $("#player1Btn").addClass("d-none");
      $("#player1Name").html("<h3>" + snap.player1 + "</h3>");
      $("#player1RPS").removeClass("d-none");
    } else {
      player1Active = false;
      $("#player1Btn").removeClass("d-none");
      $("#player1Name").html("");
      $("#player1RPS").addClass("d-none");
    }
    if (snap.player2Btn == true) {
      player2Active = true;
      $("#player2Btn").addClass("d-none");
      $("#player2Name").html("<h3>" + snap.player2 + "</h3>")
      $("#player2RPS").removeClass("d-none");
    } else {
      player2Active = false;
      $("#player2Btn").removeClass("d-none");
      $("#player2Name").html("")
      $("#player2RPS").addClass("d-none");
    }
  })

var signinOpen = false;
var registerOpen = false;
var displayName;
var player1Active;
var player2Active;
var userIsPlayer1 = false;
var userIsPlayer2 = false;
var userDisplay;


$(document).ready(function(){

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
$("#player1Btn").on("click", player1Sit);
$("#player2Btn").on("click", player2Sit);
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
    $(".displayName").addClass("d-none");
    console.log(user);
  })
  return userDisplay = newName;
}

function logout() {
  firebase.auth().signOut().then(function() {
    if (userIsPlayer1) {
      database.ref("activePlayers").update({
        player1Btn: false,
        player1: ""
      })
      userIsPlayer1 = false;
    }
      else if (userIsPlayer2) {
        database.ref("activePlayers").update({
          player2Btn: false,
          player2: ""
        })
      }
      userIsPlayer2 = false;
  }).catch(function(error) {
    // An error happened.
  });
}

function player1Sit() {
  if (!player1Active && !userIsPlayer2) {
  userIsPlayer1 = true;
  var user = userDisplay;
  database.ref("activePlayers").update({
    player1Btn: true,
    player1: user
  }).then(function() {
  if (player1Active && player2Active) {
    startGame();
  }
})
}
}

function player2Sit() {
  if (!player2Active && !userIsPlayer1) {
  userIsPlayer2 = true;
  var user = userDisplay;
  database.ref("activePlayers").update({
    player2Btn: true,
    player2: user
  }).then(function() {
    if (player1Active && player2Active) {
      startGame();
    }
  })
}
}

function startGame() {
  database.ref("inputs").set({
    player1: null,
    player2: null,
  })
  $("#welcome").html("Two Players have entered! Make your choice!");
}