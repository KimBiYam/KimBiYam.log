export type MarkdownViewProps = {
  contentHtml: string;
};

const MarkdownView = ({ contentHtml }: MarkdownViewProps) => {
  return (
    <div className="flex justify-center">
      <div
        className="w-full prose xs:prose-sm sm:prose-sm dark:prose-dark"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
};

export default MarkdownView;
