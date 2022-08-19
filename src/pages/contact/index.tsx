import { m } from 'framer-motion';
import { GetStaticProps } from 'next';
import PageHead from '../../components/base/PageHead';
import MarkdownView from '../../components/posts/MarkdownView';
import { CONTACT_DIRECTORY, CONTACT_FILE_NAME } from '../../constants';
import { getMarkdownData } from '../../lib/posts/markdown';
import { routingMotion } from '../../lib/styles/motions';

interface ContactProps {
  contentHtml: string;
}

const Contact = ({ contentHtml }: ContactProps) => (
  <>
    <PageHead title="Contact" description="Contact" url="/contact" />
    <m.div className="py-12" {...routingMotion}>
      <MarkdownView contentHtml={contentHtml} />
    </m.div>
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
