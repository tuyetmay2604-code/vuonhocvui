import React from 'react';
import { X, BookOpen, Sparkles, Database, Share2, PlusCircle } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-rose-100 my-8">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-rose-500 to-pink-500 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🌸</span>
            <h3 className="text-lg font-bold">Hướng dẫn sử dụng – Vườn Học Vui</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-slate-700 text-sm leading-relaxed max-h-[80vh] overflow-y-auto">
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900">
            <h4 className="font-bold text-base mb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-600" />
              <span>Chào mừng thầy cô đến với Kho Liên Kết Học Tập!</span>
            </h4>
            <p className="text-xs">
              Ứng dụng được thiết kế riêng cho giáo viên tiểu học để lưu trữ, quản lý và chia sẻ các trang web học tập, phần mềm tương tác và tài liệu bổ ích cho 4 môn chính: Toán, Tiếng Việt, Tin học và Tiếng Anh.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold shrink-0 mt-0.5">
                1
              </div>
              <div>
                <h5 className="font-bold text-slate-800 mb-1">Khám phá theo môn học</h5>
                <p className="text-xs text-slate-600">
                  Nhấn vào các nút bông hoa môn học (Toán, Tiếng Việt, Tin học, Tiếng Anh) ở trang chủ để lọc nhanh các liên kết thuộc bộ môn đó.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0 mt-0.5">
                2
              </div>
              <div>
                <h5 className="font-bold text-slate-800 mb-1">Thêm và quản lý liên kết</h5>
                <p className="text-xs text-slate-600">
                  Nhấn nút <strong className="text-rose-600">+ Thêm liên kết</strong> ở góc trên bên phải để đóng góp thêm trang web hay. Thầy cô có thể chỉnh sửa, xóa hoặc đánh dấu yêu thích các liên kết quan trọng.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold shrink-0 mt-0.5">
                3
              </div>
              <div>
                <h5 className="font-bold text-slate-800 mb-1">Lưu trữ lâu dài với Supabase & Chia sẻ</h5>
                <p className="text-xs text-slate-600">
                  Để dữ liệu không bị mất khi đổi thiết bị hoặc triển khai lên Vercel, hãy bấm nút <strong className="text-teal-600">Cấu hình Supabase</strong> để kết nối cơ sở dữ liệu trực tuyến. Thầy cô cũng có thể xuất/nhập file sao lưu JSON bất cứ lúc nào.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 transition-colors"
            >
              Đã hiểu, bắt đầu khám phá
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
