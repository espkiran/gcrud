// Import Firebase modules
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

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDjVs5MLZjh2iTHxy54WmyuoOf0kkjRpOA",
  authDomain: "mywebform-81b01.firebaseapp.com",
  projectId: "mywebform-81b01",
  storageBucket: "mywebform-81b01.firebasestorage.app",
  messagingSenderId: "284178824887",
  appId: "1:284178824887:web:b34bd1bd101aa67404d732"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Form Submit Handler
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
    } else {
      // Create new user
      await addDoc(collection(db, 'users'), { name, email, age });
    }
    resetForm();
    loadUsers(); // Reload the users list
  } catch (error) {
    console.error("Error saving data:", error);
    alert("Error saving data. Check console for details.");
  }
});

// Read Data (Realtime Listener)
function loadUsers() {
  const usersCollection = collection(db, 'users');
  onSnapshot(usersCollection, (snapshot) => {
    let html = '';
    snapshot.forEach((doc) => {
      const user = doc.data();
      html += `
        <tr>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${user.age}</td>
          <td>
            <button onclick="editUser('${doc.id}')" class="btn btn-sm btn-warning">Edit</button>
            <button onclick="deleteUser('${doc.id}')" class="btn btn-sm btn-danger">Delete</button>
          </td>
        </tr>
      `;
    });
    document.getElementById('usersList').innerHTML = html;
  });
}

// Edit User
async function editUser(id) {
  console.log("Editing user with ID:", id); // Debugging line
  try {
    const userDoc = doc(db, 'users', id);
    const docSnap = await getDoc(userDoc);
    if (docSnap.exists()) {
      const user = docSnap.data();
      document.getElementById('userId').value = id;
      document.getElementById('name').value = user.name || '';
      document.getElementById('email').value = user.email || '';
      document.getElementById('age').value = user.age || '';
    } else {
      console.error("User document does not exist.");
      alert("Error: User not found.");
    }
  } catch (error) {
    console.error("Error editing user:", error);
    alert("Error loading user data. Check console for details.");
  }
}

// Delete User
async function deleteUser(id) {
  console.log("Deleting user with ID:", id); // Debugging line
  if (confirm('Are you sure?')) {
    try {
      const userDoc = doc(db, 'users', id);
      await deleteDoc(userDoc);
      loadUsers(); // Reload the users list
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Error deleting user. Check console for details.");
    }
  }
}

// Reset Form
function resetForm() {
  document.getElementById('userId').value = '';
  document.getElementById('userForm').reset();
}

// Initial Load
loadUsers();

// Expose functions to global scope
window.editUser = editUser;
window.deleteUser = deleteUser;
