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

// Utility Functions
function limitInputLength(element, maxLength) {
    if (element.value.length > maxLength) {
        element.value = element.value.slice(0, maxLength);
    }
}

// Convert numbers to Nepali words
function convertToNepaliWords(number) {
    // Add your Nepali number conversion logic here
    // This is a placeholder - implement actual conversion
    return number.toString() + " in Nepali";
}

// Initialize date pickers
$(document).ready(function() {
    $('.date-picker').nepaliDatePicker({
        ndpYear: true,
        ndpMonth: true,
        ndpYearCount: 10
    });
});

// Form data collection
function getLoanFormData() {
    return {
        tcsh: document.getElementById('tcsh').value,
        loanPercentage: document.getElementById('Lper').value,
        mobileNumber: document.getElementById('Qno').value,
        date1: document.getElementById('date1').value,
        date2: document.getElementById('date2').value,
        date3: document.getElementById('date3').value,
        date4: document.getElementById('date4').value,
        iwe: document.getElementById('iwe').value,
        loanWork: document.getElementById('loanWork').value,
        loanType: document.getElementById('ltype').value,
        chhu: document.getElementById('chhu').value,
        timestamp: new Date()
    };
}

// Convert buttons functionality
document.getElementById('convert').addEventListener('click', function() {
    const amount = document.getElementById('tcsh').value;
    const output = convertToNepaliWords(amount);
    document.getElementById('output2').textContent = output;
});

// Handle date conversions
['convert1', 'convert2', 'convert3', 'convert4'].forEach(id => {
    document.getElementById(id).addEventListener('click', function() {
        const dateId = id.replace('convert', '');
        const dateInput = document.getElementById('date' + dateId);
        const dateValue = dateInput.value;
        // Convert date logic here - implement as needed
        console.log(`Converting date ${dateId}: ${dateValue}`);
    });
});

// Loan type and work type population
function populateLoanTypes() {
    const loanTypes = [
        "व्यापार कर्जा",
        "कृषि कर्जा",
        "शैक्षिक कर्जा",
        "घर कर्जा"
    ];

    const loanWorks = [
        "व्यापार",
        "कृषि",
        "शिक्षा",
        "घर निर्माण"
    ];

    const ltypeSelect = document.getElementById('ltype');
    const loanWorkSelect = document.getElementById('loanWork');

    loanTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        ltypeSelect.appendChild(option);
    });

    loanWorks.forEach(work => {
        const option = document.createElement('option');
        option.value = work;
        option.textContent = work;
        loanWorkSelect.appendChild(option);
    });
}

// User Form Submit Handler
document.getElementById('userForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        const userData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            age: document.getElementById('age').value,
            loanDetails: getLoanFormData()
        };

        const userId = document.getElementById('userId').value;

        if (userId) {
            await updateDoc(doc(db, 'users', userId), userData);
            alert('User updated successfully!');
        } else {
            await addDoc(collection(db, 'users'), userData);
            alert('User added successfully!');
        }
        
        resetForm();
        loadUsers();
    } catch (error) {
        console.error("Error saving data:", error);
        alert("Error saving data: " + error.message);
    }
});

// Load Users
function loadUsers() {
    const usersCollection = collection(db, 'users');
    onSnapshot(usersCollection, (snapshot) => {
        const tableBody = document.getElementById('usersList');
        const dropdown = document.getElementById('userDropdown');
        
        tableBody.innerHTML = '';
        dropdown.innerHTML = '<option value="">Select a user...</option>';

        snapshot.forEach((doc) => {
            const user = doc.data();
            
            // Add to table
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${doc.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.age}</td>
                <td>
                    <button onclick="window.editUser('${doc.id}')" class="btn btn-warning">Edit</button>
                    <button onclick="window.deleteUser('${doc.id}')" class="btn btn-danger">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);

            // Add to dropdown
            const option = document.createElement('option');
            option.value = doc.id;
            option.textContent = `${user.name} (${doc.id})`;
            dropdown.appendChild(option);
        });
    });
}

// Edit User
async function editUser(id) {
    try {
        const userDoc = await getDoc(doc(db, 'users', id));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            document.getElementById('userId').value = id;
            document.getElementById('name').value = userData.name || '';
            document.getElementById('email').value = userData.email || '';
            document.getElementById('age').value = userData.age || '';

            // Populate loan form if exists
            if (userData.loanDetails) {
                const loan = userData.loanDetails;
                document.getElementById('tcsh').value = loan.tcsh || '';
                document.getElementById('Lper').value = loan.loanPercentage || '';
                document.getElementById('Qno').value = loan.mobileNumber || '';
                // ... populate other loan fields
            }
        }
    } catch (error) {
        console.error("Error editing user:", error);
        alert("Error loading user data: " + error.message);
    }
}

