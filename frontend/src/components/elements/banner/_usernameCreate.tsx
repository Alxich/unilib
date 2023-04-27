import { FC, FormEvent, useEffect, useState } from "react";

import { useMutation } from "@apollo/client";
import {
  CreateUsernameData,
  CreateUsernameVariables,
} from "../../../util/types";
import userOperations from "../../../graphql/operations/users";

import Button from "../_button";

interface IUsernameCreateProps {
  setBannerActive: any;
}

const UsernameCreate: FC<IUsernameCreateProps> = ({
  setBannerActive,
}: IUsernameCreateProps) => {
  const [username, setUsername] = useState("");

  const [createUsername, { data, loading, error }] = useMutation<
    CreateUsernameData,
    CreateUsernameVariables
  >(userOperations.Mutations.createUsername);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!username) return;

    try {
      /**
       * Passing username from frontend to backend server and sumbiting it.
       */
      await createUsername({ variables: { username } });
    } catch (error) {
      console.log("Submiting username caused an error", error);
    }
  };

  useEffect(() => {
    if (error) {
      console.log("The error pop-ups from creating your username", error);

      return;
    }

    if (data?.createUsername.success) {
      setBannerActive(false);
    }
  }, [data, error, setBannerActive]);

  return (
    <>
      <div className="title">
        <h2>Веддіть свій нікнейм</h2>
      </div>
      <form className="login-form" onSubmit={(e) => onSubmit(e)}>
        <input
          type="name"
          placeholder="Ваш нікнейм або імя та призвісько"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        ></input>
        <Button
          filled
          form
          fullWidth
          loading={loading}
          disabled={username.length <= 0}
        >
          Увійти
        </Button>
      </form>
    </>
  );
};

export default UsernameCreate;
