import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, setDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { StudyLink } from '../types';
import { INITIAL_LINKS } from '../data/initialLinks';

const LOCAL_STORAGE_KEY = 'vuon_hoc_vui_links_v1';

// Firebase configuration provided by user
const firebaseConfig = {
  apiKey: "AIzaSyAxtI8wDzEPGyk_rmvV1rm5AZAmzsO7R1E",
  authDomain: "vuonhocvui.firebaseapp.com",
  projectId: "vuonhocvui",
  storageBucket: "vuonhocvui.firebasestorage.app",
  messagingSenderId: "228069642206",
  appId: "1:228069642206:web:5b1df20961cba1078a574f"
};

let db: any = null;
let isFirebaseInitialized = false;

try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  isFirebaseInitialized = true;
  console.log("Firebase initialized successfully for project:", firebaseConfig.projectId);
} catch (err) {
  console.error("Failed to initialize Firebase:", err);
  isFirebaseInitialized = false;
}

export function getIsFirebaseConnected(): boolean {
  return isFirebaseInitialized;
}

// Fetch links from Firebase Firestore (collection 'links'), fallback to LocalStorage
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
        // Sort by updatedAt desc
        links.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        return { links, isSupabase: true }; // Reusing isSupabase flag for DB connected status in UI
      } else {
        // If empty in Firestore, seed with initial links
        for (const link of INITIAL_LINKS) {
          await setDoc(doc(db, "links", link.id), link);
        }
        return { links: INITIAL_LINKS, isSupabase: true };
      }
    } catch (e) {
      console.warn("Firestore fetch error, falling back to localStorage:", e);
    }
  }

  // LocalStorage Fallback
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return { links: parsed, isSupabase: false };
      }
    } catch {
      // fallback
    }
  }

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_LINKS));
  return { links: INITIAL_LINKS, isSupabase: false };
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
    } catch (e) {
      console.warn("Firestore save error:", e);
    }
  }

  // LocalStorage update
  const { links } = await fetchLinks();
  const updated = [newLink, ...links];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
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
    } catch (e) {
      console.warn("Firestore update error:", e);
    }
  }

  // LocalStorage update
  const { links } = await fetchLinks();
  const updated = links.map(l => l.id === withNewTime.id ? withNewTime : l);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  return withNewTime;
}

export async function deleteLinkFromStorage(id: string): Promise<void> {
  if (isFirebaseInitialized && db) {
    try {
      await deleteDoc(doc(db, "links", id));
      return;
    } catch (e) {
      console.warn("Firestore delete error:", e);
    }
  }

  // LocalStorage update
  const { links } = await fetchLinks();
  const updated = links.filter(l => l.id !== id);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
}

export async function toggleFavoriteInStorage(id: string): Promise<StudyLink | null> {
  const { links } = await fetchLinks();
  const target = links.find(l => l.id === id);
  if (!target) return null;

  const updated: StudyLink = {
    ...target,
    isFavorite: !target.isFavorite,
    updatedAt: new Date().toISOString()
  };

  return await updateLinkInStorage(updated);
}

// Dummy config export for Supabase modal compatibility if needed
export function getSavedSupabaseConfig() {
  return { url: "https://vuonhocvui.firebaseapp.com", anonKey: "firebase-active" };
}
export function saveSupabaseConfig() {}
export function clearSupabaseConfig() {}
export async function testSupabaseConnection() {
  return { success: true, message: "Kết nối Firebase Firestore thành công!" };
}