// Delete User
async function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        try {
            await deleteDoc(doc(db, 'users', id));
            alert('User deleted successfully!');
            resetForm();
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Error deleting user: " + error.message);
        }
    }
}

// Reset Form
function resetForm() {
    document.getElementById('userId').value = '';
    document.getElementById('userForm').reset();
    document.getElementById('save-later-form').reset();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    populateLoanTypes();
    loadUsers();
});

// Expose functions to window
window.editUser = editUser;
window.deleteUser = deleteUser;
window.limitInputLength = limitInputLength;




// // Import Firebase modules
// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
// import {
//   getFirestore,
//   collection,
//   addDoc,
//   doc,
//   updateDoc,
//   deleteDoc,
//   onSnapshot,
//   getDoc,
// } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// // Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyDjVs5MLZjh2iTHxy54WmyuoOf0kkjRpOA",
//   authDomain: "mywebform-81b01.firebaseapp.com",
//   projectId: "mywebform-81b01",
//   storageBucket: "mywebform-81b01.firebasestorage.app",
//   messagingSenderId: "284178824887",
//   appId: "1:284178824887:web:b34bd1bd101aa67404d732"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// // Form Submit Handler
// document.getElementById('userForm').addEventListener('submit', async (e) => {
//   e.preventDefault();
//   const name = document.getElementById('name').value;
//   const email = document.getElementById('email').value;
//   const age = document.getElementById('age').value;
//   const userId = document.getElementById('userId').value;

//   try {
//     if (userId) {
//       // Update existing user
//       await updateDoc(doc(db, 'users', userId), { name, email, age });
//     } else {
//       // Create new user
//       await addDoc(collection(db, 'users'), { name, email, age });
//     }
//     resetForm();
//     loadUsers();
//   } catch (error) {
//     console.error("Error saving data:", error);
//     alert("Error saving data. Check console for details.");
//   }
// });

// // Load Users
// function loadUsers() {
//   const usersCollection = collection(db, 'users');
//   onSnapshot(usersCollection, (snapshot) => {
//     let tableHtml = ''; // HTML for the table
//     let dropdownHtml = '<option value="">Select a user...</option>'; // HTML for the dropdown

//     snapshot.forEach((doc) => {
//       const user = doc.data();

//       // Add user to the table
//       tableHtml += `
//         <tr>
//           <td>${doc.id}</td>
//           <td>${user.name}</td>
//           <td>${user.email}</td>
//           <td>${user.age}</td>
//           <td>
//             <button onclick="editUser('${doc.id}')" class="btn btn-warning">Edit</button>
//             <button onclick="deleteUser('${doc.id}')" class="btn btn-danger">Delete</button>
//           </td>
//         </tr>
//       `;

//       // Add user to the dropdown
//       dropdownHtml += `<option value="${doc.id}">${user.name} (${doc.id})</option>`;
//     });

//     // Update the table and dropdown in the DOM
//     document.getElementById('usersList').innerHTML = tableHtml;
//     document.getElementById('userDropdown').innerHTML = dropdownHtml;
//   });
// }

// // Edit User
// async function editUser(id) {
//   try {
//     const userDoc = doc(db, 'users', id);
//     const docSnap = await getDoc(userDoc);
//     if (docSnap.exists()) {
//       const user = docSnap.data();
//       document.getElementById('userId').value = id;
//       document.getElementById('name').value = user.name || '';
//       document.getElementById('email').value = user.email || '';
//       document.getElementById('age').value = user.age || '';
//     } else {
//       console.error("User document does not exist.");
//       alert("Error: User not found.");
//     }
//   } catch (error) {
//     console.error("Error editing user:", error);
//     alert("Error loading user data. Check console for details.");
//   }
// }

// // Delete User
// async function deleteUser(id) {
//   if (confirm('Are you sure?')) {
//     try {
//       await deleteDoc(doc(db, 'users', id));
//       loadUsers(); // Reload users after deletion
//     } catch (error) {
//       console.error("Error deleting user:", error);
//       alert("Error deleting user. Check console for details.");
//     }
//   }
// }

// // Reset Form
// function resetForm() {
//   document.getElementById('userId').value = '';
//   document.getElementById('userForm').reset();
// }

// // Handle User Selection from Dropdown
// document.getElementById('userDropdown').addEventListener('change', (e) => {
//   const selectedUserId = e.target.value;
//   if (selectedUserId) {
//     editUser(selectedUserId); // Populate form fields when a user is selected
//   }
// });

// // Initial Load
// loadUsers();

// // Expose functions to global scope
// window.editUser = editUser;
// window.deleteUser = deleteUser;
