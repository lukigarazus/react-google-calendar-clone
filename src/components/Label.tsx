import React, { ReactElement } from "react";

export default ({
  label,
  children,
  style = {},
}: {
  label: string;
  children: ReactElement | ReactElement[];
  style?: React.CSSProperties;
}) => (
  <div style={{ ...style, display: "flex", flexDirection: "column" }}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        padding: "5px",
      }}
    >
      <span>{label}</span>
    </div>
    {children}
  </div>
);
