
import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { generateInspirationVideo, editMusicImage, getMusicAdvice } from '../services/geminiService';

interface SongSection {
  id: string;
  type: string;
  label: string;
  duration: string;
  color: string;
}

const SECTION_TYPES = [
  { type: 'Intro', color: 'bg-slate-400' },
  { type: 'Verse', color: 'bg-blue-400' },
  { type: 'Pre-Chorus', color: 'bg-indigo-400' },
  { type: 'Chorus', color: 'bg-rose-500' },
  { type: 'Bridge', color: 'bg-amber-500' },
  { type: 'Solo', color: 'bg-purple-500' },
  { type: 'Outro', color: 'bg-slate-600' },
];

const TEMPLATES = {
  'Verse-Chorus': [
    { id: '1', type: 'Intro', label: 'Intro', duration: '8 bars', color: 'bg-slate-400' },
    { id: '2', type: 'Verse', label: 'Verse 1', duration: '16 bars', color: 'bg-blue-400' },
    { id: '3', type: 'Chorus', label: 'Chorus 1', duration: '8 bars', color: 'bg-rose-500' },
    { id: '4', type: 'Verse', label: 'Verse 2', duration: '16 bars', color: 'bg-blue-400' },
    { id: '5', type: 'Chorus', label: 'Chorus 2', duration: '8 bars', color: 'bg-rose-500' },
    { id: '6', type: 'Bridge', label: 'Bridge', duration: '8 bars', color: 'bg-amber-500' },
    { id: '7', type: 'Chorus', label: 'Final Chorus', duration: '16 bars', color: 'bg-rose-500' },
    { id: '8', type: 'Outro', label: 'Outro', duration: '8 bars', color: 'bg-slate-600' },
  ],
  'AABA': [
    { id: '1', type: 'Verse', label: 'A1', duration: '32 bars', color: 'bg-blue-400' },
    { id: '2', type: 'Verse', label: 'A2', duration: '32 bars', color: 'bg-blue-400' },
    { id: '3', type: 'Bridge', label: 'B (Middle Eight)', duration: '16 bars', color: 'bg-amber-500' },
    { id: '4', type: 'Verse', label: 'A3', duration: '32 bars', color: 'bg-blue-400' },
  ],
  'Custom': [
    { id: '1', type: 'Intro', label: 'New Section', duration: '4 bars', color: 'bg-slate-400' },
  ]
};

