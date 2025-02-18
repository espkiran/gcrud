import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { 
    getFirestore, collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot 
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
let selectedUserId = null;
let allUsers = [];

// Form Submission
document.getElementById('userForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const user = {
        name: document.getElementById('name').value,
        age: document.getElementById('age').value,
        mobile: document.getElementById('mobile').value,
        address: document.getElementById('address').value,
        income: document.getElementById('income').value,
        country: document.getElementById('country').value,
        city: document.getElementById('city').value,
        timestamp: new Date()
    };

    try {
        if(selectedUserId) {
            // Update existing user
            await updateDoc(doc(db, "users", selectedUserId), user);
        } else {
            // Add new user
            await addDoc(collection(db, "users"), user);
        }
        document.getElementById('userForm').reset();
        selectedUserId = null;
        document.getElementById('userDropdown').value = '';
    } catch (error) {
        console.error("Error saving document: ", error);
    }
});

// Load users into dropdown and list
const loadUsers = () => {
    onSnapshot(collection(db, "users"), (snapshot) => {
        allUsers = [];
        let dropdownHtml = '<option value="">Select User to Edit</option>';
        let listHtml = '';
        
        snapshot.forEach((doc) => {
            const user = { id: doc.id, ...doc.data() };
            allUsers.push(user);
            
            // For dropdown
            dropdownHtml += `
                <option value="${user.id}">${user.name} - ${user.mobile}</option>
            `;

            // For list
            listHtml += `
                <div class="user-item">
                    <h3>${user.name}</h3>
                    <p>Age: ${user.age}</p>
                    <p>Mobile: ${user.mobile}</p>
                    <p>Address: ${user.address}</p>
                    <p>Income: NPR ${user.income}</p>
                    <p>Location: ${user.city}, ${user.country}</p>
                    <button onclick="deleteUser('${user.id}')">Delete</button>
                </div>
            `;
        });

        document.getElementById('userDropdown').innerHTML = dropdownHtml;
        document.getElementById('usersList').innerHTML = listHtml;
    });
};

// Edit user selection
document.getElementById('userDropdown').addEventListener('change', (e) => {
    const userId = e.target.value;
    if(!userId) {
        document.getElementById('userForm').reset();
        selectedUserId = null;
        return;
    }
    
    const selectedUser = allUsers.find(user => user.id === userId);
    if(selectedUser) {
        document.getElementById('name').value = selectedUser.name;
        document.getElementById('age').value = selectedUser.age;
        document.getElementById('mobile').value = selectedUser.mobile;
        document.getElementById('address').value = selectedUser.address;
        document.getElementById('income').value = selectedUser.income;
        document.getElementById('country').value = selectedUser.country;
        document.getElementById('city').value = selectedUser.city;
        selectedUserId = selectedUser.id;
    }
});

// Search functionality
document.getElementById('searchInput').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredUsers = allUsers.filter(user => 
        user.name.toLowerCase().includes(searchTerm) || 
        user.mobile.includes(searchTerm)
    );

    const filteredHtml = filteredUsers.map(user => `
        <div class="user-item">
            <h3>${user.name}</h3>
            <p>Age: ${user.age}</p>
            <p>Mobile: ${user.mobile}</p>
            <p>Address: ${user.address}</p>
            <p>Income: NPR ${user.income}</p>
            <p>Location: ${user.city}, ${user.country}</p>
            <button onclick="deleteUser('${user.id}')">Delete</button>
        </div>
    `).join('');

    document.getElementById('usersList').innerHTML = filteredHtml;
});

// Delete User
window.deleteUser = async (id) => {
    if (confirm('Are you sure you want to delete this user?')) {
        await deleteDoc(doc(db, "users", id));
    }
};

// Initial Load
loadUsers();



// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
// import { 
//     getFirestore, collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot 
// } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// const firebaseConfig = {
//     apiKey: "AIzaSyDjVs5MLZjh2iTHxy54WmyuoOf0kkjRpOA",
//     authDomain: "mywebform-81b01.firebaseapp.com",
//     projectId: "mywebform-81b01",
//     storageBucket: "mywebform-81b01.firebasestorage.app",
//     messagingSenderId: "284178824887",
//     appId: "1:284178824887:web:b34bd1bd101aa67404d732"
// };

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// // Form Submission
// document.getElementById('userForm').addEventListener('submit', async (e) => {
//     e.preventDefault();
    
//     const user = {
//         name: document.getElementById('name').value,
//         age: document.getElementById('age').value,
//         mobile: document.getElementById('mobile').value,
//         address: document.getElementById('address').value,
//         income: document.getElementById('income').value,
//         country: document.getElementById('country').value,
//         city: document.getElementById('city').value,
//         timestamp: new Date()
//     };

