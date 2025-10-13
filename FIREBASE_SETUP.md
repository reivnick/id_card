# Firebase Authentication Setup Guide

Simple Firebase Authentication with role-based access control (Admin/User).

## Prerequisites

- Firebase project at [Firebase Console](https://console.firebase.google.com/)
- Bun installed
- Firebase packages (already installed)

## Step 1: Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable **Authentication** → **Email/Password** sign-in method
4. Enable **Firestore Database** (Start in production mode)

## Step 2: Get Firebase Configuration

1. Go to Project Settings → General
2. Scroll to "Your apps" section
3. Click "Add app" → Web (</>) icon
4. Register your app
5. Copy the configuration values

## Step 3: Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Firebase Client Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
```

## Step 4: Create Users in Firebase Console

Since users cannot self-register, create them manually:

### Create a User

1. Go to Firebase Console → **Authentication** → **Users**
2. Click **"Add user"**
3. Enter email and password
4. Click **"Add user"**

### Assign Role to User

1. Go to Firebase Console → **Firestore Database**
2. Click **"Start collection"**
3. Collection ID: `users`
4. Document ID: Use the **User UID** from Authentication
5. Add fields:
   ```
   email: "user@example.com"
   role: "admin"  (or "user")
   createdAt: (timestamp)
   ```
6. Click **"Save"**

**Important:** The document ID must match the user's UID from Authentication.

## Step 5: Set Firestore Security Rules

Go to Firestore Database → Rules and add:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      // Users can read their own data
      allow read: if request.auth != null && request.auth.uid == userId;

      // Only authenticated users can read (for role checking)
      allow get: if request.auth != null;

      // No one can write (users created manually in console)
      allow write: if false;
    }
  }
}
```

## Step 6: Run the Application

```bash
bun run dev
```

The application will run on `http://localhost:5173` (or your configured port)

## Step 7: Test the System

1. **Login:**

   - Go to login page
   - Enter email and password of created user
   - You should be redirected to dashboard

2. **Check Role:**
   - The role is automatically fetched from Firestore
   - Use `useAuth()` hook to access user role
   - Example: `const { role } = useAuth();`

## Project Structure

```
├── src/
│   ├── lib/
│   │   └── firebase.ts              # Firebase client config
│   ├── features/
│   │   └── auth/
│   │       └── AuthContext.tsx      # Auth context with role management
│   └── pages/
│       └── Login.tsx                # Login page
└── .env                             # Environment variables
```

## Using Role-Based Access Control

In your components:

```tsx
import { useAuth } from "../features/auth/AuthContext";

function MyComponent() {
  const { role, user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  if (role === "admin") {
    return <div>Admin content</div>;
  }

  return <div>User content</div>;
}
```

## How It Works

1. **Authentication:** Firebase handles email/password authentication
2. **Role Storage:** User roles stored in Firestore `users` collection
3. **Role Retrieval:** On login, role is fetched from Firestore using user's UID
4. **Access Control:** Use `role` from `useAuth()` to control UI/features

## Creating New Users

To create new users:

1. Go to Firebase Console → Authentication → Users
2. Click "Add user"
3. Enter email and password
4. Go to Firestore Database → users collection
5. Add document with user's UID as document ID
6. Set role field to "admin" or "user"

## Security Notes

- Users **cannot** self-register
- Only two roles: `admin` and `user`
- Roles are stored in Firestore
- All user creation done through Firebase Console
- Firestore rules prevent unauthorized writes

## Troubleshooting

### "Permission denied" in Firestore

- Check Firestore security rules are set correctly
- Verify user document exists with correct UID

### "User not found" error

- Verify user exists in Firebase Authentication
- Check email/password are correct

### Role is null or undefined

- Verify user document exists in Firestore `users` collection
- Check document ID matches user's UID
- Ensure `role` field is set in the document

## Next Steps

1. Add password reset functionality
2. Add email verification
3. Implement role-specific features
4. Set up production environment variables
5. Deploy to hosting platform
