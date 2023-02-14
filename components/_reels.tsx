import Link from "next/link";

const Reels = () => {
  interface types {
    nickname: string;
    thematic: string;
    content: string;
  }

  const reelsArray = [
    {
      nickname: "SonyToxicBoyDea…",
      thematic: "Покупка Resident evi…",
      content:
        "Це ніяк не змінює того факту, що про це не згадано навіть. Терпіти не можу подібне маркеті ...",
    },
    {
      nickname: "SonyToxicBoyDea…",
      thematic: "Покупка Resident evi…",
      content:
        "Це ніяк не змінює того факту, що про це не згадано навіть. Терпіти не можу подібне маркеті ...",
    },
    {
      nickname: "SonyToxicBoyDea…",
      thematic: "Покупка Resident evi…",
      content:
        "Це ніяк не змінює того факту, що про це не згадано навіть. Терпіти не можу подібне маркеті ...",
    },
    {
      nickname: "SonyToxicBoyDea…",
      thematic: "Покупка Resident evi…",
      content:
        "Це ніяк не змінює того факту, що про це не згадано навіть. Терпіти не можу подібне маркеті ...",
    },
  ];

  const ReturnReel = ({ nickname, thematic, content }: types) => {
    return (
      <Link href="post/1" className="item container flex-left">
        <div className="author-thread container flex-left flex-row">
          <div className="icon"></div>
          <div className="info container flex-left">
            <div className="nickname">
              <p>{nickname}</p>
            </div>
            <div className="thematic">
              <p>{thematic}</p>
            </div>
          </div>
        </div>
        <div className="text-block">
          <p>{content}</p>
        </div>
      </Link>
    );
  };

  return (
    <div id="reels" className="container flex-left to-right full-height">
      <div className="title">
        <p>Наразі обговорюють</p>
      </div>
      <div className="container flex-left">
        {reelsArray.map((item, i) => {
          const { nickname, thematic, content } = item;
          return (
            <ReturnReel
              key={`${item}__${i}`}
              nickname={nickname}
              thematic={thematic}
              content={content}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Reels;
