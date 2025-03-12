import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js';
// import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';

import {
  getFirestore, collection, addDoc, doc, updateDoc, deleteDoc,
  onSnapshot, getDoc, timestamp
} from 'https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyDjVs5MLZjh2iTHxy54WmyuoOf0kkjRpOA",
  authDomain: "mywebform-81b01.firebaseapp.com",
  projectId: "mywebform-81b01",
  storageBucket: "mywebform-81b01.appspot.com",
  messagingSenderId: "284178824887",
  appId: "1:284178824887:web:b34bd1bd101aa67404d732"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const usersCollection = collection(db, 'users');

// DOM Elements
const userForm = document.getElementById('userForm');
const userIdInput = document.getElementById('userId'); 
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const ageInput = document.getElementById('age');
const percentageInput = document.getElementById('percentage');
const userDropdown = document.getElementById('userDropdown');
const usersList = document.getElementById('usersList');
const resetBtn = document.getElementById('resetBtn'); // Reference to reset button

// Event Delegation for Dynamic Buttons
usersList.addEventListener('click', async (e) => {
  const target = e.target;
  if (target.classList.contains('delete-btn')) {
    const userId = target.dataset.id;
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        alert('User deleted successfully!');
      } catch (error) {
        console.error('Delete error:', error);
        alert('Error deleting user');
      }
    }
  }
  if (target.classList.contains('edit-btn')) {
    const userId = target.dataset.id;
    await handleEditUser(userId);
  }
});

// User Selection Handler
userDropdown.addEventListener('change', async (e) => {
  const selectedId = e.target.value;
  if (selectedId) {
    try {
      const docSnap = await getDoc(doc(db, 'users', selectedId));
      if (docSnap.exists()) {
        const user = docSnap.data();
        usersList.innerHTML = `
          <tr>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.age}</td>
            <td>${user.percentage}</td>
            <td>
              <button class="edit-btn" data-id="${docSnap.id}">Edit</button>
              <button class="delete-btn" data-id="${docSnap.id}">Delete</button>
            </td>
          </tr>
        `;
      }
    } catch (error) {
      console.error('Error loading user:', error);
      alert('Error loading user details');
    }
  } else {
    loadAllUsers();
  }
});

// Form Submit Handler
userForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const userData = {
    name: nameInput.value,
    email: emailInput.value,
    age: ageInput.value,
    percentage: percentageInput.value,
    timestamp: serverTimestamp()
  };

  try {
    if (userIdInput.value) {
      await updateDoc(doc(db, 'users', userIdInput.value), userData);
      alert('User updated successfully!');
    } else {
      await addDoc(usersCollection, userData);
      alert('User added successfully!');
    }
    resetForm(); // Reset the form after submission
    loadAllUsers();
  } catch (error) {
    console.error('Error:', error);
    alert(`Error: ${error.message}`);
  }
});

// Reset Button Handler
resetBtn.addEventListener('click', () => {
  resetForm();
});

// Edit User Function
async function handleEditUser(userDocId) {
  try {
    const docSnap = await getDoc(doc(db, 'users', userDocId));
    if (docSnap.exists()) {
      const user = docSnap.data();
      userIdInput.value = docSnap.id;
      nameInput.value = user.name;
      emailInput.value = user.email || '';
      ageInput.value = user.age || '';
      percentageInput.value = user.percentage || '';
    }
  } catch (error) {
    console.error('Edit error:', error);
    alert('Error loading user for editing');
  }
}

// Load All Users
function loadAllUsers() {
  onSnapshot(usersCollection, (snapshot) => {
    usersList.innerHTML = '';
    userDropdown.innerHTML = '<option value="">Select User</option>';

    snapshot.forEach(doc => {
      const user = doc.data();
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.age}</td>
        <td>${user.percentage}</td>
        <td>
          <button class="edit-btn" data-id="${doc.id}">Edit</button>
          <button class="delete-btn" data-id="${doc.id}">Delete</button>
        </td>
      `;
      usersList.appendChild(row);

      const option = document.createElement('option');
      option.value = doc.id;
      option.textContent = user.name;
      userDropdown.appendChild(option);
    });
  });
}

// Reset Form Function
function resetForm() {
  userForm.reset();          // Resets all form fields
  userIdInput.value = '';    // Clear hidden input holding user ID
  userDropdown.value = '';   // Reset the dropdown selection
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  loadAllUsers();
});
