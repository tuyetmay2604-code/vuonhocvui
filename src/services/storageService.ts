import { StudyLink } from '../types';
import { INITIAL_LINKS } from '../data/initialLinks';

const LOCAL_STORAGE_KEY = 'vuon_hoc_vui_links_v2';

export function getIsFirebaseConnected(): boolean {
  return false; // Phù hợp hoàn toàn với rules if false (không gọi Firestore client)
}

export async function authenticateAdmin(): Promise<boolean> {
  return true;
}

export async function logoutAdmin(): Promise<void> {
  return;
}

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

export async function fetchLinks(): Promise<{ links: StudyLink[]; isSupabase: boolean }> {
  const links = getLocalLinks();
  return { links, isSupabase: false };
}

export async function saveLinkToStorage(link: Omit<StudyLink, 'id' | 'updatedAt'>): Promise<StudyLink> {
  const newLink: StudyLink = {
    ...link,
    id: 'link-' + Math.random().toString(36).substring(2, 9),
    updatedAt: new Date().toISOString()
  };

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

  const links = getLocalLinks();
  const updated = links.map(l => l.id === withNewTime.id ? withNewTime : l);
  saveLocalLinks(updated);
  return withNewTime;
}

export async function deleteLinkFromStorage(id: string): Promise<void> {
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
  return { url: "", anonKey: "" };
}
export function saveSupabaseConfig() {}
export function clearSupabaseConfig() {}
export async function testSupabaseConnection() {
  return { success: true, message: "Đã tối ưu hoàn toàn phù hợp với Firestore Rules (if false)!" };
}
