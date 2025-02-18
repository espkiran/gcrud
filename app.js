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
      await updateDoc(doc(db, 'users', userId), { name, email, age });
    } else {
      await addDoc(collection(db, 'users'), { name, email, age });
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
    if (userDoc.exists()) {
      const user = userDoc.data();
      document.getElementById('userId').value = id;
      document.getElementById('name').value = user.name || '';
      document.getElementById('email').value = user.email || '';
      document.getElementById('age').value = user.age || '';
      document.getElementById('mobile').value = user.mobile || '';
      document.getElementById('address').value = user.address || '';
      document.getElementById('income').value = user.income || '';
      document.getElementById('country').value = user.country || '';
      document.getElementById('city').value = user.city || '';
    } else {
      console.error("User document does not exist.");
      alert("Error: User not found.");
    }
  } catch (error) {
    console.error("Error editing user:", error);
    alert("Error loading user data. Check console for details.");
  }
}


async function deleteUser(id) {
  if (confirm('Are you sure?')) {
    try {
      await deleteDoc(doc(db, 'users', id));
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

document.getElementById('userForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const age = document.getElementById('age').value;
  const mobile = document.getElementById('mobile').value;
  const address = document.getElementById('address').value;
  const income = document.getElementById('income').value;
  const country = document.getElementById('country').value;
  const city = document.getElementById('city').value;
  const userId = document.getElementById('userId').value;

  try {
    if (userId) {
      // Update existing user
      await updateDoc(doc(db, 'users', userId), {
        name,
        email,
        age,
        mobile,
        address,
        income,
        country,
        city,
      });
    } else {
      // Add new user
      await addDoc(collection(db, 'users'), {
        name,
        email,
        age,
        mobile,
        address,
        income,
        country,
        city,
      });
    }
    resetForm();
    loadUsers(); // Reload the user list
  } catch (error) {
    console.error("Error saving data:", error);
    alert("Error saving data. Check console for details.");
  }
});

function loadUsers() {
  const usersCollection = collection(db, 'users');
  onSnapshot(usersCollection, 
    (snapshot) => {
      let html = '';
      let dropdownHtml = '<option value="">Select a user...</option>';
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
        dropdownHtml += `<option value="${doc.id}">${user.name} (${user.email})</option>`;
      });
      document.getElementById('usersList').innerHTML = html;
      document.getElementById('userDropdown').innerHTML = dropdownHtml;
    },
    (error) => {
      console.error("Error loading users:", error);
      alert("Error loading data. Check console for details.");
    }
  );
}

function handleUserSelection() {
  const selectedUserId = document.getElementById('userDropdown').value;
  if (selectedUserId) {
    editUser(selectedUserId);
  }
}
loadUsers();

// Expose functions to global scope
window.editUser = editUser;
window.deleteUser = deleteUser;
