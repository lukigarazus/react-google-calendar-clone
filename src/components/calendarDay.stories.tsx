import React from "react";
import moment from "moment";
import CalendarDay from "./CalendarDay";

export default {
  title: "CalendarDay",
};

export const Basic = () => (
  <CalendarDay date={moment()} events={[]} createEvent={() => {}} />
);
