const API_BASE = "https://project-300-g7gu.onrender.com"; // Render backend URL

// Get logged-in user
function getLoggedInUser() {
  return JSON.parse(localStorage.getItem("loggedInUser") || "{}");
}

// ===== BOOKING FORM =====
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = getLoggedInUser();
    if (!user.email) return alert("❌ Please login first.");

    const formData = {
      name: user.name || document.getElementById("name").value,
      email: user.email,
      phone: document.getElementById("phone").value,
      checkin: document.getElementById("checkin").value,
      checkout: document.getElementById("checkout").value,
      guests: parseInt(document.getElementById("guests").value),
      room: document.getElementById("room").value,
      requests: document.getElementById("requests").value,
    };

    try {
      const response = await fetch(`${API_BASE}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        alert("✅ Booking successful!");
        contactForm.reset();
      } else alert("❌ Booking failed: " + result.message);
    } catch (error) {
      console.error("Booking error:", error);
      alert("❌ An error occurred during booking.");
    }
  });
}

// ===== REGISTRATION FORM =====
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const result = await response.json();
      if (response.ok) {
        alert("✅ Registration successful! Redirecting to login...");
        window.location.href = "login.html";
      } else alert("❌ Registration failed: " + result.message);
    } catch (error) {
      console.error("Registration error:", error);
      alert("❌ An error occurred during registration.");
    }
  });
}

// ===== LOGIN FORM =====
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const messageElem = document.getElementById("message");
    messageElem.textContent = "";

    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      if (response.ok) {
        messageElem.style.color = "green";
        messageElem.textContent = "✅ Login successful! Redirecting...";
        localStorage.setItem(
          "loggedInUser",
          JSON.stringify({ email: email, name: result.name || email })
        );
        setTimeout(() => window.location.href = "index.html", 2000);
      } else {
        messageElem.style.color = "red";
        messageElem.textContent = result.error || "❌ Login failed";
      }
    } catch (error) {
      console.error("Login error:", error);
      messageElem.style.color = "red";
      messageElem.textContent = "❌ Error: Server not responding.";
    }
  });
}

// ===== CHECKIN PAGE =====
const checkinContainer = document.getElementById("checkin-container");
if (checkinContainer) {
  const user = getLoggedInUser();
  if (!user.email) {
    checkinContainer.innerHTML = "<p>Please login to see your bookings.</p>";
  } else {
    fetch(`${API_BASE}/user-bookings?email=${user.email}`)
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          checkinContainer.innerHTML = `<p>${data.message}</p>`;
        } else {
          checkinContainer.innerHTML = data
            .map(
              b => `
            <div class="booking-card">
              <p><strong>Room:</strong> ${b.room}</p>
              <p><strong>Check-in:</strong> ${b.checkin}</p>
              <p><strong>Check-out:</strong> ${b.checkout}</p>
              <p><strong>Guests:</strong> ${b.guests}</p>
              <p><strong>Requests:</strong> ${b.requests}</p>
            </div>
          `
            )
            .join("");
        }
      })
      .catch(err => {
        console.error("Fetch bookings error:", err);
        checkinContainer.innerHTML = "<p>Error loading bookings.</p>";
      });
  }
}
