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
import { auth, db } from '../lib/firebase';

interface UserData {
  uid: string;
  email: string | null;
  firstName: string | null;
  investmentTier: string | null;
  balance: number;
  kycStatus: string;
  createdAt: any;
}

interface AuthContextType {
  user: FirebaseUser | null;
  userData: UserData | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string, firstName: string, investmentTier: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        // Check if user document exists, if not create it
        const userRef = doc(db, 'users', user.uid);
        
        try {
          const userSnap = await getDoc(userRef);

          if (!userSnap.exists()) {
            const names = user.displayName?.split(' ') || [];
            const firstName = names[0] || user.email?.split('@')[0] || 'Investor';

            const newUserData = {
              email: user.email,
              firstName: firstName,
              investmentTier: 'Not Set',
              balance: 0,
              kycStatus: 'Not Set',
              createdAt: serverTimestamp()
            };
            await setDoc(userRef, newUserData);
          }

          // Listen for user data changes
          const unsubUser = onSnapshot(userRef, (doc) => {
            if (doc.exists()) {
              setUserData({ uid: doc.id, ...doc.data() } as UserData);
              setLoading(false);
            }
          });

          return () => unsubUser();
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

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  };

  const signUp = async (email: string, pass: string, firstName: string, investmentTier: string) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, pass);
      // Explicitly create user doc with firstName and investmentTier
      const userRef = doc(db, 'users', user.uid);
      const newUserData = {
        email: email,
        firstName: firstName,
        investmentTier: investmentTier,
        balance: 0,
        kycStatus: 'Not Set',
        createdAt: serverTimestamp()
      };
      await setDoc(userRef, newUserData);
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
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

  return (
    <AuthContext.Provider value={{ user, userData, loading, signIn, signInWithEmail, signUp, logout }}>
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