const AIStudio: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [mode, setMode] = useState<'video' | 'image' | 'architect'>('video');
  const [songStructure, setSongStructure] = useState<SongSection[]>(TEMPLATES['Verse-Chorus']);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const checkBilling = async () => {
    if (typeof window.aistudio === 'undefined') return true; 
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await window.aistudio.openSelectKey();
      return true;
    }
    return true;
  };

  const handleGenerateVideo = async () => {
    if (!prompt) return;
    try {
      setIsGenerating(true);
      setStatus('Composing cinematic visuals...');
      await checkBilling();
      const videoUrl = await generateInspirationVideo(prompt, originalImage || undefined);
      setGeneratedVideo(videoUrl);
      setStatus('Inspiration ready!');
    } catch (e: any) {
      setStatus(`Error: ${e.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEditImage = async () => {
    if (!originalImage || !prompt) return;
    try {
      setIsGenerating(true);
      setStatus('Retouching your vision...');
      const result = await editMusicImage(originalImage, prompt);
      if (result) setEditedImage(result);
      setStatus('Edits applied.');
    } catch (e: any) {
      setStatus(`Error: ${e.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const analyzeStructure = async () => {
    try {
      setIsGenerating(true);
      setStatus('Maestro is studying your arrangement...');
      const structureText = songStructure.map(s => `${s.label} (${s.type}) - ${s.duration}`).join(', ');
      const advice = await getMusicAdvice(`Analyze this song structure and provide creative suggestions for emotional impact and flow: ${structureText}`);
      setAiAnalysis(advice.text);
      setStatus('Analysis complete.');
    } catch (e: any) {
      setStatus(`Error: ${e.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const applyTemplate = (name: keyof typeof TEMPLATES) => {
    setSongStructure(TEMPLATES[name]);
  };

  const updateSection = (id: string, field: keyof SongSection, value: string) => {
    setSongStructure(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const addSection = () => {
    const newSection: SongSection = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'Verse',
      label: 'New Section',
      duration: '8 bars',
      color: 'bg-blue-400'
    };
    setSongStructure([...songStructure, newSection]);
  };

  const removeSection = (id: string) => {
    setSongStructure(prev => prev.filter(s => s.id !== id));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setOriginalImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <i className="fa-solid fa-sparkles text-9xl text-indigo-500"></i>
        </div>

        <div className="relative z-10">
          <div className="flex flex-wrap gap-4 mb-8 p-1 bg-slate-100 rounded-2xl w-fit">
            <button 
              onClick={() => setMode('video')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${mode === 'video' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
            >
              <i className="fa-solid fa-video mr-2"></i>Veo Video
            </button>
            <button 
              onClick={() => setMode('image')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${mode === 'image' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
            >
              <i className="fa-solid fa-image mr-2"></i>Image Edit
            </button>
            <button 
              onClick={() => setMode('architect')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${mode === 'architect' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
            >
              <i className="fa-solid fa-layer-group mr-2"></i>Song Architect
            </button>
          </div>

          {mode !== 'architect' ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Prompt your vision</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={mode === 'video' ? "A neon hologram of a jazz pianist in a rain-slicked 1940s alley..." : "Add a vintage sepia filter and musical notes floating in the air..."}
                  className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                />
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-12 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center gap-2 text-slate-500 hover:border-indigo-400 hover:text-indigo-600 transition-all"
                  >
                    <i className="fa-solid fa-upload"></i>
                    {originalImage ? 'Change Image' : 'Upload Start Image (Optional)'}
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                </div>
                <button
                  disabled={isGenerating || !prompt}
                  onClick={mode === 'video' ? handleGenerateVideo : handleEditImage}
                  className="bg-indigo-600 text-white px-10 py-3 rounded-2xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {isGenerating ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-wand-sparkles"></i>}
                  {mode === 'video' ? 'Animate with Veo' : 'Magic Edit'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-2">
                  {(Object.keys(TEMPLATES) as Array<keyof typeof TEMPLATES>).map(t => (
                    <button 
                      key={t}
                      onClick={() => applyTemplate(t)}
                      className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-lg hover:bg-slate-700 transition-colors"
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={analyzeStructure}
                  disabled={isGenerating}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
                >
                   {isGenerating ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-brain"></i>}
                   AI Analysis
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {songStructure.map((section, index) => (
                  <div key={section.id} className="group relative bg-slate-50 border border-slate-200 p-5 rounded-3xl hover:border-indigo-300 transition-all">
                    <div className={`w-full h-2 rounded-full mb-4 ${section.color}`}></div>
                    <div className="space-y-3">
                      <input 
                        type="text" 
                        value={section.label}
                        onChange={(e) => updateSection(section.id, 'label', e.target.value)}
                        className="w-full bg-transparent font-bold text-slate-800 focus:outline-none"
                      />
                      <div className="flex items-center justify-between">
                        <select 
                          value={section.type}
                          onChange={(e) => {
                            const newType = e.target.value;
                            const typeObj = SECTION_TYPES.find(t => t.type === newType);
                            updateSection(section.id, 'type', newType);
                            if (typeObj) updateSection(section.id, 'color', typeObj.color);
                          }}
                          className="bg-white border border-slate-200 text-[10px] font-bold px-2 py-1 rounded-md"
                        >
                          {SECTION_TYPES.map(t => <option key={t.type} value={t.type}>{t.type}</option>)}
                        </select>
                        <input 
                          type="text" 
                          value={section.duration}
                          onChange={(e) => updateSection(section.id, 'duration', e.target.value)}
                          className="w-20 bg-white border border-slate-200 text-[10px] text-center px-2 py-1 rounded-md font-medium"
                        />
                      </div>
                    </div>
                    <button 
                      onClick={() => removeSection(section.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-rose-100 text-rose-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs"
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                ))}
                <button 
                  onClick={addSection}
                  className="border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-2 p-5 text-slate-400 hover:border-indigo-400 hover:text-indigo-500 transition-all"
                >
                  <i className="fa-solid fa-plus text-xl"></i>
                  <span className="text-xs font-bold">Add Section</span>
                </button>
              </div>

              {aiAnalysis && (
                <div className="bg-indigo-50 border border-indigo-100 p-8 rounded-[2.5rem] animate-in zoom-in duration-500">
                  <div className="flex items-center gap-3 mb-4 text-indigo-700">
                    <i className="fa-solid fa-wand-magic-sparkles"></i>
                    <h4 className="font-bold">Maestro's Structural Advice</h4>
                  </div>
                  <div className="text-indigo-900 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                    {aiAnalysis}
                  </div>
                </div>
              )}
            </div>
          )}

          {status && (
            <p className="text-center mt-6 text-sm font-medium text-indigo-600 animate-pulse">
              {status}
            </p>
          )}
        </div>
      </div>

      {mode !== 'architect' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {originalImage && (
            <div className="bg-white p-4 rounded-3xl border border-slate-200">
              <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Source Image</p>
              <img src={originalImage} className="w-full aspect-video object-cover rounded-2xl" alt="Source" />
            </div>
          )}
          
          {mode === 'video' && generatedVideo && (
            <div className="bg-white p-4 rounded-3xl border border-slate-200 animate-in zoom-in duration-700">
              <p className="text-xs font-bold text-indigo-500 mb-2 uppercase tracking-widest">Veo Cinematic Result</p>
              <video controls src={generatedVideo} className="w-full aspect-video object-cover rounded-2xl shadow-lg" />
            </div>
          )}

          {mode === 'image' && editedImage && (
            <div className="bg-white p-4 rounded-3xl border border-slate-200 animate-in zoom-in duration-700">
              <p className="text-xs font-bold text-indigo-500 mb-2 uppercase tracking-widest">Gemini Edited Result</p>
              <img src={editedImage} className="w-full aspect-video object-cover rounded-2xl shadow-lg" alt="Edited" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIStudio;
