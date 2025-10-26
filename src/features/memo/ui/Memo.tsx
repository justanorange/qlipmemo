import { useEffect } from 'react';
import { useVoiceInput } from '@features/memo/hooks/useVoiceInput';
import { useLocalStorage, useIndexedDB } from '@shared/hooks/';
import { useUIStore } from '@/shared/lib/stores/uiStore';
import { CapabilitesCheck } from './CapabilitiesCheck';
import { Errors } from './Errors';
import { Timer } from './Timer';
import { AudioPlayer } from './AudioPlayer';
import { Stats } from './Stats';
import { ExportButton } from './ExportButton';
import { InputActions } from './Buttons';

export const Memo = () => {
  const [input, setInput, clearInput] = useLocalStorage('memo_text', '');
  const [lastSaved, setLastSaved, clearLastSaved] = useLocalStorage('memo_date', '');

  const {
    canRecordAndTranscribe,
    isCheckingCapabilities,
    isRecording,
    isTranscribing,
    audioUrl: recordedAudioUrl,
    audioBlob,
    newTranscript,
    interimTranscript,
    error,
    recordingTime,
    startRecording,
    stopRecording,
    startTranscription,
    stopTranscription,
    startBoth,
    stopBoth,
    clearAll,
    clearNewTranscript,
  } = useVoiceInput();

  const {
    audioUrl: savedAudioUrl,
    saveAudio,
    clearAudio,
    isLoading: audioLoading,
  } = useIndexedDB();

  const startLogoSpin = useUIStore((state) => state.startLogoSpin);
  const stopLogoSpin = useUIStore((state) => state.stopLogoSpin);

  // Sync only NEW transcript with input (incremental)
  useEffect(() => {
    if (newTranscript) {
      setInput(newTranscript);
      clearNewTranscript(); // Mark as consumed
      setLastSaved(new Date() + '');
    }
  }, [newTranscript, setInput, clearNewTranscript]);

  // Save audio on recording stop
  useEffect(() => {
    if (audioBlob && !isRecording) {
      saveAudio(audioBlob);
    }
  }, [audioBlob, isRecording, saveAudio]);

  // Logo spin on activity
  useEffect(() => {
    if (isRecording || isTranscribing) {
      startLogoSpin();
    } else {
      stopLogoSpin();
    }
  }, [isRecording, isTranscribing, startLogoSpin, stopLogoSpin]);

  // Clear everything
  const handleClearAll = () => {
    clearAll();
    clearInput();
    clearAudio();
    clearLastSaved();
    // setLastSaved(null);
  };

  // Export memo
  const handleExport = () => {
    const data = {
      text: input,
      timestamp: new Date().toISOString(),
      hasAudio: !!(recordedAudioUrl || savedAudioUrl),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `memo_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const charCount = input.length;
  const storageSize = new Blob([input]).size;
  const displayAudioUrl = recordedAudioUrl || savedAudioUrl;
  const isActive = isRecording || isTranscribing;

  if (isCheckingCapabilities) {
    {/* Showing splash screen while checking */}
    return <CapabilitesCheck />
  }

  return (
    <div className="
      flex flex-col items-stretch
      overflow-hidden mx-6 mb-6 space-y-5
      bg-white/50 dark:bg-zinc-900 rounded-2xl shadow-lg backdrop-blur-sm
    ">
      {/* Errors */}
      <Errors error={error} />
      
      {/* Timer */}
      <Timer recordingTime={recordingTime} />

      {/* Audio player */}
      <AudioPlayer displayAudioUrl={displayAudioUrl} audioLoading={audioLoading} />

      {/* Text area / transcription preview */}
      <div className="
        relative
        flex-1 mx-5 p-6
        flex justify-items-stretch
        bg-zinc-50 dark:bg-zinc-800 rounded-2xl
      ">
        {/* Transcript */}
        {isActive && interimTranscript && (
          <div className="text-sm tracking-tight font-normal text-yellow-500 italic">
            "{interimTranscript}"
          </div>
        )}

        {/* "Keep talking" label */}
        {isActive && !interimTranscript && (
          <div className="text-sm tracking-tight font-normal text-yellow-500">
            Keep talking. {isRecording ? 'Recording' : 'Transcription'} in progress
          </div>
        )}

        {/* Textarea */}
        {!isActive && (
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Start recording or type here..."
            className="w-full mb-4 resize-none focus:outline-none bg-transparent"
          />
        )}

        {/* Memo export button */}
        {input && <ExportButton handleExport={handleExport} />}
      </div>

      {/* Stats */}
      {charCount !== 0 && (
        <Stats
          charCount={charCount}
          storageSize={storageSize}
          lastSaved={lastSaved}
        />
      )}

      {/* Controls (Erase, Record, Dictate) */}
      <InputActions
        canRecordAndTranscribe={canRecordAndTranscribe}
        isActive={isActive}
        isRecording={isRecording}
        isTranscribing={isTranscribing}
        hasContent={!!(displayAudioUrl || input)}
        onClearAll={handleClearAll}
        onStartBoth={startBoth}
        onStopBoth={stopBoth}
        onStartRecording={startRecording}
        onStopRecording={stopRecording}
        onStartTranscription={startTranscription}
        onStopTranscription={stopTranscription}
      />
    </div>
  );
};
