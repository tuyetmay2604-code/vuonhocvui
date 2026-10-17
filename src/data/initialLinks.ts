import { StudyLink } from '../types';

export const INITIAL_LINKS: StudyLink[] = [
  {
    id: 'link-1',
    title: 'VioEdu - Đấu trường Toán học Tiểu học',
    url: 'https://vioedu.vn',
    subject: 'toan',
    description: 'Hệ thống học tập thông minh ứng dụng AI, giúp học sinh tiểu học luyện tập toán theo chương trình chuẩn Bộ GD&ĐT.',
    tags: ['Toán', 'Luyện tập', 'AI', 'Thi đấu'],
    isFavorite: true,
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    author: 'Cô Thảo (GV Toán)'
  },
  {
    id: 'link-2',
    title: 'Trạng Nguyên Tiếng Việt',
    url: 'https://trangnguyen.edu.vn',
    subject: 'tieng-viet',
    description: 'Sân chơi thi đấu trực tuyến các kiến thức tiếng Việt, ca dao, tục ngữ, chính tả và luyện từ và câu cho học sinh.',
    tags: ['Tiếng Việt', 'Chính tả', 'Ca dao', 'Sân chơi'],
    isFavorite: true,
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    author: 'Thầy Minh (GV Văn)'
  },
  {
    id: 'link-3',
    title: 'ScratchJr - Lập trình sáng tạo cho trẻ',
    url: 'https://www.scratchjr.org',
    subject: 'tin-hoc',
    description: 'Ngôn ngữ lập trình trực quan giúp học sinh tiểu học tạo ra những câu chuyện và trò chơi tương tác của riêng mình.',
    tags: ['Lập trình', 'Sáng tạo', 'Tin học', 'Trò chơi'],
    isFavorite: true,
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    author: 'Cô Lan (GV Tin học)'
  },
  {
    id: 'link-4',
    title: 'Duolingo for Schools - Học Tiếng Anh miễn phí',
    url: 'https://schools.duolingo.com',
    subject: 'tieng-anh',
    description: 'Ứng dụng học ngoại ngữ sinh động dạng trò chơi, giúp rèn luyện từ vựng, phát âm và ngữ pháp tiếng Anh hiệu quả.',
    tags: ['Tiếng Anh', 'Từ vựng', 'Phát âm', 'Trò chơi'],
    isFavorite: true,
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    author: 'Thầy John (GV Tiếng Anh)'
  },
  {
    id: 'link-5',
    title: 'OLM.vn - Học liệu trực tuyến các môn',
    url: 'https://olm.vn',
    subject: 'toan',
    description: 'Nền tảng học tập trực tuyến kết hợp bài giảng video, bài tập tương tác Toán, Tiếng Việt và Khoa học lớp 1 đến lớp 5.',
    tags: ['Toán', 'Video bài giảng', 'Bài tập'],
    isFavorite: false,
    updatedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    author: 'Ban Giám Hiệu'
  },
  {
    id: 'link-6',
    title: 'Quizizz - Trò chơi trắc nghiệm lớp học',
    url: 'https://quizizz.com',
    subject: 'tin-hoc',
    description: 'Công cụ tạo bài kiểm tra tương tác dưới dạng trò chơi thú vị, giáo viên có thể dùng để ôn tập từ vựng hoặc kiến thức toán.',
    tags: ['Trắc nghiệm', 'Ôn tập', 'Trò chơi'],
    isFavorite: false,
    updatedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    author: 'Cô Lan (GV Tin học)'
  },
  {
    id: 'link-7',
    title: 'Monkey Junior - Đọc sách và học từ vựng',
    url: 'https://www.monkeyuni.net',
    subject: 'tieng-viet',
    description: 'Chương trình phát triển ngôn ngữ sớm và đọc hiểu tiếng Việt cho trẻ tiểu học với kho truyện tranh tương tác phong phú.',
    tags: ['Đọc hiểu', 'Truyện tranh', 'Tiếng Việt'],
    isFavorite: false,
    updatedAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    author: 'Thầy Minh (GV Văn)'
  },
  {
    id: 'link-8',
    title: 'British Council Kids - English Games',
    url: 'https://learnenglishkids.britishcouncil.org',
    subject: 'tieng-anh',
    description: 'Trang web học tiếng Anh uy tín của Anh Quốc với vô số trò chơi, bài hát, câu chuyện và hoạt động thủ công cho học sinh.',
    tags: ['Nghe nói', 'Bài hát', 'Trò chơi'],
    isFavorite: false,
    updatedAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    author: 'Thầy John (GV Tiếng Anh)'
  }
];
