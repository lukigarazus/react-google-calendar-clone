import React, { useState, useRef } from "react";
import { Moment } from "moment";
import EventComp from "./Event";
import { Event } from "./types";
import { QUARTER_HEIGHT, DEFAULT_INTERVAL } from "./constants";
import { date as D, array as A } from "../util/index";

const getStartAndEnd = (d: Moment) => {
  const start = d;
  const end = start.clone().add(...DEFAULT_INTERVAL);
  return { start, end };
};

const generateData = (date: Moment) => {
  return A.range(0, 24).map((h) => ({
    h,
    qs: A.range(0, 4).map((q) => ({ date: D.set(date, { h, m: q * 15 }) })),
  }));
};

const handleOverlap = (events: Event[]) => {
  const byStart = [...events].sort((a, b) => a.start.diff(b.start));
  const byEnd = [...events].sort((a, b) => a.end.diff(b.end));
  for (let ev of byStart) {
    ev.left = 0;
    for (let ev2 of byEnd) {
      const startEnd = ev.start.diff(ev2.end);
      const startStart = ev.start.diff(ev2.start);
      console.log(ev.title, ev2.title, startEnd, startStart);
      if (ev === ev2 || startEnd > 0) {
        continue;
      } else if (startEnd < 0 && startStart > 0) {
        ev.left = (ev2.left || 0) + 1;
      }
    }
  }
};

export default ({
  date,
  events,
  createEvent,
}: {
  date: Moment;
  events: Event[];
  createEvent: (ev: Event) => void;
}) => {
  handleOverlap(events);
  const [_, setDummy] = useState({});
  const data = useRef(generateData(date));
  const day = useRef(null);
  return (
    <div className="day">
      <h3>{D.getStringDate(date)}</h3>
      <div className="day__body" ref={day}>
        {day.current
          ? events.map((ev) => (
              <EventComp refreshParent={setDummy} ev={ev} {...ev} />
            ))
          : (() => {
              setTimeout(() => {
                setDummy({});
              });
            })()}
        {data.current.map(({ h, qs }) => (
          <div className="hour">
            <div className="hour__label">{h}</div>
            <div className="hour__body">
              {qs.map(({ date: qDate }, i) => {
                return (
                  <div
                    onClick={() => {
                      const { start, end } = getStartAndEnd(qDate);
                      createEvent({
                        title: "Ev",
                        start,
                        end,
                        diff: Math.abs(start.diff(end)),
                      });
                    }}
                    className="quarter"
                    {...(i === 3
                      ? { style: { height: `${QUARTER_HEIGHT - 1}px` } }
                      : {})}
                  ></div>
                );
              })}
            </div>
          </div>
        ))}
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
