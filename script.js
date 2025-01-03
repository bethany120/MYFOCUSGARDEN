console.log("JavaScript is linked correctly!");

// ------------------------- Timer Logic -------------------------
let focusTime = 25 * 60; // Default focus time: 25 minutes
let breakTime = 5 * 60; // Default break time: 5 minutes
let currentTime = focusTime; // Tracks remaining time
let isFocus = true; // Is it focus time or break time?
let timerRunning = false; // Is the timer currently running?
let sessionDuration = 0; // Tracks the total focus time in seconds
let timerInterval;

// DOM Elements
const timerLabel = document.getElementById("timer-label");
const timerDisplay = document.getElementById("timer-display");
const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
const coinCountElement = document.getElementById("coin-count");

// Ensure DOM elements exist
if (
  !timerLabel ||
  !timerDisplay ||
  !startBtn ||
  !resetBtn ||
  !coinCountElement
) {
  console.error("One or more required DOM elements are missing!");
}

// Format Time
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}

// Update Timer Display
function updateTimerDisplay() {
  timerDisplay.textContent = formatTime(currentTime);
  timerLabel.textContent = isFocus ? "Focus" : "Break";
}

// Start Timer
function startTimer() {
  if (!timerRunning) {
    timerRunning = true;
    sessionDuration = 0; // Reset session duration
    startBtn.textContent = "Stop";
    const endTime = Date.now() + currentTime * 1000;

    timerInterval = setInterval(() => {
      const now = Date.now();
      currentTime = Math.max(Math.ceil((endTime - now) / 1000), 0);

      if (isFocus) {
        sessionDuration++;
      }

      updateTimerDisplay();

      if (currentTime <= 0) {
        clearInterval(timerInterval);
        handleTimerEnd();
      }
    }, 100); // Accurate timing
  } else {
    stopTimer();
  }
}

// Stop Timer
function stopTimer() {
  clearInterval(timerInterval);
  timerRunning = false;
  startBtn.textContent = "Start";
}

// Reset Timer
function resetTimer() {
  stopTimer();
  isFocus = true;
  currentTime = focusTime;
  updateTimerDisplay();
}

// Handle Timer End
function handleTimerEnd() {
  stopTimer();

  // Add coins only if the user focused for 25 minutes or more (1500 seconds)
  if (isFocus && sessionDuration >= 1500) {
    addCoinsForFocus(); // Adds 5 coins
  } else if (isFocus) {
    console.log(
      "Focus session ended, but duration was less than 25 minutes. No coins awarded."
    );
  }

  isFocus = !isFocus; // Toggle between focus and break
  currentTime = isFocus ? focusTime : breakTime; // Reset time for the next session
  sessionDuration = 0; // Reset session duration for the next session
  updateTimerDisplay();
}
// ------------------------- Coin Counter Logic -------------------------
let coins = 0; // Tracks total coins earned

function addCoinsForFocus() {
  coins += 5; // Add 5 coins after completing a full focus session
  updateCoinDisplay();
}

function updateCoinDisplay() {
  if (coinCountElement) {
    coinCountElement.textContent = coins;
  }
}

// Initialize Timer
updateTimerDisplay();

// Event Listeners
startBtn.addEventListener("click", startTimer);
resetBtn.addEventListener("click", resetTimer);

// ------------------------- Backpack Logic -------------------------
let backpackItems = {
  Daisy: 3, // Default items
};

const backpackIcon = document.querySelector(".backpack");
const backpackMenu = document.createElement("div");
backpackMenu.classList.add("backpack-menu");
backpackMenu.style.display = "none";
document.body.appendChild(backpackMenu);

// Toggle Backpack Menu
backpackIcon.addEventListener("click", () => {
  backpackMenu.style.display =
    backpackMenu.style.display === "none" ? "block" : "none";
});

