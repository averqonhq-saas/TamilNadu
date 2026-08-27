"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, RefreshCw, Check, AlertCircle } from "lucide-react";

// Web Speech API — not in TypeScript's standard lib
// We use a generic type reference to avoid the error
type SpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onstart: (() => void) | null;
  onresult: ((event: Event) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
};

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  onFallback: () => void;
}

type VoiceState = "idle" | "listening" | "transcribing" | "done" | "error" | "unsupported";

export default function VoiceInput({ onTranscript, onFallback }: VoiceInputProps) {
  const [state, setState] = useState<VoiceState>("idle");
  const [transcript, setTranscript] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    // Check browser support — use window directly with 'any' cast to avoid TS lib issues
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;
    const SpeechRecognitionAPI = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setState("unsupported");
      return;
    }

    const recognition: SpeechRecognitionInstance = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "ta-IN"; // Tamil first, with English fallback
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setState("listening");
    };

    recognition.onresult = (event: Event) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const speechEvent = event as any;
      let interimText = "";
      let finalText = "";

      for (let i = speechEvent.resultIndex; i < speechEvent.results.length; i++) {
        const result = speechEvent.results[i];
        if (result.isFinal) {
          finalText += result[0].transcript;
        } else {
          interimText += result[0].transcript;
        }
      }

      setTranscript(finalText || interimText);
      if (finalText) {
        setState("done");
      }
    };

    recognition.onerror = (event: Event) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errEvent = event as any;
      if (errEvent.error === "no-speech") {
        setErrorMsg("We didn't hear anything. Please try again.");
      } else if (errEvent.error === "not-allowed") {
        setErrorMsg("Microphone access was denied. Please allow microphone access and try again.");
      } else {
        setErrorMsg("Something went wrong with voice input. Please type instead.");
      }
      setState("error");
    };

    recognition.onend = () => {
      setState((prev) => {
        if (prev === "listening") return "transcribing";
        return prev;
      });
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    setTranscript("");
    setErrorMsg("");
    setState("idle");

    if (!recognitionRef.current) return;

    try {
      recognitionRef.current.start();
    } catch {
      setErrorMsg("Could not start voice input. Please try again.");
      setState("error");
    }
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setState("transcribing");
  };

  const handleAccept = () => {
    if (transcript) {
      onTranscript(transcript);
    }
  };

  const handleRetry = () => {
    setTranscript("");
    setState("idle");
  };

  // Unsupported browser
  if (state === "unsupported") {
    return (
      <div className="bg-[#fffbeb] border border-[#fde68a] rounded-2xl p-6 text-center">
        <AlertCircle size={24} className="text-[#f59e0b] mx-auto mb-3" />
        <p className="font-semibold text-[#0a0e1a] mb-2">
          Voice input isn&apos;t available in this browser.
        </p>
        <p className="text-[#64748b] text-[14px] mb-4">
          Try Chrome or Safari on mobile for voice input.
        </p>
        <button onClick={onFallback} className="btn btn-primary">
          Type instead
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      {/* State: idle or listening */}
      {(state === "idle" || state === "listening") && (
        <>
          {/* Mic button */}
          <div className="relative flex items-center justify-center">
            {/* Pulse rings */}
            {state === "listening" && (
              <>
                <div className="absolute w-28 h-28 rounded-full border-2 border-[#e85d26] animate-ping opacity-20" />
                <div
                  className="absolute w-36 h-36 rounded-full border border-[#e85d26] animate-ping opacity-10"
                  style={{ animationDelay: "0.3s" }}
                />
              </>
            )}

            <button
              onClick={state === "listening" ? stopListening : startListening}
              className="relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg"
              style={{
                backgroundColor: state === "listening" ? "#e85d26" : "#0a0e1a",
              }}
              aria-label={state === "listening" ? "Stop recording" : "Start recording"}
            >
              {state === "listening" ? (
                <MicOff size={28} className="text-white" />
              ) : (
                <Mic size={28} className="text-white" />
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="font-jakarta font-semibold text-[18px] text-[#0a0e1a] mb-2">
              {state === "listening" ? "Listening..." : "Tap to speak"}
            </p>
            <p className="text-[14px] text-[#64748b]">
              {state === "listening"
                ? "Speak in Tamil, English, or Tanglish. Tap the mic when done."
                : "We'll convert your voice to text."}
            </p>
          </div>

          {/* Live transcript during listening */}
          {state === "listening" && transcript && (
            <div className="w-full bg-[#f8f7f4] border border-[#e2e8f0] rounded-xl p-4">
              <p className="text-[14px] text-[#64748b] italic">{transcript}</p>
            </div>
          )}
        </>
      )}

      {/* State: transcribing */}
      {state === "transcribing" && (
        <div className="text-center">
          <div
            className="w-12 h-12 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{ border: "3px solid #e85d26", borderTopColor: "transparent" }}
          />
          <p className="font-semibold text-[#0a0e1a]">Transcribing your idea...</p>
        </div>
      )}

      {/* State: done */}
      {state === "done" && transcript && (
        <div className="w-full space-y-4">
          <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-4">
            <p className="text-[12px] text-[#22c55e] font-semibold mb-2 uppercase tracking-wider">
              Here&apos;s what we heard:
            </p>
            <p className="text-[15px] text-[#0a0e1a] leading-relaxed">{transcript}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleRetry}
              className="btn btn-secondary flex items-center gap-2 flex-1 justify-center"
            >
              <RefreshCw size={15} />
              Try again
            </button>
            <button
              onClick={handleAccept}
              className="btn btn-primary flex items-center gap-2 flex-1 justify-center"
            >
              <Check size={15} />
              Looks good
            </button>
          </div>

          <button
            onClick={onFallback}
            className="w-full text-[13px] text-[#94a3b8] hover:text-[#64748b] text-center"
          >
            Edit as text instead
          </button>
        </div>
      )}

      {/* State: error */}
      {state === "error" && (
        <div className="w-full space-y-4 text-center">
          <div className="bg-[#fef2f2] border border-[#fecaca] rounded-xl p-4">
            <AlertCircle size={20} className="text-[#ef4444] mx-auto mb-2" />
            <p className="text-[14px] text-[#0a0e1a]">{errorMsg}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleRetry} className="btn btn-secondary flex-1">
              Try again
            </button>
            <button onClick={onFallback} className="btn btn-primary flex-1">
              Type instead
            </button>
          </div>
        </div>
      )}

      {/* Always show fallback option */}
      {state === "idle" && (
        <button
          onClick={onFallback}
          className="text-[13px] text-[#94a3b8] hover:text-[#64748b] transition-colors"
        >
          Prefer to type? Switch to text input →
        </button>
      )}
    </div>
  );
}
