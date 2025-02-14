import React, { useState, useEffect } from 'react';
import { RiPauseMiniFill, RiPlayMiniFill, RiStopCircleLine } from "react-icons/ri";
import '../../index.css';

interface TimerProps {
  startTime: Date | null;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  isPaused: boolean;
  isSessionActive: boolean;
}

const Timer: React.FC<TimerProps> = ({ startTime, onPause, onResume, onReset, isPaused, isSessionActive }) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;  // Initialize intervalId to null

    if (startTime && !isPaused) {
      console.log("Timer: Starting interval with startTime:", startTime);
      intervalId = setInterval(() => {
        setElapsedTime(Date.now() - startTime.getTime());
      }, 1000);
    } else {
      console.log("Timer: Clearing interval");
      if (intervalId) {
        clearInterval(intervalId);
      }
    }

    return () => {
      console.log("Timer: Component unmounting, clearing interval");
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [startTime, isPaused]);

  const formatTime = (ms: number): string => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)));

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center rounded-full bg-gray-100 p-2">
      {isSessionActive && !isPaused ? (
        <>
          <div
            className="tag-button"
          >
            <div className="radar-circle"></div>
          </div>
          <span style={{ fontFamily: 'Lato, sans-serif' }}>{formatTime(elapsedTime)}</span>
          <button onClick={onPause} className="p-1 rounded-full hover:bg-gray-200">
            <RiPauseMiniFill className="w-4 h-4" />
          </button>
        </>
      ) : isSessionActive && isPaused ? (
        <>
          <button
            onClick={onReset}
            className="p-1 rounded-full hover:bg-red-200 text-red-500 bg-transparent"
            title="End Session"
          >
            <RiStopCircleLine className="w-4 h-4" />
          </button>
          <span style={{ fontFamily: 'Lato, sans-serif' }}>{formatTime(elapsedTime)}</span>
          <button
            onClick={onResume}
            className="p-1 rounded-full hover:bg-gray-200"
          >
            <RiPlayMiniFill className="w-4 h-4" />
          </button>
        </>
      ) : null}
    </div>
  );
}

export default Timer;
