// src/utils/speech.ts
type SpeechCallback = (text: string) => void;

export const useSpeech = (onResult: SpeechCallback) => {
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    return {
      start: () => alert("Speech recognition not supported"),
      stop: () => {}
    };
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (e: any) => {
    const text = e.results[0][0].transcript;
    onResult(text);
  };

  return {
    start: () => recognition.start(),
    stop: () => recognition.stop()
  };
};
