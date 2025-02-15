import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  getDoc,
  runTransaction,
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

// Reference to the counter document
const counterDocRef = doc(db, 'metadata', 'counter');

document.getElementById('userForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const age = document.getElementById('age').value;

  try {
    // Use a transaction to safely increment the counter
    const newSerialNumber = await runTransaction(db, async (transaction) => {
      const counterDoc = await transaction.get(counterDocRef);
      let nextSerialNumber;

      if (!counterDoc.exists()) {
        nextSerialNumber = 1;
        transaction.set(counterDocRef, { value: nextSerialNumber });
      } else {
        nextSerialNumber = counterDoc.data().value + 1;
        transaction.update(counterDocRef, { value: nextSerialNumber });
      }

      return nextSerialNumber;
    });

    // Add the new user with the serial number
    const docRef = await addDoc(collection(db, 'users'), {
      serialNumber: newSerialNumber,
      name,
      email,
      age,
    });

    console.log("Document written with ID: ", docRef.id); // Debugging

    resetForm();
    loadUsers(); // Reload the users list after adding
  } catch (error) {
    console.error("Error saving data:", error);
    alert("Error saving data. Check console for details.");
  }
});

function loadUsers() {
  const usersCollection = collection(db, 'users');
  onSnapshot(usersCollection, 
    (snapshot) => {
      let combinedText = ''; // Combine all users into a single string
      snapshot.forEach((doc) => {
        const user = doc.data();
        combinedText += `ID: ${user.serialNumber}, Name: ${user.name}, Email: ${user.email}, Age: ${user.age}\n`;
      });
      document.getElementById('usersList').textContent = combinedText || 'No users found.';
    },
    (error) => {
      console.error("Error loading users:", error);
      alert("Error loading data. Check console for details.");
    }
  );
}

async function deleteUser(id) {
  if (confirm('Are you sure?')) {
    try {
      await deleteDoc(doc(db, 'users', id));
      loadUsers(); // Reload the users list after deletion
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Error deleting user. Check console for details.");
    }
  }
}

function resetForm() {
  document.getElementById('userForm').reset();
}

loadUsers();
