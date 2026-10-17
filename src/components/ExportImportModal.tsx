import React, { useState } from 'react';
import { StudyLink } from '../types';
import { X, Download, Upload, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  links: StudyLink[];
  onImportLinks: (imported: StudyLink[]) => void;
  onShowToast: (msg: string) => void;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  isOpen,
  onClose,
  links,
  onImportLinks,
  onShowToast
}) => {
  const [importText, setImportText] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(links, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `vuon_hoc_vui_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onShowToast('Đã xuất file sao lưu dữ liệu thành công!');
  };

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(importText);
      if (!Array.isArray(parsed)) {
        throw new Error('Định dạng JSON không hợp lệ (phải là danh sách liên kết).');
      }
      // Validate items
      for (const item of parsed) {
        if (!item.id || !item.title || !item.url || !item.subject) {
          throw new Error('Thiếu trường dữ liệu bắt buộc trong file JSON.');
        }
      }
      onImportLinks(parsed);
      onShowToast(`Đã nhập thành công ${parsed.length} liên kết vào vườn!`);
      onClose();
    } catch (err: any) {
      setError(`Lỗi nhập dữ liệu: ${err.message || 'Không thể đọc file JSON'}`);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        setImportText(content);
        setError('');
      } catch (err) {
        setError('Không thể đọc file đã chọn.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-rose-100">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Download className="w-5 h-5" />
            <h3 className="text-lg font-bold">Sao lưu & Phục hồi dữ liệu</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Export Section */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
            <h4 className="text-sm font-bold text-amber-900 mb-1 flex items-center gap-2">
              <Download className="w-4 h-4 text-amber-600" />
              <span>Xuất dữ liệu (Backup)</span>
            </h4>
            <p className="text-xs text-slate-600 mb-3">
              Tải xuống file JSON chứa toàn bộ {links.length} liên kết hiện có trong kho để lưu trữ phòng khi cần thiết.
            </p>
            <button
              onClick={handleExport}
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Tải xuống file sao lưu (.json)</span>
            </button>
          </div>

          <div className="border-t border-slate-200" />

          {/* Import Section */}
          <form onSubmit={handleImport} className="space-y-3">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Upload className="w-4 h-4 text-rose-600" />
              <span>Nhập dữ liệu (Restore)</span>
            </h4>
            <p className="text-xs text-slate-600">
              Tải lên file JSON hoặc dán mã JSON vào ô bên dưới để khôi phục danh sách liên kết.
            </p>

            <div>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100 cursor-pointer"
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <textarea
                rows={4}
                value={importText}
                onChange={e => setImportText(e.target.value)}
                placeholder="Hoặc dán nội dung JSON vào đây..."
                className="w-full p-3 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200"
              >
                Đóng
              </button>
              <button
                type="submit"
                disabled={!importText.trim()}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-sm disabled:opacity-50"
              >
                Khôi phục dữ liệu
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
