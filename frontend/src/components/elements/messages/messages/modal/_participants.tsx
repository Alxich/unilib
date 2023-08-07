import { FC } from "react";
import { SearchedUser } from "../../../../../util/types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

interface ParticipantsProps {
  participants: Array<SearchedUser>;
  removeParticipant: (userId: string) => void;
}

const Participants: FC<ParticipantsProps> = ({
  participants,
  removeParticipant,
}: ParticipantsProps) => {
  return (
    <div className="participents container flex-row flex-wrap flex-left">
      <div className="title">
        <p>Обрані вами співрозмовники: </p>
      </div>
      {participants.map((participant) => (
        <div key={participant.id} className="item">
          <p className="username">{participant.username}</p>
          <div
            className="fafont-icon big interactive cross"
            onClick={() => removeParticipant(participant.id)}
          >
            <FontAwesomeIcon
              icon={faClose}
              style={{ width: "100%", height: "100%", color: "inherit" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
export default Participants;