// Render Backpack Menu
function renderBackpackMenu() {
  backpackMenu.innerHTML = "";
  for (const [itemName, count] of Object.entries(backpackItems)) {
    if (count > 0) {
      const itemDiv = document.createElement("div");
      itemDiv.classList.add("backpack-item");

      const itemImage = document.createElement("img");
      itemImage.src = `assets/images/${itemName.toLowerCase()}.svg`;
      itemImage.alt = itemName;
      itemImage.style.width = "30px";
      itemImage.style.height = "30px";

      const itemLabel = document.createElement("span");
      itemLabel.textContent = `${itemName} x${count}`;

      itemDiv.appendChild(itemImage);
      itemDiv.appendChild(itemLabel);
      backpackMenu.appendChild(itemDiv);

      itemDiv.addEventListener("click", () => placeItemInGarden(itemName));
    }
  }
}

// ------------------------- Shop Logic -------------------------
const shopItems = [
  { name: "Tulip Orange", price: 1 },
  { name: "Pink Daisy", price: 1 },
  { name: "White Daisy", price: 1 },
  { name: "Light Grass", price: 1 },
  { name: "Dark Grass", price: 1 },
  { name: "Lavender", price: 1 },
  { name: "Crocus", price: 1 },
  { name: "Marigold", price: 1 },
];

function initializeShop() {
  const shopItemElements = document.querySelectorAll(".shop-item");
  shopItemElements.forEach((itemElement, index) => {
    const buyButton = itemElement.querySelector(".buy-button");
    buyButton.addEventListener("click", () => {
      const item = shopItems[index];
      if (coins >= item.price) {
        coins -= item.price;
        updateCoinDisplay();

        if (!backpackItems[item.name]) {
          backpackItems[item.name] = 0;
        }
        backpackItems[item.name]++;
        renderBackpackMenu();

        buyButton.textContent = "Added!";
        setTimeout(() => {
          buyButton.textContent = `Buy ${item.name} for $${item.price}`;
        }, 1000);
      } else {
        alert("Not enough coins!");
      }
    });
  });
}

// ------------------------- Initialize -------------------------
updateTimerDisplay();
renderBackpackMenu();
initializeShop();
startBtn.addEventListener("click", startTimer);
resetBtn.addEventListener("click", resetTimer);

// Create Edit Menu
function createEditMenu() {
  const editContainer = document.createElement("div");
  editContainer.style.marginTop = "20px";
  editContainer.style.textAlign = "center";

  // Focus Time Input
  const focusInput = document.createElement("input");
  focusInput.type = "number";
  focusInput.value = focusTime / 60; // Set initial value in minutes
  focusInput.min = 1;
  focusInput.style.margin = "5px";
  focusInput.style.padding = "5px";
  focusInput.style.width = "60px";
  focusInput.style.borderRadius = "5px";
  focusInput.style.border = "1px solid #ccc";

  const focusLabel = document.createElement("label");
  focusLabel.textContent = "Focus Time:";
  focusLabel.style.marginRight = "10px";

  // Break Time Input
  const breakInput = document.createElement("input");
  breakInput.type = "number";
  breakInput.value = breakTime / 60; // Set initial value in minutes
  breakInput.min = 1;
  breakInput.style.margin = "5px";
  breakInput.style.padding = "5px";
  breakInput.style.width = "60px";
  breakInput.style.borderRadius = "5px";
  breakInput.style.border = "1px solid #ccc";

  const breakLabel = document.createElement("label");
  breakLabel.textContent = "Break Time:";
  breakLabel.style.marginRight = "10px";

  // Append Inputs and Labels
  editContainer.appendChild(focusLabel);
  editContainer.appendChild(focusInput);
  editContainer.appendChild(document.createElement("br"));
  editContainer.appendChild(breakLabel);
  editContainer.appendChild(breakInput);

  // Append to Timer Section
  const timerDiv = document.querySelector(".timer");
  timerDiv.appendChild(editContainer);

  // Update Timer Settings on Change
  focusInput.addEventListener("change", () => {
    const newFocus = parseInt(focusInput.value);
    if (newFocus > 0) {
      focusTime = newFocus * 60;
      if (isFocus) {
        currentTime = focusTime;
        updateTimerDisplay();
      }
    }
  });

  breakInput.addEventListener("change", () => {
    const newBreak = parseInt(breakInput.value);
    if (newBreak > 0) {
      breakTime = newBreak * 60;
      if (!isFocus) {
        currentTime = breakTime;
        updateTimerDisplay();
      }
    }
  });
}

