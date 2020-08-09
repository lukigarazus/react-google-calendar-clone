import React, { useState, ReactElement, useEffect } from "react";
import { Select, Card, Calendar, Button, Badge } from "antd";
import moment, { Moment } from "moment";
import { PlusOutlined, RightOutlined, LeftOutlined } from "@ant-design/icons";
import { Event } from "../types";
import Day from "./CalendarDay";
import { date as D, dom as DOM } from "../util";
import CreateEventModal from "./CreateEventModal";
import "antd/dist/antd.css";

enum CalendarModes {
  Day = "Day",
  Week = "Week",
  Month = "Month",
  // Year = "Year",
}

const SideCalendarHeader = ({
  onChange,
  value,
}: {
  onChange: any;
  value: Moment;
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "5px",
        userSelect: "none",
      }}
    >
      <LeftOutlined
        onClick={() => {
          onChange(value.clone().subtract(1, "month"));
        }}
        style={{ cursor: "pointer" }}
      />
      <span>{value.format("MMMM YYYY")}</span>
      <RightOutlined
        onClick={() => onChange(value.clone().add(1, "month"))}
        style={{ cursor: "pointer" }}
      />
    </div>
  );
};

const CREATE_BUTTON_STYLE = {
  borderRadius: "50px",
  boxShadow: `0 5px 5px -3px rgba(0,0,0,0.2)`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "48px",
  width: "120px",
};

const SIDER_STYLES: React.CSSProperties[] = [
  {
    width: "300px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
  },
  {
    display: "flex",
    justifyContent: "center",
    padding: "20px",
  },
  { fontSize: "25px" },
];

const CREATE_BUTTON_INSIDE = (
  <>
    <PlusOutlined className="create-button" style={SIDER_STYLES[2]} />
    <span>Create</span>
  </>
);

const Sider = ({
  date,
  onChange,
  createEvent,
}: {
  date: Moment;
  onChange: any;
  createEvent?: (ev: Event) => void;
}) => {
  const [creating, setCreating] = useState(false);
  return (
    <>
      {createEvent && (
        <CreateEventModal
          visible={creating}
          setVisible={setCreating}
          date={date}
          key={`${creating}`}
          createEvent={createEvent}
        />
      )}
      <div style={SIDER_STYLES[0]}>
        <div style={SIDER_STYLES[1]}>
          <Button
            disabled={!createEvent}
            style={CREATE_BUTTON_STYLE}
            onClick={() => setCreating(true)}
          >
            {CREATE_BUTTON_INSIDE}
          </Button>
        </div>
        <Calendar
          value={date}
          onChange={onChange}
          fullscreen={false}
          headerRender={SideCalendarHeader}
        />
      </div>
    </>
  );
};

const MODE_STYLE: React.CSSProperties = {
  padding: "20px",
  width: "calc(100% - 300px)",
  overflowY: "scroll",
};

const Mode = ({
  Sider,
  Body,
  windowSize,
}: {
  Sider: ReactElement;
  Body: ReactElement;
  windowSize: { width: number; height: number };
}) => {
  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        flexDirection: windowSize.width < 756 ? "column" : "row",
      }}
    >
      {Sider}
      <div style={MODE_STYLE}>{Body}</div>
    </div>
  );
};

const isSameDay = (a: Moment, b: Moment) => a.isSame(b, "day");

export default ({
  title = "Calendar",
  events,
  createEvent,
  onChange,
}: {
  title?: string;
  events: Event[];
  createEvent?: (ev: Event) => void;
  onChange?: (ev: Event) => void;
}) => {
  const [windowSize, setWindowSize] = useState(DOM.viewport());
  const [mode, setMode] = useState<CalendarModes>(CalendarModes.Day);
  const [date, setDate] = useState<Moment>(moment());

  useEffect(() => {
    const list = () => {
      setWindowSize(DOM.viewport);
    };
    window.addEventListener("resize", list);
    return () => {
      window.removeEventListener("resize", list);
    };
  }, []);
  // const createEvent = useCallback(
  //   (ev: Event) => {
  //     setEvents([...events, ev]);
  //   },
  //   [events]
  // );
  const modes = {
    [CalendarModes.Day]: () => ({
      Sider: (
        <Sider
          date={date}
          onChange={(v: Moment) => {
            setDate(v);
          }}
          createEvent={createEvent}
        />
      ),
      Body: (
        <Day
          date={date}
          events={events.filter((ev) => isSameDay(ev.start, date))}
          createEvent={createEvent}
          onChange={onChange}
        />
      ),
    }),
    [CalendarModes.Week]: () => ({
      Sider: (
        <Sider
          date={date}
          onChange={(v: Moment) => {
            setDate(v);
          }}
          createEvent={createEvent}
        />
      ),
      Body: (
        <div
          style={{
            display: "flex",
            flexDirection: windowSize.width < 756 ? "column" : "row",
          }}
        >
          {D.getWeek(date).map((d) => {
            return (
              <Day
                date={d}
                createEvent={() => {}}
                events={events.filter((ev) => isSameDay(ev.start, d))}
              />
            );
          })}
        </div>
      ),
    }),
    [CalendarModes.Month]: () => ({
      Sider: (
        <Sider
          date={date}
          onChange={(v: Moment) => {
            setDate(v);
          }}
          createEvent={createEvent}
        />
      ),
      Body: (
        <div>
          <Calendar
            value={date}
            onChange={(v) => setDate(v)}
            headerRender={() => <div />}
            dateCellRender={function (value) {
              const list = events
                .filter((ev) => isSameDay(ev.start, value))
                .sort((a, b) => a.start.diff(b.start));
              return (
                <div className="month__events">
                  {list.map((item: Event) => (
                    <Badge
                      status={"default"}
                      text={` ${item.start.format("H:mm")} ${item.title}`}
                    />
                  ))}
                </div>
              );
            }}
          />
        </div>
      ),
    }),
    // [CalendarModes.Year]: {
    //   Sider: (
    //     <Sider
    //       date={date}
    //       onChange={(v: Moment) => {
    //         setDate(v);
    //       }}
    //     />
    //   ),
    //   Body: <div />,
    // },
  };
  return (
    <Card
      title={title}
      style={{ height: "100%" }}
      bodyStyle={{ height: "calc(100% - 57px)" }}
      extra={[
        <Select
          onSelect={(v: CalendarModes) => {
            setMode(v);
          }}
          defaultValue={mode}
          style={{ width: "106px" }}
        >
          {Object.values(CalendarModes).map((mode) => (
            <Select.Option value={mode}>{mode}</Select.Option>
          ))}
        </Select>,
      ]}
    >
      <div style={{ height: "calc(100% - 32px)" }}>
        {<Mode windowSize={windowSize} {...modes[mode]()} />}
      </div>
    </Card>
  );
};
