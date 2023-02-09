import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsDown,
  faHeart,
  faImages,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import Notification from "../_notification";

const Comments = () => {
  return (
    <div id="comments" className="post-wrapper container">
      <div className="title">
        <h3>Коментарів</h3>
        <div className="count">
          <p>62</p>
        </div>
      </div>
      <form className="comment">
        <textarea placeholder="Написати свій коментар ..." />
        <button className="fafont-icon image post-image">
          <FontAwesomeIcon
            icon={faImages}
            style={{ width: "100%", height: "100%", color: "inherit" }}
          />
        </button>
      </form>
      <div className="container comments-flow">
        <div className="item">
          <div className="main-content">
            <div className="user-author">
              <div className="author">
                <div className="user-icon"></div>
                <div className="author-names">
                  <div className="name">
                    <p>Andrey Noice</p>
                  </div>
                  <div className="time">
                    <p>9 січня 12:31</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="content">
              <p>
                Не знаю, це все начебто обіцялося як ексклюзив для тих, хто
                підтримав краудфандингову кампанію. Спробуйте написати
                організаторам із посилання на пост, може у них буде щось із
                бонусів продаватися в роздріб.
              </p>
            </div>
            <div className="interactions">
              <div className="lt-side">
                <div className="answer">
                  <p>Відповісти</p>
                  <div className="fafont-icon arrow-down">
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      style={{
                        width: "100%",
                        height: "100%",
                        color: "inherit",
                      }}
                    />
                  </div>
                </div>
                <div className="complain">
                  <p>Поскаржитися</p>
                </div>
                <div className="answer-count">
                  <p>3 Відповідь</p>
                </div>
              </div>
              <div className="rt-side">
                <div className="heart">
                  <div className="fafont-icon heart">
                    <FontAwesomeIcon
                      icon={faHeart}
                      style={{
                        width: "100%",
                        height: "100%",
                        color: "inherit",
                      }}
                    />
                  </div>
                  <div className="counter">
                    <p>3</p>
                  </div>
                </div>
                <div className="fafont-icon dislike">
                  <FontAwesomeIcon
                    icon={faThumbsDown}
                    style={{
                      width: "100%",
                      height: "100%",
                      color: "inherit",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="comments-to-item">
            <div className="item">
              <div className="main-content">
                <div className="user-author">
                  <div className="author">
                    <div className="user-icon"></div>
                    <div className="author-names">
                      <div className="name">
                        <p>Andrey Noice</p>
                      </div>
                      <div className="time">
                        <p>9 січня 12:31</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="content">
                  <p>
                    Не знаю, це все начебто обіцялося як ексклюзив для тих, хто
                    підтримав краудфандингову кампанію. Спробуйте написати
                    організаторам із посилання на пост, може у них буде щось із
                    бонусів продаватися в роздріб.
                  </p>
                </div>
                <div className="interactions">
                  <div className="lt-side">
                    <div className="answer">
                      <p>Відповісти</p>
                      <div className="fafont-icon arrow-down">
                        <FontAwesomeIcon
                          icon={faChevronDown}
                          style={{
                            width: "100%",
                            height: "100%",
                            color: "inherit",
                          }}
                        />
                      </div>
                    </div>
                    <div className="complain">
                      <p>Поскаржитися</p>
                      <Notification activeElem={true} />
                    </div>
                    <div className="answer-count">
                      <p>3 Відповідь</p>
                    </div>
                  </div>
                  <div className="rt-side">
                    <div className="heart">
                      <div className="fafont-icon heart">
                        <FontAwesomeIcon
                          icon={faHeart}
                          style={{
                            width: "100%",
                            height: "100%",
                            color: "inherit",
                          }}
                        />
                      </div>
                      <div className="counter">
                        <p>3</p>
                      </div>
                    </div>
                    <div className="fafont-icon dislike">
                      <FontAwesomeIcon
                        icon={faThumbsDown}
                        style={{
                          width: "100%",
                          height: "100%",
                          color: "inherit",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <form className="comment">
                  <textarea placeholder="Написати свій коментар ..." />
                  <button className="fafont-icon image post-image">
                    <FontAwesomeIcon
                      icon={faImages}
                      style={{
                        width: "100%",
                        height: "100%",
                        color: "inherit",
                      }}
                    />
                  </button>
                </form>
              </div>
              <div className="comments-to-item"></div>
            </div>
            <div className="item">
              <div className="main-content">
                <div className="user-author">
                  <div className="author">
                    <div className="user-icon"></div>
                    <div className="author-names">
                      <div className="name">
                        <p>Andrey Noice</p>
                      </div>
                      <div className="time">
                        <p>9 січня 12:31</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="content">
                  <p>
                    Не знаю, це все начебто обіцялося як ексклюзив для тих, хто
                    підтримав краудфандингову кампанію. Спробуйте написати
                    організаторам із посилання на пост, може у них буде щось із
                    бонусів продаватися в роздріб.
                  </p>
                </div>
                <div className="interactions">
                  <div className="lt-side">
                    <div className="answer">
                      <p>Відповісти</p>
                      <div className="fafont-icon arrow-down">
                        <FontAwesomeIcon
                          icon={faChevronDown}
                          style={{
                            width: "100%",
                            height: "100%",
                            color: "inherit",
                          }}
                        />
                      </div>
                    </div>
                    <div className="complain">
                      <p>Поскаржитися</p>
                    </div>
                    <div className="answer-count">
                      <p>3 Відповідь</p>
                    </div>
                  </div>
                  <div className="rt-side">
                    <div className="heart">
                      <div className="fafont-icon heart">
                        <FontAwesomeIcon
                          icon={faHeart}
                          style={{
                            width: "100%",
                            height: "100%",
                            color: "inherit",
                          }}
                        />
                      </div>
                      <div className="counter">
                        <p>3</p>
                      </div>
                    </div>
                    <div className="fafont-icon dislike">
                      <FontAwesomeIcon
                        icon={faThumbsDown}
                        style={{
                          width: "100%",
                          height: "100%",
                          color: "inherit",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="comments-to-item"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comments;
