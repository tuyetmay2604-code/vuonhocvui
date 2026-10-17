import React from 'react';
import { SubjectType } from '../types';
import { Calculator, BookOpen, Laptop, Globe, Check } from 'lucide-react';

interface SubjectFlowersProps {
  activeSubject: SubjectType | 'all';
  onSelectSubject: (subject: SubjectType | 'all') => void;
  counts: Record<SubjectType | 'all', number>;
}

interface SubjectCardInfo {
  id: SubjectType | 'all';
  name: string;
  subtitle: string;
  flowerEmoji: string;
  icon: React.ComponentType<{ className?: string }>;
  bgGradient: string;
  borderColor: string;
  textColor: string;
  badgeBg: string;
}

export const SubjectFlowers: React.FC<SubjectFlowersProps> = ({
  activeSubject,
  onSelectSubject,
  counts
}) => {
  const subjects: SubjectCardInfo[] = [
    {
      id: 'all',
      name: 'Tất cả môn học',
      subtitle: 'Xem toàn bộ kho liên kết',
      flowerEmoji: '🌸',
      icon: Globe,
      bgGradient: 'from-pink-50 via-sky-50/50 to-blue-50/60',
      borderColor: 'border-blue-200 hover:border-pink-300',
      textColor: 'text-blue-900',
      badgeBg: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'toan',
      name: 'Toán học',
      subtitle: 'Tính toán, tư duy, hình học',
      flowerEmoji: '🌻',
      icon: Calculator,
      bgGradient: 'from-pink-50 to-rose-100/60',
      borderColor: 'border-pink-200 hover:border-pink-400',
      textColor: 'text-pink-900',
      badgeBg: 'bg-pink-100 text-pink-800'
    },
    {
      id: 'tieng-viet',
      name: 'Tiếng Việt',
      subtitle: 'Đọc hiểu, chính tả, từ & câu',
      flowerEmoji: '🌷',
      icon: BookOpen,
      bgGradient: 'from-sky-50 to-blue-100/60',
      borderColor: 'border-sky-200 hover:border-sky-400',
      textColor: 'text-blue-900',
      badgeBg: 'bg-sky-100 text-blue-800'
    },
    {
      id: 'tin-hoc',
      name: 'Tin học',
      subtitle: 'Lập trình, kỹ năng số, trò chơi',
      flowerEmoji: '🌼',
      icon: Laptop,
      bgGradient: 'from-blue-50 to-indigo-100/60',
      borderColor: 'border-blue-200 hover:border-indigo-400',
      textColor: 'text-indigo-900',
      badgeBg: 'bg-indigo-100 text-indigo-800'
    },
    {
      id: 'tieng-anh',
      name: 'Tiếng Anh',
      subtitle: 'Từ vựng, phát âm, ngoại ngữ',
      flowerEmoji: '🌺',
      icon: Globe,
      bgGradient: 'from-pink-100/60 to-sky-100/60',
      borderColor: 'border-pink-300 hover:border-blue-400',
      textColor: 'text-slate-900',
      badgeBg: 'bg-pink-100 text-pink-900'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <span>🌸🌻🌷🌼🌺</span>
          <span>Vườn học vui - Chinh phục điểm 10</span>
        </h3>
        {activeSubject !== 'all' && (
          <button
            onClick={() => onSelectSubject('all')}
            className="text-xs font-semibold text-pink-600 hover:text-pink-700 underline underline-offset-4 cursor-pointer"
          >
            Hiển thị tất cả môn học
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {subjects.map((sub) => {
          const Icon = sub.icon;
          const isActive = activeSubject === sub.id;
          const count = counts[sub.id] || 0;

          return (
            <button
              key={sub.id}
              onClick={() => onSelectSubject(sub.id)}
              className={`relative text-left p-5 rounded-3xl bg-gradient-to-br ${sub.bgGradient} border-2 ${
                isActive
                  ? 'border-pink-500 shadow-lg ring-4 ring-pink-300/40 scale-[1.03]'
                  : sub.borderColor
              } transition-all duration-300 hover:scale-[1.03] cursor-pointer group flex flex-col justify-between overflow-hidden shadow-xs`}
            >
              {/* Background decorative watermark */}
              <span className="absolute -bottom-4 -right-4 text-7xl opacity-10 group-hover:opacity-20 transition-opacity select-none pointer-events-none">
                {sub.flowerEmoji}
              </span>

              {isActive && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-sm z-10">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-13 h-13 rounded-2xl bg-white shadow-sm border border-black/5 flex items-center justify-center text-2xl group-hover:rotate-12 transition-transform duration-300">
                    {sub.flowerEmoji}
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-white/70 flex items-center justify-center">
                    <Icon className={`w-4 h-4 ${sub.textColor}`} />
                  </div>
                </div>

                <h4 className={`text-base font-bold ${sub.textColor} mb-1`}>
                  {sub.name}
                </h4>
                <p className="text-xs text-slate-600 font-medium line-clamp-2 mb-4 leading-relaxed">
                  {sub.subtitle}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-black/5 relative z-10">
                <span className="text-xs text-slate-600 font-medium">Số liên kết:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${sub.badgeBg}`}>
                  {count}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
