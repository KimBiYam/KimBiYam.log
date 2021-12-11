import Head from "next/head";
import MarkdownView from "../../components/posts/MarkdownView";
import { INTRODUCTION_DIRECTORY } from "../../constants";
import { getMarkdownData } from "../../lib/posts/markdown";

type IntroductionProps = {
  contentHtml: string;
};

const Introduction = ({ contentHtml }: IntroductionProps) => {
  return (
    <>
      <Head>
        <title>KimBiYam.log | Introduction</title>
      </Head>
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
