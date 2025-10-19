interface StatsProps {
  charCount: number;
  storageSize: number;
  lastSaved: Date | null;
};

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

export function Stats({ charCount = 0, storageSize = 0, lastSaved }: StatsProps) {
  return (
    <div className="px-6 pb-2 mb-0 text-xs text-zinc-500 dark:text-zinc-400 flex justify-between">
      <span>{charCount} symbols · {formatBytes(storageSize)}</span>
      {lastSaved && (
        <span>Saved: {new Date(lastSaved).toLocaleTimeString()}</span>
      )}
    </div>
  );
}
