const firebaseConfig = {
  apiKey: "AIzaSyDjVs5MLZjh2iTHxy54WmyuoOf0kkjRpOA",
  authDomain: "mywebform-81b01.firebaseapp.com",
  projectId: "mywebform-81b01",
  storageBucket: "mywebform-81b01.appspot.com",
  messagingSenderId: "284178824887",
  appId: "1:284178824887:web:b34bd1bd101aa67404d732"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// DOM Elements
const userForm = document.getElementById('userForm');
const userId = document.getElementById('userId');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const ageInput = document.getElementById('age');
const perageInput = document.getElementById('perage');
const userDropdown = document.getElementById('userDropdown');
const usersList = document.getElementById('usersList');

// Form Submit Handler
userForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const userData = {
      name: nameInput.value,
      email: emailInput.value,
      age: ageInput.value,
      percentage: perageInput.value,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
  };

  try {
      if (userId.value) {
          await db.collection('users').doc(userId.value).update(userData);
      } else {
          await db.collection('users').add(userData);
      }
      resetForm();
  } catch (error) {
      console.error("Error saving user:", error);
      alert("Error saving user. Check console for details.");
  }
});

// Load Users into Dropdown Only
function loadUsers() {
  db.collection('users').onSnapshot(snapshot => {
      let options = '<option value="">Select User</option>';
      snapshot.forEach(doc => {
          const user = doc.data();
          options += `<option value="${doc.id}">${user.name}</option>`;
      });
      userDropdown.innerHTML = options;
  }, error => {
      console.error("Error loading users:", error);
  });
}

// Display Single Selected User
function displaySelectedUser(userId) {
  db.collection('users').doc(userId).get().then(doc => {
      if (doc.exists) {
          const user = doc.data();
          usersList.innerHTML = `
              <tr>
                  <td>${user.name}</td>
                  <td>${user.email}</td>
                  <td>${user.age}</td>
                  <td>
                      <button onclick="editUser('${doc.id}')">Edit</button>
                      <button onclick="deleteUser('${doc.id}')">Delete</button>
                  </td>
              </tr>
          `;
      }
  }).catch(error => {
      console.error("Error fetching user:", error);
      usersList.innerHTML = '<tr><td colspan="4">Error loading user</td></tr>';
  });
}

// Edit User
function editUser(id) {
  db.collection('users').doc(id).get().then(doc => {
      if (doc.exists) {
          const user = doc.data();
          userId.value = id;
          nameInput.value = user.name;
          emailInput.value = user.email;
          ageInput.value = user.age;
          perageInput.value = user.percentage;
      }
  }).catch(error => {
      console.error("Error editing user:", error);
  });
}

// Delete User
function deleteUser(id) {
  if (confirm('Are you sure you want to delete this user?')) {
      db.collection('users').doc(id).delete().catch(error => {
          console.error("Error deleting user:", error);
      });
  }
}

// Reset Form
function resetForm() {
  userForm.reset();
  userId.value = '';
  usersList.innerHTML = ''; // Clear table after form submission
}

// Dropdown Change Handler
userDropdown.addEventListener('change', (e) => {
  const selectedUserId = e.target.value;
  if (selectedUserId) {
      displaySelectedUser(selectedUserId);
  } else {
      usersList.innerHTML = ''; // Clear table when no user selected
  }
});


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
let editId = null;

// Save/Update Form Data
saveLaterForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = {
    amount: document.getElementById('tcsh').value,
    interest: document.getElementById('Lper').value,
    mobile: document.getElementById('Qno').value,
    date1: document.getElementById('date1').value,
    date2: document.getElementById('date2').value,
    fullName: document.getElementById('fullName').textContent,
    timestamp: new Date()
  };

  try {
    if(editId) {
      await updateDoc(doc(db, "applications", editId), formData);
      editId = null;
    } else {
      await addDoc(collection(db, "applications"), formData);
    }
    saveLaterForm.reset();
  } catch (error) {
    console.error("Error saving document: ", error);
  }
});

// Display Records with CRUD Operations
const renderApplications = (docs) => {
  const applicationsList = document.getElementById('applicationsList');
  applicationsList.innerHTML = '';
  
  docs.forEach(doc => {
    const data = doc.data();
    const recordElement = document.createElement('div');
    recordElement.className = 'application-item';
    recordElement.innerHTML = `
      <div class="app-info">
        <p><strong>${data.fullName}</strong></p>
        <p>Amount: ${data.amount} | Interest: ${data.interest}%</p>
        <p>Mobile: ${data.mobile} | Date: ${new Date(data.timestamp).toLocaleDateString()}</p>
      </div>
      <div class="app-actions">
        <button class="edit-btn" data-id="${doc.id}">✏️ Edit</button>
        <button class="delete-btn" data-id="${doc.id}">🗑️ Delete</button>
      </div>
    `;
    applicationsList.appendChild(recordElement);
  });

  // Add Edit Functionality
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const docId = e.target.dataset.id;
      const docSnap = await getDoc(doc(db, "applications", docId));
      
      if(docSnap.exists()) {
        const data = docSnap.data();
        document.getElementById('tcsh').value = data.amount;
        document.getElementById('Lper').value = data.interest;
        document.getElementById('Qno').value = data.mobile;
        document.getElementById('date1').value = data.date1;
        document.getElementById('date2').value = data.date2;
        editId = docId;
        window.scrollTo(0, 0);
      }
    });
  });

  // Add Delete Functionality
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      if(confirm('Are you sure you want to delete this application?')) {
        await deleteDoc(doc(db, "applications", e.target.dataset.id));
      }
    });
  });
};

// Real-time Listener
onSnapshot(collection(db, "applications"), (snapshot) => {
  renderApplications(snapshot.docs);
});

// Error Handling
const handleFirebaseError = (error) => {
  console.error('Firebase Error:', error);
  alert(`Error: ${error.message}`);
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadUsers();
  usersList.innerHTML = ''; // Ensure table is empty on initial load
});
