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

  // Set up a mutation for creating a username
  const [createUsername, { data, loading, error }] = useMutation<
    CreateUsernameData,
    CreateUsernameVariables
  >(userOperations.Mutations.createUsername);

  // Function to handle form submission
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // If username is not provided, exit the function
    if (!username) return;

    try {
      // Submit the provided username to the backend server
      await createUsername({ variables: { username } });
    } catch (error) {
      console.error("Submitting username caused an error", error);
    }
  };

  // useEffect to handle response data and errors
  useEffect(() => {
    if (error) {
      console.error("An error occurred while creating your username", error);
      // Exit the useEffect
      return;
    }

    if (data?.createUsername.success) {
      // If the username creation was successful, setBannerActive to false.
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
