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

// Error handling function
const handleFirebaseError = (error) => {
  console.error('Firebase Error:', error);
  alert(`Error: ${error.message || 'Check console for details'}`);
};

// Get form data with validation
const getFormData = () => {
  const data = {};
  document.querySelectorAll('input, select, textarea').forEach(el => {
    data[el.id] = el.value || null;
  });
  return data;
};

// Save/Update document
document.getElementById('saveBtn').addEventListener('click', async () => {
  try {
    const data = getFormData();
    
    if (!data.fname || !data.tcsh) {
      alert('Name and Loan Amount are required!');
      return;
    }

    if (currentDocId) {
      await updateDoc(doc(db, 'loanApplications', currentDocId), data);
      alert('Document updated successfully!');
    } else {
      const docRef = await addDoc(loanAppsRef, {
        ...data,
        createdAt: serverTimestamp()
      });
      currentDocId = docRef.id;
      alert('Document saved successfully!');
    }
  } catch (error) {
    handleFirebaseError(error);
  }
});

// Delete handler with confirmation
window.deleteRecord = async (docId) => {
  if (confirm('Are you sure you want to delete this record?')) {
    try {
      await deleteDoc(doc(db, 'loanApplications', docId));
      if (currentDocId === docId) currentDocId = null;
      alert('Document deleted successfully!');
    } catch (error) {
      handleFirebaseError(error);
    }
  }
};

// Edit handler
window.editRecord = async (docId) => {
  try {
    const docSnap = await getDoc(doc(db, 'loanApplications', docId));
    if (docSnap.exists()) {
      const data = docSnap.data();
      Object.entries(data).forEach(([key, value]) => {
        const el = document.getElementById(key);
        if (el) el.value = value || '';
      });
      currentDocId = docId;
      alert('Document loaded for editing!');
    }
  } catch (error) {
    handleFirebaseError(error);
  }
};

// Real-time listener with error handling
try {
  onSnapshot(loanAppsRef, (snapshot) => {
    const recordsList = document.getElementById('recordsList');
    recordsList.innerHTML = '<h3>Saved Applications:</h3>';
    
    snapshot.forEach(doc => {
      const data = doc.data();
      const record = document.createElement('div');
      record.className = 'record-item';
      record.innerHTML = `
        <div>
          <strong>${data.fname || 'Unnamed Application'}</strong><br>
          Amount: रु ${data.tcsh || '0'} | 
          Created: ${data.createdAt?.toDate().toLocaleDateString()}
        </div>
        <div>
          <button onclick="editRecord('${doc.id}')">Edit</button>
          <button onclick="deleteRecord('${doc.id}')">Delete</button>
        </div>
      `;
      recordsList.appendChild(record);
    });
  });
} catch (error) {
  handleFirebaseError(error);
}

// Initialize form
window.newRecord = () => {
  currentDocId = null;
  document.querySelectorAll('input, select, textarea').forEach(el => {
    el.value = '';
  });
  alert('New form initialized!');
};
