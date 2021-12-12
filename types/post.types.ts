export type PostData = {
  id: string;
  date: string;
  contentHtml: string;
  description: string;
  title: string;
};

export type PostPreview = {
  id: string;
  date: string;
  content: string;
  title: string;
  tag: string;
};

export type PostPath = {
  id: string;
  subdirectory: string;
};
