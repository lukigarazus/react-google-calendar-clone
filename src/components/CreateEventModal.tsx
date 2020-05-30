import React, { useState } from "react";
import { Modal, Input, TimePicker } from "antd";
import moment, { Moment } from "moment";
import TimeAndDatePicker from "./TimeAndDatePicker";
import Label from "./Label";
import { Event } from "../types";

export default ({
  setVisible,
  visible,
  date,
  createEvent,
}: {
  setVisible: (v: boolean) => void;
  visible: boolean;
  date: Moment;
  createEvent: (v: Event) => void;
}) => {
  const [state, setState] = useState({
    start: date.clone(),
    end: date.clone().add(15, "m"),
    title: "",
    quarters: [],
    diff: 0,
  });
  const [placeholder, setPlaceholder] = useState("Add title");
  return (
    <Modal
      onCancel={() => {
        setVisible(false);
      }}
      visible={visible}
      onOk={() => {
        if (!state.title) {
          setPlaceholder("You need to add a title!");
          return;
        }
        setVisible(false);
        createEvent(state);
      }}
    >
      <div style={{ paddingTop: "20px" }}>
        <Input
          value={state.title}
          placeholder={placeholder}
          style={{ fontSize: "19px" }}
          onChange={(ev) => {
            setState({ ...state, title: ev.target.value });
          }}
        />
        <div style={{ display: "flex", width: "100%" }}>
          <Label label="Start" style={{ width: "100%" }}>
            <TimeAndDatePicker
              onChange={(ev) => setState({ ...state, start: ev })}
              value={state.start}
            />
          </Label>
          <Label label="End" style={{ width: "100%" }}>
            <TimeAndDatePicker
              onChange={(ev) => setState({ ...state, end: ev })}
              value={state.end}
            />
          </Label>
        </div>
      </div>
    </Modal>
  );
};
