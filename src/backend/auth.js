import { auth, db } from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';

/**
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User object with role and profile info
 */
export const loginUser = async (email, password) => {
  try {
    // Sign in with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get user document from Firestore to retrieve role and other info
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      console.warn('User profile not found, creating default profile');
      // Return basic user info if profile doesn't exist yet
      return {
        uid: user.uid,
        email: user.email,
        firstName: 'User',
        lastName: user.email.split('@')[0],
        role: 'Student',
        profileCompleted: false,
      };
    }

    const userData = userDoc.data();

    return {
      uid: user.uid,
      email: user.email,
      firstName: userData.firstName || 'User',
      lastName: userData.lastName || user.email.split('@')[0],
      role: userData.role || 'Student',
      profileCompleted: userData.profileCompleted || false,
    };
  } catch (error) {
    console.error('Login error:', error);
    
    // Provide more specific error messages
    if (error.code === 'auth/user-not-found') {
      throw new Error('User not found. Please register first.');
    } else if (error.code === 'auth/wrong-password') {
      throw new Error('Incorrect password. Please try again.');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email format.');
    } else if (error.code === 'auth/too-many-requests') {
      throw new Error('Too many login attempts. Please try again later.');
    }
    
    throw error;
  }
};

/**
 * Logout user
 */
export const logoutUser = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};
