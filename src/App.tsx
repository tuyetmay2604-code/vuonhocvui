import React, { useState, useEffect, useMemo } from 'react';
import { StudyLink, SubjectType, FilterState } from './types';
import { 
  fetchLinks, 
  saveLinkToStorage, 
  updateLinkInStorage, 
  deleteLinkFromStorage, 
  toggleFavoriteInStorage,
  getSavedSupabaseConfig 
} from './services/storageService';
import { Navbar } from './components/Navbar';
import { HeroGarden } from './components/HeroGarden';
import { SubjectFlowers } from './components/SubjectFlowers';
import { LinkCard } from './components/LinkCard';
import { LinkModal } from './components/LinkModal';
import { SupabaseSetupModal } from './components/SupabaseSetupModal';
import { ExportImportModal } from './components/ExportImportModal';
import { GuideModal } from './components/GuideModal';
import { Toast } from './components/Toast';
import { Heart, ShieldAlert, Sparkles, EyeOff } from 'lucide-react';

export default function App() {
  const [links, setLinks] = useState<StudyLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');
  
  // activeSubject is null by default so links are hidden until a subject flower is clicked!
  const [activeSubject, setActiveSubject] = useState<SubjectType | null>(null);

  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);

  // Role state: 'admin' (Quản trị viên - toàn quyền) | 'viewer' (Người xem - chỉ xem)
  const [role, setRole] = useState<'admin' | 'viewer'>('admin');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isExportImportModalOpen, setIsExportImportModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<StudyLink | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter state
  const [filter, setFilter] = useState<FilterState>({
    subject: 'all',
    searchQuery: '',
    sortBy: 'newest',
    onlyFavorites: false,
    selectedTag: null
  });

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(prev => (prev === message ? null : prev));
    }, 3000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchLinks();
      setLinks(res.links);
      setIsSupabaseConnected(res.isSupabase);
    } catch (err) {
      console.error('Failed to load links:', err);
      showToast('Có lỗi khi tải dữ liệu liên kết.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const cfg = getSavedSupabaseConfig();
    if (cfg && cfg.url && cfg.anonKey && cfg.url !== 'https://your-project.supabase.co') {
      setIsSupabaseConnected(true);
    }
  }, []);

  const handleSelectSubject = (subj: SubjectType | 'all') => {
    if (subj === 'all') {
      // If 'all' is clicked, show all subjects or let them pick
      setActiveSubject('toan'); // Default to first or show all if desired
      showToast('Đã mở toàn bộ kho liên kết học tập!');
    } else {
      setActiveSubject(subj);
      const names: Record<SubjectType, string> = {
        toan: 'Toán học',
        'tieng-viet': 'Tiếng Việt',
        'tin-hoc': 'Tin học',
        'tieng-anh': 'Tiếng Anh'
      };
      showToast(`Đã mở kho liên kết môn ${names[subj]}`);
    }
  };

  const counts = useMemo(() => {
    const res: Record<SubjectType | 'all', number> = {
      all: links.length,
      toan: 0,
      'tieng-viet': 0,
      'tin-hoc': 0,
      'tieng-anh': 0
    };
    links.forEach(l => {
      if (res[l.subject] !== undefined) {
        res[l.subject]++;
      }
    });
    return res;
  }, [links]);

  const favoriteCount = useMemo(() => {
    return links.filter(l => l.isFavorite).length;
  }, [links]);

  const filteredLinks = useMemo(() => {
    if (!activeSubject && activeTab !== 'favorites') return [];

    return links.filter(link => {
      if (activeTab === 'favorites') {
        if (!link.isFavorite) return false;
      } else {
        if (activeSubject && link.subject !== activeSubject) return false;
      }

      if (filter.searchQuery.trim()) {
        const q = filter.searchQuery.toLowerCase();
        const matchTitle = link.title.toLowerCase().includes(q);
        const matchDesc = link.description.toLowerCase().includes(q);
        const matchUrl = link.url.toLowerCase().includes(q);
        const matchTags = link.tags?.some(t => t.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchUrl && !matchTags) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filter.sortBy === 'newest') {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      if (filter.sortBy === 'oldest') {
        return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      }
      if (filter.sortBy === 'title-asc') {
        return a.title.localeCompare(b.title);
      }
      if (filter.sortBy === 'title-desc') {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });
  }, [links, activeTab, activeSubject, filter]);

  // CRUD handlers with RBAC check
  const handleSaveLink = async (linkData: { title: string; url: string; subject: SubjectType; description: string; tags: string[]; author?: string }) => {
    if (role === 'viewer') {
      showToast('⚠️ Bạn đang ở chế độ Người xem, không có quyền thêm liên kết.');
      return;
    }
    try {
      if (editingLink) {
        const updated = await updateLinkInStorage({
          ...editingLink,
          ...linkData
        });
        setLinks(prev => prev.map(l => l.id === updated.id ? updated : l));
        showToast(`Đã cập nhật liên kết: ${updated.title}`);
      } else {
        const newLink = await saveLinkToStorage(linkData);
        setLinks(prev => [newLink, ...prev]);
        showToast(`Đã thêm liên kết mới thành công!`);
      }
      setEditingLink(null);
    } catch (err) {
      console.error('Save failed:', err);
      showToast('Có lỗi xảy ra khi lưu liên kết.');
    }
  };

  const handleDeleteLink = async (id: string) => {
    if (role === 'viewer') {
      showToast('⚠️ Bạn đang ở chế độ Người xem, không có quyền xóa liên kết.');
      return;
    }
    try {
      await deleteLinkFromStorage(id);
      setLinks(prev => prev.filter(l => l.id !== id));
      showToast('Đã xóa liên kết khỏi vườn.');
    } catch (err) {
      console.error('Delete failed:', err);
      showToast('Có lỗi xảy ra khi xóa liên kết.');
    }
  };

  const handleToggleFavorite = async (id: string) => {
    try {
      const updated = await toggleFavoriteInStorage(id);
      if (updated) {
        setLinks(prev => prev.map(l => l.id === updated.id ? updated : l));
        showToast(updated.isFavorite ? 'Đã thêm vào mục yêu thích ⭐' : 'Đã bỏ khỏi mục yêu thích');
      }
    } catch (err) {
      console.error('Favorite toggle failed:', err);
    }
  };

  const handleImportLinks = (imported: StudyLink[]) => {
    if (role === 'viewer') {
      showToast('⚠️ Bạn đang ở chế độ Người xem, không có quyền nhập/khôi phục dữ liệu.');
      return;
    }
    setLinks(imported);
    localStorage.setItem('vuon_hoc_vui_links_v1', JSON.stringify(imported));
  };

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 font-sans selection:bg-pink-100 selection:text-pink-900">
      {/* Top Navigation */}
      <Navbar
        onOpenAddModal={() => {
          if (role === 'viewer') {
            showToast('⚠️ Bạn đang ở chế độ Người xem. Vui lòng chuyển sang Quản trị viên để thêm liên kết.');
            return;
          }
          setEditingLink(null);
          setIsAddModalOpen(true);
        }}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        onOpenExportImportModal={() => {
          if (role === 'viewer') {
            showToast('⚠️ Chế độ Người xem chỉ có thể xem và xuất file.');
          }
          setIsExportImportModalOpen(true);
        }}
        onOpenGuideModal={() => setIsGuideModalOpen(true)}
        isSupabaseConnected={isSupabaseConnected}
        activeTab={activeTab}
        setActiveTab={tab => {
          setActiveTab(tab);
          if (tab === 'favorites') {
            setActiveSubject(null); // Show favorites view
          }
        }}
        totalCount={links.length}
        favoriteCount={favoriteCount}
        role={role}
        onToggleRole={setRole}
        onShowToast={showToast}
      />

      {/* Role banner notification */}
      {role === 'viewer' && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-xs text-amber-900 font-medium flex items-center justify-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Bạn đang ở <strong>Chế độ Người xem (Viewer)</strong>: Xem và mở liên kết. Bấm nút "Quản trị" trên thanh menu và nhập mã PIN <strong className="text-amber-950">admin123</strong> để quản lý.</span>
        </div>
      )}

      {/* Hero Garden Banner */}
      <HeroGarden
        filter={filter}
        setFilter={setFilter}
        totalLinks={links.length}
        isSupabaseConnected={isSupabaseConnected}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
      />

      {/* Subject Flowers Section */}
      <SubjectFlowers
        activeSubject={activeSubject || 'all'}
        onSelectSubject={handleSelectSubject}
        counts={counts}
      />

      {/* Main Content Repository */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {!activeSubject && activeTab !== 'favorites' ? (
          /* Hidden State: Prompt user to click a subject flower */
          <div className="bg-gradient-to-br from-pink-50/80 via-sky-50/50 to-white rounded-3xl border-2 border-dashed border-pink-200 p-12 text-center max-w-2xl mx-auto my-12 shadow-sm animate-fadeIn">
            <div className="w-20 h-20 rounded-3xl bg-white shadow-md border border-pink-100 flex items-center justify-center mx-auto mb-4 text-3xl animate-bounce">
              🌸
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              Kho liên kết đang được ẩn
            </h3>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              Hãy nhấn vào một trong các ô bông hoa môn học ở bên trên (<strong className="text-pink-600">Toán học</strong>, <strong className="text-emerald-600">Tiếng Việt</strong>, <strong className="text-sky-600">Tin học</strong>, <strong className="text-amber-600">Tiếng Anh</strong>) để mở và xem danh sách liên kết của môn học đó!
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => handleSelectSubject('toan')}
                className="px-4 py-2 rounded-xl bg-pink-100 text-pink-800 font-semibold text-xs hover:bg-pink-200 transition-colors shadow-2xs"
              >
                🌻 Xem môn Toán học
              </button>
              <button
                onClick={() => handleSelectSubject('tieng-viet')}
                className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 font-semibold text-xs hover:bg-emerald-200 transition-colors shadow-2xs"
              >
                🌷 Xem môn Tiếng Việt
              </button>
              <button
                onClick={() => handleSelectSubject('tin-hoc')}
                className="px-4 py-2 rounded-xl bg-sky-100 text-sky-800 font-semibold text-xs hover:bg-sky-200 transition-colors shadow-2xs"
              >
                🌼 Xem môn Tin học
              </button>
              <button
                onClick={() => handleSelectSubject('tieng-anh')}
                className="px-4 py-2 rounded-xl bg-amber-100 text-amber-800 font-semibold text-xs hover:bg-amber-200 transition-colors shadow-2xs"
              >
                🌺 Xem môn Tiếng Anh
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  {activeTab === 'favorites' ? (
                    <>
                      <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
                      <span>Liên kết yêu thích ({filteredLinks.length})</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 text-pink-500" />
                      <span>
                        Kho liên kết môn {activeSubject === 'toan' ? 'Toán học 🌻' : activeSubject === 'tieng-viet' ? 'Tiếng Việt 🌷' : activeSubject === 'tin-hoc' ? 'Tin học 🌼' : 'Tiếng Anh 🌺'} ({filteredLinks.length})
                      </span>
                    </>
                  )}
                </h3>
                <p className="text-xs text-slate-500">
                  Nhấn vào tên liên kết hoặc biểu tượng mở để truy cập trực tiếp tài nguyên học tập.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {activeSubject && (
                  <button
                    onClick={() => setActiveSubject(null)}
                    className="text-xs font-semibold text-slate-600 hover:text-pink-600 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Ẩn liên kết môn này</span>
                  </button>
                )}

                {activeTab === 'favorites' && (
                  <button
                    onClick={() => setActiveTab('all')}
                    className="text-xs font-semibold text-pink-600 hover:text-pink-700 underline underline-offset-4 cursor-pointer"
                  >
                    Xem tất cả kho liên kết
                  </button>
                )}
              </div>
            </div>

            {/* Loading state */}
            {loading ? (
              <div className="py-20 text-center">
                <div className="inline-block w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-sm text-slate-500 font-medium">Đang tải kho liên kết từ vườn...</p>
              </div>
            ) : filteredLinks.length === 0 ? (
              /* Empty state */
              <div className="bg-white rounded-3xl border border-pink-100 p-12 text-center max-w-md mx-auto my-12 shadow-xs">
                <div className="w-16 h-16 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center mx-auto mb-4 text-2xl">
                  🌱
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-1">Chưa có liên kết nào</h4>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                  Môn học này chưa có liên kết nào được thêm vào kho. Thầy cô hãy thêm liên kết mới nhé!
                </p>
                {role === 'admin' && (
                  <button
                    onClick={() => { setEditingLink(null); setIsAddModalOpen(true); }}
                    className="px-5 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-semibold shadow-sm transition-all"
                  >
                    + Thêm liên kết ngay
                  </button>
                )}
              </div>
            ) : (
              /* Links Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLinks.map(link => (
                  <LinkCard
                    key={link.id}
                    link={link}
                    onEdit={l => {
                      if (role === 'viewer') {
                        showToast('⚠️ Bạn đang ở chế độ Người xem, không có quyền sửa liên kết.');
                        return;
                      }
                      setEditingLink(l);
                      setIsAddModalOpen(true);
                    }}
                    onDelete={handleDeleteLink}
                    onToggleFavorite={handleToggleFavorite}
                    onShowToast={showToast}
                    role={role}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-pink-100 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-bold text-slate-700">VƯỜN HỌC VUI – CHINH PHỤC ĐIỂM 10</p>
          <p>Hệ thống phân quyền Người xem / Quản trị viên · Hỗ trợ Toán, Tiếng Việt, Tin học, Tiếng Anh</p>
        </div>
      </footer>

      {/* Modals */}
      <LinkModal
        isOpen={isAddModalOpen}
        onClose={() => { setIsAddModalOpen(false); setEditingLink(null); }}
        onSave={handleSaveLink}
        editingLink={editingLink}
      />

      <SupabaseSetupModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onConfigUpdated={() => {
          loadData();
          showToast('Đã cập nhật cấu hình cơ sở dữ liệu!');
        }}
      />

      <ExportImportModal
        isOpen={isExportImportModalOpen}
        onClose={() => setIsExportImportModalOpen(false)}
        links={links}
        onImportLinks={handleImportLinks}
        onShowToast={showToast}
      />

      <GuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />

      {/* Toast Notification */}
      <Toast message={toastMessage} />
    </div>
  );
}
