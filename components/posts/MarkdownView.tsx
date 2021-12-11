export type MarkdownViewProps = {
  contentHtml: string;
};

const MarkdownView = ({ contentHtml }: MarkdownViewProps) => {
  return (
    <div className="flex justify-center">
      <div
        className="w-full prose dark:prose-dark sm:prose-sm md:prose"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
};

export default MarkdownView;
