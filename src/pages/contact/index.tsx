import { GetStaticProps } from 'next';

import PageHead from '../../components/base/PageHead';
import PageRoutingAnimation from '../../components/base/PageRoutingAnimation';
import MarkdownView from '../../components/posts/MarkdownView';
import { CONTACT_DIRECTORY, CONTACT_FILE_NAME } from '../../constants';
import { getMarkdownData } from '../../lib/posts/markdown';

interface ContactProps {
  contentHtml: string;
}

const Contact = ({ contentHtml }: ContactProps) => (
  <>
    <PageHead title="Contact" description="Contact" url="/contact" />
    <PageRoutingAnimation className="py-12">
      <MarkdownView contentHtml={contentHtml} />
    </PageRoutingAnimation>
  </>
);

export const getStaticProps: GetStaticProps = async () => {
  const contactData = await getMarkdownData(
    CONTACT_DIRECTORY,
    CONTACT_FILE_NAME,
  );

  const { contentHtml } = contactData;

  return {
    props: {
      contentHtml,
    },
  };
};

export default Contact;
