import { FC, useEffect, useState } from "react";
import { toast } from "react-toastify";

import Button from "../../_button";

import { Session } from "next-auth";
import { useMutation } from "@apollo/client";

import {
  AuthorInfoTypes,
  SearchUserData,
  UpdateItemResoponse,
  UpdateUserArguments,
} from "../../../../util/types";
import UserOperations from "../../../../graphql/operations/users";

type AuthorinfoEditProps = {
  currentUser?: SearchUserData;
  blockContent?: AuthorInfoTypes;
  session?: Session;
};

const AuthorinfoEdit: FC<AuthorinfoEditProps> = ({
  session,
  currentUser,
  blockContent,
}: AuthorinfoEditProps) => {
  /**
   * Edit variables for creating edit page
   */
  const [username, setUsername] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [banner, setBanner] = useState<string>("");
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");

  // Set up an effect to update component state when blockContent changes
  useEffect(() => {
    // Check if there's any data in the blockContent
    if (blockContent) {
      // Extract relevant data fields from blockContent
      const { username, aboutMe, banner, image } = blockContent;

      // Update component state with username if available
      username && setUsername(username);
      // Update component state with aboutMe if available
      aboutMe && setDesc(aboutMe);
      // Update component state with image if available
      image && setImage(image);
      // Update component state with banner if available
      banner && setBanner(banner);
    }
  }, [blockContent]);

  const [updateProccessing, setUpdateProccessing] = useState<boolean>(false);
  const cooldownTimeInSeconds = 5; // Length of cooldown time
  const [cooldown, setCooldown] = useState<number>(cooldownTimeInSeconds);
  const [isCooldownActive, setIsCooldownActive] = useState<boolean>(false);

  // Set up an effect to manage the cooldown interval
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isCooldownActive) {
      // Set up an interval to decrement the cooldown every second
      interval = setInterval(() => {
        setCooldown((prevCooldown) => prevCooldown - 1);
      }, 1000);
    }

    // Clean up the interval when the component unmounts or when isCooldownActive changes
    return () => clearInterval(interval);
  }, [isCooldownActive]);

  // Set up an effect to stop the cooldown when it reaches 0
  useEffect(() => {
    cooldown === 0 && stopCooldown();
  }, [cooldown]);

  // Function to start the cooldown
  const startCooldown = () => {
    // Set the initial cooldown time
    setCooldown(cooldownTimeInSeconds);

    // Activate the cooldown
    setIsCooldownActive(true);
  };

  // Function to stop the cooldown
  const stopCooldown = () => {
    // Deactivate the cooldown
    setIsCooldownActive(false);
  };

  // Set up a mutation for updating user data
  const [updateUser] = useMutation<
    { updateUser: UpdateItemResoponse },
    UpdateUserArguments
  >(UserOperations.Mutations.updateUser);

  // Function to handle user data update
  const onUpdateUser = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setUpdateProccessing(true);

    try {
      if (!session) {
        throw new Error("Not authorized Session");
      }

      // Extract necessary data from the session
      const { username: sessionUsername, id: userId } = session.user;

      // Check if the session's user information is available
      if (!sessionUsername) {
        throw new Error("Not authorized user");
      }

      // Check if the current user data is available
      if (!currentUser) {
        throw new Error("Not authorized user");
      }

      // Send an update request to the server
      const { data, errors } = await updateUser({
        variables: {
          banner,
          desc,
          image,
          username,
        },
      });

      // Handle update response and errors
      if (!data?.updateUser.success || errors) {
        setUpdateProccessing(false);
        throw new Error("Error updating user");
      }

      // If successful, display a success toast and trigger cooldown
      if (!errors) {
        toast.success("User was updated!");
        setUpdateProccessing(false);
        startCooldown();
      }
    } catch (error: any) {
      // If unsuccessful, display a error toast
      console.error("onFollowUser error", error);
      toast.error(error?.message);
    }
  };

  return (
    <div className="edit">
      <div className="title">
        <h5>Настройки користувача</h5>
      </div>
      <form>
        <div className="item">
          <div className="title">
            <p>Змінити ім{"`"}я користувача</p>
          </div>
          <input
            placeholder={`Your current username: ${currentUser?.searchUser.username}`}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="item">
          <div className="title">
            <p>Змінити опис користувача</p>
          </div>
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} />
        </div>
        <div className="item">
          <div className="title">
            <p>Ваш email до якого привязаний аккаунт</p>
          </div>
          <input value={currentUser?.searchUser.email} disabled />
        </div>
        <div className="item">
          <div className="title">
            <p>Змінити іконку користувача</p>
          </div>
          <input
            placeholder={`Your current image: ${currentUser?.searchUser.image}`}
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </div>
        <div className="item">
          <div className="title">
            <p>Змінити баннер користувача</p>
          </div>
          <input
            placeholder={`Your current banner: ${currentUser?.searchUser.banner}`}
            value={banner}
            onChange={(e) => setBanner(e.target.value)}
          />
        </div>
        <div className="item update">
          <div className="title">
            <p>Оновити ваші нові дані користувача</p>
          </div>
          <Button
            filled
            big
            onClick={(e: any) => {
              onUpdateUser(e);
            }}
            disabled={isCooldownActive || updateProccessing}
          >
            {isCooldownActive ? `Оновити (${cooldown}сек)` : "Оновити"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AuthorinfoEdit;
