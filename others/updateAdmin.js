/**
 * Update Existing Admin Account Script
 * Updates the existing johnpatrickelemino@gmail.com account to have Admin role
 */

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, setDoc, doc, getDoc } from 'firebase/firestore';

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
const auth = getAuth(app);
const db = getFirestore(app);

async function updateAdminAccount() {
  try {
    const adminEmail = 'johnpatrickelemino@gmail.com';
    const adminPassword = 'hyugo012345';
    
    console.log('Updating admin account...');
    console.log('Email:', adminEmail);
    
    // Sign in to get the user
    const userCredential = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
    const user = userCredential.user;
    
    // Get existing user data
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    
    let userData = {};
    if (userDoc.exists()) {
      userData = userDoc.data();
    }

    // Update user document with admin role
    await setDoc(userDocRef, {
      uid: user.uid,
      email: adminEmail,
      firstName: userData.firstName || 'John',
      lastName: userData.lastName || 'Patrick',
      role: 'Admin',
      status: userData.status || 'Active',
      profileCompleted: userData.profileCompleted || false,
      createdAt: userData.createdAt || new Date(),
      updatedAt: new Date(),
    }, { merge: true });

    console.log('✓ Admin account updated successfully!');
    console.log('─────────────────────────────────────');
    console.log('Account Details:');
    console.log('  Email:', adminEmail);
    console.log('  Password:', adminPassword);
    console.log('  UID:', user.uid);
    console.log('  Role: Admin');
    console.log('─────────────────────────────────────');
    
    process.exit(0);
  } catch (error) {
    console.error('✗ Error updating admin account:', error.message);
    
    if (error.code === 'auth/user-not-found') {
      console.error('  The email johnpatrickelemino@gmail.com was not found.');
    } else if (error.code === 'auth/wrong-password') {
      console.error('  The password is incorrect.');
    }
    
    process.exit(1);
  }
}

updateAdminAccount();
