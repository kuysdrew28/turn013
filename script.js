// Import modules from Firebase CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js";
import { getFirestore, collection, doc, setDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js";

// Your firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAwzp3h8tt_tcDF1um--LoroAu1rErMmBc",
  authDomain: "virac-tsv.firebaseapp.com",
  projectId: "virac-tsv",
  storageBucket: "virac-tsv.firebasestorage.app",
  messagingSenderId: "455316064834",
  appId: "1:455316064834:web:1dc1033265b58a6c82bbdb",
  measurementId: "G-S7LVGRXCCZ"
};

 // Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Passwords for each student
const studentPasswords = {
  "Juan Dela Cruz": "1234",
  "Maria Santos": "abcd",
  "Pedro Reyes": "5678",
  "Ana Lopez": "efgh"
};

function getDateNowISO() {
  return new Date().toISOString();
}

// Update UI based on Firestore
async function loadTurnedInStatus(){
  const snapshot = await getDocs(collection(db, 'June18'));

  snapshot.forEach(docSnap => {
    const name = docSnap.id;
    const turnedIn = docSnap.data().turnedIn;
    const li = document.querySelector(`[data-name="${name}"]`);

    if (li && turnedIn) {
      li.querySelector('span').classList.add('highlight');
      li.querySelector('button').innerText = 'TURNED IN';
    }
  });
}

await loadTurnedInStatus();

document.querySelectorAll("#student-list button").forEach((btn) => {
  btn.addEventListener('click', async () => {
    const studentLi = btn.closest('li');
    const name = studentLi.dataset.name;
    const password = await showPasswordPopup(name, studentPasswords[name]);

    if (password === null) {
      // User pressed cancel or closed popup
      return;
    }
  
    // At this point password is correct
    const turnedIn = !studentLi.querySelector('span').classList.contains('highlight');
  
    // Update UI first
    if (turnedIn) {
      studentLi.querySelector('span').classList.add('highlight');
      btn.innerText = 'TURNED IN';
    } else {
      studentLi.querySelector('span').classList.remove('highlight');
      btn.innerText = 'Mark as Turned In';
    }
  
    // Update Firestore
    await setDoc(doc(db, 'June18', name), { turnedIn }, { merge: true });
  });
});


function showPasswordPopup(name, correctPass) {
  return new Promise((resolve) => {
    const popup = document.getElementById('password-popup');
    const passwordInput = document.getElementById('input-password');
    const warning = document.getElementById('warning-message');
    const confirmBtn = document.getElementById('confirm-password');
    const cancelBtn = document.getElementById('cancel-password');

    passwordInput.value = '';
    warning.style.display = 'none';
    popup.style.display = 'flex';

    function handleConfirm() {
      const password = passwordInput.value.trim();

      if (password === correctPass) {
        // Password is correct
        popup.style.display = 'none';
        clearHandlers();
        resolve(password);
      } else {
        // Incorrect password — show warning and stay on popup
        warning.textContent = 'Incorrect password. Please try again';
        warning.style.display = 'block';
      }
    }
  
    function handleCancel() {
      popup.style.display = 'none';
      clearHandlers();
      resolve(null);
    }
  
    function handleKeyDown(e) {
      if (e.key === 'Enter') {
        handleConfirm();
      }
    }
  
    function clearHandlers(){
      confirmBtn.removeEventListener('click', handleConfirm);
      cancelBtn.removeEventListener('click', handleCancel);
      passwordInput.removeEventListener('keydown', handleKeyDown);
    }
  
    confirmBtn.addEventListener('click', handleConfirm);
    cancelBtn.addEventListener('click', handleCancel);
    passwordInput.addEventListener('keydown', handleKeyDown);
  });
}
