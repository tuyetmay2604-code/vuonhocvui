import React, { useState } from 'react';
import { Plus, Database, BookOpen, Download, Heart, Shield, Eye, Lock } from 'lucide-react';
import { authenticateAdmin, logoutAdmin } from '../services/storageService';

interface NavbarProps {
  onOpenAddModal: () => void;
  onOpenSupabaseModal: () => void;
  onOpenExportImportModal: () => void;
  onOpenGuideModal: () => void;
  isSupabaseConnected: boolean;
  activeTab: 'all' | 'favorites';
  setActiveTab: (tab: 'all' | 'favorites') => void;
  totalCount: number;
  favoriteCount: number;
  role: 'admin' | 'viewer';
  onToggleRole: (newRole: 'admin' | 'viewer') => void;
  onShowToast: (msg: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAddModal,
  onOpenSupabaseModal,
  onOpenExportImportModal,
  onOpenGuideModal,
  isSupabaseConnected,
  activeTab,
  setActiveTab,
  totalCount,
  favoriteCount,
  role,
  onToggleRole,
  onShowToast
}) => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSwitchToViewer = async () => {
    await logoutAdmin();
    onToggleRole('viewer');
    onShowToast('Đã chuyển sang chế độ Người xem (Chỉ xem)');
  };

  const handleOpenAdminModal = () => {
    setShowPasswordModal(true);
    setPasswordInput('');
    setErrorMsg('');
  };

  const handleVerifyPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'admin123') {
      // Authenticate with Firebase Auth so request.auth != null is true for Firestore rules
      await authenticateAdmin();
      onToggleRole('admin');
      setShowPasswordModal(false);
      onShowToast('Đăng nhập Quản trị viên & Xác thực Firebase thành công!');
    } else {
      setErrorMsg('Mã PIN không đúng (Mã PIN quản trị: admin123)');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-pink-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Zone 1: Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-400 via-rose-400 to-sky-400 flex items-center justify-center shadow-sm text-white font-bold text-xl">
              🌸
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-800 leading-tight">
                Vườn học vui
              </h1>
              <p className="text-xs text-sky-600 font-medium">Chinh phục điểm 10</p>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-2 rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 ${
                activeTab === 'all'
                  ? 'bg-pink-50 text-pink-700 font-semibold shadow-2xs'
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              <BookOpen className="w-4 h-4 text-pink-500" />
              <span>Tất cả kho ({totalCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-3.5 py-2 rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 ${
                activeTab === 'favorites'
                  ? 'bg-sky-50 text-sky-700 font-semibold shadow-2xs'
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              <Heart className="w-4 h-4 text-sky-500 fill-sky-500" />
              <span>Yêu thích ({favoriteCount})</span>
            </button>

            <button
              onClick={onOpenGuideModal}
              className="px-3.5 py-2 rounded-xl hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0 text-slate-600"
            >
              Hướng dẫn
            </button>
          </nav>

          {/* Zone 3: Actions & Role buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Viewer Button */}
            <button
              onClick={handleSwitchToViewer}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border cursor-pointer ${
                role === 'viewer'
                  ? 'bg-sky-100 text-sky-800 border-sky-300 shadow-2xs'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
              title="Chuyển sang chế độ Người xem (Chỉ xem)"
            >
              <Eye className="w-3.5 h-3.5 text-sky-600" />
              <span className="hidden sm:inline">Người xem</span>
            </button>

            {/* Admin Button */}
            <button
              onClick={handleOpenAdminModal}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border cursor-pointer ${
                role === 'admin'
                  ? 'bg-pink-100 text-pink-800 border-pink-300 shadow-2xs'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
              title="Nhập mã PIN để vào chế độ Quản trị"
            >
              <Shield className="w-3.5 h-3.5 text-pink-600" />
              <span className="hidden sm:inline">Quản trị</span>
            </button>

            <button
              onClick={onOpenSupabaseModal}
              title="Cơ sở dữ liệu Firebase"
              className={`px-3 py-2 rounded-xl text-xs font-medium hidden lg:flex items-center gap-1.5 transition-colors border ${
                isSupabaseConnected
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>{isSupabaseConnected ? 'Firebase' : 'Cấu hình DB'}</span>
            </button>

            <button
              onClick={onOpenExportImportModal}
              title="Sao lưu dữ liệu"
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors hidden xl:flex items-center gap-1.5"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>Sao lưu</span>
            </button>

            {role === 'admin' && (
              <button
                onClick={onOpenAddModal}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-pink-500 via-rose-500 to-sky-500 hover:from-pink-600 hover:to-sky-600 shadow-md shadow-pink-200 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 whitespace-nowrap shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm liên kết</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Password verification modal for Admin role switch */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 border border-pink-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Lock className="w-4 h-4 text-pink-600" />
                <span>Nhập mã PIN Quản trị</span>
              </h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Vui lòng nhập mã PIN quản trị để xác thực Firebase (<strong className="text-pink-600">admin123</strong>).
            </p>

            <form onSubmit={handleVerifyPassword} className="space-y-3">
              <input
                type="password"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                placeholder="Nhập mã PIN (admin123)..."
                autoFocus
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 font-mono"
              />

              {errorMsg && (
                <p className="text-xs text-rose-600 font-medium">{errorMsg}</p>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-pink-600 hover:bg-pink-700 shadow-sm"
                >
                  Xác nhận
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
