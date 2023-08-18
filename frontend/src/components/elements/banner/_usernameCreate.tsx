import { FC, FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { useMutation, useQuery } from "@apollo/client";
import {
  AdminFindData,
  CreateUsernameData,
  CreateUsernameVariables,
  FindItemResoponse,
} from "../../../util/types";
import userOperations from "../../../graphql/operations/users";

import Button from "../_button";

interface IUsernameCreateProps {
  setBannerActive: any;
}

const UsernameCreate: FC<IUsernameCreateProps> = ({
  setBannerActive,
}: IUsernameCreateProps) => {
  const [username, setUsername] = useState<string>("");
  const [wantBeAdmin, setWantBeAdmin] = useState<boolean>(false);
  const [queryFisrtAdmin, setQueryFisrtAdmin] = useState<FindItemResoponse>();

  const handleChange = () => {
    setWantBeAdmin(!wantBeAdmin);

    console.log(wantBeAdmin);
  };

  const { data: adminData, loading: adminDataLoading } =
    useQuery<AdminFindData>(userOperations.Queries.queryFisrtAdmin, {
      onError: ({ message }: any) => {
        toast.error(message);
      },
    });

  useEffect(() => {
    if (adminData && adminDataLoading !== true) {
      const { queryFisrtAdmin: queryData } = adminData;

      setQueryFisrtAdmin(queryData);
    }
  }, [adminData, adminDataLoading]);

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

    if (!adminData) return;

    try {
      // Submit the provided username to the backend server
      await createUsername({
        variables: {
          username,
          ...(!queryFisrtAdmin?.success && { wantBeAdmin: !wantBeAdmin }),
        },
      });
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
          disabled={adminDataLoading}
          onChange={(e) => setUsername(e.target.value)}
        ></input>
        <Button
          filled
          form
          fullWidth
          loading={loading || adminDataLoading}
          disabled={username.length <= 0 || adminDataLoading}
        >
          Увійти
        </Button>
        {queryFisrtAdmin?.success !== true && (
          <div className="do-you-want-be-admin">
            <p>Do you want be admin ?</p>
            <input
              name="acceptAdmin"
              type="checkbox"
              id="acceptTerms"
              checked={!wantBeAdmin}
              onChange={handleChange}
            />
          </div>
        )}
      </form>
    </>
  );
};

export default UsernameCreate;
