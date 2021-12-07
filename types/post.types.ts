export type PostData = {
  id: string;
  date: string;
  content: string;
};

export type PostPreview = PostData & {
  title: string;
};
