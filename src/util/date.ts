import { Moment } from "moment";

export const getStringDate = (d: Moment) => {
  return d.locale("PL").format("dddd DD/MM/YYYY");
};

export interface SetConfig {
  h?: number;
  m?: number;
  s?: number;
  y?: number;
  mo?: number;
  d?: number;
}

const CONFIG_MAP = {
  h: "hours",
  m: "minutes",
  s: "seconds",
  y: "years",
  mo: "months",
  d: "date",
};

export const set = (d: Moment, config: SetConfig) => {
  const c = d.clone();
  Object.keys(config).forEach((k) => {
    // @ts-ignore
    c[CONFIG_MAP[k]](config[k]);
  });
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
