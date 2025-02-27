import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js';
// import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';

import {
    getFirestore, collection, addDoc, doc, updateDoc, deleteDoc,
    onSnapshot, getDoc, serverTimestamp
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
const userIdInput = document.getElementById('userId'); // Changed variable name
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const ageInput = document.getElementById('age');
const percentageInput = document.getElementById('percentage');
const userDropdown = document.getElementById('userDropdown');
const usersList = document.getElementById('usersList');

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
        resetForm();
        loadAllUsers();
    } catch (error) {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);
    }
});

// Edit User Function
async function handleEditUser(userDocId) { // Changed parameter name
    try {
        const docSnap = await getDoc(doc(db, 'users', userDocId));
        if (docSnap.exists()) {
            const user = docSnap.data();
            userIdInput.value = docSnap.id; // Use the renamed DOM element
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

// Reset Form
function resetForm() {
    userForm.reset();
    userIdInput.value = '';
    userDropdown.value = '';
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadAllUsers();
});


// import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
// import {
//     getFirestore, collection, addDoc, doc, updateDoc, deleteDoc,
//     onSnapshot, getDoc, serverTimestamp
// } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';

// const firebaseConfig = {
//     apiKey: "AIzaSyDjVs5MLZjh2iTHxy54WmyuoOf0kkjRpOA",
//     authDomain: "mywebform-81b01.firebaseapp.com",
//     projectId: "mywebform-81b01",
//     storageBucket: "mywebform-81b01.appspot.com",
//     messagingSenderId: "284178824887",
//     appId: "1:284178824887:web:b34bd1bd101aa67404d732"
// };

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// const usersCollection = collection(db, 'users');

// // DOM Elements
// const userForm = document.getElementById('userForm');
// const userId = document.getElementById('userId');
// const nameInput = document.getElementById('name');
// const emailInput = document.getElementById('email');
// const ageInput = document.getElementById('age');
// const percentageInput = document.getElementById('percentage');
// const userDropdown = document.getElementById('userDropdown');
// const usersList = document.getElementById('usersList');

// // Event Delegation for Dynamic Elements
// usersList.addEventListener('click', async (e) => {
//     const target = e.target;
    
//     if (target.classList.contains('edit-btn')) {
//         const userId = target.dataset.id;
//         await handleEditUser(userId);
//     }
    
//     if (target.classList.contains('delete-btn')) {
//         const userId = target.dataset.id;
//         await handleDeleteUser(userId);
//     }
// });

// // Initialize Real-time Listener
// onSnapshot(usersCollection, (snapshot) => {
//     userDropdown.innerHTML = '<option value="">Select User</option>';
//     usersList.innerHTML = '';
    
//     snapshot.forEach(doc => {
//         // Update dropdown
//         const option = document.createElement('option');
//         option.value = doc.id;
//         option.textContent = doc.data().name;
//         userDropdown.appendChild(option);

//         // Update table
//         const user = doc.data();
//         const row = document.createElement('tr');
//         row.innerHTML = `
//             <td>${user.name}</td>
//             <td>${user.email}</td>
//             <td>${user.age}</td>
//             <td>${user.percentage}</td>
//             <td>
//                 <button class="edit-btn" data-id="${doc.id}">Edit</button>
//                 <button class="delete-btn" data-id="${doc.id}">Delete</button>
//             </td>
//         `;
//         usersList.appendChild(row);
//     });
// });

// // Form Submit Handler
// userForm.addEventListener('submit', async (e) => {
//     e.preventDefault();
    
//     const userData = {
//         name: nameInput.value,
//         email: emailInput.value,
//         age: ageInput.value,
//         percentage: percentageInput.value,
//         timestamp: serverTimestamp()
//     };

//     try {
//         if (userId.value) {
//             await updateDoc(doc(db, 'users', userId.value), userData);
//             alert('User updated successfully!');
//         } else {
//             await addDoc(usersCollection, userData);
//             alert('User added successfully!');
//         }
//         userForm.reset();
//         userId.value = '';
//     } catch (error) {
//         console.error('Error:', error);
//         alert(`Error: ${error.message}`);
//     }
// });

// // Edit User Handler
// async function handleEditUser(userId) {
//     try {
//         const docSnap = await getDoc(doc(db, 'users', userId));
//         if (docSnap.exists()) {
//             const user = docSnap.data();
//             userId.value = docSnap.id;
//             nameInput.value = user.name;
//             emailInput.value = user.email;
//             ageInput.value = user.age;
//             percentageInput.value = user.percentage;
//         }
//     } catch (error) {
//         console.error('Edit error:', error);
//         alert('Error loading user for editing');
//     }
// }

// // Delete User Handler
// async function handleDeleteUser(userId) {
//     if (confirm('Are you sure you want to delete this user?')) {
//         try {
//             await deleteDoc(doc(db, 'users', userId));
//             alert('User deleted successfully!');
//         } catch (error) {
//             console.error('Delete error:', error);
//             alert('Error deleting user');
//         }
//     }
// }


// // import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
// // import {
// //     getFirestore,
// //     collection,
// //     addDoc,
// //     doc,
// //     updateDoc,
// //     deleteDoc,
// //     onSnapshot,
// //     getDoc,
// //     serverTimestamp
// // } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';

// // const firebaseConfig = {
// //     apiKey: "AIzaSyDjVs5MLZjh2iTHxy54WmyuoOf0kkjRpOA",
// //     authDomain: "mywebform-81b01.firebaseapp.com",
// //     projectId: "mywebform-81b01",
// //     storageBucket: "mywebform-81b01.appspot.com",
// //     messagingSenderId: "284178824887",
// //     appId: "1:284178824887:web:b34bd1bd101aa67404d732"
// // };

// // const app = initializeApp(firebaseConfig);
// // const db = getFirestore(app);

// // // DOM Elements
// // const userForm = document.getElementById('userForm');
// // const userId = document.getElementById('userId');
// // const nameInput = document.getElementById('name');
// // const emailInput = document.getElementById('email');
// // const ageInput = document.getElementById('age');
// // const percentageInput = document.getElementById('percentage');
// // const userDropdown = document.getElementById('userDropdown');
// // const usersList = document.getElementById('usersList');
// // const resetButton = document.getElementById('resetButton');

// // // Firestore Collection Reference
// // const usersRef = collection(db, 'users');

// // // Initialize App
// // document.addEventListener('DOMContentLoaded', () => {
// //     setupRealTimeListeners();
// //     setupEventHandlers();
// // });

// // function setupRealTimeListeners() {
// //     // Real-time updates for users list
// //     onSnapshot(usersRef, (snapshot) => {
// //         updateUserDropdown(snapshot);
// //         updateUsersTable(snapshot);
// //     });
// // }

// // function setupEventHandlers() {
// //     // Form submission
// //     userForm.addEventListener('submit', async (e) => {
// //         e.preventDefault();
// //         await handleFormSubmit();
// //     });

// //     // Reset form
// //     resetButton.addEventListener('click', resetForm);

// //     // User selection
// //     userDropdown.addEventListener('change', handleUserSelection);

// //     // Table actions
// //     usersList.addEventListener('click', handleTableActions);
// // }

// // async function handleFormSubmit() {
// //     const userData = {
// //         name: nameInput.value,
// //         email: emailInput.value,
// //         age: ageInput.value,
// //         percentage: percentageInput.value,
// //         timestamp: serverTimestamp()
// //     };

// //     try {
// //         if (userId.value) {
// //             await updateDoc(doc(db, 'users', userId.value), userData);
// //             alert('User updated successfully!');
// //         } else {
// //             await addDoc(usersRef, userData);
// //             alert('User added successfully!');
// //         }
// //         resetForm();
// //     } catch (error) {
// //         console.error('Error:', error);
// //         alert(`Error: ${error.message}`);
// //     }
// // }

// // function updateUserDropdown(snapshot) {
// //     userDropdown.innerHTML = '<option value="">Select User</option>';
// //     snapshot.forEach(doc => {
// //         const option = document.createElement('option');
// //         option.value = doc.id;
// //         option.textContent = doc.data().name;
// //         userDropdown.appendChild(option);
// //     });
// // }

// // function updateUsersTable(snapshot) {
// //     usersList.innerHTML = '';
// //     snapshot.forEach(doc => {
// //         const user = doc.data();
// //         const row = document.createElement('tr');
        
// //         row.innerHTML = `
// //             <td>${user.name}</td>
// //             <td>${user.email}</td>
// //             <td>${user.age}</td>
// //             <td>${user.percentage}</td>
// //             <td>
// //                 <button class="edit-btn" data-id="${doc.id}">Edit</button>
// //                 <button class="delete-btn" data-id="${doc.id}">Delete</button>
// //             </td>
// //         `;
// //         usersList.appendChild(row);
// //     });
// // }

// // async function handleUserSelection(e) {
// //     const userId = e.target.value;
// //     if (!userId) return;

// //     try {
// //         const docSnap = await getDoc(doc(db, 'users', userId));
// //         if (docSnap.exists()) {
// //             populateForm(docSnap);
// //         }
// //     } catch (error) {
// //         console.error('Error loading user:', error);
// //         alert('Error loading user details');
// //     }
// // }

// // function handleTableActions(e) {
// //     if (e.target.classList.contains('delete-btn')) {
// //         handleDeleteUser(e.target.dataset.id);
// //     }
// //     if (e.target.classList.contains('edit-btn')) {
// //         handleEditUser(e.target.dataset.id);
// //     }
// // }

// // async function handleDeleteUser(userId) {
// //     if (confirm('Are you sure you want to delete this user?')) {
// //         try {
// //             await deleteDoc(doc(db, 'users', userId));
// //             alert('User deleted successfully!');
// //         } catch (error) {
// //             console.error('Delete error:', error);
// //             alert('Error deleting user');
// //         }
// //     }
// // }

// // async function handleEditUser(userId) {
// //     try {
// //         const docSnap = await getDoc(doc(db, 'users', userId));
// //         if (docSnap.exists()) {
// //             populateForm(docSnap);
// //         }
// //     } catch (error) {
// //         console.error('Edit error:', error);
// //         alert('Error loading user for editing');
// //     }
// // }

// // function populateForm(docSnap) {
// //     const user = docSnap.data();
// //     userId.value = docSnap.id;
// //     nameInput.value = user.name;
// //     emailInput.value = user.email;
// //     ageInput.value = user.age;
// //     percentageInput.value = user.percentage;
// // }

// // function resetForm() {
// //     userForm.reset();
// //     userId.value = '';
// //     userDropdown.value = '';
// // }





// // // import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
// // // import {
// // //     getFirestore,
// // //     collection,
// // //     addDoc,
// // //     doc,
// // //     updateDoc,
// // //     deleteDoc,
// // //     onSnapshot,
// // //     serverTimestamp,
// // //     getDoc // Add this missing import
// // // } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';

// // // const firebaseConfig = {
// // //     apiKey: "AIzaSyDjVs5MLZjh2iTHxy54WmyuoOf0kkjRpOA",
// // //     authDomain: "mywebform-81b01.firebaseapp.com",
// // //     projectId: "mywebform-81b01",
// // //     storageBucket: "mywebform-81b01.appspot.com",
// // //     messagingSenderId: "284178824887",
// // //     appId: "1:284178824887:web:b34bd1bd101aa67404d732"
// // // };

// // // Rest of your existing code remains the same...



// // // import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
// // // import {
// // //     getFirestore,
// // //     collection,
// // //     addDoc,
// // //     doc,
// // //     updateDoc,
// // //     deleteDoc,
// // //     onSnapshot,
// // //     serverTimestamp
// // // } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';

// // // const firebaseConfig = {
// // //     apiKey: "AIzaSyDjVs5MLZjh2iTHxy54WmyuoOf0kkjRpOA",
// // //     authDomain: "mywebform-81b01.firebaseapp.com",
// // //     projectId: "mywebform-81b01",
// // //     storageBucket: "mywebform-81b01.appspot.com",
// // //     messagingSenderId: "284178824887",
// // //     appId: "1:284178824887:web:b34bd1bd101aa67404d732"
// // // };

// // // // Initialize Firebase
// // // const app = initializeApp(firebaseConfig);
// // // const db = getFirestore(app);
// // // const usersCollection = collection(db, 'users');

// // // // DOM Elements
// // // const userForm = document.getElementById('userForm');
// // // const userId = document.getElementById('userId');
// // // const nameInput = document.getElementById('name');
// // // const emailInput = document.getElementById('email');
// // // const ageInput = document.getElementById('age');
// // // const percentageInput = document.getElementById('percentage');
// // // const userDropdown = document.getElementById('userDropdown');
// // // const usersList = document.getElementById('usersList');
// // // const resetBtn = document.getElementById('resetBtn');

// // // // Form Submit Handler
// // // userForm.addEventListener('submit', async (e) => {
// // //     e.preventDefault();
    
// // //     const userData = {
// // //         name: nameInput.value,
// // //         email: emailInput.value,
// // //         age: ageInput.value,
// // //         percentage: percentageInput.value,
// // //         timestamp: serverTimestamp()
// // //     };

// // //     try {
// // //         if (userId.value) {
// // //             await updateDoc(doc(db, 'users', userId.value), userData);
// // //             alert('User updated successfully!');
// // //         } else {
// // //             await addDoc(usersCollection, userData);
// // //             alert('User added successfully!');
// // //         }
// // //         resetForm();
// // //     } catch (error) {
// // //         console.error('Error:', error);
// // //         alert(`Error: ${error.message}`);
// // //     }
// // // });

// // // // Reset Form
// // // resetBtn.addEventListener('click', resetForm);

// // // // Real-time Data Sync
// // // const setupRealtimeUpdates = () => {
// // //     onSnapshot(usersCollection, (snapshot) => {
// // //         // Update dropdown
// // //         userDropdown.innerHTML = '<option value="">Select User</option>';
        
// // //         // Update user list
// // //         usersList.innerHTML = '';
        
// // //         snapshot.forEach(doc => {
// // //             const user = doc.data();
            
// // //             // Add to dropdown
// // //             const option = document.createElement('option');
// // //             option.value = doc.id;
// // //             option.textContent = user.name;
// // //             userDropdown.appendChild(option);

// // //             // Add to table
// // //             const row = document.createElement('tr');
// // //             row.innerHTML = `
// // //                 <td>${user.name}</td>
// // //                 <td>${user.email}</td>
// // //                 <td>${user.age}</td>
// // //                 <td>${user.percentage}</td>
// // //                 <td>
// // //                     <button class="edit-btn" data-id="${doc.id}">Edit</button>
// // //                     <button class="delete-btn" data-id="${doc.id}">Delete</button>
// // //                 </td>
// // //             `;
// // //             usersList.appendChild(row);
// // //         });
// // //     });
// // // };

// // // // Delete User
// // // document.addEventListener('click', async (e) => {
// // //     if (e.target.classList.contains('delete-btn')) {
// // //         const userId = e.target.dataset.id;
// // //         if (confirm('Are you sure you want to delete this user?')) {
// // //             try {
// // //                 await deleteDoc(doc(db, 'users', userId));
// // //                 alert('User deleted successfully!');
// // //             } catch (error) {
// // //                 console.error('Delete error:', error);
// // //                 alert('Error deleting user');
// // //             }
// // //         }
// // //     }
// // // });

// // // // Edit User
// // // document.addEventListener('click', async (e) => {
// // //     if (e.target.classList.contains('edit-btn')) {
// // //         const userId = e.target.dataset.id;
// // //         try {
// // //             const docSnap = await getDoc(doc(db, 'users', userId));
// // //             if (docSnap.exists()) {
// // //                 const user = docSnap.data();
// // //                 userId.value = docSnap.id;
// // //                 nameInput.value = user.name;
// // //                 emailInput.value = user.email;
// // //                 ageInput.value = user.age;
// // //                 percentageInput.value = user.percentage;
// // //             }
// // //         } catch (error) {
// // //             console.error('Edit error:', error);
// // //             alert('Error loading user data');
// // //         }
// // //     }
// // // });

// // // // Initialize
// // // const resetForm = () => {
// // //     userForm.reset();
// // //     userId.value = '';
// // // };

// // // document.addEventListener('DOMContentLoaded', () => {
// // //     setupRealtimeUpdates();
// // // });
