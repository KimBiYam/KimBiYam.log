import { GetStaticProps } from 'next';
import PageHead from '../../components/base/PageHead';
import PageTransitionWrapper from '../../components/base/PageTransitionWrapper';
import MarkdownView from '../../components/posts/MarkdownView';
import { CONTACT_DIRECTORY, CONTACT_FILE_NAME } from '../../constants';
import { getMarkdownData } from '../../lib/posts/markdown';

interface ContactProps {
  contentHtml: string;
}

const Contact = ({ contentHtml }: ContactProps) => (
  <>
    <PageHead
      title="KimBiYam.log | Contact"
      description="Contact"
      url="/contact"
    />
    <PageTransitionWrapper>
      <div className="py-12">
        <MarkdownView contentHtml={contentHtml} />
      </div>
    </PageTransitionWrapper>
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
