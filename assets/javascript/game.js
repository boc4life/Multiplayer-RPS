$(document).ready(function(){

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

var loggedIn = false;
var signinOpen = false;
var registerOpen = false;

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


})