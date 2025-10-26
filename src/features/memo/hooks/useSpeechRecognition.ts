import { useState, useRef, useCallback, useEffect } from 'react';

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  newTranscript: string;
  error: string;
  
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  clearNewTranscript: () => void;
  
  hasSpeechSupport: boolean;
}

export const useSpeechRecognition = (): UseSpeechRecognitionReturn => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [newTranscript, setNewTranscript] = useState('');
  const [error, setError] = useState('');

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const accumulatedTranscriptRef = useRef<string>('');

  const hasSpeechSupport = ('SpeechRecognition' in window) || ('webkitSpeechRecognition' in window);

  useEffect(() => {
    accumulatedTranscriptRef.current = transcript;
  }, [transcript]);

  const startListening = useCallback(() => {
    if (!hasSpeechSupport) {
      setError('Speech recognition not supported');
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore abort errors
        }
        recognitionRef.current = null;
      }

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognitionRef.current = recognition;
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'ru-RU';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        // Desktop: resultIndex always 0, results[0] contains progressive text
        // Mobile: resultIndex increments, results is full history array
        
        // Strategy: only process the result at resultIndex (the changed one)
        const result = event.results[event.resultIndex];
        if (!result) return;

        const transcriptPart = result[0].transcript;
        const isFinal = result.isFinal;

        if (isFinal) {
          // Final result - accumulate in newTranscript for UI consumption
          setNewTranscript(prev => prev + transcriptPart + ' ');
          setInterimTranscript('');
        } else {
          // Interim result - show as preview
          setInterimTranscript(transcriptPart);
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setError('Microphone access denied');
          setIsListening(false);
        }
        if (event.error === 'aborted') {
          setIsListening(false);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };

      recognition.start();
      setIsListening(true);
      setError('');
    } catch (err) {
      setError(`Recognition error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsListening(false);
    }
  }, [hasSpeechSupport]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore stop errors
      }
    }
    
    setInterimTranscript('');
    setIsListening(false);
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setNewTranscript('');
    setInterimTranscript('');
    setError('');
    accumulatedTranscriptRef.current = '';
  }, []);

  const clearNewTranscript = useCallback(() => {
    setNewTranscript('');
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    newTranscript,
    error,
    startListening,
    stopListening,
    resetTranscript,
    clearNewTranscript,
    hasSpeechSupport,
  };
};
