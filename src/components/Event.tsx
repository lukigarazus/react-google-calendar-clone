import React, { useState } from "react";
import { Moment } from "moment";
import { QUARTER_HEIGHT } from "./constants";
import ClickAway from "react-click-away-listener";
import Draggable from "react-draggable";
import { Event } from "./types";

const LEFT = 15;

export default ({
  title,
  start: pStart,
  end: pEnd,
  left = 0,
  ev,
  refreshParent,
}: {
  ev: Event;
  title: string;
  start: Moment;
  end: Moment;
  left?: number;
  refreshParent: any;
}) => {
  const [{ start, end }, setTime] = useState({ start: pStart, end: pEnd });
  const fifteens = (start.hours() * 60 + start.minutes()) / 15;
  const { x, y } = {
    x: left * LEFT + 38,
    y: fifteens * QUARTER_HEIGHT,
  };
  const [focused, setFocused] = useState(false);
  const [resizing, setResizing] = useState(false);
  const diff = end.diff(start);
  const height = Math.floor(diff / 1000 / 60 / 15) * QUARTER_HEIGHT;
  return (
    <ClickAway onClickAway={() => setFocused(false)}>
      <Draggable
        disabled={resizing}
        // @ts-ignore
        bounds={{ top: 0, bottom: 24 * 4 * QUARTER_HEIGHT - height }}
        axis="y"
        grid={[QUARTER_HEIGHT, QUARTER_HEIGHT]}
        position={{ x, y }}
        onDrag={(e, ui) => {
          const am = (ui.deltaY / QUARTER_HEIGHT) * 15;
          setTime({
            start: start
              .clone()
              [am > 0 ? "add" : "subtract"](Math.abs(am), "m"),
            end: end.clone()[am > 0 ? "add" : "subtract"](Math.abs(am), "m"),
          });
        }}
        onStop={() => {
          ev.start = start;
          ev.end = end;
          refreshParent({});
        }}
      >
        <div
          onClick={() => {
            setFocused(true);
          }}
          style={{
            position: "absolute",
            // left: `${left * LEFT + 38}px`,
            zIndex: focused ? 100 : left,
            borderRadius: "3px",
            border: "1px solid white",
            padding: "5px",
            width: `calc(100% - ${left * LEFT + 38}px)`,
            background: "black",
            color: "white",
            height: `${height}px`,
            minHeight: `${2 * QUARTER_HEIGHT}px`,
          }}
        >
          {`${start.format("H:mm")} ${title}`}
          <Draggable
            grid={[QUARTER_HEIGHT, QUARTER_HEIGHT]}
            onMouseDown={(ev) => {
              ev.preventDefault();
              ev.stopPropagation();
              setResizing(true);
            }}
            onStop={() => {
              setResizing(false);
              ev.end = end;
              refreshParent();
            }}
            onDrag={(_, ui) => {
              const am = (ui.deltaY / QUARTER_HEIGHT) * 15;
              setTime({
                start,
                end: end
                  .clone()
                  [am > 0 ? "add" : "subtract"](Math.abs(am), "m"),
              });
            }}
            position={{ x: 0, y: 0 }}
          >
            <div
              style={{
                cursor: "ns-resize",
                height: "3px",
                position: "absolute",
                bottom: "0px",
                width: "100%",
              }}
            ></div>
          </Draggable>
        </div>
      </Draggable>
    </ClickAway>
  );
};
