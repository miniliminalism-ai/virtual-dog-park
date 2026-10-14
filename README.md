# Virtual Dog Park

A small practice website built with plain HTML, CSS and vanilla JavaScript — no
framework, no build tools and no backend. It has two parts: a **Dog Encyclopedia**
that introduces three breeds, and a **My Virtual Dog** game where you adopt a dog,
look after it and watch it grow up.

## Features

**Dog Encyclopedia**
- Three breeds: Beagle, Golden Retriever and Poodle
- Each breed card lists size, personality and everyday care notes
- A "Pat this dog" button highlights the card and counts how many dogs you pat

**My Virtual Dog**
- Adopt a dog: choose a breed, type a name (1–20 characters) and press **Adopt**
- The dog card shows its name, breed, day number, growth stage and happiness
- **Feed** and **Play** each add 10 happiness
- **Next Day** moves time forward: the dog becomes one day older and loses 5 happiness
- Growth is shown two ways: a growth bar and the written stage name
- **Start Over** deletes the saved dog, but only after you confirm

## Previewing index.html

The page loads `style.css`, `script.js` and the files in `assets/` with relative
paths, so the whole folder has to be served together. Keeping the folder structure
exactly as it is will avoid 404 errors.

**Option A — VS Code Live Server (recommended)**
1. Open the `virtual-dog-park` folder in VS Code.
2. Open the Extensions panel and install **Live Server** (by Ritwick Dey).
3. In the Explorer, right-click `index.html` and choose **Open with Live Server**.
4. The browser opens at an address like `http://127.0.0.1:5500/index.html`.
   While Live Server is running, saving a file reloads the page automatically.

**Option B — Python's built-in server**

Run this from inside the project folder:

```
python -m http.server 8000
```

Then open `http://localhost:8000/index.html` in the browser. Press `Ctrl+C` in the
terminal to stop the server.

**Option C — open the file directly**

Double-clicking `index.html` also works for a quick look, but a local server is
closer to how a real website is delivered.

## Growth and happiness rules

| Day | Growth stage |
| --- | --- |
| 1 | Puppy |
| 2 – 3 | Young Dog |
| 4 and later | Adult Dog |

- A newly adopted dog starts on **Day 1** as a **Puppy** with **50 happiness**.
- **Feed** adds **10 happiness** and **Play** adds **10 happiness**.
  Happiness never goes above **100**.
- **Next Day** adds **1 day** and takes away **5 happiness**.
  Happiness never goes below **0**, and the day still advances once happiness is at 0.
- The stage is always written out as text next to the growth bar, so the stage is
  never communicated by colour or size alone.
- The growth bar fills in three steps — one third for Puppy, two thirds for
  Young Dog, and fully for Adult Dog.

## Where your pet is saved

Your dog is stored in the browser's **localStorage**, under the key
`virtualDogParkPetV1`. Only one dog is saved at a time.

- The data is saved immediately after adopting, and again after every **Feed**,
  **Play** and **Next Day** action.
- Refreshing the page brings the same dog back: its name, breed, day number and
  happiness are all restored.
- **Nothing is uploaded anywhere.** There is no backend, no login and no GitHub
  account involved. The saved dog lives only inside the browser on the computer
  where you played, so it does not follow you to another computer or another browser.
- Clearing the browser's site data, or pressing **Start Over**, removes the saved
  dog for good.
- Storage is kept per origin, so a dog saved after opening the file directly is not
  the same as one saved through `http://localhost:5500`. Pick one way of previewing
  the page and stay with it.
- To see the saved data, open DevTools (`F12`) → **Application** → **Local Storage**,
  select the page's origin, and look for the key `virtualDogParkPetV1`.

## Illustrations

All three dog pictures (`assets/beagle.svg`, `assets/golden-retriever.svg` and
`assets/poodle.svg`) are simple SVG drawings created for this project. They are
**illustrations, not photographs of real dogs**. No copyrighted photographs and no
external image websites are used anywhere on the page.

## Manual testing checklist

Walk through these in the browser after any change:

- [ ] The Dog Encyclopedia shows three breed cards, each with its illustration and notes.
- [ ] Each illustration has a breed name written next to it, and the image has alt text that names the breed.
- [ ] "Pat this dog" highlights a card and the pat counter goes up; clicking again counts back down.
- [ ] Adopting with an empty name, or a name of only spaces, shows a message and creates no dog.
- [ ] A name longer than 20 characters is refused with a message that explains the limit.
- [ ] A valid name creates a dog on **Day 1**, **Puppy** stage, with **50** happiness.
- [ ] **Feed** and **Play** each add 10 happiness and stop at 100.
- [ ] **Next Day** adds a day and removes 5 happiness, and happiness never goes below 0.
- [ ] The growth bar and the written stage both change at Day 1, Day 2 and Day 4.
- [ ] Refreshing the page restores the dog with the same name, breed, day and happiness.
- [ ] **Start Over** → Cancel keeps the dog; **Start Over** → OK clears it and returns to the form.
- [ ] Tabbing through the page reaches every control, each form field has a label, and focus is visible.
- [ ] Narrow the window to phone width: nothing overflows sideways and every button is still reachable.

## Project files

```
virtual-dog-park/
├── index.html    page structure and content
├── style.css     all styling, written mobile-first
├── script.js     greeting, pat counter and the virtual dog game
├── assets/
│   ├── beagle.svg
│   ├── golden-retriever.svg
│   └── poodle.svg
└── README.md
```
