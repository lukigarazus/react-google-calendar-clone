import React, { useState } from "react";
import { DatePicker, TimePicker } from "antd";
import moment, { Moment } from "moment";
import { date as D } from "../util";

export default ({
  value,
  onChange,
}: {
  value: Moment;
  onChange: (ev: Moment) => void;
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <TimePicker
        value={value}
        onChange={(ev) => {
          if (ev) {
            onChange(
              D.set(value, { h: ev.hours(), m: ev.minutes(), s: ev.seconds() })
            );
          }
        }}
      />
      <DatePicker
        value={value}
        onChange={(ev) => {
          if (ev) {
            console.log({ y: ev.years(), mo: ev.months(), d: ev.date() });
            onChange(
              D.set(value, { y: ev.years(), mo: ev.months(), d: ev.date() })
            );
          }
        }}
      />
    </div>
  );
};
