import { FC } from "react";
import Link from "next/link";

import { generateHTML } from "@tiptap/react";
import TiptapImage from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";

/**
 * This code allow to use titap html generator
 * which help to show json code to normal html view
 * 
 * Using it to show created titap text to html
 */

interface ReturnMeContentProps {
  content: string;
  className: string;
  isLink?: {
    url: string;
  };
}

const ReturnMeContent: FC<ReturnMeContentProps> = ({
  content,
  className,
  isLink,
}: ReturnMeContentProps) => {
  let componentsToUse: any[] = [StarterKit, TiptapImage];

  const html = generateHTML(JSON.parse(content), componentsToUse);

  return isLink ? (
    <Link
      href={isLink.url}
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  ) : (
    <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
  );
};

export default ReturnMeContent;
