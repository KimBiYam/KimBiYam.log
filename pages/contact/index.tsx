import Head from "next/head";
import ContactItem from "../../components/contact/ContactItem";
import EmailIcon from "../../assets/svgs/email.svg";
import VelogIcon from "../../assets/svgs/velog.svg";
import NaverIcon from "../../assets/svgs/naver.svg";
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
          icon={<NaverIcon className="fill-current" />}
          label="Naver"
          href="https://blog.naver.com/hot9998"
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
