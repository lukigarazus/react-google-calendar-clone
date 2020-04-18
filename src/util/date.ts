import { Moment } from "moment";

export const getStringDate = (d: Moment) => {
  return d.locale("PL").format("dddd DD/MM/YYYY");
};

export interface SetConfig {
  h?: number;
  m?: number;
  s?: number;
}

export const set = (d: Moment, { h = 0, m = 0, s = 0 }: SetConfig) => {
  const c = d.clone();
  c.hours(h);
  c.minutes(m);
  c.seconds(s);
  return c;
};

export const getWeek = (d: Moment) => {
  const c = d.clone().isoWeekday(1);
  const week = [c.clone()];
  for (let i = 0; i < 6; i++) {
    week.push(c.add(1, "d").clone());
  }
  return week;
};
