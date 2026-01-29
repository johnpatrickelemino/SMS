# Admin Login Fix - Setup Instructions

## Problem Fixed
The admin login was failing because the login component was trying to fetch from a non-existent API endpoint `/api/account/login`. The app is configured with Firebase but wasn't using Firebase authentication.

## Solution Implemented
I've created Firebase authentication functions and updated the login system to use Firebase directly:

### Files Created:
1. **`src/firebase/auth.js`** - Firebase authentication functions
   - `loginUser()` - Authenticates user and retrieves their profile from Firestore
   - `logoutUser()` - Logs out the user

2. **`src/firebase/addAdmin.js`** - Admin user setup functions
   - `addAdminUser()` - Creates the admin account
   - `addMultipleUsers()` - Creates test user accounts

### Files Modified:
1. **`src/login.jsx`** - Updated to use Firebase authentication instead of API calls

## How to Setup Admin Account

### Step 1: Start the development server
```bash
npm run dev
```

### Step 2: Navigate to the admin setup page
Go to: `http://localhost:5173/admin-setup`

### Step 3: Click "Add Admin User Only"
This will create the admin account with the following credentials:
- **Email**: `admin@cdm.com`
- **Password**: `Admin@123`

### Step 4: Login
Go back to `http://localhost:5173/login` and use the admin credentials above.

## Test Users (Optional)
If you want to create test student and employee accounts, you can click "Add Both Admin and Test Users" on the admin setup page. This will create:

**Student Accounts:**
- Email: `student1@cdm.com` / Password: `Student@123`
- Email: `student2@cdm.com` / Password: `Student@123`

**Employee Account:**
- Email: `employee1@cdm.com` / Password: `Employee@123`

## What Changed in the Login Flow
1. **Before**: Login → API call to `/api/account/login` → (Failed, no API)
2. **After**: Login → Firebase Authentication → Firestore Lookup → SessionStorage → Admin Dashboard

## Notes
- The admin credentials are stored in Firebase Authentication
- User profile information (name, role, etc.) is stored in Firestore
- Session storage is used to persist login state across page refreshes
- The admin dashboard checks for `Role === 'Admin'` in sessionStorage
