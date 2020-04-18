import { Moment } from "moment";

export interface Event {
  title: string;
  start: Moment;
  end: Moment;
  diff: number;
  left?: number;
}
