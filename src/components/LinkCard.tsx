import React, { useState } from 'react';
import { StudyLink, SubjectType } from '../types';
import { ExternalLink, Copy, Heart, Edit3, Trash2, Check, Globe, Calculator, BookOpen, Laptop } from 'lucide-react';

interface LinkCardProps {
  link: StudyLink;
  onEdit: (link: StudyLink) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onShowToast: (message: string) => void;
  role: 'admin' | 'viewer';
}

const subjectMeta: Record<SubjectType, { label: string; bg: string; text: string; icon: React.ComponentType<{ className?: string }> }> = {
  toan: { label: 'Toán học', bg: 'bg-pink-50 text-pink-700 border-pink-200', text: 'text-pink-700', icon: Calculator },
  'tieng-viet': { label: 'Tiếng Việt', bg: 'bg-sky-50 text-sky-700 border-sky-200', text: 'text-sky-700', icon: BookOpen },
  'tin-hoc': { label: 'Tin học', bg: 'bg-blue-50 text-blue-700 border-blue-200', text: 'text-blue-700', icon: Laptop },
  'tieng-anh': { label: 'Tiếng Anh', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', text: 'text-indigo-700', icon: Globe }
};

export const LinkCard: React.FC<LinkCardProps> = ({
  link,
  onEdit,
  onDelete,
  onToggleFavorite,
  onShowToast,
  role
}) => {
  const [copied, setCopied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const meta = subjectMeta[link.subject] || subjectMeta.toan;
  const SubjectIcon = meta.icon;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(link.url);
    setCopied(true);
    onShowToast(`Đã sao chép liên kết: ${link.title}`);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = new Date(link.updatedAt).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <div className="bg-white rounded-3xl border border-pink-100 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between p-5 relative group overflow-hidden">
      {/* Top row: Subject badge & Favorite button */}
      <div className="flex items-center justify-between mb-3">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border ${meta.bg}`}>
          <SubjectIcon className="w-3.5 h-3.5" />
          <span>{meta.label}</span>
        </span>

        <button
          onClick={() => onToggleFavorite(link.id)}
          title={link.isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
          className={`p-2 rounded-xl transition-colors cursor-pointer ${
            link.isFavorite
              ? 'text-pink-500 bg-pink-50 hover:bg-pink-100'
              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Heart className={`w-4 h-4 ${link.isFavorite ? 'fill-pink-500' : ''}`} />
        </button>
      </div>

      {/* Main content */}
      <div className="mb-4">
        <h4 className="text-base font-bold text-slate-800 mb-2 leading-snug group-hover:text-pink-600 transition-colors">
          {link.title}
        </h4>
        <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-3">
          {link.description}
        </p>

        {/* URL display */}
        <div className="bg-slate-50 px-3 py-2 rounded-xl text-xs text-slate-500 font-mono truncate border border-slate-100 flex items-center justify-between gap-2">
          <span className="truncate">{link.url}</span>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            title="Mở liên kết trong tab mới"
            className="text-blue-600 hover:text-blue-700 p-1 shrink-0"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Tags */}
      {link.tags && link.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {link.tags.map((tag, idx) => (
            <span key={idx} className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer metadata & action buttons */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span>Cập nhật: {formattedDate}</span>
          {link.author && (
            <>
              <span>·</span>
              <span>{link.author}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            title="Sao chép URL"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>

          {role === 'admin' && (
            <>
              <button
                onClick={() => onEdit(link)}
                title="Chỉnh sửa liên kết"
                className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowDeleteConfirm(true)}
                title="Xóa liên kết"
                className="p-1.5 rounded-lg text-slate-500 hover:text-pink-600 hover:bg-pink-50 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Delete confirmation overlay */}
      {showDeleteConfirm && role === 'admin' && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-xs z-20 flex flex-col items-center justify-center p-4 text-center animate-fadeIn">
          <p className="text-sm font-bold text-slate-800 mb-2">Bạn có chắc chắn muốn xóa liên kết này?</p>
          <p className="text-xs text-slate-500 mb-4">{link.title}</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onDelete(link.id)}
              className="px-4 py-2 bg-pink-600 text-white rounded-xl text-xs font-semibold hover:bg-pink-700 shadow-sm"
            >
              Xác nhận xóa
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-medium hover:bg-slate-200"
            >
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
