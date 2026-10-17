import React, { useState, useEffect } from 'react';
import { StudyLink, SubjectType } from '../types';
import { X, Link as LinkIcon, AlertCircle } from 'lucide-react';

interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (linkData: { title: string; url: string; subject: SubjectType; description: string; tags: string[]; author?: string }) => void;
  editingLink?: StudyLink | null;
}

export const LinkModal: React.FC<LinkModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingLink
}) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [subject, setSubject] = useState<SubjectType>('toan');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [author, setAuthor] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingLink) {
      setTitle(editingLink.title);
      setUrl(editingLink.url);
      setSubject(editingLink.subject);
      setDescription(editingLink.description);
      setTagsInput(editingLink.tags ? editingLink.tags.join(', ') : '');
      setAuthor(editingLink.author || '');
    } else {
      setTitle('');
      setUrl('https://');
      setSubject('toan');
      setDescription('');
      setTagsInput('Toán, Tiểu học');
      setAuthor('Giáo viên');
    }
    setError('');
  }, [editingLink, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Vui lòng nhập tên liên kết.');
      return;
    }
    if (!url.trim() || (!url.startsWith('http://') && !url.startsWith('https://'))) {
      setError('Địa chỉ URL không hợp lệ. URL phải bắt đầu bằng http:// hoặc https://');
      return;
    }
    if (!description.trim()) {
      setError('Vui lòng nhập mô tả ngắn cho liên kết.');
      return;
    }

    const tags = tagsInput
      ? tagsInput.split(',').map(t => t.trim()).filter(Boolean)
      : [];

    onSave({
      title: title.trim(),
      url: url.trim(),
      subject,
      description: description.trim(),
      tags,
      author: author.trim() || 'Giáo viên'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-pink-100">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-pink-500 via-rose-500 to-sky-500 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🌸</span>
            <h3 className="text-lg font-bold">
              {editingLink ? 'Chỉnh sửa liên kết học tập' : 'Thêm liên kết học tập mới'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-pink-50 border border-pink-200 text-pink-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tên liên kết / Tên phần mềm <span className="text-pink-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ví dụ: VioEdu - Đấu trường Toán học"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Địa chỉ URL (phải bắt đầu bằng http:// hoặc https://) <span className="text-pink-500">*</span>
            </label>
            <div className="relative flex items-center">
              <LinkIcon className="absolute left-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Môn học <span className="text-pink-500">*</span>
              </label>
              <select
                value={subject}
                onChange={e => setSubject(e.target.value as SubjectType)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"
              >
                <option value="toan">Toán học</option>
                <option value="tieng-viet">Tiếng Việt</option>
                <option value="tin-hoc">Tin học</option>
                <option value="tieng-anh">Tiếng Anh</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Người đóng góp / Giáo viên
              </label>
              <input
                type="text"
                value={author}
                onChange={e => setAuthor(e.target.value)}
                placeholder="Ví dụ: Cô Thảo (GV Toán)"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mô tả ngắn gọn <span className="text-pink-500">*</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Giới thiệu nội dung, cách sử dụng tài nguyên này cho học sinh..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Từ khóa (phân cách bằng dấu phẩy)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              placeholder="Ví dụ: Luyện tập, Trò chơi, Đố vui"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-pink-500 via-rose-500 to-sky-500 hover:from-pink-600 hover:to-sky-600 shadow-md shadow-pink-200 transition-all"
            >
              {editingLink ? 'Lưu thay đổi' : 'Thêm vào vườn'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
