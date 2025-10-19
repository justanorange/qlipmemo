import { ActionButton } from './ActionButton';

interface RecordButtonProps {
  isRecording: boolean;
  onStart: () => void;
  onStop: () => void;
  fullWidth?: boolean;
}

export function RecordButton({ isRecording, onStart, onStop, fullWidth = true }: RecordButtonProps) {
  const recordIcon = isRecording ? (
    <i className="bg-red-700 rounded-full w-4 h-4 inline-block animate-pulse"></i>
  ) : (
    <i className="bg-red-600 rounded-full w-4 h-4 inline-block"></i>
  );

  return (
    <ActionButton
      onClick={isRecording ? onStop : onStart}
      icon={recordIcon}
      text={isRecording ? 'STOP' : 'RECORD'}
      color="red"
      isActive={isRecording}
      fullWidth={fullWidth}
    />
  );
}
