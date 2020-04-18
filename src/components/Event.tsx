import React from "react";
import { Moment } from "moment";
import { QUARTER_HEIGHT } from "./constants";

const LEFT = 15;

export default ({
  title,
  start,
  end,
  startX,
  left = 0,
}: {
  title: string;
  startX: number;
  start: Moment;
  end: Moment;
  left?: number;
}) => {
  const diff = end.diff(start);
  return (
    <div
      style={{
        position: "absolute",
        top: `${
          ((start.hours() * 60 + start.minutes()) / 15) * QUARTER_HEIGHT +
          (start.hours() * 60 + start.minutes()) / 15 / 4
        }px`,
        left: `${left * LEFT + 38}px`,
        zIndex: left,
        borderRadius: "3px",
        border: "1px solid white",
        padding: "5px",
        width: `calc(100% - ${left * LEFT + 38}px)`,
        background: "black",
        color: "white",
        height: `${Math.floor(diff / 1000 / 60 / 15) * QUARTER_HEIGHT}px`,
        minHeight: `${2 * QUARTER_HEIGHT}px`,
      }}
    >
      {`${start.format("H:mm")} ${title}`}
    </div>
  );
};
