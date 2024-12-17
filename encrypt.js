document.getElementById("encrypt-button").addEventListener("click", (event) => {
  event.preventDefault();  // Prevent form submission

  const word = document.getElementById("word").value.trim();
  const shift = parseInt(document.getElementById("shift").value);
  const riddle = document.getElementById("riddle").value.trim();

  // Check if word is a sentence or has more than 9 words
  if (word.split(/\s+/).length > 9) {
    alert("Only words (up to 9 words) are allowed, not sentences.");
    document.getElementById("output").textContent = "Please enter a valid word with no more than 9 words.";
    return;
  }

  // Check if the input is a valid word (no sentences)
  if (word.split(/\s+/).length > 1) {
    alert("Please enter a single word, no sentences allowed.");
    document.getElementById("output").textContent = "Only a single word is allowed.";
    return;
  }

  // Check if shift value is between 0 and 9
  if (shift < 0 || shift > 9) {
    alert("Shift value must be between 0 and 9!");
    document.getElementById("output").textContent = "Please enter a valid shift value between 0 and 9.";
    return;
  }

  // Check if word length exceeds shift value
  if (word.length > shift) {
    alert("The word length exceeds the shift value! Please choose a smaller word or shift value.");
    document.getElementById("output").textContent = "Word length cannot exceed shift value.";
    return;
  }

  // Ensure word and riddle fields are not empty
  if (!word || !riddle) {
    document.getElementById("output").textContent = "Please fill in all fields.";
    return;
  }

  // Encrypt the word using the Caesar cipher with the given shift
  const encryptedWord = word.replace(/[a-zA-Z]/g, (char) => {
    const base = char <= 'Z' ? 65 : 97;
    return String.fromCharCode(((char.charCodeAt(0) - base + shift) % 26) + base);
  });

  // Store data in localStorage as a list
  let encryptedMessages = JSON.parse(localStorage.getItem("encryptedMessages")) || [];
  encryptedMessages.push({ encryptedWord, riddle, shift });
  localStorage.setItem("encryptedMessages", JSON.stringify(encryptedMessages));

  document.getElementById("output").textContent = `Encrypted Word: ${encryptedWord}. Encrypted successfully!`;
});

// Add listener to check if shift value is within the allowed range
document.getElementById("shift").addEventListener("input", () => {
  const shiftValue = parseInt(document.getElementById("shift").value);
  const encryptButton = document.getElementById("encrypt-button");

  // Disable the button if shift value is not within the range 0-9
  if (shiftValue < 0 || shiftValue > 9 || isNaN(shiftValue)) {
    encryptButton.disabled = true;
    if (shiftValue < 0 || shiftValue > 9) {
      alert("Shift value must be between 0 and 9!");
    }
  } else {
    encryptButton.disabled = false;
  }
});

// Listener to auto-update shift value based on the word entered
document.getElementById("word").addEventListener("input", () => {
  const word = document.getElementById("word").value.trim();

  // Only calculate shift value if it's a single word
  if (word && word.split(/\s+/).length === 1) {
    const shiftValue = word.length % 10; // Calculate shift based on word length (0-9)
    document.getElementById("shift").value = shiftValue;
  }
});
