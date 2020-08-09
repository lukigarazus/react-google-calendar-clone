import React, { useState, useRef, useEffect } from "react";
import { Moment } from "moment";
import EventComp from "./Event";
import { Event } from "../types";
import { QUARTER_HEIGHT } from "../constants";
import { date as D } from "../util";
import {
  // mapOverlap,
  generateData,
  getStartAndEnd,
  handleOverlap,
} from "../util/event";

const Quarter = ({
  createEvent,
  qDate,
  index,
}: {
  createEvent?: (ev: Event) => void;
  qDate: Moment;
  index: number;
}) => {
  return (
    <div
      onClick={() => {
        const { start, end } = getStartAndEnd(qDate);
        createEvent &&
          createEvent({
            title: "Ev",
            start,
            end,
            diff: Math.abs(start.diff(end)),
            quarters: [],
          });
      }}
      className="quarter"
      {...(index === 3 ? { style: { height: `${QUARTER_HEIGHT - 1}px` } } : {})}
    ></div>
  );
};

export default ({
  date,
  events,
  createEvent,
  onChange,
}: {
  date: Moment;
  events: Event[];
  createEvent?: (ev: Event) => void;
  onChange?: (ev: Event) => void;
}) => {
  // @ts-ignore
  handleOverlap(events);
  // const [overlapData, setOverlapData] = useState(mapOverlap(events));
  const [_, setDummy] = useState({});
  const quarters = useRef(
    generateData().map(({ h, qs }) => (
      <div className="hour">
        <div className="hour__label">{h}</div>
        <div className="hour__body">
          {qs.map(({ date: qDate }, i) => {
            return (
              <Quarter createEvent={createEvent} index={i} qDate={qDate} />
            );
          })}
        </div>
      </div>
    ))
  );
  const day = useRef(null);
  return (
    <div className="day">
      <h3>{D.getStringDate(date)}</h3>
      <div className="day__body" ref={day}>
        {day.current
          ? events.map((ev: Event) => (
              <EventComp
                // data={overlapData || []}
                onChange={onChange}
                // Refresh parent is needed to recalculate offset
                refreshParent={setDummy}
                ev={ev}
                {...ev}
              />
            ))
          : (() => {
              // Schedule rerender on empty stack
              setTimeout(() => {
                setDummy({});
              });
            })()}
        {quarters.current}
      </div>
      <style>
        {`
            .day > h3 {
                padding: 10px;
            }
            .day {
                width: 100%;
                border: 1px solid #f0f0f0;
                border-radius: 2px;
                display: inline-block;
                min-width: 205px;
            }
            .day__body {
                display: flex;
                flex-direction: column;
                position: relative;
            }
            .hour {
                margin: 0 10px;
                display: flex;
            }
            .hour__body {
                margin-left: 10px;
                width: 100%;
                border-top: 1px solid #f0f0f0;
                display: flex;
                flex-direction: column;
                align-items: stretch;
                justify-content: flex-around;
            }
            .quarter {
                width: 100%;
                height: ${QUARTER_HEIGHT}px;
            }
            `}
      </style>
    </div>
  );
};
