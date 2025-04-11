import React from "react";

const HighlightBox = ({ title, value, Icon }) => {
  return (
    <div className="highlight-box">
      <div className="highlight-box-title">{title}</div>
      <div className="highlight-box-content">
        <Icon className="highlight-box-icon" />
        <p className="highlight-box-value">{value}</p>
      </div>
    </div>
  );
};

export default HighlightBox;
