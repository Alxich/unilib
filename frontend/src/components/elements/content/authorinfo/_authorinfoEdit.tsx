import { FC, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

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

  useEffect(() => {
    if (blockContent) {
      const { username, aboutMe, banner, image } = blockContent;

      username && setUsername(username);
      aboutMe && setDesc(aboutMe);
      image && setImage(image);
      banner && setBanner(banner);
    }
  }, [blockContent]);

  const [updateProccessing, setUpdateProccessing] = useState<boolean>(false);
  const cooldownTimeInSeconds = 5; // Length of cooldown time
  const [cooldown, setCooldown] = useState<number>(cooldownTimeInSeconds);
  const [isCooldownActive, setIsCooldownActive] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isCooldownActive) {
      interval = setInterval(() => {
        setCooldown((prevCooldown) => prevCooldown - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isCooldownActive]);

  useEffect(() => {
    cooldown === 0 && stopCooldown();
  }, [cooldown]);

  // Start counting cooldown
  const startCooldown = () => {
    setCooldown(cooldownTimeInSeconds);
    setIsCooldownActive(true);
  };

  // End counting cooldown (For extra situation)
  const stopCooldown = () => {
    setIsCooldownActive(false);
  };

  const [updateUser] = useMutation<
    { updateUser: UpdateItemResoponse },
    UpdateUserArguments
  >(UserOperations.Mutations.updateUser);

  const onUpdateUser = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setUpdateProccessing(true);
    try {
      if (!session) {
        throw new Error("Not authorized Session");
      }

      const { username: sessionUsername, id: userId } = session.user;

      // Check if user exist to make post secure
      if (!sessionUsername) {
        throw new Error("Not authorized user");
      }

      if (!currentUser) {
        throw new Error("Not authorized user");
      }

      const { data, errors } = await updateUser({
        variables: {
          banner,
          desc,
          image,
          username,
        },
      });

      if (!data?.updateUser.success || errors) {
        setUpdateProccessing(false);
        throw new Error("Error to update user");
      }

      if (!errors) {
        toast.success("User was updated!");
        setUpdateProccessing(false);
        startCooldown();
      }
    } catch (error: any) {
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
        <div className="item">
          <div className="title">
            <p>Змінити пороль користувача</p>
          </div>
          <div>
            <input
              placeholder={"Please write your current password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
              placeholder={"Write your new password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
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
