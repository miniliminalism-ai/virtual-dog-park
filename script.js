/* ===========================================================
   Virtual Dog Park - script.js
   Plain JavaScript. No libraries, no frameworks.
   Three small jobs:
     1. Greet the visitor based on the time of day
     2. Let the visitor "pat" a dog
     3. Write the current year in the footer
   =========================================================== */

/* ---------- 1. Greeting ---------- */

// Check the hour on the visitor's computer and pick a greeting.
function setGreeting() {
  var hour = new Date().getHours();
  var message = "Welcome to the park!";

  if (hour < 12) {
    message = "Good morning, dog lover!";
  } else if (hour < 18) {
    message = "Good afternoon, dog lover!";
  } else {
    message = "Good evening, dog lover!";
  }

  document.getElementById("greeting").textContent = message;
}

/* ---------- 2. Patting a dog ---------- */

// How many dogs the visitor has patted so far.
var patCount = 0;

// Find every "Pat this dog" button and watch for clicks.
function setUpPatButtons() {
  var buttons = document.querySelectorAll(".pat-button");

  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", patDog);
  }
}

// Runs when one of the buttons is clicked.
function patDog(event) {
  var button = event.currentTarget;
  var card = button.closest(".breed-card");

  // Clicking once pats the dog; clicking again takes the pat back.
  if (card.classList.contains("is-patted")) {
    card.classList.remove("is-patted");
    button.textContent = "Pat this dog";
    patCount = patCount - 1;
  } else {
    card.classList.add("is-patted");
    button.textContent = "Patted!";
    patCount = patCount + 1;
  }

  showPatCount();
}

// Show the running total on the page.
function showPatCount() {
  var word = "dogs";

  if (patCount === 1) {
    word = "dog";
  }

  document.getElementById("pat-count").textContent =
    "You have patted " + patCount + " " + word + " today.";
}

/* ---------- 3. Footer year ---------- */

function setYear() {
  document.getElementById("year").textContent = new Date().getFullYear();
}

/* ---------- Start everything ---------- */

// script.js is loaded at the end of the page, so the HTML already exists here.
setGreeting();
setYear();
showPatCount();
setUpPatButtons();
