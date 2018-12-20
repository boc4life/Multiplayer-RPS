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
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
    console.log(user);
    $("#welcome").html("Logged in successfully. Please choose a display name to take a seat.");
    $(".loginRemove").addClass("d-none");
    $(".loginAdd").removeClass("d-none");
    $("#logoutBtn").removeClass("d-none");
    userDisplay = user.displayName;
    console.log(user.wins);
    console.log(user.displayName);
  } else {
    // No user is signed in.
    $("#welcome").html("Sign In or Register to Play!");
    $(".loginRemove").removeClass("d-none");
    $(".loginAdd").addClass("d-none");
    $("#logoutBtn").addClass("d-none");
  }
});

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)
  .then(function () {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  })
  .catch(function (error) {
    var errorCode = error.code;
    var errorMessage = error.message;
  });

// From here until the global variables are global Firebase Event Listeners.

// Code to be executed when a player takes a seat or leaves. Also runs on page load.
database.ref("activePlayers/").on("value", function (snapshot) {
  var snap = snapshot.val();
  console.log(snap)
  if (snap.player1Btn == true) {
    $("#player1Record").removeClass("d-none");
    uid = snap.player1UID;
    database.ref("users/" + uid).once("value", function (player) {
      userWins = player.val().wins;
      userLosses = player.val().losses;
      userTies = player.val().ties;
      $("#player1Record").html("<strong>Wins:</strong> " + userWins + "<br><strong>Losses:</strong> " + userLosses + "<br><strong>Ties:</strong> " + userTies);
    })
    player1Active = true;
    $("#player1Btn").addClass("d-none");
    $("#player1Name").html("<h3>" + snap.player1 + "</h3>");
    if (userIsPlayer1) {
      console.log("Hi");
      $("#player1RPS").removeClass("d-none");
    }
  } else {
    player1Active = false;
    $("#player1Record").addClass("d-none");
    $("#player1Btn").removeClass("d-none");
    $("#player1Name").html("");
    $("#player1RPS").addClass("d-none");
  }
  if (snap.player2Btn == true) {
    $("#player2Record").removeClass("d-none");
    uid = snap.player2UID;
    database.ref("users/" + uid).once("value", function (player) {
      userWins = player.val().wins;
      userLosses = player.val().losses;
      userTies = player.val().ties;
      $("#player2Record").html("<strong>Wins:</strong> " + userWins + "<br><strong>Losses:</strong> " + userLosses + "<br><strong>Ties:</strong> " + userTies);
    })
    player2Active = true;
    $("#player2Btn").addClass("d-none");
    $("#player2Name").html("<h3>" + snap.player2 + "</h3>")
    if (userIsPlayer2) {
      $("#player2RPS").removeClass("d-none");
      console.log("This shouldn't happen");
    }
  } else {
    player2Active = false;
    $("#player2Btn").removeClass("d-none");
    $("#player2Name").html("")
    $("#player2RPS").addClass("d-none");
    $("#player2RPS").addClass("d-none");
  }
})

// Chat display function
database.ref("/Chat").limitToLast(5).on("child_added", function (snapshot) {
  console.log(snapshot);
  var newChatDiv = $("<div>")
  newChatDiv.attr("class", "chatDiv");
  var newChatName = $("<strong>");
  newChatName.append(snapshot.val().userName);
  var newChat = snapshot.val().chat;
  newChatDiv.append(newChatName).append(": ").append(newChat);
  $("#gameChat").append(newChatDiv);
})

database.ref("inputs").on("value", function (snapshot) {
  if (snapshot.player1Chosen && snapshot.player2Chosen == true) {
    compareInputs();
  }
  if (snapshot.game == true) {
    startGame();
  }
})

// Declaring Global variables for page load.

var signinOpen = false;
var registerOpen = false;
var displayName;
var player1Active;
var player2Active;
var userIsPlayer1 = false;
var userIsPlayer2 = false;
var userDisplay = false;
var uid;
var timer;
var clock;
var player1Input;
var player2Input;

$(document).ready(function () {

  // All HTML click listeners are listed inside this document.ready function.
  $("#signin").on("click", function () {
    if (registerOpen == false) {
      $("#signinArea").slideToggle();
      signinOpen ^= true;
    }
  })

  $("#register").on("click", function () {
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
  $("#chatSubmit").on("click", submitChat);
})


// Global functions.
function signIn() {
  email = $("#signinEmail").val().trim();
  password = $("#signinPassword").val().trim();
  firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
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
  }).then(function () {
    user = firebase.auth().currentUser;
    uid = user.uid;
  })
}

