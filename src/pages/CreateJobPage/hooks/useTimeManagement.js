import { useRef, useState } from "react";

export function useTimeManagement() {
  const [timeframe, setTimeframe] = useState({ years: 0, months: 0, days: 0 });
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
      updatedTimeframe.years * 31536000 +
      updatedTimeframe.months * 2592000 +
      updatedTimeframe.days * 86400;
    console.log("Calculated timeframe in seconds:", updatedTimeframeInSeconds);

    setTimeframe(updatedTimeframe);
    setTimeframeInSeconds(updatedTimeframeInSeconds);
    if (
      updatedTimeframe.years > 0 ||
      updatedTimeframe.months > 0 ||
      updatedTimeframe.days > 0
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
