import React from 'react';
import './Clock.css';

export default ({hour, minute}) => {
  if (hour > 11) hour -= 12;
  const hourRotation = hour * 30;
  const minuteRotation = minute * 6;

  const hourPointerContainerStyles = {
    position: "absolute",
    width: "70px",
    height: "70px",
    borderRadius: "100%",
    border: "7px solid transparent",
    transform: `rotate(${hourRotation}deg)`
  };

  const minutePointerContainerStyles = {
    position: "absolute",
    width: "70px",
    height: "70px",
    borderRadius: "100%",
    border: "7px solid transparent",
    transform: `rotate(${minuteRotation}deg)`
  };

  return <div className="Clock ml-md-auto mb-3" style={{width: "70px", height: "70px"}}>
    <span className="ClockContainer">
      <div className="MiddlePointContainer">
        <div className="MiddlePoint"/>
      </div>

      <div className="ClockBorder"/>
      <div style={hourPointerContainerStyles}>
        <div className="HourPointer"/>
      </div>
      <div style={minutePointerContainerStyles}>
        <div className="MinutePointer"/>
      </div>
    </span>
  </div>

}