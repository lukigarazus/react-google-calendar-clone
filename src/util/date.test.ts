import { getWeek } from "./date";
import moment from "moment";

test("getWeek", () => {
  expect(getWeek(moment()).length).toEqual(7);
});
