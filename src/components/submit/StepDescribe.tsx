"use client";

import { useState, useEffect } from "react";
import VoiceInput from "@/components/submit/VoiceInput";
import { Mic, Keyboard, Sparkles, MessageSquare, Lightbulb } from "lucide-react";

interface StepDescribeProps {
  description: string;
  solution: string;
  onChange: (description: string, solution: string) => void;
}

type Mode = "choose" | "voice" | "type";

export default function StepDescribe({ description, solution, onChange }: StepDescribeProps) {
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [mode, setMode] = useState<Mode>(description ? "type" : "choose");
  const [showSolution, setShowSolution] = useState(!!solution);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.enableVoiceInput !== undefined) {
          setVoiceEnabled(data.enableVoiceInput);
          if (!data.enableVoiceInput && !description) {
            setMode("type");
          }
        }
      })
      .catch(() => {});
  }, [description]);

  const handleVoiceTranscript = (text: string) => {
    onChange(description ? description + " " + text : text, solution);
    setMode("type");
  };

  return (
    <div>
      <div className="mb-7">
        <h2 className="font-jakarta font-extrabold text-[24px] sm:text-[28px] text-[#0a0e1a] mb-1.5">
          Want to add more details?
        </h2>
        <p className="text-[#64748b] text-[15px]">
          Optional: Speak your idea in Tamil or English, type it out, or skip directly.
        </p>
      </div>

      {/* Mode selector */}
      {mode === "choose" && !description && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setMode("voice")}
            className="flex flex-col items-center gap-4 p-8 rounded-3xl border-2 border-[#e2e8f0] bg-white hover:border-[#e85d26] hover:bg-[#fff8f5] transition-all duration-200 group text-center cursor-pointer shadow-xs hover:shadow-md"
            id="describe-voice-btn"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#fde8dc] text-[#e85d26] flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
              <Mic size={28} />
            </div>
            <div>
              <div className="font-jakarta font-bold text-[17px] text-[#0a0e1a] mb-1">
                🎙️ Speak Your Idea
              </div>
              <div className="text-[13px] text-[#e85d26] font-semibold font-tamil">
                தமிழில் பேசலாம்
              </div>
              <div className="text-[12px] text-[#64748b] mt-0.5">
                Tamil, English, or Tanglish
              </div>
            </div>
          </button>

          <button
            onClick={() => setMode("type")}
            className="flex flex-col items-center gap-4 p-8 rounded-3xl border-2 border-[#e2e8f0] bg-white hover:border-[#3b82f6] hover:bg-[#eff6ff] transition-all duration-200 group text-center cursor-pointer shadow-xs hover:shadow-md"
            id="describe-type-btn"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#eff6ff] text-[#3b82f6] flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
              <Keyboard size={28} />
            </div>
            <div>
              <div className="font-jakarta font-bold text-[17px] text-[#0a0e1a] mb-1">
                ⌨️ Type Instead
              </div>
              <div className="text-[13px] text-[#3b82f6] font-semibold">
                Write in your own words
              </div>
              <div className="text-[12px] text-[#64748b] mt-0.5">
                Bullet points or free paragraph
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Voice Mode Component */}
      {mode === "voice" && (
        <div className="bg-[#f8f7f4] rounded-3xl p-6 border border-[#e2e8f0] mb-6">
          <VoiceInput
            onTranscript={handleVoiceTranscript}
            onFallback={() => setMode("type")}
          />
        </div>
      )}

      {/* Type Mode */}
      {(mode === "type" || description) && (
        <div className="space-y-5">
          <div className="bg-[#f8f7f4] rounded-3xl p-6 border border-[#e2e8f0]">
            <label
              htmlFor="description"
              className="block text-[14px] font-bold text-[#0a0e1a] mb-2"
            >
              Tell us what happens today:{" "}
              <span className="text-[#94a3b8] font-normal">(optional)</span>
            </label>
            <textarea
              id="description"
              className="input textarea bg-white"
              placeholder="What happens today? Why is it difficult? How does it affect you, your family, or your community?"
              value={description}
              onChange={(e) => onChange(e.target.value, solution)}
              rows={4}
              maxLength={2000}
            />
            <div className="flex items-center justify-between mt-2">
              {voiceEnabled ? (
                <button
                  type="button"
                  onClick={() => setMode("voice")}
                  className="text-[12.5px] font-semibold text-[#e85d26] hover:underline flex items-center gap-1.5"
                >
                  <Mic size={14} />
                  <span>Switch to voice input in Tamil</span>
                </button>
              ) : <div />}
              <span className="text-[12px] text-[#94a3b8] font-mono">
                {description.length} / 2000
              </span>
            </div>
          </div>

          {/* Solution idea box */}
          {!showSolution ? (
            <button
              type="button"
              onClick={() => setShowSolution(true)}
              className="text-[14px] font-semibold text-[#64748b] hover:text-[#e85d26] border-2 border-dashed border-[#cbd5e1] hover:border-[#e85d26] rounded-2xl p-4.5 w-full text-left transition-colors flex items-center gap-2 bg-white"
            >
              <Lightbulb size={18} className="text-[#f59e0b]" />
              <span>+ Do you have a suggestion or idea for how software could solve this? (optional)</span>
            </button>
          ) : (
            <div className="bg-[#f8f7f4] rounded-3xl p-6 border border-[#e2e8f0] animate-fade-in">
              <label
                htmlFor="solution"
                className="block text-[14px] font-bold text-[#0a0e1a] mb-2"
              >
                How do you imagine technology helping?{" "}
                <span className="text-[#94a3b8] font-normal">(optional)</span>
              </label>
              <textarea
                id="solution"
                className="input textarea bg-white"
                placeholder="Maybe an app could display... / An automated SMS that... / A scanner tool that..."
                value={solution}
                onChange={(e) => onChange(description, e.target.value)}
                rows={3}
                maxLength={2000}
              />
              <p className="text-[12px] text-[#94a3b8] mt-1.5">
                You don't need technical skills — just share what product or feature you imagine.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Skip hint */}
      {mode === "choose" && !description && (
        <p className="text-center text-[13px] text-[#94a3b8] mt-6">
          ✦ You can skip this step — your theme and problem choice are already enough.
        </p>
      )}
    </div>
  );
}

