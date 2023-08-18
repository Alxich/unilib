import { FC, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { formatTimeToPost } from "../../util/functions";
import classNames from "classnames";

import { useMutation } from "@apollo/client";
import {
  UpdateItemResoponse,
  UpdateUserAdminArguments,
  UserAdminItemProps,
} from "../../util/types";
import { UserPopulated } from "../../../../backend/src/util/types";
import UserOperations from "../../graphql/operations/users";

import { useEscapeClose } from "../../util/functions/useEscapeClose";

import { Button } from "../elements";

const UserItem: FC<UserAdminItemProps> = ({
  item,
  session,
}: UserAdminItemProps) => {
  const [userData, setUserData] = useState<UserPopulated>(item);
  const [formVisible, setFormVisible] = useState<boolean>(false);

  // Close the form via esc button

  useEscapeClose({
    activeElem: formVisible,
    setActiveElem: setFormVisible,
  });

  /**
   * Edit variables for creating edit page
   */
  const [username, setUsername] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [banner, setBanner] = useState<string>("");

  // Set up an effect to update component state when userData changes
  useEffect(() => {
    // Check if there's any data in the userData
    if (userData) {
      // Extract relevant data fields from userData
      const { username, aboutMe, banner, image } = userData;

      // Update component state with username if available
      username && setUsername(username);
      // Update component state with aboutMe if available
      aboutMe && setDesc(aboutMe);
      // Update component state with image if available
      image && setImage(image);
      // Update component state with banner if available
      banner && setBanner(banner);
    }
  }, [userData]);

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
  const [updateUserByAdmin] = useMutation<
    { updateUserByAdmin: UpdateItemResoponse },
    UpdateUserAdminArguments
  >(UserOperations.Mutations.updateUserByAdmin);

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
      if (!userData) {
        throw new Error("Not authorized user");
      }

      // Send an update request to the server
      const { data, errors } = await updateUserByAdmin({
        variables: {
          id: userData.id,
          banner,
          desc,
          image,
          username,
        },
      });

      // Handle update response and errors
      if (!data?.updateUserByAdmin.success || errors) {
        setUpdateProccessing(false);
        throw new Error("Error updating user");
      }

      // If successful, display a success toast and trigger cooldown
      if (!errors) {
        toast.success("User was updated!");
        setUpdateProccessing(false);
        setUserData({
          ...userData,
          banner: banner,
          aboutMe: desc,
          image: image,
          username: username,
        });
        startCooldown();
      }
    } catch (error: any) {
      // If unsuccessful, display a error toast
      console.error("onFollowUser error", error);
      toast.error(error?.message);
    }
  };

  return (
    <div className="table-row">
      <div className="information">
        <div className="table-data">{userData.username}</div>
        <div className="table-data">{userData.id}</div>
        <div className="table-data">{formatTimeToPost(userData.createdAt)}</div>
        <div className="table-data">{formatTimeToPost(userData.updatedAt)}</div>
        <div className="table-data">
          {userData.subscribedCategoryIDs.length}
        </div>

        <div
          className="table-data edit"
          onClick={() => setFormVisible(formVisible ? false : true)}
        >
          {formVisible ? "Close X" : "Edit"}
        </div>
      </div>

      <div
        className={classNames("update-current-item big-form", {
          active: formVisible,
        })}
      >
        <form className="table-data has-content">
          <div className="column__item">
            <input
              placeholder={`Your current username: ${userData.username}`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              value={
                userData.email ? userData.email : "User not provided the email"
              }
              onChange={() => {}}
              disabled
            />
            <input
              placeholder={`Your current image: ${userData.image}`}
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
            <input
              placeholder={`Your current banner: ${userData.banner}`}
              value={banner}
              onChange={(e) => setBanner(e.target.value)}
            />
          </div>
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} />
        </form>
        <div className="table-data">
          <Button
            filled
            big
            onClick={(e: any) => {
              onUpdateUser(e);
            }}
            disabled={isCooldownActive || updateProccessing}
          >
            {isCooldownActive
              ? ` Update user (${cooldown}сек)`
              : " Update user"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserItem;
