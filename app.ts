// Replace with your Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Sample personnel list (you can store this in Firestore too)
const personnel = ["Juan Dela Cruz", "Maria Santos", "Pedro Reyes"];

const listDiv = document.getElementById("personnel-list");

personnel.forEach(name => {
  const personDiv = document.createElement("div");
  personDiv.className = "person";
  personDiv.id = name;

  const label = document.createElement("span");
  label.textContent = name;

  const btn = document.createElement("button");
  btn.textContent = "Time In";
  btn.onclick = () => timeIn(name);

  personDiv.appendChild(label);
  personDiv.appendChild(btn);
  listDiv.appendChild(personDiv);
});

// Handle time-in
function timeIn(name) {
  const now = new Date();
  db.collection("logbook").doc(name).set({
    timeIn: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    document.getElementById(name).classList.add("active");
  });
}

// Load previously timed-in personnel (optional if using realtime)
db.collection("logbook").get().then(snapshot => {
  snapshot.forEach(doc => {
    const name = doc.id;
    if (personnel.includes(name)) {
      const person = document.getElementById(name);
      if (person) person.classList.add("active");
    }
  });
});
