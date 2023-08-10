import { FC } from "react";
import Image from "next/image";
import Link from "next/link";

import ReturnMeContent from "../../../util/functions/returnMeContent";

interface reelsItemProps {
  author: {
    image: string | null;
    id: string;
    username: string | null;
  };
  post: {
    id: string;
    title: string;
  };
  text: string;
}

const ReelsItem: FC<reelsItemProps> = ({
  author,
  post,
  text,
}: reelsItemProps) => {
  return (
    <Link href={`/post/${post.id}`} className="item container flex-left">
      <div className="author-thread container flex-left flex-row">
        <div className="icon">
          {author?.image && (
            <Image
              src={author.image}
              height={1080}
              width={1920}
              alt="author-background"
            />
          )}
        </div>
        <div className="info container flex-left">
          <div className="nickname">
            <p>{author.username}</p>
          </div>
          <div className="thematic">
            <p>{post.title}</p>
          </div>
        </div>
      </div>
      <ReturnMeContent className="text-block" content={text} />
    </Link>
  );
};

export default ReelsItem;
