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

/* ===========================================================
   4. My Virtual Dog
   Adopt a dog, then feed it or play with it.
   =========================================================== */

// Small numbers kept in one place so they are easy to change.
var MAX_NAME_LENGTH = 20;
var MAX_HAPPINESS = 100;
var HAPPINESS_STEP = 10;
var START_HAPPINESS = 50;

// The picture that belongs to each breed.
// The breed names here must match the values in the <option> tags.
var BREED_ART = {
  "Beagle": "assets/beagle.svg",
  "Golden Retriever": "assets/golden-retriever.svg",
  "Poodle": "assets/poodle.svg"
};

// The adopted dog is kept in this one object.
// It is null while no dog has been adopted yet.
var myDog = null;

/* ---------- Adopting a dog ---------- */

// Runs when the visitor presses Adopt (or presses Enter in a field).
function adoptDog(event) {
  // A form normally reloads the page when it is sent.
  // preventDefault stops that so our JavaScript can take over.
  event.preventDefault();

  var nameInput = document.getElementById("dog-name");
  var breedSelect = document.getElementById("breed-choice");

  // trim() removes spaces at the very start and the very end.
  // Spaces between the words are kept, so "Big  Ben" stays "Big  Ben".
  var name = nameInput.value.trim();

  // Work out whether the name is valid, and why not if it is not.
  var problem = "";

  if (name === "") {
    problem = "Please type a name for your dog before adopting.";
  } else if (name.length > MAX_NAME_LENGTH) {
    problem = "That name is " + name.length + " characters long. Please use " +
              MAX_NAME_LENGTH + " characters or fewer.";
  }

  // If there is a problem, show it and stop here.
  if (problem !== "") {
    setFormMessage(problem, true);
    nameInput.focus();
    return;
  }

  // Otherwise build the new dog. Every new dog starts the same way.
  myDog = {
    name: name,
    breed: breedSelect.value,
    day: 1,
    happiness: START_HAPPINESS
  };

  setFormMessage("Welcome home, " + name + "!", false);
  nameInput.value = "";
  showDogCard();
}

// Writes a message under the form.
// isError is true for a problem, false for good news.
function setFormMessage(text, isError) {
  var message = document.getElementById("form-message");

  // textContent puts the words on the page as plain text, so a name like
  // "<b>Rex</b>" would show up as those exact characters and never as HTML.
  message.textContent = text;

  if (isError === true) {
    message.classList.add("is-error");
  } else {
    message.classList.remove("is-error");
  }
}

// Which growth stage a dog is at on a given day.
// A brand new dog is on day 1, so it starts as a Puppy.
function getGrowthStage(day) {
  if (day < 30) {
    return "Puppy";
  }
  if (day < 180) {
    return "Young dog";
  }
  if (day < 365) {
    return "Adult";
  }
  return "Senior";
}

/* ---------- Showing the dog ---------- */

// Copies the facts about myDog onto the page and reveals the card.
function showDogCard() {
  document.getElementById("dog-title").textContent = myDog.name;
  document.getElementById("dog-breed").textContent = myDog.breed;
  document.getElementById("dog-day").textContent = "Day " + myDog.day;
  document.getElementById("dog-stage").textContent = getGrowthStage(myDog.day);

  // Swap in the picture that matches the chosen breed.
  var art = document.getElementById("dog-art");
  art.src = BREED_ART[myDog.breed];
  art.alt = "Illustration of a " + myDog.breed;

  document.getElementById("dog-card").hidden = false;
  document.getElementById("no-dog-note").hidden = true;

  updateHappiness();
}

// Redraws the happiness number and the happiness bar.
function updateHappiness() {
  var label = document.getElementById("dog-happiness");
  var bar = document.getElementById("happiness-bar");
  var note = document.getElementById("dog-note");

  label.textContent = myDog.happiness + " / " + MAX_HAPPINESS;
  bar.style.width = myDog.happiness + "%";

  if (myDog.happiness >= MAX_HAPPINESS) {
    note.textContent = myDog.name + " is as happy as a dog can be!";
  } else {
    note.textContent = "";
  }
}

/* ---------- Feed and Play ---------- */

// Both buttons do the same thing: add 10 happiness.
// Math.min keeps the result at 100 even if we add 10 to 95.
function addHappiness() {
  if (myDog === null) {
    return;
  }

  myDog.happiness = Math.min(myDog.happiness + HAPPINESS_STEP, MAX_HAPPINESS);
  updateHappiness();
}

/* ---------- Connect the buttons ---------- */

document.getElementById("adopt-form").addEventListener("submit", adoptDog);
document.getElementById("feed-button").addEventListener("click", addHappiness);
document.getElementById("play-button").addEventListener("click", addHappiness);

