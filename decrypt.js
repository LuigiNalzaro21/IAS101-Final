let timer; // Declare timer globally to reset it if needed

window.addEventListener("load", () => {
  const encryptedMessages = JSON.parse(localStorage.getItem("encryptedMessages")) || [];
  const selectElement = document.getElementById("encrypted-messages-list");

  // Populate dropdown with available encrypted messages
  encryptedMessages.forEach((message, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = `Message ${index + 1}`;
    selectElement.appendChild(option);
  });

  // Handle message selection
  selectElement.addEventListener("change", () => {
    const selectedIndex = selectElement.value;
    if (selectedIndex !== "") {
      const selectedMessage = encryptedMessages[selectedIndex];

      document.querySelector("#riddle-clue span").textContent = selectedMessage.riddle;
      document.querySelector("#encrypted-text span").textContent = selectedMessage.encryptedWord;
      document.getElementById("shift").value = selectedMessage.shift;

      clearTimeout(timer); // Clear the previous timer
      removeExistingTimer(); // Remove any existing timer display
      startTimer(); // Start a new timer
    }
  });

  // Handle decryption on button click
  document.getElementById("decrypt-button").addEventListener("click", (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    const selectedIndex = selectElement.value;
    if (selectedIndex === "") {
      document.getElementById("output").textContent = "Please select an encrypted message.";
      return;
    }

    const selectedMessage = encryptedMessages[selectedIndex];
    const guess = document.getElementById("guess").value.trim();

    const decodedWord = decryptMessage(selectedMessage.encryptedWord, selectedMessage.shift);

    if (guess.toLowerCase() === decodedWord.toLowerCase()) {
      document.getElementById("output").textContent = "Correct! Decrypted successfully!";
    } else {
      document.getElementById("output").textContent = "Incorrect! Try again.";
    }
  });

  // Prevent copying the riddle
  const riddleClue = document.querySelector("#riddle-clue");
  riddleClue.addEventListener("copy", (event) => {
    alert("Copying the typed riddle is prohibited.");
    event.preventDefault(); // Prevent the default copy behavior
  });

  // Handle reset button functionality
  document.getElementById('reset-button').addEventListener('click', () => {
    // Clear only the fields excluding the dropdown
    document.getElementById('riddle-clue').querySelector('span').textContent = "";
    document.getElementById('encrypted-text').querySelector('span').textContent = "";
    document.getElementById('shift').value = 3; // Reset shift value to default
    document.getElementById('guess').value = ""; // Clear the guess input
    document.getElementById('output').textContent = ""; // Clear output

    // Clear any existing timer display
    removeExistingTimer();

    // Re-enable buttons and inputs in case they were disabled
    document.getElementById('decrypt-button').disabled = false;
    document.getElementById('guess').disabled = false;
  });
});

// Function to start the countdown timer
function startTimer() {
  const decryptButton = document.getElementById("decrypt-button");
  const guessInput = document.getElementById("guess");

  let timeLeft = 60; // 1 minute
  const timerDisplay = document.createElement("p");
  timerDisplay.id = "timer";
  document.getElementById("decrypt-section").appendChild(timerDisplay);

  decryptButton.disabled = false; // Ensure button is enabled
  guessInput.disabled = false; // Ensure input is enabled

  const updateTimer = () => {
    if (timeLeft > 0) {
      timeLeft--;
      timerDisplay.textContent = `Time Remaining: ${timeLeft}s`;
    } else {
      clearTimeout(timer);
      timerDisplay.textContent = "Time's up!";
      decryptButton.disabled = true; // Disable the decrypt button
      guessInput.disabled = true; // Disable the input field
    }
  };

  timer = setInterval(updateTimer, 1000);
}

// Function to remove the existing timer if present
function removeExistingTimer() {
  const existingTimer = document.getElementById("timer");
  if (existingTimer) {
    existingTimer.remove(); // Remove the existing timer display
  }
}

// Function to decrypt the message using the Caesar Cipher logic
function decryptMessage(encryptedWord, shift) {
  return encryptedWord.replace(/[a-zA-Z]/g, (char) => {
    const base = char <= 'Z' ? 65 : 97;
    return String.fromCharCode(((char.charCodeAt(0) - base - shift + 26) % 26) + base);
  });
}
