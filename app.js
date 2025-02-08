// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
// const app = initializeApp(firebaseConfig);

// Firebase Configuration (Replace with your values)
// const firebaseConfig = {
//     apiKey: "YOUR_API_KEY",
//     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
//     projectId: "YOUR_PROJECT_ID",
//     storageBucket: "YOUR_PROJECT_ID.appspot.com",
//     messagingSenderId: "YOUR_SENDER_ID",
//     appId: "YOUR_APP_ID"
//   };
  
  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  
  // Form Submit Handler
  document.getElementById('userForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const age = document.getElementById('age').value;
    const userId = document.getElementById('userId').value;
  
    if (userId) {
      // Update existing user
      await db.collection('users').doc(userId).update({ name, email, age });
    } else {
      // Create new user
      await db.collection('users').add({ name, email, age });
    }
  
    resetForm();
    loadUsers();
  });
  
  // Read Data (Realtime Listener)
  function loadUsers() {
    db.collection('users').onSnapshot((snapshot) => {
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
    const doc = await db.collection('users').doc(id).get();
    const user = doc.data();
    document.getElementById('userId').value = id;
    document.getElementById('name').value = user.name;
    document.getElementById('email').value = user.email;
    document.getElementById('age').value = user.age;
  }
  
  // Delete User
  async function deleteUser(id) {
    if (confirm('Are you sure?')) {
      await db.collection('users').doc(id).delete();
    }
  }
  
  // Reset Form
  function resetForm() {
    document.getElementById('userId').value = '';
    document.getElementById('userForm').reset();
  }
  
  // Initial Load
  loadUsers();