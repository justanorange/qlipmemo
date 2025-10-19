interface TimerProps {
  recordingTime: number;
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export function Timer({ recordingTime = 0 }: TimerProps) {
  return (
    <div className="
      text-black dark:text-white/70 font-mono text-8xl font-normal text-center
      py-5 border-b-2 border-zinc-300 dark:border-zinc-800">
      {formatTime(recordingTime)}
    </div>
  );
}
