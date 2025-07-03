async function promptPassword() {
  const userInput = prompt("Enter password:");
  if (!userInput) return;

  try {
    const response = await fetch('/api/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password: userInput })
    });

    if (response.ok) {
      document.getElementById("secret-image").style.display = "block";
    } else {
      alert("Wrong password!");
    }
  } catch (err) {
    console.error('Error:', err);
    alert('Something went wrong. Try again.');
  }
}
