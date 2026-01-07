
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { encode, decode, decodeAudioData } from '../services/geminiService';

const Coach: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [transcripts, setTranscripts] = useState<string[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const outputNodeRef = useRef<GainNode | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);
  const sessionRef = useRef<any>(null);

  const startSession = async () => {
    setIsConnecting(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const inputContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    outputNodeRef.current = audioContextRef.current.createGain();
    outputNodeRef.current.connect(audioContextRef.current.destination);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const sessionPromise = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-12-2025',
      callbacks: {
        onopen: () => {
          setIsActive(true);
          setIsConnecting(false);
          const source = inputContext.createMediaStreamSource(stream);
          const processor = inputContext.createScriptProcessor(4096, 1, 1);
          processor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const int16 = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
            sessionPromise.then(s => s.sendRealtimeInput({
              media: { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' }
            }));
          };
          source.connect(processor);
          processor.connect(inputContext.destination);
        },
        onmessage: async (msg: LiveServerMessage) => {
          if (msg.serverContent?.outputTranscription) {
            setTranscripts(prev => [...prev, `Maestro: ${msg.serverContent?.outputTranscription?.text}`]);
          }
          if (msg.serverContent?.inputTranscription) {
            setTranscripts(prev => [...prev, `You: ${msg.serverContent?.inputTranscription?.text}`]);
          }
          
          const audioBase64 = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (audioBase64 && audioContextRef.current) {
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioContextRef.current.currentTime);
            const buffer = await decodeAudioData(decode(audioBase64), audioContextRef.current, 24000, 1);
            const source = audioContextRef.current.createBufferSource();
            source.buffer = buffer;
            source.connect(outputNodeRef.current!);
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += buffer.duration;
            sourcesRef.current.add(source);
            source.onended = () => sourcesRef.current.delete(source);
          }
        },
        onclose: () => setIsActive(false),
        onerror: () => setIsActive(false),
      },
      config: {
        responseModalities: [Modality.AUDIO],
        outputAudioTranscription: {},
        inputAudioTranscription: {},
        systemInstruction: "You are Maestro AI, a world-class music composition coach. Help the student with harmony, counterpoint, and orchestration in a friendly, encouraging voice.",
      }
    });

    sessionRef.current = await sessionPromise;
  };

  const stopSession = () => {
    if (sessionRef.current) sessionRef.current.close();
    setIsActive(false);
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col items-center gap-8 py-10 h-[calc(100vh-160px)]">
      <div className="relative">
        <div className={`w-48 h-48 rounded-full bg-indigo-100 flex items-center justify-center transition-all duration-500 ${isActive ? 'scale-110 shadow-[0_0_50px_rgba(99,102,241,0.3)]' : ''}`}>
          <div className={`w-32 h-32 rounded-full bg-white flex items-center justify-center shadow-lg transition-all duration-500 ${isActive ? 'bg-indigo-600 text-white' : 'text-indigo-400'}`}>
            <i className={`fa-solid fa-microphone-lines text-5xl ${isActive ? 'animate-pulse' : ''}`}></i>
          </div>
          {isActive && (
            <>
              <div className="absolute inset-0 rounded-full border-2 border-indigo-400 animate-ping opacity-20"></div>
              <div className="absolute -inset-4 rounded-full border border-indigo-200 animate-pulse opacity-40"></div>
            </>
          )}
        </div>
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-800">Maestro Voice Coach</h2>
        <p className="text-slate-500">Ask anything about theory, harmony, or production in real-time.</p>
      </div>

      <div className="flex-1 w-full bg-white rounded-3xl border border-slate-200 p-6 overflow-y-auto space-y-4 shadow-inner">
        {transcripts.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-4">
            <i className="fa-solid fa-comments text-4xl"></i>
            <p className="text-sm font-medium">Your conversation will appear here</p>
          </div>
        ) : (
          transcripts.map((t, i) => (
            <div key={i} className={`p-4 rounded-2xl max-w-[85%] ${t.startsWith('You:') ? 'bg-slate-100 ml-auto text-slate-700' : 'bg-indigo-50 text-indigo-800'}`}>
              <p className="text-sm leading-relaxed">{t}</p>
            </div>
          ))
        )}
      </div>

      <div className="w-full flex justify-center pb-6">
        {isActive ? (
          <button onClick={stopSession} className="bg-rose-500 text-white px-10 py-4 rounded-full font-bold shadow-xl shadow-rose-200 hover:bg-rose-600 transition-all flex items-center gap-3">
            <i className="fa-solid fa-stop"></i>
            END SESSION
          </button>
        ) : (
          <button 
            disabled={isConnecting}
            onClick={startSession} 
            className="bg-indigo-600 text-white px-10 py-4 rounded-full font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-3"
          >
            {isConnecting ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-play"></i>}
            START VOICE COACHING
          </button>
        )}
      </div>
    </div>
  );
};

export default Coach;
