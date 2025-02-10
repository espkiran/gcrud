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
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Your web app's Firebase configuration
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

  if (userId) {
    // Update existing user
    await updateDoc(doc(db, 'users', userId), { name, email, age });
  } else {
    // Create new user
    await addDoc(collection(db, 'users'), { name, email, age });
  }

  resetForm();
  loadUsers();
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
  const userDoc = doc(db, 'users', id);
  const docSnap = await getDoc(userDoc);
  const user = docSnap.data();
  document.getElementById('userId').value = id;
  document.getElementById('name').value = user.name;
  document.getElementById('email').value = user.email;
  document.getElementById('age').value = user.age;
}

// Delete User
async function deleteUser(id) {
  if (confirm('Are you sure?')) {
    await deleteDoc(doc(db, 'users', id));
  }
}

// Reset Form
function resetForm() {
  document.getElementById('userId').value = '';
  document.getElementById('userForm').reset();
}

// Initial Load
loadUsers();