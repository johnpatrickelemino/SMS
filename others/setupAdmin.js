/**
 * Admin Account Setup Script
 * Run with: node setupAdmin.js
 * 
 * This script creates an admin account with the following credentials:
 * Email: johnpatrickelemino@gmail.com
 * Password: hyugo012345
 */

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, setDoc, doc } from 'firebase/firestore';

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

async function createAdminAccount() {
  try {
    const adminEmail = 'johnpatrickelemino@gmail.com';
    const adminPassword = 'hyugo012345';
    
    console.log('Creating admin account...');
    console.log('Email:', adminEmail);
    
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
    const user = userCredential.user;

    // Add user document to Firestore with admin role
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: adminEmail,
      firstName: 'John',
      lastName: 'Patrick',
      role: 'Admin',
      createdAt: new Date(),
      status: 'Active',
      profileCompleted: false,
    });

    console.log('✓ Admin account created successfully!');
    console.log('─────────────────────────────────────');
    console.log('Account Details:');
    console.log('  Email:', adminEmail);
    console.log('  Password:', adminPassword);
    console.log('  UID:', user.uid);
    console.log('  Role: Admin');
    console.log('─────────────────────────────────────');
    
    process.exit(0);
  } catch (error) {
    console.error('✗ Error creating admin account:', error.message);
    
    if (error.code === 'auth/email-already-in-use') {
      console.error('  The email johnpatrickelemino@gmail.com is already registered.');
      console.error('  Use a different email or delete the existing account first.');
    } else if (error.code === 'auth/weak-password') {
      console.error('  Password is too weak. Please use a stronger password.');
    }
    
    process.exit(1);
  }
}

createAdminAccount();
