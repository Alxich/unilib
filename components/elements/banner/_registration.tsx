import Button from "../_button";

const Registration = () => {
  return (
    <>
      <div className="title">
        <h2>Регістрація акаунту</h2>
      </div>
      <form className="login-form">
        <input type="email" placeholder="Ваша почта"></input>
        <input
          type="name"
          placeholder="Ваш нікнейм або імя та призвісько"
        ></input>
        <input type="password" placeholder="Ведіть свій пароль"></input>
        <Button filled form fullWidth>
          Увійти
        </Button>
      </form>
      <div className="user-login-other">
        <div className="title">
          <h3>Маєте аккаунт? </h3>
        </div>
        <div className="register">
          <p>Увійти до мого аккаунту</p>
        </div>
      </div>
    </>
  );
};

export default Registration;
