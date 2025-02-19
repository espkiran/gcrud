import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot
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
let currentEditId = null;

// Form Submission Handler
document.getElementById('save-later-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = {
    // Personal Information
    name: document.getElementById('fname').value,
    age: document.getElementById('myage').value,
    gender: document.getElementById('gender').value,
    mobile: document.getElementById('vmob').innerText,
    address: document.getElementById('pdist').value,
    // Loan Details
    loanAmount: document.getElementById('tcsh').value,
    interestRate: document.getElementById('Lper').value,
    // Add all other form fields similarly
    timestamp: new Date()
  };

  try {
    if (currentEditId) {
      await updateDoc(doc(db, "loanApplications", currentEditId), formData);
    } else {
      await addDoc(collection(db, "loanApplications"), formData);
    }
    resetForm();
    loadApplications();
  } catch (error) {
    console.error("Error saving document: ", error);
    alert("Error saving data. Check console for details.");
  }
});

// Load Applications
const loadApplications = () => {
  const query = collection(db, "loanApplications");
  
  onSnapshot(query, (snapshot) => {
    const applicationsList = document.getElementById('usersList');
    applicationsList.innerHTML = '';
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      const applicationHTML = `
        <div class="application-card">
          <h3>${data.name}</h3>
          <p>Loan Amount: NPR ${data.loanAmount}</p>
          <p>Interest Rate: ${data.interestRate}%</p>
          <button onclick="editApplication('${doc.id}')">Edit</button>
          <button onclick="deleteApplication('${doc.id}')">Delete</button>
        </div>
      `;
      applicationsList.innerHTML += applicationHTML;
    });
  });
};

// Edit Application
window.editApplication = async (id) => {
  const docRef = doc(db, "loanApplications", id);
  const docSnap = await getDoc(docRef);
  
  if(docSnap.exists()) {
    const data = docSnap.data();
    currentEditId = id;
    
    // Populate form fields
    document.getElementById('fname').value = data.name;
    document.getElementById('myage').value = data.age;
    document.getElementById('gender').value = data.gender;
    // Populate all other fields similarly
    
    window.scrollTo(0, 0);
  }
};

// Delete Application
window.deleteApplication = async (id) => {
  if(confirm('Delete this application?')) {
    await deleteDoc(doc(db, "loanApplications", id));
  }
};

// Reset Form
const resetForm = () => {
  document.getElementById('save-later-form').reset();
  currentEditId = null;
};

// Initial Load
loadApplications();
