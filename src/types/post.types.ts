import { ParsedUrlQuery } from 'querystring';

export interface Post {
  id: string;
  date: string;
  title: string;
  tag: string;
}

export interface PostDetail extends Post {
  markdown: string;
  description: string;
  ogImagePath?: string;
}

export interface PostPreview extends Post {
  content: string;
}

export interface PostPath extends ParsedUrlQuery {
  id: string;
  subdirectory: string;
}
