# Firebase Admin Setup Instructions

## Quick Start

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to the admin setup page:**
   ```
   http://localhost:5173/admin-setup
   ```

3. **Click one of these buttons:**
   - **"Add Admin User Only"** - Creates just the admin account
   - **"Add Admin + Test Students"** - Creates admin + 2 test student accounts

## Admin Login Credentials

After setup, use these credentials to access the admin dashboard:

**Email:** admin@cdm.com  
**Password:** Admin@123

## Test Student Credentials (if you created them)

**Student 1:**
- Email: john.student@cdm.com
- Password: Student@123
- Course: Computer Science

**Student 2:**
- Email: sarah.student@cdm.com
- Password: Student@123
- Course: Business Administration

## What Gets Created?

The admin setup script creates user records in Firebase Firestore with the following structure:

```
Collection: users
Document fields:
  - firstName: String
  - lastName: String
  - email: String (unique)
  - password: String (for login API)
  - role: "Admin" or "Student"
  - status: "Active" or "Inactive"
  - course: String (for students)
  - createdAt: Timestamp
  - profileCompleted: Boolean
```

## Notes

- ⚠️ The setup page (`/admin-setup`) is publicly accessible. Consider protecting it in production.
- ✓ The script checks if users already exist before creating them
- ✓ All passwords shown are test credentials and should be changed in production
- ✓ Use a proper password hashing library in production (bcrypt, etc.)

## Accessing the Admin Dashboard

1. Go to http://localhost:5173/login
2. Enter admin credentials:
   - Email: admin@cdm.com
   - Password: Admin@123
3. You'll be redirected to http://localhost:5173/admin/dashboard

## Removing the Setup Page (Optional)

For production, you may want to remove or protect the `/admin-setup` route. Simply remove or comment out the route in `App.jsx`.
