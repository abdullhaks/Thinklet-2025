// src/types.ts (Assuming a types file, but inline for components where needed)
// Define interfaces based on models and DTO

interface Category {
  _id: string;
  name: string;
}

interface Author {
  _id: string;
  firstName: string;
  lastName: string;
  profile?: string;
}

interface UserInteraction {
  liked: boolean;
  disliked: boolean;
  blocked: boolean;
}

export interface ArticleResponseDTO {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
  tags?: string[];
  category: Category;
  author: Author;
  likesCount: number;
  dislikesCount: number;
  userInteraction: UserInteraction;
  createdAt: Date;
  updatedAt: Date;
}

export interface IArticleData {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
  tags?: string[];
  category: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}
