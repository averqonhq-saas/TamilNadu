import { auth, googleProvider } from "./client";
import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as fbSignOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (error: any) {
    if (error.code === "auth/popup-blocked") {
      try {
        await signInWithRedirect(auth, googleProvider);
        return { user: null, error: null };
      } catch (redirectError: any) {
        return { user: null, error: redirectError };
      }
    }
    return { user: null, error };
  }
}

export async function checkRedirectResult() {
  try {
    const result = await getRedirectResult(auth);
    return { user: result?.user || null, error: null };
  } catch (error: any) {
    return { user: null, error };
  }
}

export async function signOutAdmin() {
  try {
    await fbSignOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error };
  }
}

export function subscribeToAdminAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
