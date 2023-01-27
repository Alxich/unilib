const Reels = () => {
  const ReturnReel = () => {
    return (
      <div className="item container flex-left">
        <div className="author-thread container flex-left flex-row">
          <div className="icon"></div>
          <div className="info container flex-left">
            <div className="nickname">
              <p>SonyToxicBoyDea…</p>
            </div>
            <div className="thematic">
              <p>Покупка Resident evi…</p>
            </div>
          </div>
        </div>
        <div className="text-block">
          <p>
            Це ніяк не змінює того факту, що про це не згадано навіть. Терпіти
            не можу подібне маркеті ...
          </p>
        </div>
      </div>
    );
  };
  return (
    <div id="reels" className="container flex-left to-right full-height">
      <div className="title">
        <p>Наразі обговорюють</p>
      </div>
      <div className="container flex-left">
        <ReturnReel />
        <ReturnReel />
        <ReturnReel />
        <ReturnReel />
        <ReturnReel />
      </div>
    </div>
  );
};

export default Reels;
