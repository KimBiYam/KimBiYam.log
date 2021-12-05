import Head from "next/head";
import ContactItem from "../../components/contact/ContactItem";
import EmailIcon from "../../assets/svgs/email.svg";
import VelogIcon from "../../assets/svgs/velog.svg";
import NotionIcon from "../../assets/svgs/notion.svg";
import GithubIcon from "../../assets/svgs/github.svg";

const contact = () => {
  return (
    <>
      <Head>
        <title>Contact</title>
      </Head>
      <div className="grid grid-cols-2 gap-6">
        <ContactItem icon={<EmailIcon />} label="hot9998@naver.com" />
        <ContactItem
          icon={<VelogIcon className="fill-current" />}
          label="Velog"
          href="https://velog.io/@kimbiyam"
        />
        <ContactItem
          icon={<NotionIcon className="fill-current" />}
          label="Notion"
          href="https://kimbiyam.notion.site/kimbiyam/Chang-Hyun-Kim-3831364898844426ab7643741dffe461"
        />
        <ContactItem
          icon={<GithubIcon className="fill-current" />}
          label="Github"
          href="https://github.com/KimBiYam"
        />
      </div>
    </>
  );
};

export default contact;
