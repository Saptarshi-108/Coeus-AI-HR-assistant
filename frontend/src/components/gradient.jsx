// src/components/GradientText.jsx
import React from "react";

const GradientText = ({
  children,
  from = "slate-300",
  to = "slate-800",
  className = "",
}) => {
  return (
    <span
      className={`bg-gradient-to-r from-${from} to-${to} bg-clip-text text-transparent ${className}`}
    >
      {children}
    </span>
  );
};

export default GradientText;
