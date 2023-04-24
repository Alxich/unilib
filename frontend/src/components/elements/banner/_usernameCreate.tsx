import { FC } from "react";
import Button from "../_button";

interface IUsernameCreateProps {}

const UsernameCreate: FC<IUsernameCreateProps> = ({}: IUsernameCreateProps) => {
  return (
    <>
      <div className="title">
        <h2>Веддіть свій нікнейм</h2>
      </div>
      <form className="login-form">
        <input
          type="name"
          placeholder="Ваш нікнейм або імя та призвісько"
        ></input>
        <Button filled form fullWidth>
          Увійти
        </Button>
      </form>
    </>
  );
};

export default UsernameCreate;
