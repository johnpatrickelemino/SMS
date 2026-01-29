/**
 * Check Admin Account Status
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtdrVfOnz2bO7J6YWJ_l-fPYz7cPsyjqQ",
  authDomain: "profile-3f806.firebaseapp.com",
  projectId: "profile-3f806",
  storageBucket: "profile-3f806.firebasestorage.app",
  messagingSenderId: "720481446432",
  appId: "1:720481446432:web:4107abc3320cb684776a45",
  measurementId: "G-G4WLGQ79NW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkAccount() {
  try {
    console.log('Checking for existing admin account...\n');
    
    // Query for the email
    const q = query(
      collection(db, 'users'),
      where('email', '==', 'johnpatrickelemino@gmail.com')
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log('✗ No account found with email johnpatrickelemino@gmail.com');
      console.log('  The account may be in Firebase Auth but not in Firestore.');
      console.log('\n  You will need to:');
      console.log('  1. Delete the account from Firebase Auth Console');
      console.log('  2. Run setupAdmin.js to create a fresh account');
    } else {
      console.log('✓ Account found in Firestore:\n');
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log('  UID:', data.uid);
        console.log('  Email:', data.email);
        console.log('  First Name:', data.firstName);
        console.log('  Last Name:', data.lastName);
        console.log('  Role:', data.role);
        console.log('  Status:', data.status);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('✗ Error checking account:', error.message);
    process.exit(1);
  }
}

checkAccount();
