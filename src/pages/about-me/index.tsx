import { GetStaticProps } from 'next';

import PageHead from '../../components/base/PageHead';
import PageRoutingAnimation from '../../components/base/PageRoutingAnimation';
import MarkdownView from '../../components/posts/MarkdownView';
import { ABOUT_ME_DIRECTORY, ABOUT_ME_FILE_NAME } from '../../constants';
import { getMarkdownData } from '../../lib/posts/markdown';

interface AboutMePageProps {
  contentHtml: string;
}

const AboutMePage = ({ contentHtml }: AboutMePageProps) => (
  <>
    <PageHead title="About Me" url="/about-me" />
    <PageRoutingAnimation className="py-12">
      <MarkdownView contentHtml={contentHtml} />
    </PageRoutingAnimation>
  </>
);

export const getStaticProps: GetStaticProps = async () => {
  const aboutMeData = await getMarkdownData(
    ABOUT_ME_DIRECTORY,
    ABOUT_ME_FILE_NAME,
  );

  const { contentHtml } = aboutMeData;

  return {
    props: {
      contentHtml,
    },
  };
};

export default AboutMePage;
