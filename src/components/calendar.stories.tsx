import React from "react";
import Calendar from "./Calendar";
import moment from "moment";
import { Event } from "./types";
import { array as A, math as M, date as D } from "../util";

export default {
  title: "Calendar",
};
let start = moment();
const events: Event[] = A.range(0, 6).map((el) => {
  const h = M.getRandomArbitrary(0, 19);
  let m = M.getRandomArbitrary(0, 59);
  m -= m % 15;
  start = D.set(start, { h, m });
  const end = start.clone();
  end.add(M.getRandomArbitrary(0, 230), "m");
  return { title: `Test ${el}`, start, end, diff: 0 };
});

export const Basic = () => <Calendar events={events} title={"Calendar"} />;

export const InContainer = () => (
  <div style={{ height: "600px" }}>
    <Calendar events={events} title={"Calendar"} />
  </div>
);
