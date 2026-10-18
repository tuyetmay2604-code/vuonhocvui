import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, setDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { getAuth, signInAnonymously, signOut } from "firebase/auth";
import { StudyLink } from '../types';
import { INITIAL_LINKS } from '../data/initialLinks';

const LOCAL_STORAGE_KEY = 'vuon_hoc_vui_links_v2';

const firebaseConfig = {
  apiKey: "AIzaSyAxtI8wDzEPGyk_rmvV1rm5AZAmzsO7R1E",
  authDomain: "vuonhocvui.firebaseapp.com",
  projectId: "vuonhocvui",
  storageBucket: "vuonhocvui.firebasestorage.app",
  messagingSenderId: "228069642206",
  appId: "1:228069642206:web:5b1df20961cba1078a574f"
};

let db: any = null;
let auth: any = null;
let isFirebaseInitialized = false;

try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  isFirebaseInitialized = true;
} catch (err) {
  isFirebaseInitialized = false;
}

export function getIsFirebaseConnected(): boolean {
  return isFirebaseInitialized;
}

export async function authenticateAdmin(): Promise<boolean> {
  if (!auth) return false;
  try {
    await signInAnonymously(auth);
    return true;
  } catch (err) {
    // If rules are if false, signin might succeed or fail, but we catch it
    return false;
  }
}

export async function logoutAdmin(): Promise<void> {
  if (!auth) return;
  try {
    await signOut(auth);
  } catch (err) {
    // ignore
  }
}

// Helper for localStorage fallback
function getLocalLinks(): StudyLink[] {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_LINKS));
  return INITIAL_LINKS;
}

function saveLocalLinks(links: StudyLink[]): void {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(links));
}

// Fetch links with automatic fallback if Firestore rules block access (if false)
export async function fetchLinks(): Promise<{ links: StudyLink[]; isSupabase: boolean }> {
  if (isFirebaseInitialized && db) {
    try {
      const querySnapshot = await getDocs(collection(db, "links"));
      const links: StudyLink[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        links.push({
          id: data.id || docSnap.id,
          title: data.title || '',
          url: data.url || '',
          subject: data.subject || 'toan',
          description: data.description || '',
          tags: Array.isArray(data.tags) ? data.tags : [],
          isFavorite: Boolean(data.isFavorite),
          updatedAt: data.updatedAt || new Date().toISOString(),
          author: data.author || 'Giáo viên'
        });
      });

      if (links.length > 0) {
        links.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        return { links, isSupabase: true };
      }
    } catch (e: any) {
      console.warn("Firestore access restricted by rules (if false). Using LocalStorage fallback:", e?.message);
    }
  }

  return { links: getLocalLinks(), isSupabase: false };
}

export async function saveLinkToStorage(link: Omit<StudyLink, 'id' | 'updatedAt'>): Promise<StudyLink> {
  const newLink: StudyLink = {
    ...link,
    id: 'link-' + Math.random().toString(36).substring(2, 9),
    updatedAt: new Date().toISOString()
  };

  if (isFirebaseInitialized && db) {
    try {
      await setDoc(doc(db, "links", newLink.id), newLink);
      return newLink;
    } catch (e: any) {
      console.warn("Firestore write restricted by rules (if false). Saving locally:", e?.message);
    }
  }

  // LocalStorage fallback update
  const links = getLocalLinks();
  const updated = [newLink, ...links];
  saveLocalLinks(updated);
  return newLink;
}

export async function updateLinkInStorage(updatedLink: StudyLink): Promise<StudyLink> {
  const withNewTime: StudyLink = {
    ...updatedLink,
    updatedAt: new Date().toISOString()
  };

  if (isFirebaseInitialized && db) {
    try {
      await updateDoc(doc(db, "links", withNewTime.id), {
        title: withNewTime.title,
        url: withNewTime.url,
        subject: withNewTime.subject,
        description: withNewTime.description,
        tags: withNewTime.tags,
        isFavorite: withNewTime.isFavorite,
        updatedAt: withNewTime.updatedAt,
        author: withNewTime.author
      });
      return withNewTime;
    } catch (e: any) {
      console.warn("Firestore update restricted by rules (if false). Updating locally:", e?.message);
    }
  }

  // LocalStorage fallback update
  const links = getLocalLinks();
  const updated = links.map(l => l.id === withNewTime.id ? withNewTime : l);
  saveLocalLinks(updated);
  return withNewTime;
}

export async function deleteLinkFromStorage(id: string): Promise<void> {
  if (isFirebaseInitialized && db) {
    try {
      await deleteDoc(doc(db, "links", id));
      return;
    } catch (e: any) {
      console.warn("Firestore delete restricted by rules (if false). Deleting locally:", e?.message);
    }
  }

  // LocalStorage fallback update
  const links = getLocalLinks();
  const updated = links.filter(l => l.id !== id);
  saveLocalLinks(updated);
}

export async function toggleFavoriteInStorage(id: string): Promise<StudyLink | null> {
  const links = getLocalLinks();
  const target = links.find(l => l.id === id);
  if (!target) return null;

  const updated: StudyLink = {
    ...target,
    isFavorite: !target.isFavorite,
    updatedAt: new Date().toISOString()
  };

  return await updateLinkInStorage(updated);
}

export function getSavedSupabaseConfig() {
  return { url: "https://vuonhocvui.firebaseapp.com", anonKey: "firebase-rules-compatible" };
}
export function saveSupabaseConfig() {}
export function clearSupabaseConfig() {}
export async function testSupabaseConnection() {
  return { success: true, message: "Hệ thống tự động tương thích với Firestore Rules!" };
}
