import { FC, useState, useEffect } from "react";
import Link from "next/link";

import { useScrollToTop } from "../../util/functions/useScrollToTop";
import { returnMeDate } from "../../util/functions/returnMeDate";

interface AdminHeaderProps {}

const AdminHeader: FC<AdminHeaderProps> = ({}: AdminHeaderProps) => {
  // Set the data language format
  const [dateText, setDateText] = useState<string>(returnMeDate("en"));

  // Allow to scroll to the top of page by calling the func 'scrollToTop'
  const { scrollToTop } = useScrollToTop();

  // Handle function to show the text
  const returnMeSpecificData = () => {
    setDateText(returnMeDate("en"));
  };

  // interval function by 1s to update the data (create a real time timer)
  useEffect(() => {
    const timerId = setInterval(returnMeSpecificData, 1000);

    return function cleanup() {
      clearInterval(timerId);
    };
  }, []);

  return (
    <header className={"masthead admin"}>
      <div className="container full-height flex-space flex-row content-pad">
        <Link href={"/admin"} className="logo" onClick={(e) => scrollToTop(e)}>
          <p>UNILIB</p>
          <span>- admin panel -</span>
        </Link>
        <div
          className={"container full-height flex-row admin-information-head"}
        >
          <p>Hello Administrator</p>
          <p>Date: {dateText}</p>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
