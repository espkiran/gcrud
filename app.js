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
// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDjVs5MLZjh2iTHxy54WmyuoOf0kkjRpOA",
    authDomain: "mywebform-81b01.firebaseapp.com",
    projectId: "mywebform-81b01",
    storageBucket: "mywebform-81b01.firebasestorage.app",
    messagingSenderId: "284178824887",
    appId: "1:284178824887:web:b34bd1bd101aa67404d732"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Initialize date pickers
document.addEventListener('DOMContentLoaded', function() {
    const dateInputs = document.querySelectorAll('.date-picker');
    dateInputs.forEach(input => {
        new Datepicker(input, {
            format: 'yyyy-mm-dd'
        });
    });
});

// Utility Functions
function limitInputLength(element, maxLength) {
    if (element.value.length > maxLength) {
        element.value = element.value.slice(0, maxLength);
    }
}

function generateUniqueId() {
    return 'LOAN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Form Data Collection
function getFormData() {
    return {
        recordId: document.getElementById('recordId').textContent,
        tcsh: document.getElementById('tcsh').value,
        aQmob: document.getElementById('aQmob').value,
        Lper: document.getElementById('Lper').value,
        Qno: document.getElementById('Qno').value,
        date1: document.getElementById('date1').value,
        date2: document.getElementById('date2').value,
        date3: document.getElementById('date3').value,
        date4: document.getElementById('date4').value,
        iwe: document.getElementById('iwe').value,
        loanWork: document.getElementById('loanWork').value,
        ltype: document.getElementById('ltype').value,
        chhu: document.getElementById('chhu').value,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };
}

// Form Population
function populateForm(data) {
    document.getElementById('recordId').textContent = data.recordId;
    document.getElementById('tcsh').value = data.tcsh;
    document.getElementById('aQmob').value = data.aQmob;
    document.getElementById('Lper').value = data.Lper;
    document.getElementById('Qno').value = data.Qno;
    document.getElementById('date1').value = data.date1;
    document.getElementById('date2').value = data.date2;
    document.getElementById('date3').value = data.date3;
    document.getElementById('date4').value = data.date4;
    document.getElementById('iwe').value = data.iwe;
    document.getElementById('loanWork').value = data.loanWork;
    document.getElementById('ltype').value = data.ltype;
    document.getElementById('chhu').value = data.chhu;
}

// CRUD Operations
// Create
document.getElementById('save-later-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        const formData = getFormData();
        formData.recordId = generateUniqueId();
        
        await db.collection('loans').doc(formData.recordId).set(formData);
        document.getElementById('recordId').textContent = formData.recordId;
        alert('Record saved successfully! Record ID: ' + formData.recordId);
    } catch (error) {
        console.error('Error saving record:', error);
        alert('Error saving record: ' + error.message);
    }
});

// Read
document.getElementById('searchBtn').addEventListener('click', async () => {
    const searchId = prompt('Enter Record ID:');
    if (!searchId) return;

    try {
        const doc = await db.collection('loans').doc(searchId).get();
        if (doc.exists) {
            populateForm(doc.data());
        } else {
            alert('No record found with ID: ' + searchId);
        }
    } catch (error) {
        console.error('Error searching record:', error);
        alert('Error searching record: ' + error.message);
    }
});

// Update
document.getElementById('updateBtn').addEventListener('click', async () => {
    const currentId = document.getElementById('recordId').textContent;
    if (currentId === 'Not Generated') {
        alert('Please load a record first');
        return;
    }

    try {
        const formData = getFormData();
        await db.collection('loans').doc(currentId).update(formData);
        alert('Record updated successfully!');
    } catch (error) {
        console.error('Error updating record:', error);
        alert('Error updating record: ' + error.message);
    }
});

// Delete
document.getElementById('deleteBtn').addEventListener('click', async () => {
    const currentId = document.getElementById('recordId').textContent;
    if (currentId === 'Not Generated') {
        alert('Please load a record first');
        return;
    }

    if (confirm('Are you sure you want to delete this record?')) {
        try {
            await db.collection('loans').doc(currentId).delete();
            alert('Record deleted successfully!');
            document.getElementById('save-later-form').reset();
            document.getElementById('recordId').textContent = 'Not Generated';
        } catch (error) {
            console.error('Error deleting record:', error);
            alert('Error deleting record: ' + error.message);
        }
    }
});

// Convert buttons functionality
document.querySelectorAll('[id^="convert"]').forEach(button => {
    button.addEventListener('click', function() {
        const dateId = this.id.replace('convert', '');
        const dateInput = document.getElementById('date' + dateId);
        // Add your date conversion logic here
        console.log('Converting date:', dateInput.value);
    });
});
