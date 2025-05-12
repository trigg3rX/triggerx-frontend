import { useRef, useState } from "react";

const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = 60 * SECONDS_PER_MINUTE; // 3600
const SECONDS_PER_DAY = 24 * SECONDS_PER_HOUR;    // 86400

export function useTimeManagement() {
  const [timeframe, setTimeframe] = useState({ days: 0, hours: 0, minutes: 0 });
  const [timeframeInSeconds, setTimeframeInSeconds] = useState(0);
  const [timeInterval, setTimeInterval] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [intervalInSeconds, setIntervalInSeconds] = useState(0);
  const [errorFrame, setErrorFrame] = useState("");
  const errorFrameRef = useRef(null);
  const [errorInterval, setErrorInterval] = useState("");
  const errorIntervalRef = useRef(null);

  const handleTimeframeChange = (field, value) => {
    const updatedTimeframe = { ...timeframe, [field]: parseInt(value) || 0 };
    const updatedTimeframeInSeconds =
      updatedTimeframe.days * SECONDS_PER_DAY +       // Use constant
      updatedTimeframe.hours * SECONDS_PER_HOUR +     // Use constant
      updatedTimeframe.minutes * SECONDS_PER_MINUTE;  // Use constant

    console.log("Calculated timeframe in seconds:", updatedTimeframeInSeconds);

    setTimeframe(updatedTimeframe);
    setTimeframeInSeconds(updatedTimeframeInSeconds);
    if (
      updatedTimeframe.days > 0 ||
      updatedTimeframe.hours > 0 ||
      updatedTimeframe.minutes > 0
    ) {
      setErrorFrame("");
    }
  };

  const handleTimeIntervalChange = (field, value) => {
    const updatedTimeInterval = {
      ...timeInterval,
      [field]: parseInt(value) || 0,
    };
    const updatedIntervalInSeconds =
      updatedTimeInterval.hours * 3600 +
      updatedTimeInterval.minutes * 60 +
      updatedTimeInterval.seconds;
    console.log("Calculated interval in seconds:", updatedIntervalInSeconds);

    setTimeInterval(updatedTimeInterval);
    setIntervalInSeconds(updatedIntervalInSeconds);
    if (
      updatedTimeInterval.hours > 0 ||
      updatedTimeInterval.minutes > 0 ||
      updatedTimeInterval.seconds > 0
    ) {
      setErrorInterval("");
    }
  };

  return {
    timeframe,
    setTimeframe,
    timeframeInSeconds,
    setTimeframeInSeconds,
    timeInterval,
    setTimeInterval,
    intervalInSeconds,
    setIntervalInSeconds,
    errorFrame,
    setErrorFrame,
    errorInterval,
    setErrorInterval,
    errorFrameRef,
    errorIntervalRef,
    handleTimeframeChange,
    handleTimeIntervalChange,
  };
}
