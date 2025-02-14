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

document.getElementById('userForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const age = document.getElementById('age').value;
  const userId = document.getElementById('userId').value;

  try {
    if (userId) {
      // Update existing user
      await updateDoc(doc(db, 'users', userId), { name, email, age });
      // Find the paragraph and update it dynamically
      const paragraph = document.querySelector(`p[data-id="${userId}"]`);
      if (paragraph) {
        paragraph.textContent = `Name: ${name}, Email: ${email}, Age: ${age}`;
      }
    } else {
      // Add new user
      const docRef = await addDoc(collection(db, 'users'), { name, email, age });
      // Append the new user as a paragraph dynamically
      const newParagraph = document.createElement('p');
      newParagraph.setAttribute('data-id', docRef.id);
      newParagraph.textContent = `Name: ${name}, Email: ${email}, Age: ${age}`;
      document.getElementById('usersList').appendChild(newParagraph);
    }
    resetForm();
  } catch (error) {
    console.error("Error saving data:", error);
    alert("Error saving data. Check console for details.");
  }
});

function loadUsers() {
  const usersCollection = collection(db, 'users');
  onSnapshot(usersCollection, 
    (snapshot) => {
      document.getElementById('usersList').innerHTML = ''; // Clear the list
      snapshot.forEach((doc) => {
        const user = doc.data();
        const paragraph = document.createElement('p');
        paragraph.setAttribute('data-id', doc.id);
        paragraph.textContent = `Name: ${user.name}, Email: ${user.email}, Age: ${user.age}`;
        document.getElementById('usersList').appendChild(paragraph);
      });
    },
    (error) => {
      console.error("Error loading users:", error);
      alert("Error loading data. Check console for details.");
    }
  );
}

async function editUser(id) {
  try {
    const userDoc = await getDoc(doc(db, 'users', id));
    const user = userDoc.data();
    document.getElementById('userId').value = id;
    document.getElementById('name').value = user.name;
    document.getElementById('email').value = user.email;
    document.getElementById('age').value = user.age;
  } catch (error) {
    console.error("Error editing user:", error);
    alert("Error loading user data. Check console for details.");
  }
}

async function deleteUser(id) {
  if (confirm('Are you sure?')) {
    try {
      await deleteDoc(doc(db, 'users', id));
      // Remove the paragraph dynamically
      const paragraph = document.querySelector(`p[data-id="${id}"]`);
      if (paragraph) {
        paragraph.remove();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Error deleting user. Check console for details.");
    }
  }
}

function resetForm() {
  document.getElementById('userId').value = '';
  document.getElementById('userForm').reset();
}

loadUsers();

// Expose functions to global scope
window.editUser = editUser;
window.deleteUser = deleteUser;
