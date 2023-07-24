import { FC, useEffect, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

import { useSession } from "next-auth/react";

import { AuthorInfo } from "../../../components";

const Author: FC<NextPage> = () => {
  const [showMore, setShowMore] = useState<boolean>(false);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [period, setPeriod] = useState<string>("popular"); // Initialize period as an empty string

  const router = useRouter();
  const { data: session } = useSession();

  // Used as sting because knew that it will only be variable not array
  const id = router.query.id as string;

  return (
    <>
      <AuthorInfo
        type="author"
        id={id}
        session={session}
        period={period}
        setPeriod={setPeriod}
        showMore={showMore}
        setShowMore={setShowMore}
        showComments={showComments}
        setShowComments={setShowComments}
        auhtorEdit={true}
      />
    </>
  );
};

export default Author;
