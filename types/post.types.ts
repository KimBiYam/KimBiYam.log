export type PostBase = {
  id: string;
  date: string;
  title: string;
  tag: string;
};

export type PostData = PostBase & {
  contentHtml: string;
  description: string;
};

export type PostPreview = PostBase & {
  content: string;
};

export type PostPath = {
  id: string;
  subdirectory: string;
};
