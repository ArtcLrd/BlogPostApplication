export interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  authorId: string;
  authorName: string;
  publishedAt: Date;
  updatedAt: Date;
  published: boolean;
}

export interface BlogDraft {
  id?: string;
  title: string;
  content: string;
  tags: string;
  lastSaved?: Date;
}