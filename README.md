# ID Card Generator

A React-based web application for generating and managing ID cards and certificates with Firebase authentication and role-based access control.

## Features

- 🔐 **Firebase Authentication** - Secure email/password authentication
- 👥 **Role-Based Access Control** - Admin and User roles with different permissions
- 🎫 **ID Card Generation** - Create and download professional ID cards
- 📜 **Certificates** - Generate certificates
- 📱 **Responsive Design** - Built with Tailwind CSS for mobile-friendly UI
- 📄 **PDF Export** - Export cards and certificates as PDF using @react-pdf/renderer
- ⚡ **Fast Development** - Powered by Vite and React 19

## Tech Stack

- **Frontend Framework:** React 19.1.1
- **Build Tool:** Vite 7.1.7
- **Styling:** Tailwind CSS 4.1.14
- **Authentication:** Firebase 12.4.0
- **PDF Generation:** @react-pdf/renderer 4.3.1
- **Language:** TypeScript 5.9.3
- **Package Manager:** Bun (or npm)

## Prerequisites

- Node.js 18+ or Bun
- Firebase account
- Firebase project with Authentication and Firestore enabled

## Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd id_card
   ```

2. **Install dependencies:**

   ```bash
   bun install
   # or
   npm install
   ```

3. **Set up environment variables:**

   Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

   Update `.env` with your Firebase configuration:

   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id_here
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
   VITE_FIREBASE_APP_ID=your_app_id_here
   ```

4. **Configure Firebase:**

   Follow the detailed setup guide in [`FIREBASE_SETUP.md`](FIREBASE_SETUP.md) to:

   - Set up Firebase Authentication
   - Configure Firestore Database
   - Create users and assign roles
   - Set security rules

5. **Customize Templates:**

   **Important:** Before using the application, you need to customize the templates with your own images:

   - Replace `INPUT_IMAGE` references in the code with your own image paths
   - Delete the existing template images that came with the project
   - Add your own organization logo, background images, and other assets to the `public/` directory
   - Update the image paths in the component files to point to your new assets

## Development

Start the development server:

```bash
bun run dev
# or
npm run dev
```

The application will be available at `http://localhost:5173`

## Build

Build for production:

```bash
bun run build
# or
npm run build
```

Preview production build:

```bash
bun run preview
# or
npm run preview
```

## Project Structure

```
id_card/
├── src/
│   ├── features/
│   │   └── auth/
│   │       └── AuthContext.tsx      # Authentication context with role management
│   ├── lib/
│   │   └── firebase.ts              # Firebase configuration
│   ├── pages/
│   │   ├── Certificate.tsx          # Certificate page
│   │   ├── Dashboard.tsx            # Main dashboard
│   │   ├── IdCard.tsx               # ID card generation page
│   │   └── Login.tsx                # Login page
│   ├── App.tsx                      # Main app component
│   └── main.tsx                     # Application entry point
├── public/                          # Static assets
├── .env.example                     # Environment variables template
├── FIREBASE_SETUP.md                # Detailed Firebase setup guide
├── package.json                     # Project dependencies
├── tsconfig.json                    # TypeScript configuration
└── vite.config.ts                   # Vite configuration
```

## Usage

### Authentication

Users cannot self-register. All users must be created manually through the Firebase Console:

1. Go to Firebase Console → Authentication → Users
2. Click "Add user" and enter email/password
3. Go to Firestore Database → users collection
4. Create a document with the user's UID as the document ID
5. Add fields: `email`, `role` (admin/user), and `createdAt`

### Role-Based Access

Access user role in components:

```tsx
import { useAuth } from "./features/auth/AuthContext";

function MyComponent() {
  const { role, user, isAuthenticated } = useAuth();

  if (role === "admin") {
    return <div>Admin content</div>;
  }

  return <div>User content</div>;
}
```

### Available Roles

- **admin** - Full access to all features
- **user** - Limited access based on permissions

## Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run preview` - Preview production build
- `bun run lint` - Run ESLint

## Security

- Email/password authentication via Firebase
- Role-based access control stored in Firestore
- Secure Firestore rules prevent unauthorized access
- No self-registration - users created by admins only
- Environment variables for sensitive configuration

## Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow get: if request.auth != null;
      allow write: if false;
    }
  }
}
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Troubleshooting

### Common Issues

**Permission denied in Firestore:**

- Verify Firestore security rules are configured correctly
- Ensure user document exists with correct UID

**User not found error:**

- Check user exists in Firebase Authentication
- Verify email/password are correct

**Role is null/undefined:**

- Confirm user document exists in Firestore `users` collection
- Verify document ID matches user's UID
- Ensure `role` field is set in the document

For more troubleshooting tips, see [`FIREBASE_SETUP.md`](FIREBASE_SETUP.md)

## License

This project is licensed under the MIT License - see below for details.

### MIT License

```
MIT License

Copyright (c) 2025 [Your Name/Organization]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Support

For detailed Firebase setup instructions, refer to [`FIREBASE_SETUP.md`](FIREBASE_SETUP.md)
