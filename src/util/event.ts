import moment, { Moment } from "moment";
import { sortedIndexBy } from "lodash";
import { date as D, array as A } from "./index";
import { DEFAULT_INTERVAL } from "../constants";
import { Event, TimePoint } from "../types";

export const getStartAndEnd = (d: Moment) => {
  const start = d;
  const end = start.clone().add(...DEFAULT_INTERVAL);
  return { start, end };
};

export const getDiff = (start: Moment, end: Moment) => {
  return end.diff(start);
};

export const getQuarterNumberFromStartToEnd = (diff: number) => {
  return Math.floor(diff / 1000 / 60 / 15);
};

export const generateData = (): { h: number; qs: TimePoint[] }[] => {
  const date = moment();
  return A.range(0, 24).map((h) => ({
    h,
    qs: A.range(0, 4).map((q) => ({
      date: D.set(date, { h, m: q * 15, s: 0 }),
      events: [],
    })),
  }));
};

const findWithIndex = <T>(f: (el: T) => any, arr: T[]): [T, number] | void => {
  let i = 0;
  for (let el of arr) {
    if (f(el)) {
      return [el, i];
    }
    i++;
  }
};

export const updateLefts = (events: Event[]) => {
  events.forEach((ev) => {
    if (ev.quarters[0]) ev.left = ev.quarters[0].events.length - 1;
  });
};

const attachQuartersToEvent = (event: Event, data: TimePoint[]) => {
  event.quarters = [];
  const diff = getDiff(event.start, event.end);
  const quarters = getQuarterNumberFromStartToEnd(diff);
  const found = findWithIndex((el) => {
    return Math.abs(el.date.diff(event.start)) < 1000; // kinda arbitrary buts works. Has to be fixed
  }, data);
  if (found) {
    data.slice(found[1], found[1] + quarters).forEach((p) => {
      p.events.push(event);
      event.quarters.push(p);
    });
  }
};

export const updateEvent = (
  event: Event,
  events: Event[],
  data: TimePoint[]
  // possibleOrderChange?: boolean
) => {
  // if (possibleOrderChange) {
  //   const index = events.indexOf(event);
  //   events.splice(index, 1);
  //   events.splice(
  //     // @ts-ignore
  //     sortedIndexBy(events, event, (ev) => ev.start._d.valueOf()),
  //     0,
  //     event
  //   );
  // }
  const quarters = event.quarters;
  quarters.forEach((q) => {
    q.events = q.events.filter((el) => el !== event);
  });
  attachQuartersToEvent(event, data);
  updateLefts(events);
};

export const mapOverlap = (events: Event[]) => {
  // @ts-ignore
  if (events.done) return;
  events.sort((a, b) => a.start.diff(b.start));
  const data = generateData()
    .map((p) => p.qs)
    .flat();
  events.forEach((ev: Event) => {
    attachQuartersToEvent(ev, data);
  });
  updateLefts(events);
  // @ts-ignore
  events.done = true;
  return data;
};

export const handleOverlap = (events: Event[]) => {
  const byStart = [...events].sort((a, b) => a.start.diff(b.start));
  const byEnd = [...events].sort((a, b) => a.end.diff(b.end));
  for (let ev of byStart) {
    ev.left = 0;
    for (let ev2 of byEnd) {
      const startEnd = ev.start.diff(ev2.end);
      const startStart = ev.start.diff(ev2.start);
      if (ev === ev2 || startEnd > 0) {
        continue;
      } else if (startEnd < 0 && startStart > 0) {
        ev.left = (ev2.left || 0) + 1; // this is possible cuz the arrays are sorted
      }
    }
  }
};
