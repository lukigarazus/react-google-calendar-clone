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

export default ({
  date,
  events,
  createEvent,
}: {
  date: Moment;
  events: Event[];
  createEvent: (ev: Event) => void;
}) => {
  // @ts-ignore
  handleOverlap(events);
  // const [overlapData, setOverlapData] = useState(mapOverlap(events));
  const [_, setDummy] = useState({});
  const data = useRef(generateData());
  const day = useRef(null);
  return (
    <div className="day">
      <h3>{D.getStringDate(date)}</h3>
      <div className="day__body" ref={day}>
        {day.current
          ? [...events].map((ev: Event) => (
              <EventComp
                // data={overlapData || []}
                refreshParent={setDummy}
                ev={ev}
                {...ev}
              />
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
                        quarters: [],
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
