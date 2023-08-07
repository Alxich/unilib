import { FC } from "react";
import Button from "../../../_button";
import { SearchedUser } from "../../../../../util/types";

interface UserListProps {
  users: Array<SearchedUser>;
  participants: Array<SearchedUser>;
  addParticipant: (user: SearchedUser) => void;
}

const UserList: FC<UserListProps> = ({
  users,
  participants,
  addParticipant,
}: UserListProps) => {
  return (
    <>
      {users.length === 0 ? (
        <div className="container flex-row flex-center">
          <p>No users found</p>
        </div>
      ) : (
        <div className="user-list container flex-row flex-left">
          {users.map((user) => (
            <div className="item container flex-row" key={user.username}>
              <div className="user-icon"></div>
              <div className="container flex-row flex-space full-width">
                <p>{user.username}</p>
                <Button
                  filled
                  disabled={
                    !!participants.find(
                      (participant) => participant.id === user.id
                    )
                  }
                  onClick={() => addParticipant(user)}
                >
                  Вибрати
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
export default UserList;
