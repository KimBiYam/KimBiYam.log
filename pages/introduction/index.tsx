import PageHead from "../../components/base/PageHead";
import MarkdownView from "../../components/posts/MarkdownView";
import { INTRODUCTION_DIRECTORY } from "../../constants";
import { getMarkdownData } from "../../lib/posts/markdown";

type IntroductionProps = {
  contentHtml: string;
};

const Introduction = ({ contentHtml }: IntroductionProps) => {
  return (
    <>
      <PageHead
        title="KimBiYam.log | Introduction"
        description="KimBiYam Introduction"
      />
      <div className="pb-24">
        <MarkdownView contentHtml={contentHtml} />
      </div>
    </>
  );
};

export const getStaticProps = async () => {
  const INTRODUCTION_FILE_NAME = "introduction";

  const introductionData = await getMarkdownData(
    INTRODUCTION_DIRECTORY,
    INTRODUCTION_FILE_NAME
  );

  const { contentHtml } = introductionData;

  return {
    props: {
      contentHtml,
    },
  };
};

export default Introduction;