function register() {
  email = $("#registerEmail").val().trim();
  password = $("#registerPassword").val().trim();
  newName = $("#usernameUpdate").val().trim();
  firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
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
  }).then(function () {
    user = firebase.auth().currentUser;
    uid = user.uid;
    database.ref("users/" + uid).set({
      wins: 0,
      losses: 0,
      ties: 0
    })
  })
  return userDisplay = newName;
}

function updateUser() {
  var user = firebase.auth().currentUser;
  newName = $("#usernameUpdate").val().trim();
  user.updateProfile({
    displayName: newName,
    wins: 0,
    losses: 0,
    ties: 0
  }).then(function () {
    $("#welcome").html("Logged in successfully as " + newName);
    $(".displayName").addClass("d-none");
    console.log(user);
  })
  return userDisplay = newName;
}

function logout() {
  firebase.auth().signOut().then(function () {
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
  }).catch(function (error) {
    // An error happened.
  });
}

function player1Sit() {
  if (!player1Active && !userIsPlayer2 && userDisplay) {
    userIsPlayer1 = true;
    user = userDisplay;
    database.ref("activePlayers").update({
      player1Btn: true,
      player1: user,
      player1UID: uid
    }).then(function () {
      if (player1Active && player2Active) {
        startGame();
      }
    })
  }
}

function player2Sit() {
  if (!player2Active && !userIsPlayer1 && userDisplay) {
    userIsPlayer2 = true;
    user = userDisplay;
    database.ref("activePlayers").update({
      player2Btn: true,
      player2: user,
      player2UID: uid
    }).then(function () {
      if (player1Active && player2Active) {
        startGame();
      }
    })
  }
}

function startGame() {
  player1Input = false;
  player2Input = false;
  database.ref("inputs").update({
    one: false,
    two: false,
    game: true
  })
  $("#welcome").html("Two Players have entered! Make your choice!");
  $(".playerInput").addClass("activeBtn");
  $(".activeBtn").on("click", submitInput);
  startTimer();
}

function submitChat() {
  if (userDisplay) {
    var chatInput = $("#chatType").val().trim();
    var user = userDisplay;
    $("#chatType").val("");
    database.ref("Chat").push({
      userName: user,
      chat: chatInput
    })
  } else {
    alert("Log in and choose a display name first.")
  }
}

function startTimer() {
  $("#timerWrapper").removeClass("d-none");
  timer = 100;
  clock = setInterval(count, 1000);
}

function count() {
  if (timer > 0) {
    timer--;
    $("#timer").html(timer);
  }
  if (timer == 0) {
    alert("Time ran out. The unresponsive players have been removed.")
    clearInterval(clock);
    database.ref("inputs").once("value", function (snapshot) {
      console.log(snapshot.val().player1);
      if (snapshot.val().player1 == false) {
        database.ref("activePlayers").update({
          player1: "",
          player1Btn: false,
          player1UID: ""
        })
      }
      if (snapshot.val().player2 == false) {
        database.ref("activePlayers").update({
          player2: "",
          player2Btn: false,
          player2UID: ""
        })
      }
    }
    )
  }
}

function compareInputs() {
  database.ref("inputs").once("value", function (snapshot) {
    player1Input = snapshot.val().one;
    player2Input = snapshot.val().two;
  })
  if (player1Input - player2Input == 0) {
    // tie
  }
  else if (player1Input - player2Input == -2 || 1) {
    // Player 1 wins
  }
  else if (player1Input - player2Input == -1 || 2) {
    // Player 2 wins
  }
  else {
    alert("ERROR");
  }
}

function submitInput() {
  var choice = $(this).attr("data-type");
  var player = $(this).attr("data-number");
  $(".playerInput").removeClass("activeBtn");
  console.log(choice);
  if (choice == "rock") {
    // Make firebase input = 0
    database.ref("inputs").update({
      ['player' + player]: 0,
      ['player' + player + "Chosen"]: true
    })
    console.log("0");
  }
  else if (choice == "paper") {
    // Make firebase input = 1
    console.log("1");
    database.ref("inputs").update({
      ['player' + player]: 1,
      ['player' + player + "Chosen"]: true
    })
  }
  else if (choice == "scissors") {
    // Make firebase input = 2
    console.log("2");
    database.ref("inputs").update({
      ['player' + player]: 2,
      ['player' + player + "Chosen"]: true
    })
  }
  else {
    alert("ERROR");
  }
}