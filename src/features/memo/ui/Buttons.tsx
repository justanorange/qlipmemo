import { RecordButton } from './RecordButton';
import { DictateButton } from './DictateButton';
import { EraseButton } from './EraseButton';

interface InputActionsProps {
  // States
  canRecordAndTranscribe: boolean;
  isActive: boolean;
  isRecording: boolean;
  isTranscribing: boolean;
  hasContent: boolean;
  
  // Handlers
  onClearAll: () => void;
  onStartBoth: () => void;
  onStopBoth: () => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onStartTranscription: () => void;
  onStopTranscription: () => void;
}

export function InputActions({
  canRecordAndTranscribe,
  isActive,
  isRecording,
  isTranscribing,
  hasContent,
  onClearAll,
  onStartBoth,
  onStopBoth,
  onStartRecording,
  onStopRecording,
  onStartTranscription,
  onStopTranscription
}: InputActionsProps) {
  // Combined mode - one button for recording and transcribing
  if (canRecordAndTranscribe) {
    return (
      <div className="w-full flex">
        {hasContent && !isActive && (
          <EraseButton 
            onClick={onClearAll} 
            showText={true}
            fullWidth={false}
          />
        )}
        
        {!isActive ? (
          <RecordButton
            isRecording={false}
            onStart={onStartBoth}
            onStop={onStopBoth}
            fullWidth={!hasContent}
          />
        ) : (
          <RecordButton
            isRecording={true}
            onStart={onStartBoth}
            onStop={onStopBoth}
            fullWidth={true}
          />
        )}
      </div>
    );
  }

  // Separate mode - two buttons - Record and Dictate
  return (
    <div className="w-full flex">
      {hasContent && !isRecording && !isTranscribing && (
        <EraseButton 
          onClick={onClearAll} 
          showText={false}
          fullWidth={false}
        />
      )}

      {isRecording ? (
        <RecordButton
          isRecording={true}
          onStart={onStartRecording}
          onStop={onStopRecording}
          fullWidth={true}
        />
      ) : isTranscribing ? (
        <DictateButton
          isTranscribing={true}
          onStart={onStartTranscription}
          onStop={onStopTranscription}
          fullWidth={true}
        />
      ) : (
        <>
          <RecordButton
            isRecording={false}
            onStart={onStartRecording}
            onStop={onStopRecording}
            fullWidth={true}
          />
          <DictateButton
            isTranscribing={false}
            onStart={onStartTranscription}
            onStop={onStopTranscription}
            fullWidth={true}
          />
        </>
      )}
    </div>
  );
}
