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
let allUsers = [];

// Form Submission
document.getElementById('userForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const userData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    age: document.getElementById('age').value,
    mobile: document.getElementById('mobile').value,
    address: document.getElementById('address').value,
    income: document.getElementById('income').value,
    country: document.getElementById('country').value,
    city: document.getElementById('city').value,
    timestamp: new Date()
  };

  const userId = document.getElementById('userId').value;

  try {
    if (userId) {
      await updateDoc(doc(db, 'users', userId), userData);
    } else {
      await addDoc(collection(db, 'users'), userData);
    }
    resetForm();
  } catch (error) {
    console.error("Error saving data:", error);
    alert("Error saving data. Check console for details.");
  }
});

// Load Users and populate dropdown
function loadUsers() {
  onSnapshot(collection(db, 'users'), (snapshot) => {
    allUsers = [];
    let usersHtml = '';
    let dropdownHtml = '<option value="">Select a user</option>';

    snapshot.forEach((doc) => {
      const user = { id: doc.id, ...doc.data() };
      allUsers.push(user);

      // For users list
      usersHtml += `
        <div class="user-card">
          <h3>${user.name}</h3>
          <p>Email: ${user.email}</p>
          <p>Age: ${user.age}</p>
          <p>Mobile: ${user.mobile}</p>
          <p>Address: ${user.address}</p>
          <p>Income: NPR ${user.income}</p>
          <p>Location: ${user.city}, ${user.country}</p>
          <button onclick="editUser('${user.id}')">Edit</button>
          <button onclick="deleteUser('${user.id}')">Delete</button>
        </div>
      `;

      // For dropdown
      dropdownHtml += `<option value="${user.id}">${user.name} (${user.mobile})</option>`;
    });

    document.getElementById('usersList').innerHTML = usersHtml;
    document.getElementById('userDropdown').innerHTML = dropdownHtml;
  });
}

// Edit User
window.editUser = async (id) => {
  try {
    const docRef = doc(db, 'users', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const user = docSnap.data();
      document.getElementById('userId').value = id;
      document.getElementById('name').value = user.name;
      document.getElementById('email').value = user.email;
      document.getElementById('age').value = user.age;
      document.getElementById('mobile').value = user.mobile;
      document.getElementById('address').value = user.address;
      document.getElementById('income').value = user.income;
      document.getElementById('country').value = user.country;
      document.getElementById('city').value = user.city;
    }
  } catch (error) {
    console.error("Error editing user:", error);
    alert("Error loading user data.");
  }
};

// Delete User
window.deleteUser = async (id) => {
  if (confirm('Are you sure you want to delete this user?')) {
    try {
      await deleteDoc(doc(db, 'users', id));
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Error deleting user.");
    }
  }
};

// Search functionality
document.getElementById('searchInput').addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const filteredUsers = allUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm) ||
    user.mobile.includes(searchTerm)
  );

  const filteredHtml = filteredUsers.map(user => `
    <div class="user-card">
      <h3>${user.name}</h3>
      <p>Email: ${user.email}</p>
      <p>Mobile: ${user.mobile}</p>
      <p>Address: ${user.address}</p>
      <button onclick="editUser('${user.id}')">Edit</button>
      <button onclick="deleteUser('${user.id}')">Delete</button>
    </div>
  `).join('');

  document.getElementById('usersList').innerHTML = filteredHtml;
});

// Handle dropdown selection
document.getElementById('userDropdown').addEventListener('change', (e) => {
  const userId = e.target.value;
  if (userId) editUser(userId);
});

// Reset form
function resetForm() {
  document.getElementById('userId').value = '';
  document.getElementById('userForm').reset();
  document.getElementById('userDropdown').value = '';
}

// Initial load
loadUsers();
