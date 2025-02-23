// Modified app.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { 
  getFirestore, collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot, getDoc, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Firestore will auto-create the 'loanApplications' collection on first write
const loanAppsRef = collection(db, 'loanApplications');
let currentDocId = null;

// Enhanced form handling
const formElements = () => document.querySelectorAll('input, select, textarea');
const getFormData = () => Array.from(formElements()).reduce((data, el) => {
  data[el.id] = el.value;
  return data;
}, {});

// Save/Update with explicit button
document.getElementById('saveBtn').addEventListener('click', async () => {
  const data = getFormData();
  try {
    if (currentDocId) {
      await updateDoc(doc(db, 'loanApplications', currentDocId), data);
      console.log('Document updated');
    } else {
      const docRef = await addDoc(loanAppsRef, { 
        ...data,
        createdAt: serverTimestamp() 
      });
      currentDocId = docRef.id;
      console.log('Document added');
    }
  } catch (error) {
    console.error("Error saving: ", error);
  }
});

// New Application
document.getElementById('newBtn').addEventListener('click', () => {
  currentDocId = null;
  formElements().forEach(el => el.value = '');
});

// Clear Form
document.getElementById('clearBtn').addEventListener('click', () => {
  formElements().forEach(el => el.value = '');
});

// Delete handler
window.deleteRecord = async (docId) => {
  if (confirm('Delete this application?')) {
    await deleteDoc(doc(db, 'loanApplications', docId));
    if (currentDocId === docId) currentDocId = null;
  }
};

// Edit handler
window.editRecord = async (docId) => {
  const docSnap = await getDoc(doc(db, 'loanApplications', docId));
  if (docSnap.exists()) {
    const data = docSnap.data();
    formElements().forEach(el => {
      if (data[el.id]) el.value = data[el.id];
    });
    currentDocId = docId;
  }
};

// Real-time display
onSnapshot(loanAppsRef, (snapshot) => {
  const recordsList = document.getElementById('recordsList');
  recordsList.innerHTML = '<h3>Saved Applications:</h3>';
  
  snapshot.forEach(doc => {
    const data = doc.data();
    const record = document.createElement('div');
    record.className = 'record-item';
    record.innerHTML = `
      <span>${data.fname || 'Unnamed'} - रु ${data.tcsh || '0'} (${new Date(data.createdAt?.toDate()).toLocaleDateString()})</span>
      <div>
        <button onclick="editRecord('${doc.id}')">Edit</button>
        <button onclick="deleteRecord('${doc.id}')">Delete</button>
      </div>
    `;
    recordsList.appendChild(record);
  });
});

// Auto-save on changes (every 2 seconds)
setInterval(() => {
  if (currentDocId) {
    const data = getFormData();
    updateDoc(doc(db, 'loanApplications', currentDocId), data);
  }
}, 2000);
