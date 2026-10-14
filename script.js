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
   Adopt a dog, feed it, play with it, and let it grow up.
   The dog is kept in localStorage so it survives a refresh.
   =========================================================== */

// Small numbers kept in one place so they are easy to change.
var MAX_NAME_LENGTH = 20;
var MAX_HAPPINESS = 100;
var HAPPINESS_STEP = 10;
var START_HAPPINESS = 50;
var DAY_HAPPINESS_LOSS = 5;
var MIN_HAPPINESS = 0;

// Where the dog is saved inside the browser. One key holds one dog.
// Open DevTools > Application > Local Storage to see it.
var STORAGE_KEY = "virtualDogParkPetV1";

// The picture that belongs to each breed.
// The breed names here must match the values in the <option> tags.
var BREED_ART = {
  "Beagle": "assets/beagle.svg",
  "Golden Retriever": "assets/golden-retriever.svg",
  "Poodle": "assets/poodle.svg"
};

// How full the growth bar is for each stage.
var GROWTH_WIDTH = {
  "Puppy": "33%",
  "Young Dog": "66%",
  "Adult Dog": "100%"
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
function getGrowthStage(day) {
  if (day === 1) {
    return "Puppy";
  }
  if (day <= 3) {
    return "Young Dog";
  }
  return "Adult Dog";
}

/* ---------- Showing the dog ---------- */

// Copies the facts about myDog onto the page and reveals the card.
function showDogCard() {
  document.getElementById("dog-title").textContent = myDog.name;
  document.getElementById("dog-breed").textContent = myDog.breed;

  // Swap in the picture that matches the chosen breed.
  var art = document.getElementById("dog-art");
  art.src = BREED_ART[myDog.breed];
  art.alt = "Illustration of a " + myDog.breed;

  // Hide the adoption form while a dog lives here, and show the dog instead.
  document.getElementById("adopt-form").hidden = true;
  document.getElementById("no-dog-note").hidden = true;
  document.getElementById("dog-card").hidden = false;

  refreshDog();
}

// Redraws the parts of the card that change, then saves the dog.
function refreshDog() {
  updateGrowth();
  updateHappiness();
  saveDog();
}

// Day number, growth stage and the growth bar.
function updateGrowth() {
  var stage = getGrowthStage(myDog.day);

  document.getElementById("dog-day").textContent = "Day " + myDog.day;
  document.getElementById("dog-stage").textContent = stage;
  document.getElementById("growth-fill").style.width = GROWTH_WIDTH[stage];
}

// The happiness number, the happiness bar and the note underneath.
function updateHappiness() {
  var note = document.getElementById("dog-note");

  document.getElementById("dog-happiness").textContent =
    myDog.happiness + " / " + MAX_HAPPINESS;
  document.getElementById("happiness-bar").style.width = myDog.happiness + "%";

  if (myDog.happiness >= MAX_HAPPINESS) {
    note.textContent = myDog.name + " is as happy as a dog can be!";
  } else if (myDog.happiness <= MIN_HAPPINESS) {
    note.textContent = myDog.name + " is unhappy. Try Feed or Play.";
  } else {
    note.textContent = "";
  }
}

/* ---------- Feed, Play and Next Day ---------- */

// Feed and Play both add 10 happiness.
// Math.min keeps the result at 100 even if we add 10 to 95.
function addHappiness() {
  if (myDog === null) {
    return;
  }

  myDog.happiness = Math.min(myDog.happiness + HAPPINESS_STEP, MAX_HAPPINESS);
  refreshDog();
}

// Next Day makes the dog one day older and five happiness points less happy.
// Math.max keeps happiness from going below zero.
function nextDay() {
  if (myDog === null) {
    return;
  }

  myDog.day = myDog.day + 1;
  myDog.happiness = Math.max(myDog.happiness - DAY_HAPPINESS_LOSS, MIN_HAPPINESS);
  refreshDog();
}

/* ---------- Saving and loading the dog ---------- */

// Turns the dog object into text and puts it in the browser's storage.
function saveDog() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(myDog));
  } catch (error) {
    // A few browsers block storage, for example in private mode.
    // The game still works, it just cannot remember the dog.
  }
}

// Checks that some saved text really looks like one of our dogs.
function isUsableDog(dog) {
  return dog !== null
    && typeof dog === "object"
    && typeof dog.name === "string"
    && typeof dog.breed === "string"
    && typeof dog.day === "number"
    && typeof dog.happiness === "number"
    && BREED_ART[dog.breed] !== undefined;
}

// Looks for a dog that was saved in this browser earlier and brings it back.
function restoreSavedDog() {
  var savedText = null;

  try {
    savedText = localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    return;   // storage is switched off in this browser
  }

  if (savedText === null) {
    return;   // no dog has been saved yet, so keep the adoption form
  }

  var dog = null;

  try {
    dog = JSON.parse(savedText);
  } catch (error) {
    dog = null;   // the saved text was damaged
  }

  if (isUsableDog(dog)) {
    myDog = dog;
    showDogCard();
  } else {
    localStorage.removeItem(STORAGE_KEY);   // throw away unusable text
  }
}

/* ---------- Starting over ---------- */

// Deletes the saved dog, but only after the visitor says yes.
function startOver() {
  if (myDog === null) {
    return;
  }

  // window.confirm shows a small box with OK and Cancel.
  // It gives back true for OK and false for Cancel.
  var sure = window.confirm(
    "Start over? " + myDog.name + " will be deleted from this browser. This cannot be undone."
  );

  if (sure === false) {
    return;   // the visitor cancelled, so the dog stays
  }

  localStorage.removeItem(STORAGE_KEY);
  myDog = null;

  // Put the page back the way it looked before adopting.
  document.getElementById("dog-card").hidden = true;
  document.getElementById("adopt-form").hidden = false;
  document.getElementById("no-dog-note").hidden = false;
  document.getElementById("form-message").textContent = "";
  document.getElementById("dog-name").value = "";
  document.getElementById("dog-name").focus();
}

/* ---------- Connect the buttons ---------- */

document.getElementById("adopt-form").addEventListener("submit", adoptDog);
document.getElementById("feed-button").addEventListener("click", addHappiness);
document.getElementById("play-button").addEventListener("click", addHappiness);
document.getElementById("next-day-button").addEventListener("click", nextDay);
document.getElementById("start-over-button").addEventListener("click", startOver);

// On a fresh page load, bring back any dog that was saved earlier.
restoreSavedDog();


