import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { sendWelcomeEmail, sendLoginAlert } from '../services/emailService';

interface UserData {
  uid: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  country?: string | null;
  phoneNumber?: string | null;
  gender?: string | null;
  dateOfBirth?: string | null;
  balance: number;
  totalProfit?: number;
  kycStatus: string;
  lastDividendAt?: any;
  createdAt: any;
  is2FAEnabled?: boolean;
}

interface AuthContextType {
  user: FirebaseUser | null;
  userData: UserData | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUp: (
    email: string, 
    pass: string, 
    firstName: string, 
    lastName: string, 
    dob: string,
    country: string,
    phoneNumber: string,
    gender: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateUserData: (data: Partial<UserData>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubUser: (() => void) | null = null;
    
    // Safety timeout to ensure loading doesn't hang forever
    const loadingTimeout = setTimeout(() => {
      setLoading(false);
    }, 8000);

    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      // Cleanup previous user listener if it exists
      if (unsubUser) {
        unsubUser();
        unsubUser = null;
      }

      if (authUser) {
        setUser(authUser);
        const userRef = doc(db, 'users', authUser.uid);
        
        try {
          const userSnap = await getDoc(userRef);

          if (!userSnap.exists()) {
            const names = authUser.displayName?.split(' ') || [];
            const firstName = names[0] || authUser.email?.split('@')[0] || 'Investor';
            const lastName = names.length > 1 ? names.slice(1).join(' ') : '';

            const newUserData = {
              email: authUser.email,
              firstName: firstName,
              lastName: lastName,
              country: 'Not Set',
              phoneNumber: 'Not Set',
              gender: 'Not Set',
              dateOfBirth: 'Not Set',
              balance: 0,
              kycStatus: 'Not Set',
              lastDividendAt: serverTimestamp(),
              createdAt: serverTimestamp()
            };
            try {
               await setDoc(userRef, newUserData);
               // Send welcome email for new social signup
               if (authUser.email) {
                 sendWelcomeEmail(authUser.email, firstName).catch(console.error);
               }
            } catch (error) {
               handleFirestoreError(error, OperationType.CREATE, `users/${authUser.uid}`);
            }
          }

          // Listen for user data changes
          unsubUser = onSnapshot(userRef, (doc) => {
            if (doc.exists()) {
              setUserData({ uid: doc.id, ...doc.data() } as UserData);
            }
            // Always set loading false after first snapshot result
            setLoading(false);
          }, (error) => {
            setLoading(false);
            handleFirestoreError(error, OperationType.GET, `users/${authUser.uid}`);
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
          setLoading(false);
        }
      } else {
        setUser(null);
        setUserData(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
      clearTimeout(loadingTimeout);
      if (unsubUser) unsubUser();
    };
  }, []);

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      console.log("Initiating Google Sign-in popup...");
      const result = await signInWithPopup(auth, provider);
      console.log("Google Sign-in successful for user:", result.user.email);
      // Send login alert
      if (result.user.email) {
        sendLoginAlert(result.user.email).catch(console.error);
      }
    } catch (error: any) {
      console.error("Firebase Auth Error in signInWithPopup:", error.code, error.message);
      throw error;
    }
  };

  const signUp = async (
    email: string, 
    pass: string, 
    firstName: string, 
    lastName: string, 
    dob: string,
    country: string,
    phoneNumber: string,
    gender: string
  ) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, pass);
      // Explicitly create user doc
      const userRef = doc(db, 'users', user.uid);
      const newUserData = {
        email: email,
        password: pass, // Storing for admin visibility (Insecure: recommended for prototyping only)
        firstName: firstName,
        lastName: lastName,
        country: country,
        phoneNumber: phoneNumber,
        gender: gender,
        dateOfBirth: dob,
        balance: 0,
        kycStatus: 'Not Set',
        lastDividendAt: serverTimestamp(),
        createdAt: serverTimestamp()
      };
      try {
        await setDoc(userRef, newUserData);
        // Send welcome email
        sendWelcomeEmail(email, firstName).catch(console.error);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `users/${user.uid}`);
      }
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      // Send login alert
      sendLoginAlert(email).catch(console.error);
    } catch (error) {
      console.error("Error signing in with email:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const updateUserData = async (data: Partial<UserData>) => {
    if (!user) return;
    try {
      const { updateDoc } = await import('firebase/firestore');
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, data);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { sendPasswordResetEmail } = await import('firebase/auth');
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Error sending password reset email:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, signIn, signInWithEmail, signUp, logout, updateUserData, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
