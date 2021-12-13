import { PostPreview } from "../../types/post.types";
import NextLink from "next/link";
import { memo } from "react";
import { motion } from "framer-motion";
import { slideUpMotion } from "../../lib/styles/motions";

export type PostListItemProps = {
  postPreview: PostPreview;
};

const PostListItem = ({ postPreview }: PostListItemProps) => {
  const { id, title, date, content } = postPreview;

  return (
    <NextLink href={`/posts/${id}`}>
      <motion.div
        className="py-4 cursor-pointer hover:text-shadow dark:hover:text-shadow-dark transition-text-shadow"
        initial={{ opacity: 0 }}
        whileInView={{ ...slideUpMotion.animate }}
        viewport={{ once: true }}
      >
        <h3 className="w-full text-2xl font-bold overflow-hidden whitespace-nowrap truncate">
          {title}
        </h3>
        <p className="mt-2 mb-4 text-sm">{date}</p>
        <p className="dark:text-gray-300 text-zinc-700 text-sm md:text-base overflow-hidden">
          {content}
        </p>
      </motion.div>
    </NextLink>
  );
};

export default memo(PostListItem);
