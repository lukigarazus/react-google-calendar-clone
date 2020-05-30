import { Moment } from "moment";

export interface Event {
  title: string;
  start: Moment;
  end: Moment;
  diff: number; // cached difference between start and end
  left?: number; // number of units the event should be shifted to left
  quarters: TimePoint[];
}

export interface TimePoint {
  date: Moment;
  events: Event[];
}
