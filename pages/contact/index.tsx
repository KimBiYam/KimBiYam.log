import { motion } from 'framer-motion';
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
    <PageHead
      title="KimBiYam.log | Contact"
      description="KimBiYam.log Contact"
    />
    <motion.div className="py-12" {...opacityMotion}>
      <MarkdownView contentHtml={contentHtml} />
    </motion.div>
  </>
);

export const getStaticProps = async () => {
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
