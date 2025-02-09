import React, { useState, useEffect } from 'react';
import { Play, Pause, StopCircle } from 'lucide-react';
import './Timer.css';

interface TimerProps {
  startTime: Date | null;
  onPause: () => void;
  onResume: () => void;
  isPaused: boolean;
  isSessionActive: boolean;
}

const Timer: React.FC<TimerProps> = ({ startTime, onPause, onResume, isPaused, isSessionActive }) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (startTime && !isPaused) {
      console.log("Timer: Starting interval with startTime:", startTime);
      intervalId = setInterval(() => {
        setElapsedTime(Date.now() - startTime.getTime());
      }, 1000);
    } else {
      console.log("Timer: Clearing interval");
    }

    return () => {
      console.log("Timer: Component unmounting, clearing interval");
      clearInterval(intervalId);
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
      {isSessionActive && isPaused ? (
        <button
          onClick={onPause}
          className="p-1 rounded-full hover:bg-red-200 bg-red-500 text-white"
          title="End Session"
        >
          <StopCircle className="w-4 h-4" />
        </button>
      ) : (
        <div
          className="tag-button"
        >
          <div className="radar-circle"></div>
        </div>
      )}
      <span>{formatTime(elapsedTime)}</span>
      <button onClick={isPaused ? onResume : onPause} className="p-1 rounded-full hover:bg-gray-200">
        {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
      </button>
    </div>
  );
}

export default Timer;
