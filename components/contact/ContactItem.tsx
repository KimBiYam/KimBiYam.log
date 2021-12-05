import NextLink from "next/link";

export type ContactItemProps = {
  icon: React.ReactNode;
  label: string;
  href?: string;
};

const ContactItem = ({ icon, label, href }: ContactItemProps) => {
  return (
    <div className="relative">
      <div className="flex items-center justify-between p-4 border-2 rounded-md">
        <div className="w-6 h-6">{icon}</div>
        <p>{label}</p>
      </div>
      {href && (
        <NextLink href={href}>
          <a className="absolute opacity-0 top-0 left-0 w-full h-full" />
        </NextLink>
      )}
    </div>
  );
};

export default ContactItem;
