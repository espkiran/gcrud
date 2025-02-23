import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { 
  getFirestore, collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot, getDoc, serverTimestamp 
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
const loanAppsRef = collection(db, 'loanApplications');
let currentDocId = null;

// Get all form data (including partial)
const getFormData = () => {
  const data = {};
  document.querySelectorAll('input, select, textarea').forEach(input => {
    data[input.id] = input.value || '';
  });
  return data;
};

// Save/Update button handler
document.getElementById('saveBtn').addEventListener('click', async () => {
  try {
    const data = getFormData();
    
    if (currentDocId) {
      // Update existing document
      await updateDoc(doc(db, 'loanApplications', currentDocId), data);
      alert('Updated successfully!');
    } else {
      // Create new document
      const docRef = await addDoc(loanAppsRef, {
        ...data,
        createdAt: serverTimestamp()
      });
      currentDocId = docRef.id;
      alert('Saved successfully!');
    }
  } catch (error) {
    console.error("Error saving:", error);
    alert(`Error: ${error.message}`);
  }
});

// Load data for editing
window.loadData = async (docId) => {
  const docSnap = await getDoc(doc(db, 'loanApplications', docId));
  if (docSnap.exists()) {
    const data = docSnap.data();
    Object.entries(data).forEach(([field, value]) => {
      const element = document.getElementById(field);
      if (element) element.value = value;
    });
    currentDocId = docId;
  }
};

// Delete document
window.deleteData = async (docId) => {
  if (confirm('Delete this application?')) {
    await deleteDoc(doc(db, 'loanApplications', docId));
    if (currentDocId === docId) currentDocId = null;
  }
};

// Real-time updates listener
onSnapshot(loanAppsRef, (snapshot) => {
  const recordsList = document.getElementById('recordsList');
  recordsList.innerHTML = '<h3>Saved Applications:</h3>';
  
  snapshot.forEach(doc => {
    const data = doc.data();
    const record = document.createElement('div');
    record.className = 'record-item';
    record.innerHTML = `
      <div>
        ${data.fname || 'No Name'} - 
        रु ${data.tcsh || '0'} - 
        ${data.createdAt?.toDate().toLocaleDateString() || ''}
      </div>
      <div>
        <button onclick="loadData('${doc.id}')">Edit</button>
        <button onclick="deleteData('${doc.id}')">Delete</button>
      </div>
    `;
    recordsList.appendChild(record);
  });
});

// New Application button
window.newApplication = () => {
  currentDocId = null;
  document.querySelectorAll('input, select, textarea').forEach(el => {
    el.value = '';
  });
};
