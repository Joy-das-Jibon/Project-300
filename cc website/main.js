let menu = document.querySelector("#menu-icon");
let navbar = document.querySelector(".navbar");

if(menu) {
  menu.onclick = () => {
    navbar.classList.toggle("active");
  };
}

window.onscroll = () => {
  if(navbar) navbar.classList.remove("active");
};


if(typeof ScrollReveal !== "undefined") {
  ScrollReveal({
    reset: true,
    distance: "60px",
    duration: 2000,
    delay: 200,
  });

  ScrollReveal().reveal(".home-text, .heading", { origin: "top" });
  ScrollReveal().reveal(".home-img, .services-container, .explore-box, .contact form", { origin: "bottom" });
  ScrollReveal().reveal(".home-text h1, .about-img", { origin: "left" });
  ScrollReveal().reveal(".home-text p, .about-content", { origin: "right" });
}


const contactForm = document.getElementById("contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      checkin: document.getElementById("checkin").value,
      checkout: document.getElementById("checkout").value,
      guests: parseInt(document.getElementById("guests").value),
      room: document.getElementById("room").value,
      requests: document.getElementById("requests").value,
    };

    try {
      const response = await fetch("http://localhost:3000/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) 
      {
        alert("✅ Booking successful!"); 
        contactForm.reset();
         
      } 
      else {
        alert("❌ Booking failed: " + result.message); 
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("❌ An error occurred during booking."); 
    }
  });
}

// ===== Registration Form Submission =====
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const result = await response.json();
      if (response.ok) {
        alert("✅ Registration successful! Redirecting to login..."); 
        window.location.href = "login.html";
      } else {
        alert("❌ Registration failed: " + result.message); 
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("❌ An error occurred during registration."); 
    }
  });
}





const loginForm = document.getElementById('loginForm');

if (loginForm) {
  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const messageElem = document.getElementById('message');
    messageElem.textContent = '';

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      if (response.ok) {
        messageElem.style.color = 'green';
        messageElem.textContent = '✅ Login successful! Redirecting...';

        
        localStorage.setItem('loggedInUser', JSON.stringify({ email: email, name: result.name || email }));

        setTimeout(() => {
          window.location.href = 'index.html';
        }, 2000);
      } else {
        messageElem.style.color = 'red';
        messageElem.textContent = result.error || '❌ Login failed';
      }
    } catch (error) {
      console.error('Login error:', error);
      messageElem.style.color = 'red';
      messageElem.textContent = '❌ Error: Server not responding.';
    }
  });
}
