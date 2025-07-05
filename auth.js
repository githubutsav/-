// auth.js
import { auth } from './firebase-config.js';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const loginBtn = document.getElementById("loginBtn");
const registerLink = document.getElementById("registerLink");

loginBtn.addEventListener("click", () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert("Login successful!");
      window.location.href = "index.html"; // redirect to homepage
    })
    .catch((error) => {
      alert("Login failed: " + error.message);
    });
});

registerLink.addEventListener("click", () => {
  const email = prompt("Enter Email");
  const password = prompt("Enter Password (min 6 characters)");

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Account created! You can now login.");
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
});
