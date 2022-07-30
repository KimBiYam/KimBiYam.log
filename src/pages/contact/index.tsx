import { motion } from 'framer-motion';
import { GetStaticProps } from 'next';
import PageHead from '../../components/base/PageHead';
import MarkdownView from '../../components/posts/MarkdownView';
import { CONTACT_DIRECTORY, CONTACT_FILE_NAME } from '../../constants';
import { getMarkdownData } from '../../lib/posts/markdown';
import { opacityMotion } from '../../lib/styles/motions';

interface ContactProps {
  contentHtml: string;
}

const Contact = ({ contentHtml }: ContactProps) => (
  <>
    <PageHead title="Contact" description="Contact" url="/contact" />
    <motion.div className="py-12" {...opacityMotion}>
      <MarkdownView contentHtml={contentHtml} />
    </motion.div>
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
