import { ActionButton } from './ActionButton';
import { Mic } from 'lucide-react';

interface DictateButtonProps {
  isTranscribing: boolean;
  onStart: () => void;
  onStop: () => void;
  fullWidth?: boolean;
}

export function DictateButton({ isTranscribing, onStart, onStop, fullWidth = true }: DictateButtonProps) {
  const dictateIcon = isTranscribing ? (
    <i className="bg-sky-700 rounded-full w-4 h-4 inline-block animate-pulse"></i>
  ) : (
    <Mic size={20} />
  );

  return (
    <ActionButton
      onClick={isTranscribing ? onStop : onStart}
      icon={dictateIcon}
      text={isTranscribing ? 'STOP' : 'DICTATE'}
      color="blue"
      isActive={isTranscribing}
      fullWidth={fullWidth}
    />
  );
}
