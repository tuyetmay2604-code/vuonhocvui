export type SubjectType = 'toan' | 'tieng-viet' | 'tin-hoc' | 'tieng-anh';

export interface StudyLink {
  id: string;
  title: string;
  url: string;
  subject: SubjectType;
  description: string;
  tags: string[];
  isFavorite: boolean;
  updatedAt: string; // ISO string or formatted date
  author?: string;
}

export interface FilterState {
  subject: SubjectType | 'all';
  searchQuery: string;
  sortBy: 'newest' | 'oldest' | 'title-asc' | 'title-desc';
  onlyFavorites: boolean;
  selectedTag: string | null;
}
