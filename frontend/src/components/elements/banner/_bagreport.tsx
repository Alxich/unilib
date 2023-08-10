import { FC, useState } from "react";

import Button from "../_button";

interface BagReportProps {}

const BagReport: FC<BagReportProps> = ({}: BagReportProps) => {
  const [textareaInput, setTextareaInput] = useState<string>();
  return (
    <>
      <div className="title">
        <h2>Повідомити про баг</h2>
      </div>
      <form className="report-form">
        <textarea
          value={textareaInput}
          onChange={(e) => setTextareaInput(e.target.value)}
          placeholder="Будь-ласка опишіть баг з яким ви зустрілися"
        />
        <Button filled form fullWidth>
          Повідомити
        </Button>
      </form>
    </>
  );
};

export default BagReport;
