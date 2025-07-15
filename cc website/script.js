document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();               // stop page refresh

  const data = {
    name:      e.target.name.value,
    email:     e.target.email.value,
    phone:     e.target.phone.value,
    checkin:   e.target.checkin.value,
    checkout:  e.target.checkout.value,
    guests:    e.target.guests.value,
    room:      e.target.room.value,
    requests:  e.target.requests.value
  };

  try {
    const res = await fetch('http://localhost:3000', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const json = await res.json();
    if (json.status === 'success') {
      alert('Booking sent successfully!');
      e.target.reset();
    } else {
      alert('Something went wrong: ' + json.message);
    }
  } catch (err) {
    console.error(err);
    alert('Could not connect to server.');
  }
});
