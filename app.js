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

// Debounce function to limit save rate
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

// Get all form data
const getFormData = () => {
  const inputs = document.querySelectorAll('input, select, textarea');
  const data = {};
  inputs.forEach(input => {
    data[input.id] = input.value;
  });
  return data;
};

// Save/Update document
const saveData = debounce(async () => {
  const data = getFormData();
  try {
    if (currentDocId) {
      await updateDoc(doc(db, 'loanApplications', currentDocId), data);
    } else {
      const docRef = await addDoc(loanAppsRef, { 
        ...data, 
        createdAt: serverTimestamp() 
      });
      currentDocId = docRef.id;
    }
  } catch (error) {
    console.error("Error saving document: ", error);
  }
}, 1000);

// Add event listeners to all form elements
document.querySelectorAll('input, select, textarea').forEach(element => {
  element.addEventListener('input', saveData);
});

// Load data into form for editing
window.loadData = async (docId) => {
  const docSnap = await getDoc(doc(db, 'loanApplications', docId));
  if (docSnap.exists()) {
    const data = docSnap.data();
    Object.keys(data).forEach(key => {
      const element = document.getElementById(key);
      if (element) element.value = data[key];
    });
    currentDocId = docId;
  }
};

// Delete document
window.deleteData = async (docId) => {
  await deleteDoc(doc(db, 'loanApplications', docId));
  if (currentDocId === docId) currentDocId = null;
};

// Display records list
const displayRecords = (docs) => {
  const recordsList = document.getElementById('recordsList');
  recordsList.innerHTML = docs.map(doc => `
    <div class="record-item">
      <span>${doc.data().fname} - रु ${doc.data().tcsh || '0'}</span>
      <button onclick="loadData('${doc.id}')">Edit</button>
      <button onclick="deleteData('${doc.id}')">Delete</button>
    </div>
  `).join('');
};

// Real-time updates listener
onSnapshot(loanAppsRef, (snapshot) => {
  const docs = [];
  snapshot.forEach(doc => docs.push(doc));
  displayRecords(docs);
});

// Initialize
window.newRecord = () => {
  currentDocId = null;
  document.querySelectorAll('input, select, textarea').forEach(el => el.value = '');
};
