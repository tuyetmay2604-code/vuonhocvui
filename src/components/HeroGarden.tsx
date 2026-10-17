import React from 'react';
import { Search, Sparkles, Database, BookMarked, CheckCircle2 } from 'lucide-react';
import { FilterState } from '../types';

interface HeroGardenProps {
  filter: FilterState;
  setFilter: React.Dispatch<React.SetStateAction<FilterState>>;
  totalLinks: number;
  isSupabaseConnected: boolean;
  onOpenSupabaseModal: () => void;
}

export const HeroGarden: React.FC<HeroGardenProps> = ({
  filter,
  setFilter,
  totalLinks,
  isSupabaseConnected,
  onOpenSupabaseModal
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-pink-50/70 via-sky-50/40 to-white pt-8 pb-12 px-4 sm:px-6 lg:px-8 border-b border-pink-100/60">
      {/* Background decorative flower shapes */}
      <div className="absolute top-4 right-10 w-64 h-64 bg-pink-200/35 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-sky-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Badge tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100/80 text-pink-800 text-xs font-semibold mb-4 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-pink-600" />
          <span>Trợ thủ đắc lực cho giáo viên tiểu học</span>
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
          <span>Giao diện Hồng & Xanh da trời</span>
        </div>

        {/* Main headline */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight mb-3">
          Vườn học vui - Chinh phục điểm 10
        </h2>
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
          Nơi tổng hợp các trang web, phần mềm, trò chơi và tài nguyên học tập chuẩn kiến thức cho các môn <span className="font-semibold text-pink-600">Toán</span>, <span className="font-semibold text-emerald-600">Tiếng Việt</span>, <span className="font-semibold text-sky-600">Tin học</span>, <span className="font-semibold text-amber-600">Tiếng Anh</span>.
        </p>

        {/* Search bar and quick filters */}
        <div className="max-w-2xl mx-auto bg-white p-2 rounded-2xl shadow-lg shadow-pink-100/50 border border-pink-100 flex flex-col sm:flex-row items-center gap-2 mb-6">
          <div className="relative flex-1 w-full flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={filter.searchQuery}
              onChange={(e) => setFilter(prev => ({ ...prev, searchQuery: e.target.value }))}
              placeholder="Tìm kiếm theo tên liên kết, mô tả, từ khóa hoặc địa chỉ URL..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50/80 focus:bg-white text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-400/50 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={filter.sortBy}
              onChange={(e) => setFilter(prev => ({ ...prev, sortBy: e.target.value as any }))}
              className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-100 text-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-400/50 transition-all cursor-pointer"
            >
              <option value="newest">Mới cập nhật</option>
              <option value="oldest">Cũ nhất</option>
              <option value="title-asc">Tên (A-Z)</option>
              <option value="title-desc">Tên (Z-A)</option>
            </select>
          </div>
        </div>

        {/* Quick status bar */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
            <BookMarked className="w-4 h-4 text-pink-500" />
            <span>Tổng số: <strong className="text-slate-800">{totalLinks}</strong> liên kết</span>
          </div>

          <button
            onClick={onOpenSupabaseModal}
            className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 shadow-2xs transition-colors cursor-pointer text-left"
          >
            {isSupabaseConnected ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Cơ sở dữ liệu: <strong className="text-emerald-700">Supabase (Trực tuyến)</strong></span>
              </>
            ) : (
              <>
                <Database className="w-4 h-4 text-sky-500" />
                <span>Kho lưu trữ: <strong className="text-sky-700">Trục cục bộ (Bấm để kết nối Supabase)</strong></span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
