import { useState } from "react";

export function useTimeManagement() {
  const [timeframes, setTimeframes] = useState({
    1: { years: 0, months: 0, days: 0 },
    2: { years: 0, months: 0, days: 0 },
    3: { years: 0, months: 0, days: 0 },
  });
  
  const [timeframesInSeconds, setTimeframesInSeconds] = useState({
    1: 0,
    2: 0,
    3: 0,
  });
  
  const [timeInterval, setTimeInterval] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [intervalInSeconds, setIntervalInSeconds] = useState(0);

  const handleTimeframeChange = (jobType, field, value) => {
    setTimeframes((prev) => {
      const updatedTimeframe = {
        ...prev[jobType],
        [field]: parseInt(value) || 0,
      };

      const updatedTimeframeInSeconds =
        updatedTimeframe.years * 31536000 +
        updatedTimeframe.months * 2592000 +
        updatedTimeframe.days * 86400;

      return {
        ...prev,
        [jobType]: updatedTimeframe,
      };
    });

    setTimeframesInSeconds((prev) => ({
      ...prev,
      [jobType]:
        (parseInt(value) || 0) * (field === "years" ? 31536000 : field === "months" ? 2592000 : 86400),
    }));
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
  };

  return {
    timeframes,
    timeframesInSeconds,
    timeInterval,
    intervalInSeconds,
    handleTimeframeChange,
    handleTimeIntervalChange,
  };
}
