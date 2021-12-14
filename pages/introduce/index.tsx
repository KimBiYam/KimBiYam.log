import PageHead from "../../components/base/PageHead";
import MarkdownView from "../../components/posts/MarkdownView";
import { INTRODUCE_DIRECTORY, INTRODUCE_FILE_NAME } from "../../constants";
import { getMarkdownData } from "../../lib/posts/markdown";
import { motion } from "framer-motion";
import { slideUpMotion } from "../../lib/styles/motions";

type IntroduceProps = {
  contentHtml: string;
};

const Introduce = ({ contentHtml }: IntroduceProps) => {
  return (
    <>
      <PageHead
        title="KimBiYam.log | Introduce"
        description="KimBiYam Introduce"
      />
      <motion.div className="pb-24" {...slideUpMotion}>
        <MarkdownView contentHtml={contentHtml} />
      </motion.div>
    </>
  );
};

export const getStaticProps = async () => {
  const introduceData = await getMarkdownData(
    INTRODUCE_DIRECTORY,
    INTRODUCE_FILE_NAME
  );

  const { contentHtml } = introduceData;

  return {
    props: {
      contentHtml,
    },
  };
};

export default Introduce;
