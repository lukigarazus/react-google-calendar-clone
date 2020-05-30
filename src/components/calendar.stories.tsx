import React, { useState } from "react";
import Calendar from "./Calendar";
import moment from "moment";
import { Event } from "../types";
import { array as A, math as M, date as D } from "../util";

export default {
  title: "Calendar",
};

const getEvents = () => {
  let start = moment();
  const events: Event[] = A.range(0, 6).map((el) => {
    const h = M.getRandomArbitrary(0, 19);
    let m = M.getRandomArbitrary(0, 59);
    m -= m % 15;
    start = D.set(start, { h, m, s: 0 });
    const end = start.clone();
    end.add(M.getRandomArbitrary(0, 230), "m");
    return { title: `Test ${el}`, start, end, diff: 0, quarters: [] };
  });
  return events;
};

export const Basic = () => (
  <Calendar createEvent={() => {}} events={getEvents()} title={"Calendar"} />
);

export const InContainer = () => (
  <div style={{ height: "600px" }}>
    <Calendar events={getEvents()} title={"Calendar"} createEvent={() => {}} />
  </div>
);

export const WithCreate = () => {
  const [events, setEvents] = useState(getEvents());
  return (
    <Calendar
      events={events}
      createEvent={(ev) => setEvents([...events, ev])}
    />
  );
};
