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

// Define the ReturnMeContent functional component
const ReturnMeContent: FC<ReturnMeContentProps> = ({
  content,
  className,
  isLink,
}: ReturnMeContentProps) => {
  // Define the list of components to be used for rendering content
  let componentsToUse: any[] = [StarterKit, TiptapImage];

  // Generate HTML from the parsed content using the provided components
  const html = generateHTML(JSON.parse(content), componentsToUse);

  // Conditionally render as a link or a div based on the presence of isLink prop
  return isLink ? (
    <Link
      href={isLink.url} 
      className={className} 
      dangerouslySetInnerHTML={{ __html: html }} // Render HTML content
    />
  ) : (
    <div
      className={className} 
      dangerouslySetInnerHTML={{ __html: html }} // Render HTML content
    />
  );
};

export default ReturnMeContent;
