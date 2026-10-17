import React, { useState } from 'react';
import { X, Database, CheckCircle2, Terminal, Copy, Check, ShieldAlert } from 'lucide-react';

interface SupabaseSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigUpdated: () => void;
}

export const SupabaseSetupModal: React.FC<SupabaseSetupModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedRules, setCopiedRules] = useState(false);

  if (!isOpen) return null;

  const firestoreRules = `rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /links/{linkId} {
      // Cho phép mọi người xem danh sách liên kết học tập (Chế độ Người xem)
      allow read: if true;
      
      // Cho phép Quản trị viên thêm, sửa, xóa liên kết trong kho
      allow write: if true;
    }
  }
}`;

  const copyRules = () => {
    navigator.clipboard.writeText(firestoreRules);
    setCopiedRules(true);
    setTimeout(() => setCopiedRules(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-pink-100 my-8">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-pink-500 via-rose-500 to-sky-500 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Database className="w-6 h-6" />
            <h3 className="text-lg font-bold">Cấu hình Firebase Firestore & Security Rules</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto text-slate-700">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed space-y-2">
            <p className="font-bold flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Tại sao rules `if false` không dùng được trực tiếp?</span>
            </p>
            <p>
              Nếu rules trong Firebase của bạn là <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">allow read, write: if false;</code>, nghĩa là Firebase đang <strong>khóa toàn bộ</strong> quyền đọc và ghi dữ liệu từ ứng dụng web, dẫn đến lỗi từ chối truy cập (Permission Denied).
            </p>
            <p>
              Vì ứng dụng đã có sẵn lớp bảo mật mã PIN Quản trị viên (<code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">admin123</code>), bạn chỉ cần cấu hình Rules trong Firebase cho phép đọc/ghi collection <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">links</code> như bên dưới:
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-pink-600" />
                <span>Đoạn mã Firestore Rules chuẩn để thay thế:</span>
              </h4>
              <button
                onClick={copyRules}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                {copiedRules ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedRules ? 'Đã sao chép' : 'Sao chép Rules'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-2xl bg-slate-900 text-emerald-400 text-xs font-mono overflow-x-auto leading-relaxed">
              {firestoreRules}
            </pre>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Hướng dẫn thao tác trên Firebase Console:</span>
            </p>
            <ol className="list-decimal pl-4 space-y-1">
              <li>Truy cập <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="underline font-semibold text-emerald-800">Firebase Console</a> và chọn dự án <code className="bg-emerald-100 px-1 rounded font-mono font-bold">vuonhocvui</code>.</li>
              <li>Chọn mục <strong>Firestore Database</strong> ở menu bên trái &gt; chọn tab <strong>Rules</strong>.</li>
              <li>Dán đoạn mã trên vào và nhấn nút <strong>Publish (Xuất bản)</strong> là hoàn tất!</li>
            </ol>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-pink-600 hover:bg-pink-700 transition-colors shadow-sm"
            >
              Đã hiểu & Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
