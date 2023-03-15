Config firebase:
1. Authentication:
- Build => Add Authentication
- In Authentication, add Eamil/Password Sign-in providers
2. Realtime Database
- Build => Add Realtime Database
- Set up rule:
{
  "rules": {
    ".read": true,
    ".write": "auth != null",
      "users": {
        ".indexOn": ["fullNameLowerCase"]
      }
  }
}
3. Storage
- Build => Add Storage
- Set up rule:
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
4. Natigate to Project Settings => Select Web App Platform. Copy const firebaseConfig to ./firebase/config.js