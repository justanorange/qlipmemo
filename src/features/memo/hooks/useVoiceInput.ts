// features/memo/hooks/useVoiceInput.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAudioRecorder } from './useAudioRecorder';
import { useSpeechRecognition } from './useSpeechRecognition';

interface UseVoiceInputReturn {
  // Capabilities
  canRecordAndTranscribe: boolean;
  isCheckingCapabilities: boolean;
  
  // Recording state
  isRecording: boolean;
  audioBlob: Blob | null;
  audioUrl: string | null;
  recordingTime: number;
  
  // Transcription state
  isTranscribing: boolean;
  transcript: string;
  interimTranscript: string;
  newTranscript: string;
  
  // Errors
  error: string;
  
  // Methods
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  startTranscription: () => void;
  stopTranscription: () => void;
  startBoth: () => Promise<void>;
  stopBoth: () => void;
  clearAll: () => void;
  clearNewTranscript: () => void;
}

export const useVoiceInput = (): UseVoiceInputReturn => {
  const [canRecordAndTranscribe, setCanRecordAndTranscribe] = useState(false);
  const [isCheckingCapabilities, setIsCheckingCapabilities] = useState(true);
  const [combinedError, setCombinedError] = useState('');

  const recorder = useAudioRecorder();
  const speech = useSpeechRecognition();
  
  const capabilitiesCheckedRef = useRef(false);
  const testStreamRef = useRef<MediaStream | null>(null);

  // Enhanced capability check - test actual concurrent usage
  useEffect(() => {
    if (capabilitiesCheckedRef.current) return;
    
    const checkCapabilities = async () => {
      if (!navigator.mediaDevices || !speech.hasSpeechSupport) {
        setCanRecordAndTranscribe(false);
        setIsCheckingCapabilities(false);
        capabilitiesCheckedRef.current = true;
        return;
      }

      try {
        // Strategy: detect mobile browsers where concurrent access fails
        // Mobile browsers often report success but one blocks the other
        
        // Check 1: User agent hints (not reliable alone, but helps)
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // Check 2: Try to actually use MediaRecorder + SpeechRecognition
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        testStreamRef.current = stream;
        
        // Create MediaRecorder
        const mediaRecorder = new MediaRecorder(stream);
        let speechStarted = false;
        
        // Try to start SpeechRecognition while MediaRecorder is active
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.onerror = (event: any) => {
          if (event.error === 'audio-capture') {
            // Audio capture error means concurrent usage failed
            speechStarted = false;
          }
        };
        
        recognition.onstart = () => {
          speechStarted = true;
        };
        
        // Start MediaRecorder first
        mediaRecorder.start();
        
        // Wait a bit for MediaRecorder to initialize
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Try to start recognition
        try {
          recognition.start();
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (e) {
          speechStarted = false;
        }
        
        // Cleanup
        recognition.stop();
        mediaRecorder.stop();
        stream.getTracks().forEach(track => track.stop());
        testStreamRef.current = null;
        
        // Decision: if mobile OR speech didn't start, use separate mode
        const canUseConcurrent = !isMobile && speechStarted;
        setCanRecordAndTranscribe(canUseConcurrent);
        
      } catch (err) {
        // If anything fails, assume separate mode is safer
        setCanRecordAndTranscribe(false);
      } finally {
        setIsCheckingCapabilities(false);
        capabilitiesCheckedRef.current = true;
      }
    };

    checkCapabilities();
    
    return () => {
      if (testStreamRef.current) {
        testStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [speech.hasSpeechSupport]);

  // Unified error handling
  useEffect(() => {
    const errors = [recorder.error, speech.error].filter(Boolean);
    setCombinedError(errors.join('; '));
  }, [recorder.error, speech.error]);

  const startBoth = useCallback(async () => {
    if (!canRecordAndTranscribe) {
      setCombinedError('Device does not support simultaneous recording and transcription');
      return;
    }

    // Clear previous transcript before starting new session
    speech.resetTranscript();
    
    await recorder.startRecording();
    
    // Delay speech recognition start to avoid conflicts
    setTimeout(() => {
      speech.startListening();
    }, 500);
  }, [canRecordAndTranscribe, recorder, speech]);

  const stopBoth = useCallback(() => {
    recorder.stopRecording();
    speech.stopListening();
  }, [recorder, speech]);

  const startRecordingOnly = useCallback(async () => {
    speech.resetTranscript();
    await recorder.startRecording();
  }, [recorder, speech]);

  const startTranscriptionOnly = useCallback(() => {
    speech.resetTranscript();
    speech.startListening();
  }, [speech]);

  const clearAll = useCallback(() => {
    recorder.clearRecording();
    speech.resetTranscript();
    setCombinedError('');
  }, [recorder, speech]);

  return {
    // Capabilities
    canRecordAndTranscribe,
    isCheckingCapabilities,
    
    // Recording
    isRecording: recorder.isRecording,
    audioBlob: recorder.audioBlob,
    audioUrl: recorder.audioUrl,
    recordingTime: recorder.recordingTime,
    
    // Transcription
    isTranscribing: speech.isListening,
    transcript: speech.transcript,
    interimTranscript: speech.interimTranscript,
    newTranscript: speech.newTranscript,
    
    // Errors
    error: combinedError,
    
    // Methods
    startRecording: startRecordingOnly,
    stopRecording: recorder.stopRecording,
    startTranscription: startTranscriptionOnly,
    stopTranscription: speech.stopListening,
    startBoth,
    stopBoth,
    clearAll,
    clearNewTranscript: speech.clearNewTranscript,
  };
};