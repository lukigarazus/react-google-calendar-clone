import React, { useState, useCallback } from "react";
import { Moment } from "moment";
import { QUARTER_HEIGHT, LEFT } from "../constants";
import ClickAway from "react-click-away-listener";
import Draggable from "react-draggable";
import { Event, TimePoint } from "../types";
import {
  getDiff,
  getQuarterNumberFromStartToEnd,
  updateEvent,
} from "../util/event";

const RESIZE_BAR_STYLE: React.CSSProperties = {
  cursor: "ns-resize",
  height: "3px",
  position: "absolute",
  bottom: "0px",
  width: "100%",
};

export default ({
  title,
  start: pStart,
  end: pEnd,
  left = 0,
  ev,
  refreshParent,
}: // data,
// events,
{
  ev: Event;
  title: string;
  start: Moment;
  end: Moment;
  left?: number;
  refreshParent: any;
  // data: TimePoint[];
  // events: Event[];
}) => {
  const [{ start, end }, setTime] = useState({ start: pStart, end: pEnd });
  const [focused, setFocused] = useState(false);
  const [resizing, setResizing] = useState(false);
  const fifteens = (start.hours() * 60 + start.minutes()) / 15;
  const { x, y } = {
    x: left * LEFT + 38,
    y: fifteens * QUARTER_HEIGHT,
  };
  const diff = getDiff(start, end);
  const height = getQuarterNumberFromStartToEnd(diff) * QUARTER_HEIGHT;
  const onDrag = useCallback(
    (_, ui) => {
      const am = (ui.deltaY / QUARTER_HEIGHT) * 15;
      setTime({
        start: start.clone()[am > 0 ? "add" : "subtract"](Math.abs(am), "m"),
        end: end.clone()[am > 0 ? "add" : "subtract"](Math.abs(am), "m"),
      });
    },
    [start, end]
  );
  const onStop = useCallback(() => {
    ev.start = start;
    ev.end = end;
    // updateEvent(ev, events, data);
    refreshParent({});
  }, [start, end, refreshParent]);
  return (
    <ClickAway onClickAway={() => setFocused(false)}>
      <Draggable
        disabled={resizing}
        bounds={{
          top: 0,
          bottom: 24 * 4 * QUARTER_HEIGHT - height,
          left: 0,
          right: 0,
        }}
        axis="y"
        grid={[QUARTER_HEIGHT, QUARTER_HEIGHT]}
        position={{ x, y }}
        onDrag={onDrag}
        onStop={onStop}
      >
        <div
          onClick={() => {
            setFocused(true);
          }}
          style={{
            position: "absolute",
            // left: `${left * LEFT + 38}px`,
            borderRadius: "3px",
            border: "1px solid white",
            padding: "5px",
            background: "black",
            color: "white",
            width: `calc(100% - ${left * LEFT + 38}px)`,
            zIndex: focused ? 100 : left,
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
              // updateEvent(ev, events, data);
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
            <div style={RESIZE_BAR_STYLE}></div>
          </Draggable>
        </div>
      </Draggable>
    </ClickAway>
  );
};
