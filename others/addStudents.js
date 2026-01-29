/**
 * Add Students to Firebase Script
 * Inserts sample students into the Firestore database
 * Run with: node addStudents.js
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
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://profile-3f806.firebaseio.com'
});

const db = admin.firestore();

// Sample students data
const studentsData = [
  {
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@student.com',
    course: 'Computer Science',
    status: 'Active',
    role: 'Student',
  },
  {
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@student.com',
    course: 'Information Technology',
    status: 'Active',
    role: 'Student',
  },
  {
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.brown@student.com',
    course: 'Software Engineering',
    status: 'Active',
    role: 'Student',
  },
  {
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@student.com',
    course: 'Data Science',
    status: 'Active',
    role: 'Student',
  },
  {
    firstName: 'David',
    lastName: 'Wilson',
    email: 'david.wilson@student.com',
    course: 'Web Development',
    status: 'Active',
    role: 'Student',
  },
  {
    firstName: 'Jessica',
    lastName: 'Miller',
    email: 'jessica.miller@student.com',
    course: 'Cybersecurity',
    status: 'Active',
    role: 'Student',
  },
];

async function addStudents() {
  try {
    console.log('Adding students to Firebase...\n');
    
    let addedCount = 0;
    const results = [];

    for (const studentData of studentsData) {
      try {
        const docRef = await db.collection('users').add({
          ...studentData,
          createdAt: admin.firestore.Timestamp.now(),
          profileCompleted: false,
        });

        results.push({
          success: true,
          name: `${studentData.firstName} ${studentData.lastName}`,
          email: studentData.email,
          id: docRef.id,
        });

        addedCount++;
        console.log(`✓ Added: ${studentData.firstName} ${studentData.lastName} (${studentData.email})`);
      } catch (error) {
        results.push({
          success: false,
          name: `${studentData.firstName} ${studentData.lastName}`,
          email: studentData.email,
          error: error.message,
        });
        console.log(`✗ Failed: ${studentData.firstName} ${studentData.lastName} - ${error.message}`);
      }
    }

    console.log('\n─────────────────────────────────────');
    console.log(`✓ Students Added Successfully: ${addedCount}/${studentsData.length}`);
    console.log('─────────────────────────────────────');
    console.log('\nStudents added:');
    results.filter(r => r.success).forEach(r => {
      console.log(`  • ${r.name} (${r.email})`);
    });

    if (results.some(r => !r.success)) {
      console.log('\nFailed to add:');
      results.filter(r => !r.success).forEach(r => {
        console.log(`  • ${r.name}: ${r.error}`);
      });
    }

    console.log('\nThese students will now appear on the Students page in the Admin Dashboard.');

    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

addStudents();
