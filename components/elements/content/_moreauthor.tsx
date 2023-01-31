import Button from "../_button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const MoreAuthor = () => {
  return (
    <div id="author-more" className="container">
      <div className="info-item post-wrapper">
        <div className="title">
          <h3>Стежувачі</h3>
          <p className="count">72</p>
        </div>
        <div className="list container flex-row flex-stretch flex-wrap flex-space full-width">
          <div className="item">
            <div className="icon"></div>
            <div className="name">
              <p>Andrey Noice</p>
            </div>
            <Button small filled>
              <div className="fafont-icon big">
                <FontAwesomeIcon
                  icon={faPlus}
                  style={{ width: "100%", height: "100%", color: "inherit" }}
                />
              </div>
            </Button>
          </div>
          <div className="item">
            <div className="icon"></div>
            <div className="name">
              <p>Andrey Noice</p>
            </div>
            <Button small filled>
              <div className="fafont-icon big">
                <FontAwesomeIcon
                  icon={faPlus}
                  style={{ width: "100%", height: "100%", color: "inherit" }}
                />
              </div>
            </Button>
          </div>
          <div className="item">
            <div className="icon"></div>
            <div className="name">
              <p>Andrey Noice</p>
            </div>
            <Button small filled>
              <div className="fafont-icon big">
                <FontAwesomeIcon
                  icon={faPlus}
                  style={{ width: "100%", height: "100%", color: "inherit" }}
                />
              </div>
            </Button>
          </div>
          <div className="item">
            <div className="icon"></div>
            <div className="name">
              <p>Andrey Noice</p>
            </div>
            <Button small filled>
              <div className="fafont-icon big">
                <FontAwesomeIcon
                  icon={faPlus}
                  style={{ width: "100%", height: "100%", color: "inherit" }}
                />
              </div>
            </Button>
          </div>
        </div>
        <div className="actions">
          <p>Дізнатися більше</p>
          <p>Відкрити усі</p>
        </div>
      </div>
      <div className="info-item post-wrapper">
        <div className="title">
          <h3>Стежувачі</h3>
          <p className="count">72</p>
        </div>
        <div className="list container flex-row flex-stretch flex-wrap flex-space full-width">
          <div className="item">
            <div className="icon"></div>
            <div className="name">
              <p>Andrey Noice</p>
            </div>
            <Button small filled>
              <div className="fafont-icon big">
                <FontAwesomeIcon
                  icon={faPlus}
                  style={{ width: "100%", height: "100%", color: "inherit" }}
                />
              </div>
            </Button>
          </div>
          <div className="item">
            <div className="icon"></div>
            <div className="name">
              <p>Andrey Noice</p>
            </div>
            <Button small filled>
              <div className="fafont-icon big">
                <FontAwesomeIcon
                  icon={faPlus}
                  style={{ width: "100%", height: "100%", color: "inherit" }}
                />
              </div>
            </Button>
          </div>
          <div className="item">
            <div className="icon"></div>
            <div className="name">
              <p>Andrey Noice</p>
            </div>
            <Button small filled>
              <div className="fafont-icon big">
                <FontAwesomeIcon
                  icon={faPlus}
                  style={{ width: "100%", height: "100%", color: "inherit" }}
                />
              </div>
            </Button>
          </div>
          <div className="item">
            <div className="icon"></div>
            <div className="name">
              <p>Andrey Noice</p>
            </div>
            <Button small filled>
              <div className="fafont-icon big">
                <FontAwesomeIcon
                  icon={faPlus}
                  style={{ width: "100%", height: "100%", color: "inherit" }}
                />
              </div>
            </Button>
          </div>
        </div>
        <div className="actions">
          <p>Дізнатися більше</p>
          <p>Відкрити усі</p>
        </div>
      </div>
    </div>
  );
};

export default MoreAuthor;
