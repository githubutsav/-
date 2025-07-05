import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { auth } from './firebaseConfig.js';

window.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('dark-mode');

  const googleLoginBtn = document.getElementById('google-login');
  const logoutBtn = document.getElementById('logout');
  const provider = new GoogleAuthProvider();

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      signOut(auth).then(() => {
        window.location.href = 'login.html';
      });
    });
  }

  if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', () => {
      signInWithPopup(auth, provider)
        .then(() => {
          window.location.href = 'index.html';
        })
        .catch(error => {
          console.error("Login failed:", error);
          alert('Login failed: ' + error.message);
        });
    });
  }

  onAuthStateChanged(auth, user => {
    if (user && window.location.pathname.includes('login')) {
      window.location.replace('index.html');
    } else if (!user && !window.location.pathname.includes('login')) {
      window.location.replace('login.html');
    }
  });
});


