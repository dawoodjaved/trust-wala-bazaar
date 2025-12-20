"use client";

import { useState, useEffect } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function VoiceSearchButton() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setTranscript(transcript);
        setIsListening(false);
        // Navigate to search with transcript
        if (transcript) {
          window.location.href = `/search?q=${encodeURIComponent(transcript)}`;
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognition);
    }
  }, []);

  const toggleListening = () => {
    if (!recognition) {
      alert("Voice search is not supported in your browser. Please use Chrome or Edge.");
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggleListening}
      className={cn(
        "h-8 w-8 rounded-lg",
        isListening && "bg-blue-100 text-blue-600"
      )}
      aria-label="Voice search"
    >
      {isListening ? (
        <MicOff className="h-4 w-4" strokeWidth={2} />
      ) : (
        <Mic className="h-4 w-4" strokeWidth={2} />
      )}
    </Button>
  );
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

