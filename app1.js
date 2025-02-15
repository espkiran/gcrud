import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  deleteDoc,
  onSnapshot,
  runTransaction,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDjVs5MLZjh2iTHxy54WmyuoOf0kkjRpOA",
  authDomain: "mywebform-81b01.firebaseapp.com",
  projectId: "mywebform-81b01",
  storageBucket: "mywebform-81b01.firebasestorage.app",
  messagingSenderId: "284178824887",
  appId: "1:284178824887:web:b34bd1bd101aa67404d732"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const counterDocRef = doc(db, 'metadata', 'counter');

document.getElementById('userForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const age = document.getElementById('age').value;

  try {
    const newSerialNumber = await runTransaction(db, async (transaction) => {
      const counterDoc = await transaction.get(counterDocRef);
      let nextSerialNumber = 1;

      if (counterDoc.exists()) {
        nextSerialNumber = counterDoc.data().value + 1;
      }

      transaction.set(counterDocRef, { value: nextSerialNumber });
      return nextSerialNumber;
    });

    await addDoc(collection(db, 'users'), {
      serialNumber: newSerialNumber,
      name,
      email,
      age,
      createdAt: new Date()
    });

    resetForm();
  } catch (error) {
    console.error("Error saving data:", error);
    alert("Error saving data. Check console for details.");
  }
});

function loadUsers() {
  const usersQuery = query(collection(db, 'users'), orderBy('serialNumber'));
  
  onSnapshot(usersQuery, (snapshot) => {
    const usersList = document.getElementById('usersList');
    usersList.innerHTML = '';

    snapshot.forEach((doc) => {
      const user = doc.data();
      const userDiv = document.createElement('div');
      userDiv.style.margin = '10px 0';
      userDiv.style.padding = '15px';
      userDiv.style.border = '1px solid #ddd';
      userDiv.style.borderRadius = '5px';

      userDiv.innerHTML = `
        <p style="margin: 5px 0;">
          Serial number ${user.serialNumber}, 
          Name: ${user.name}, 
          Email: ${user.email}, 
          Age: ${user.age}
        </p>
        <button onclick="deleteUser('${doc.id}')" 
          style="padding: 5px 10px;
                 background-color: #ff4444;
                 color: white;
                 border: none;
                 border-radius: 3px;
                 cursor: pointer;">
          Delete
        </button>
      `;

      usersList.appendChild(userDiv);
    });
  });
}

window.deleteUser = async (id) => {
  if (confirm('Are you sure you want to delete this user?')) {
    try {
      await deleteDoc(doc(db, 'users', id));
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Error deleting user. Check console for details.");
    }
  }
};

function resetForm() {
  document.getElementById('userForm').reset();
}

// Initialize
loadUsers();
