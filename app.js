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
    loadUsers();
  } catch (error) {
    console.error("Error saving data:", error);
    alert("Error saving data. Check console for details.");
  }
});

// Load Users
function loadUsers() {
  const usersCollection = collection(db, 'users');
  onSnapshot(usersCollection, (snapshot) => {
    let tableHtml = ''; // HTML for the table
    let dropdownHtml = '<option value="">Select a user...</option>'; // HTML for the dropdown

    snapshot.forEach((doc) => {
      const user = doc.data();

      // Add user to the table
      tableHtml += `
        <tr>
          <td>${doc.id}</td>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${user.age}</td>
          <td>
            <button onclick="editUser('${doc.id}')" class="btn btn-warning">Edit</button>
            <button onclick="deleteUser('${doc.id}')" class="btn btn-danger">Delete</button>
          </td>
        </tr>
      `;

      // Add user to the dropdown
      dropdownHtml += `<option value="${doc.id}">${user.name} (${doc.id})</option>`;
    });

    // Update the table and dropdown in the DOM
    document.getElementById('usersList').innerHTML = tableHtml;
    document.getElementById('userDropdown').innerHTML = dropdownHtml;
  });
}

// Edit User
async function editUser(id) {
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
  if (confirm('Are you sure?')) {
    try {
      await deleteDoc(doc(db, 'users', id));
      loadUsers(); // Reload users after deletion
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

// Handle User Selection from Dropdown
document.getElementById('userDropdown').addEventListener('change', (e) => {
  const selectedUserId = e.target.value;
  if (selectedUserId) {
    editUser(selectedUserId); // Populate form fields when a user is selected
  }
});

// Initial Load
loadUsers();

// Expose functions to global scope
window.editUser = editUser;
window.deleteUser = deleteUser;
