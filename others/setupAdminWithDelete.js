/**
 * Admin Account Setup Script with Deletion
 * Uses Firebase Admin SDK to delete existing account and create new one
 * Run with: node setupAdminWithDelete.js
 */

import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load service account key
const serviceAccountPath = path.join(__dirname, 'src/firebase/firebase/serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('✗ Service account key not found at:', serviceAccountPath);
  console.error('  Please ensure serviceAccountKey.json exists in src/firebase/firebase/');
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://profile-3f806.firebaseio.com'
});

const auth = admin.auth();
const db = admin.firestore();

async function setupAdminAccount() {
  try {
    const adminEmail = 'johnpatrickelemino@gmail.com';
    const adminPassword = 'hyugo012345';

    console.log('Setting up admin account...');
    console.log('Email:', adminEmail);
    console.log('─────────────────────────────────────\n');

    // Step 1: Check if user exists
    let userId = null;
    try {
      const user = await auth.getUserByEmail(adminEmail);
      userId = user.uid;
      console.log('Found existing account, deleting...');
      await auth.deleteUser(userId);
      console.log('✓ Existing account deleted');
    } catch (error) {
      if (error.code !== 'auth/user-not-found') {
        throw error;
      }
      console.log('No existing account found');
    }

    // Step 2: Create new user in Auth
    console.log('Creating new user account...');
    const newUser = await auth.createUser({
      email: adminEmail,
      password: adminPassword,
      displayName: 'John Patrick',
    });
    console.log('✓ User created in Firebase Auth');

    // Step 3: Create user document in Firestore
    console.log('Creating user profile in Firestore...');
    await db.collection('users').doc(newUser.uid).set({
      uid: newUser.uid,
      email: adminEmail,
      firstName: 'John',
      lastName: 'Patrick',
      role: 'Admin',
      status: 'Active',
      profileCompleted: false,
      createdAt: admin.firestore.Timestamp.now(),
    });
    console.log('✓ User profile created in Firestore');

    console.log('\n✓ Admin account created successfully!');
    console.log('─────────────────────────────────────');
    console.log('Account Details:');
    console.log('  Email:', adminEmail);
    console.log('  Password:', adminPassword);
    console.log('  UID:', newUser.uid);
    console.log('  Role: Admin');
    console.log('─────────────────────────────────────');
    console.log('\nYou can now log in with these credentials.');

    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

setupAdminAccount();
