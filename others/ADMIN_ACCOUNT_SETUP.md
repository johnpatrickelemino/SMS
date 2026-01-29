# Admin Account Setup Instructions

## Current Status
- Email: `johnpatrickelemino@gmail.com`
- Status: Account exists in Firebase Auth but NOT in Firestore database
- Action Required: Delete the existing account and recreate it

## Steps to Create Admin Account

### Option 1: Delete and Recreate via Firebase Console (Recommended)

1. **Go to Firebase Console**
   - Navigate to [Firebase Console](https://console.firebase.google.com/)
   - Select your project: `profile-3f806`

2. **Delete Existing Account**
   - Go to **Authentication** → **Users**
   - Find the user with email `johnpatrickelemino@gmail.com`
   - Click the three-dot menu and select **Delete user**
   - Confirm deletion

3. **Create New Account via Script**
   - Run the setup script:
     ```bash
     node setupAdmin.js
     ```
   - This will create the account with:
     - Email: `johnpatrickelemino@gmail.com`
     - Password: `hyugo012345`
     - Role: `Admin`
     - Name: John Patrick

### Option 2: Update Firestore Manually (If you want to keep Auth account)

If you want to keep the existing account, you can manually add it to Firestore:

1. Go to Firebase Console → Firestore Database
2. Create a new document in the `users` collection with:
   - Document ID: [Get from Firebase Auth Console - Users section]
   - Fill in the following fields:
     ```json
     {
       "uid": "[Copy from Firebase Auth]",
       "email": "johnpatrickelemino@gmail.com",
       "firstName": "John",
       "lastName": "Patrick",
       "role": "Admin",
       "status": "Active",
       "profileCompleted": false,
       "createdAt": "[current date]"
     }
     ```

## Available Scripts

### `setupAdmin.js`
Creates a brand new admin account. Run this after deleting the old account.
```bash
node setupAdmin.js
```

### `updateAdmin.js`
Updates an existing account to have Admin role (if credentials are correct).
```bash
node updateAdmin.js
```

### `checkAdmin.js`
Checks if the admin account exists in Firestore.
```bash
node checkAdmin.js
```

## Admin Account Details (After Setup)

- **Email**: johnpatrickelemino@gmail.com
- **Password**: hyugo012345
- **Role**: Admin
- **Full Name**: John Patrick

You can log in to the admin dashboard at `/admin` using these credentials.

## Troubleshooting

### "Email already in use" error
- The account exists in Firebase Auth but not in Firestore
- Solution: Delete from Firebase Console and run `setupAdmin.js`

### "Invalid credentials" error
- The password doesn't match what's in Firebase Auth
- Solution: Delete and recreate the account

### Access Denied to Admin Dashboard
- Verify the role in Firestore is set to `"Admin"` (case-sensitive)
- Check sessionStorage shows `Role: Admin` after login
