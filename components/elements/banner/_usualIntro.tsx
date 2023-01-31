import Image from "next/image";

import googleLogin from "../../../public/images/logins/google.svg";
import appleLogin from "../../../public/images/logins/apple.svg";
import emailLogin from "../../../public/images/logins/email.svg";

const UsualIntro = () => {
  return (
    <>
      <div className="title">
        <h2>Вхід до Аккаунту</h2>
      </div>
      <div className="user-login-type">
        <div className="item">
          <Image src={googleLogin} alt="login-type" />
          <div className="title">
            <h5>Продовжити з Google</h5>
          </div>
        </div>
        <div className="item">
          <Image src={appleLogin} alt="login-type" />
          <div className="title">
            <h5>Продовжити з Apple</h5>
          </div>
        </div>
        <div className="item">
          <Image src={emailLogin} alt="login-type" />
          <div className="title">
            <h5>Продовжити з Email</h5>
          </div>
        </div>
      </div>
      <div className="user-login-other">
        <div className="title">
          <h3>Немаєте аккаунту? </h3>
        </div>
        <div className="register">
          <p>Зареєструватися</p>
        </div>
      </div>
    </>
  );
};

export default UsualIntro;
