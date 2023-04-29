## Sign in with Google
- Firebase SDK method such as `signInWithPopup` and `signInWithRedirect` does not work on Expo mobile app since it needs to modify DOM directly.
- Instead, need to use sign-in flow with "Sign In With Google" first (from Google Cloud API). Then forward the credential/token to authenticate with Firebase.
To do so, we need to use `expo-web-browser` and `expo-auth-session`
- https://firebase.google.com/docs/auth/web/google-signin#expandable-2
- https://docs.expo.dev/guides/google-authentication/
- NOTE: after creating project on Google API, need to add all clientIDs to Firebase project.