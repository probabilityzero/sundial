import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, StopCircle } from 'lucide-react';
import './Timer.css';
import DimensionPopover from './DimensionPopover';

interface TimerProps {
  startTime: Date | null;
  onPause: () => void;
  onResume: () => void;
  isPaused: boolean;
  isSessionActive: boolean;
}

const Timer: React.FC<TimerProps> = ({ startTime, onPause, onResume, isPaused, isSessionActive }) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showDimensionPopover, setShowDimensionPopover] = useState(false);
  const timerRef = useRef<HTMLDivElement>(null);

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

  const handleTagClick = (e: any) => {
    setShowDimensionPopover(!showDimensionPopover);
  };

  return (
    <div className="flex items-center space-x-2" ref={timerRef}>
      <span>{formatTime(elapsedTime)}</span>
      <button onClick={isPaused ? onResume : onPause} className="p-1 rounded-full hover:bg-gray-200">
        {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
      </button>
      {isSessionActive && isPaused ? (
        <button
          onClick={onPause}
          className="p-1 rounded-full hover:bg-red-200 bg-red-500 text-white"
          title="End Session"
        >
          <StopCircle className="w-4 h-4" />
        </button>
      ) : (
        <div className="relative">
          <button
            onClick={handleTagClick}
            className="tag-button"
          >
            <div className="radar-circle"></div>
          </button>
          {showDimensionPopover && <DimensionPopover />}
        </div>
      )}
    </div>
  );
};

export default Timer;