//     try {
//         await addDoc(collection(db, "users"), user);
//         document.getElementById('userForm').reset();
//     } catch (error) {
//         console.error("Error adding document: ", error);
//     }
// });

// // Real-time Data Load
// const loadUsers = () => {
//     onSnapshot(collection(db, "users"), (snapshot) => {
//         let html = '';
//         snapshot.forEach((doc) => {
//             const user = doc.data();
//             html += `
//                 <div class="user-item">
//                     <h3>${user.name}</h3>
//                     <p>Age: ${user.age}</p>
//                     <p>Mobile: ${user.mobile}</p>
//                     <p>Address: ${user.address}</p>
//                     <p>Income: NPR ${user.income}</p>
//                     <p>Location: ${user.city}, ${user.country}</p>
//                     <button onclick="deleteUser('${doc.id}')">Delete</button>
//                 </div>
//             `;
//         });
//         document.getElementById('usersList').innerHTML = html;
//     });
// };

// // Delete User
// window.deleteUser = async (id) => {
//     if (confirm('Are you sure you want to delete this user?')) {
//         await deleteDoc(doc(db, "users", id));
//     }
// };

// // Initial Load
// loadUsers();
// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
// import {
//   getFirestore,
//   collection,
//   addDoc,
//   doc,
//   deleteDoc,
//   onSnapshot,
//   runTransaction,
//   query,
//   orderBy
// } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// const firebaseConfig = {
//   apiKey: "AIzaSyDjVs5MLZjh2iTHxy54WmyuoOf0kkjRpOA",
//   authDomain: "mywebform-81b01.firebaseapp.com",
//   projectId: "mywebform-81b01",
//   storageBucket: "mywebform-81b01.firebasestorage.app",
//   messagingSenderId: "284178824887",
//   appId: "1:284178824887:web:b34bd1bd101aa67404d732"
// };

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// const counterDocRef = doc(db, 'metadata', 'counter');

// document.getElementById('userForm').addEventListener('submit', async (e) => {
//   e.preventDefault();
//   const name = document.getElementById('name').value;
//   const email = document.getElementById('email').value;
//   const age = document.getElementById('age').value;

//   try {
//     const newSerialNumber = await runTransaction(db, async (transaction) => {
//       const counterDoc = await transaction.get(counterDocRef);
//       let nextSerialNumber = 1;

//       if (counterDoc.exists()) {
//         nextSerialNumber = counterDoc.data().value + 1;
//       }

//       transaction.set(counterDocRef, { value: nextSerialNumber });
//       return nextSerialNumber;
//     });

//     await addDoc(collection(db, 'users'), {
//       serialNumber: newSerialNumber,
//       name,
//       email,
//       age,
//       createdAt: new Date()
//     });

//     resetForm();
//   } catch (error) {
//     console.error("Error saving data:", error);
//     alert("Error saving data. Check console for details.");
//   }
// });

// function loadUsers() {
//   const usersQuery = query(collection(db, 'users'), orderBy('serialNumber'));
  
//   onSnapshot(usersQuery, (snapshot) => {
//     const usersList = document.getElementById('usersList');
//     usersList.innerHTML = '';

//     snapshot.forEach((doc) => {
//       const user = doc.data();
//       const userDiv = document.createElement('div');
//       userDiv.style.margin = '10px 0';
//       userDiv.style.padding = '15px';
//       userDiv.style.border = '1px solid #ddd';
//       userDiv.style.borderRadius = '5px';

//       userDiv.innerHTML = `
//         <p style="margin: 5px 0;">
//           Serial number ${user.serialNumber}, 
//           Name: ${user.name}, 
//           Email: ${user.email}, 
//           Age: ${user.age}
//         </p>
//         <button onclick="deleteUser('${doc.id}')" 
//           style="padding: 5px 10px;
//                  background-color: #ff4444;
//                  color: white;
//                  border: none;
//                  border-radius: 3px;
//                  cursor: pointer;">
//           Delete
//         </button>
//       `;

//       usersList.appendChild(userDiv);
//     });
//   });
// }

// window.deleteUser = async (id) => {
//   if (confirm('Are you sure you want to delete this user?')) {
//     try {
//       await deleteDoc(doc(db, 'users', id));
//     } catch (error) {
//       console.error("Error deleting user:", error);
//       alert("Error deleting user. Check console for details.");
//     }
//   }
// };

// function resetForm() {
//   document.getElementById('userForm').reset();
// }

// // Initialize
// loadUsers();
