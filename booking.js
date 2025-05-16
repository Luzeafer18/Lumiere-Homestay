document.getElementById("bookingForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;

  const bookingData = {
    name: form.name.value.trim(),
    phone: form.phone.value.trim(),
    email: form.email.value.trim(),
    checkin: form.checkin.value,
    checkout: form.checkout.value,
  };

  try {
    const response = await fetch("/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    });
    const result = await response.json();
    if (result.success) {
      alert("Booking successful! Booking ID: " + result.bookingId);
      form.reset();
      window.location.href = "index.html";
    } else {
      alert("Booking failed: " + result.message);
    }
  } catch (err) {
    alert("Error connecting to server.");
  }
});
