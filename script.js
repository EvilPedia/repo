function promptPassword() {
  const correctPassword = "hum4idh2025"; // change this!
  const userInput = prompt("Enter password:");

  if (userInput === correctPassword) {
    document.getElementById("secret-image").style.display = "block";
  } else {
    alert("Wrong password!");
  }
}
