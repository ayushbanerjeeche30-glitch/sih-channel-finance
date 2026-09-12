"use client";

import React, { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Sparkles, AlertCircle, ArrowRight, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VoiceInputProps {
  languageCode?: string;
  onExpressSubmit: (transcript: string) => void;
}

export default function VoiceInput({ languageCode = "en-IN", onExpressSubmit }: VoiceInputProps) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");
  const recognitionRef = useRef<any>(null);
  // Tracks whether the user *wants* to be listening, so we can tell the
  // difference between "user clicked stop" and "Chrome silently cut us off".
  const wantsListeningRef = useRef(false);

  useEffect(() => {
    return () => {
      wantsListeningRef.current = false;
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  const createRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("❌ Speech API blocked. Use Google Chrome.");
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = languageCode;
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event: any) => {
      let currentText = "";
      // Rebuild from scratch every time — never append to old state,
      // that's what causes the "I amI am aI am a..." stutter.
      for (let i = 0; i < event.results.length; i++) {
        const segment = event.results[i][0].transcript.trim();
        if (!segment) continue;
        currentText += (currentText ? " " : "") + segment;
      }
      setTranscript(currentText);
    };

    recognition.onerror = (e: any) => {
      if (e.error === 'no-speech' || e.error === 'aborted') return;
      wantsListeningRef.current = false;
      setListening(false);
      setError(`❌ Mic Error: ${e.error}`);
    };

    recognition.onend = () => {
      // Chrome fires onend on its own after a pause even with continuous=true.
      // If the user never clicked "Stop", silently restart instead of just dying.
      if (wantsListeningRef.current) {
        try {
          recognition.start();
        } catch {
          setListening(false);
        }
      } else {
        setListening(false);
      }
    };

    return recognition;
  };

  const startListening = () => {
    setError("");
    setTranscript("");
    wantsListeningRef.current = true;

    try {
      const recognition = createRecognition();
      if (!recognition) return;
      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      setError(`❌ Crash: ${err.message}`);
    }
  };

  const stopListening = () => {
    wantsListeningRef.current = false;
    recognitionRef.current?.stop();
    setListening(false);
  };

  const submitTranscript = () => {
    if (transcript.trim().length > 2) {
      onExpressSubmit(transcript.trim());
    } else {
      setError("❌ Transcript is empty. Please type or record.");
    }
  };

  return (
    <div className="flex flex-col justify-between h-full bg-gradient-to-br from-indigo-50/70 via-blue-50/50 to-slate-50 border-2 border-dashed border-blue-300 rounded-2xl p-6 text-center">
      <div>
        <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
          <Sparkles size={22} />
        </div>
        <h4 className="font-bold text-lg text-slate-900 mb-1">Instant AI Voice Match</h4>
      </div>

      <div className="space-y-4 my-4">
        <Button
          type="button"
          onClick={listening ? stopListening : startListening}
          className={`w-full py-7 rounded-xl font-semibold shadow-md text-white transition-all ${
            listening ? 'bg-red-600 hover:bg-red-700 animate-pulse' : 'bg-[#1e3a8a] hover:bg-blue-800'
          }`}
        >
          {listening ? (
            <><MicOff size={20} className="mr-2" /> Stop Recording</>
          ) : (
            <><Mic size={20} className="mr-2 text-blue-200" /> Tap to Record</>
          )}
        </Button>

        {/* STAGE-SAFE EDITABLE TRANSCRIPT BOX */}
        <div className="relative">
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Your spoken words will appear here. You can also type to edit them..."
            className="w-full p-3 pr-8 bg-white border border-blue-200 rounded-xl text-left text-sm text-slate-800 shadow-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          />
          <Edit3 size={14} className="absolute top-3 right-3 text-slate-400 pointer-events-none" />
        </div>

        {transcript && !listening && (
          <Button
            type="button"
            onClick={submitTranscript}
            className="w-full py-6 rounded-xl font-bold shadow-md bg-green-600 hover:bg-green-700 text-white"
          >
            Find Scheme Now <ArrowRight size={18} className="ml-2" />
          </Button>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg text-left flex gap-2">
            <AlertCircle size={14} className="shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
