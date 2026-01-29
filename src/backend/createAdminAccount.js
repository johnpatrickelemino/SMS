import { auth, db } from './firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';

/**
 * Create admin account with specified email and password
 */
export const createAdminAccount = async () => {
  try {
    const adminEmail = 'johnpatrickelemino@gmail.com';
    const adminPassword = 'hyugo012345';
    
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

    console.log('Admin account created successfully!');
    return {
      success: true,
      message: 'Admin account created successfully',
      uid: user.uid,
      email: adminEmail,
      credentials: {
        email: adminEmail,
        password: adminPassword,
      },
    };
  } catch (error) {
    console.error('Error creating admin account:', error);
    
    // Check if user already exists
    if (error.code === 'auth/email-already-in-use') {
      console.warn('Admin account already exists with this email.');
      return {
        success: false,
        message: 'Admin account already exists',
        error: 'Email johnpatrickelemino@gmail.com is already registered',
      };
    }
    
    if (error.code === 'auth/weak-password') {
      console.error('Password is too weak. Please use a stronger password.');
      return {
        success: false,
        message: 'Password is too weak',
        error: error.message,
      };
    }
    
    throw error;
  }
};