// Call the function to ensure it initializes
createEditMenu();

// Place Item in Garden
function placeItemInGarden(itemName) {
  if (backpackItems[itemName] > 0) {
    console.log(`Placing ${itemName} in the garden...`);

    // Decrease inventory count
    backpackItems[itemName]--;
    renderBackpackMenu();

    // Add item to the garden visually
    const garden = document.querySelector(".garden-area");
    const gardenItem = document.createElement("div");
    gardenItem.classList.add("garden-item");
    gardenItem.style.position = "absolute";

    const itemImage = document.createElement("img");

    // Define sizes for each plant
    const sizeMap = {
      "Tulip Orange": { width: "70apx", height: "75px" },
      "Pink Daisy": { width: "40px", height: "40px" },
      "White Daisy": { width: "40px", height: "40px" },
      "Light Grass": { width: "70px", height: "70px" },
      "Dark Grass": { width: "70px", height: "70px" },
      Lavender: { width: "70px", height: "80px" },
      Crocus: { width: "80px", height: "90px" },
      Marigold: { width: "70px", height: "80px" },
    };

    const imageMap = {
      Daisy: "DAISY white.svg",
      "Tulip Orange": "tulip orange.svg",
      "Pink Daisy": "DAISY pink.svg",
      "White Daisy": "DAISY white.svg",
      "Light Grass": "Grass light.svg",
      "Dark Grass": "Grass dark.svg",
      Lavender: "lavender.svg",
      Crocus: "crocus.svg",
      Marigold: "marigold2.svg",
    };

    // Assign size and image
    const size = sizeMap[itemName] || { width: "40px", height: "40px" }; // Default size
    itemImage.src = `assets/images/${imageMap[itemName]}`;
    itemImage.alt = itemName;
    itemImage.style.width = size.width;
    itemImage.style.height = size.height;

    // Generate random position
    const gardenRect = garden.getBoundingClientRect();
    const backpackRect = document
      .querySelector(".backpack")
      .getBoundingClientRect();

    let top, left;

    do {
      top = Math.random() * (gardenRect.height - 50); // 50px padding
      left = Math.random() * (gardenRect.width - 50); // 50px padding
    } while (
      left < backpackRect.right - gardenRect.left &&
      top > backpackRect.top - gardenRect.top
    );

    gardenItem.style.top = `${top}px`;
    gardenItem.style.left = `${left}px`;

    // Create red cross for removal (hidden initially)
    const removeButton = document.createElement("div");
    removeButton.textContent = "❌";
    removeButton.classList.add("remove-item");
    removeButton.style.position = "absolute";
    removeButton.style.top = "0";
    removeButton.style.right = "0";
    removeButton.style.cursor = "pointer";
    removeButton.style.fontSize = "16px";
    removeButton.style.color = "red";
    removeButton.style.display = "none"; // Hidden initially

    // Show the red cross when the item is clicked
    itemImage.addEventListener("click", () => {
      removeButton.style.display = "block";
    });

    // Add removal functionality to the red cross
    removeButton.addEventListener("click", () => {
      garden.removeChild(gardenItem); // Remove from garden
      backpackItems[itemName]++; // Add back to inventory
      renderBackpackMenu(); // Update inventory
    });

    // Append image and red cross
    gardenItem.appendChild(itemImage);
    gardenItem.appendChild(removeButton);

    // Append the item to the garden
    garden.appendChild(gardenItem);
    console.log(`${itemName} added to the garden.`);
  } else {
    console.warn(`No ${itemName} left in inventory!`);
  }
}

// Initialize Backpack
renderBackpackMenu();
