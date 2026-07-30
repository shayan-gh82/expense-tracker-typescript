const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
);

let firebasePromise;

const getFirebaseAuth = async () => {
  if (!isFirebaseConfigured) {
    throw new Error("FIREBASE_NOT_CONFIGURED");
  }

  if (!firebasePromise) {
    firebasePromise = Promise.all([import("firebase/app"), import("firebase/auth")]).then(
      ([appModule, authModule]) => {
        const app = appModule.getApps()[0] || appModule.initializeApp(firebaseConfig);
        const auth = authModule.getAuth(app);
        auth.useDeviceLanguage();
        return { auth, authModule };
      }
    );
  }

  return firebasePromise;
};

export const signInWithGoogle = async () => {
  const { auth, authModule } = await getFirebaseAuth();
  const provider = new authModule.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  const result = await authModule.signInWithPopup(auth, provider);
  const user = result.user;

  return {
    id: `google-${user.uid}`,
    name: user.displayName || "Google User",
    email: user.email || "",
    avatarUrl: user.photoURL || "",
    provider: "google",
    createdAt: new Date().toISOString(),
  };
};

export const signOutGoogle = async () => {
  if (!isFirebaseConfigured) return;
  const { auth, authModule } = await getFirebaseAuth();
  await authModule.signOut(auth);
};
