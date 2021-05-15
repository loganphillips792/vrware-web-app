import { useState, useEffect } from "react";

// https://codesandbox.io/s/y0q4rkn95z?file=/src/customHooks.js combined with https://medium.com/@peterjd42/building-timers-in-react-stopwatch-and-countdown-bc06486560a2
export const useStopWatch = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval;
      
      if (isRunning) {
        const timerStart = Date.now() - elapsedTime;
        interval = setInterval(
          () => setElapsedTime(Date.now() - timerStart),
          10
        );
      }
      return () => clearInterval(interval);
  }, [isRunning])

  const handleReset = () => {
    setIsRunning(false);
    setElapsedTime(0);
  };

  return {
    elapsedTime: elapsedTime,
    resetTimer: () => handleReset(),
    startTimer: () => setIsRunning(true),
    stopTimer: () => setIsRunning(false),
    isRunning
  };
};

export default useStopWatch
