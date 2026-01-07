
import React, { useState, useEffect, useRef } from 'react';
import { COURSE_MODULES, GENRE_COLORS } from '../constants.ts';
import { Difficulty, Genre, Lesson, ChordData } from '../types.ts';

const NOTE_FREQUENCIES: Record<string, number> = {
  'C': 261.63, 'C#': 277.18, 'Db': 277.18,
  'D': 293.66, 'D#': 311.13, 'Eb': 311.13,
  'E': 329.63,
  'F': 349.23, 'F#': 369.99, 'Gb': 369.99,
  'G': 392.00, 'G#': 415.30, 'Ab': 415.30,
  'A': 440.00, 'A#': 466.16, 'Bb': 466.16,
  'B': 493.88
};

const PIANO_KEYS = [
  { note: 'C', color: 'white' }, { note: 'C#', color: 'black' },
  { note: 'D', color: 'white' }, { note: 'D#', color: 'black' },
  { note: 'E', color: 'white' },
  { note: 'F', color: 'white' }, { note: 'F#', color: 'black' },
  { note: 'G', color: 'white' }, { note: 'G#', color: 'black' },
  { note: 'A', color: 'white' }, { note: 'A#', color: 'black' },
  { note: 'B', color: 'white' },
  { note: 'C2', color: 'white' }, { note: 'C#2', color: 'black' },
  { note: 'D2', color: 'white' }, { note: 'D#2', color: 'black' },
  { note: 'E2', color: 'white' },
  { note: 'F2', color: 'white' }, { note: 'F#2', color: 'black' },
  { note: 'G2', color: 'white' }, { note: 'G#2', color: 'black' },
  { note: 'A2', color: 'white' }, { note: 'A#2', color: 'black' },
  { note: 'B2', color: 'white' }
];

const ChordVisualizer: React.FC<{ chords: ChordData[] }> = ({ chords }) => {
  const [selectedChordIndex, setSelectedChordIndex] = useState(0);
  const [inversion, setInversion] = useState(0);
  const [voicing, setVoicing] = useState<'closed' | 'open'>('closed');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const currentChord = chords[selectedChordIndex];

  const getActiveNotes = () => {
    let notes = [...currentChord.notes];
    for (let i = 0; i < inversion; i++) {
      const first = notes.shift();
      if (first) notes.push(first + '2');
    }
    if (voicing === 'open' && notes.length >= 3) {
      // Simplistic: drop the 2nd note (from bottom) an octave
      const secondNote = notes[1];
      notes[1] = secondNote + '2';
    }
    return notes;
  };

  const activeNotes = getActiveNotes();

  const playChord = async () => {
    if (isPlaying) return;
    setIsPlaying(true);

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;
    
    const oscillators = activeNotes.map(n => {
      const name = n.replace('2', '');
      const isHigher = n.includes('2');
      let freq = NOTE_FREQUENCIES[name] || 261.63;
      if (isHigher) freq *= 2;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2 / activeNotes.length, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      return osc;
    });

    oscillators.forEach(osc => {
      osc.start();
      osc.stop(ctx.currentTime + 1.6);
    });

    setTimeout(() => setIsPlaying(false), 1600);
  };

  return (
    <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl border border-slate-800 my-10 overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h4 className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] mb-2">Chord Analysis Laboratory</h4>
          <div className="flex items-center gap-4">
            <select 
              value={selectedChordIndex}
              onChange={(e) => { setSelectedChordIndex(Number(e.target.value)); setInversion(0); }}
              className="bg-slate-800 border border-slate-700 text-white font-black text-lg rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-all hover:bg-slate-750"
            >
              {chords.map((c, i) => <option key={c.name} value={i}>{c.name}</option>)}
            </select>
            <button 
              onClick={playChord}
              disabled={isPlaying}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isPlaying ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-indigo-400 hover:scale-110 active:scale-95 shadow-lg'}`}
            >
              <i className={`fa-solid ${isPlaying ? 'fa-volume-high' : 'fa-play'} text-xl`}></i>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          <div className="space-y-3">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Inversion</p>
            <div className="flex bg-slate-800/50 p-1.5 rounded-2xl border border-slate-700">
              {[0, 1, 2].map((inv) => (
                <button
                  key={inv}
                  onClick={() => setInversion(inv)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${inversion === inv ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400 hover:text-white'}`}
                >
                  {inv === 0 ? 'Root' : inv === 1 ? '1st' : '2nd'}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Voicing</p>
            <div className="flex bg-slate-800/50 p-1.5 rounded-2xl border border-slate-700">
              {(['closed', 'open'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setVoicing(v)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all capitalize ${voicing === v ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400 hover:text-white'}`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative h-60 bg-slate-800/50 rounded-[2rem] border border-slate-700/50 overflow-hidden flex select-none p-4 backdrop-blur-sm">
        {PIANO_KEYS.map((k, i) => {
          const isActive = activeNotes.some(n => n === k.note || n === k.note + '2');
          return (
            <div 
              key={i}
              className={`relative flex-1 border-r border-slate-700/20 transition-all duration-300 ${k.color === 'white' ? 'bg-white rounded-b-lg' : 'bg-slate-900 h-2/3 z-10 -mx-4 w-8 rounded-b-xl border-x border-slate-800 shadow-2xl'}`}
              style={k.color === 'black' ? { minWidth: '1.8rem', maxWidth: '1.8rem' } : {}}
            >
              {isActive && (
                <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.8)] ${k.color === 'white' ? 'bg-indigo-600' : 'bg-indigo-400'} animate-bounce`}></div>
              )}
              {k.color === 'white' && (
                <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[9px] font-black text-slate-300 uppercase tracking-tighter">
                  {k.note.replace('2','')}
                </span>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-8 flex justify-between items-center bg-slate-800/30 p-5 rounded-2xl border border-slate-700/50">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Notes</span>
            <div className="flex gap-2 mt-1">
              {activeNotes.map((n, i) => (
                <span key={i} className="text-sm font-bold bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-lg border border-indigo-500/20">
                  {n.replace('2', '')}
                </span>
              ))}
            </div>
          </div>
        </div>
        <p className="text-slate-400 text-xs italic font-medium">
          Manipulate inversions to see how the interval structure shifts.
        </p>
      </div>
    </div>
  );
};

const Academy: React.FC = () => {
  const [selectedGenre, setSelectedGenre] = useState<Genre>(Genre.ALL);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'All'>('All');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeLesson]);

  const filteredModules = COURSE_MODULES.map(module => ({
    ...module,
    lessons: module.lessons.filter(lesson => 
      (selectedGenre === Genre.ALL || lesson.genre === selectedGenre) &&
      (selectedDifficulty === 'All' || lesson.difficulty === selectedDifficulty)
    )
  })).filter(module => module.lessons.length > 0);

  const genres = [Genre.ALL, Genre.CLASSICAL, Genre.JAZZ, Genre.POP, Genre.ROCK, Genre.BLUES, Genre.PRODUCTION];

  if (activeLesson) {
    return (
      <div className="animate-in fade-in slide-in-from-right-8 duration-500 max-w-5xl mx-auto pb-24">
        <button 
          onClick={() => setActiveLesson(null)}
          className="mb-8 flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-800 transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
            <i className="fa-solid fa-arrow-left"></i>
          </div>
          Back to Academy
        </button>
        
        <div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-2xl">
          <div className="h-96 overflow-hidden relative">
            <img src={activeLesson.imageUrl} className="w-full h-full object-cover" alt={activeLesson.title} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-12">
               <div>
                 <div className="flex items-center gap-3 mb-4">
                   <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${GENRE_COLORS[activeLesson.genre]}`}>
                     {activeLesson.genre}
                   </span>
                   <span className="text-white/60 font-black text-[10px] uppercase tracking-widest">{activeLesson.difficulty}</span>
                 </div>
                 <h2 className="text-5xl font-serif font-bold text-white drop-shadow-lg">{activeLesson.title}</h2>
               </div>
            </div>
          </div>
          <div className="p-12">
            <div className="prose prose-slate max-w-none mb-12">
              <p className="text-2xl text-slate-600 leading-relaxed italic border-l-8 border-indigo-500 pl-8 py-4 mb-12 bg-slate-50 rounded-r-3xl">
                {activeLesson.description}
              </p>
              
              <div className="text-slate-700 space-y-8 text-xl leading-relaxed">
                {activeLesson.content.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>

            {activeLesson.chords && activeLesson.chords.length > 0 && (
              <ChordVisualizer chords={activeLesson.chords} />
            )}
            
            <div className="flex flex-wrap gap-4 pt-12 border-t border-slate-100 mt-12">
              <button className="bg-indigo-600 text-white px-12 py-6 rounded-[2rem] font-bold shadow-2xl shadow-indigo-200 flex items-center gap-4 hover:scale-105 active:scale-95 transition-all text-lg">
                <i className="fa-solid fa-graduation-cap"></i>
                Mark Lesson Complete
              </button>
              <button className="bg-slate-100 text-slate-700 px-12 py-6 rounded-[2rem] font-bold flex items-center gap-4 hover:bg-slate-200 transition-all text-lg">
                <i className="fa-solid fa-brain"></i>
                Practice Drills
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-32">
      <div className="flex flex-col gap-10 bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-5xl font-serif font-bold text-slate-900 mb-4">The Maestro Path</h2>
          <p className="text-slate-500 text-xl max-w-2xl">A curated journey from the physics of sound to world-class orchestral arrangement and studio production.</p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
             <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Filter by Genre</span>
             <div className="h-[1px] flex-1 bg-slate-100"></div>
          </div>
          <div className="flex flex-wrap gap-3">
            {genres.map(g => (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className={`px-6 py-3 rounded-2xl text-sm font-bold border transition-all ${
                  selectedGenre === g
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-100 scale-105'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-400 hover:text-indigo-600'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-4 pt-2">
             <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Filter by Level</span>
             <div className="h-[1px] flex-1 bg-slate-100"></div>
          </div>
          <div className="flex flex-wrap gap-3">
            {['All', ...Object.values(Difficulty)].map(d => (
              <button
                key={d}
                onClick={() => setSelectedDifficulty(d as any)}
                className={`px-6 py-2 rounded-xl text-xs font-bold border transition-all ${
                  selectedDifficulty === d
                    ? 'bg-slate-800 text-white border-slate-800'
                    : 'bg-white text-slate-400 border-slate-200 hover:border-slate-400'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-24">
        {filteredModules.length === 0 ? (
          <div className="bg-white p-32 rounded-[4rem] border border-slate-200 text-center shadow-sm">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 text-5xl mx-auto mb-8">
              <i className="fa-solid fa-compact-disc animate-spin-slow"></i>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">The studio is empty.</h3>
            <p className="text-slate-400 mb-8">Try adjusting your filters to find more courses.</p>
            <button 
              onClick={() => { setSelectedGenre(Genre.ALL); setSelectedDifficulty('All'); }}
              className="px-8 py-3 bg-indigo-50 text-indigo-600 rounded-2xl font-bold hover:bg-indigo-100 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredModules.map((module) => (
            <section key={module.id} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                  <i className="fa-solid fa-layer-group text-xl"></i>
                </div>
                <div>
                  <h3 className="text-3xl font-serif font-bold text-slate-900">{module.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{module.lessons.length} LESSONS AVAILABLE</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {module.lessons.map((lesson) => (
                  <div 
                    key={lesson.id} 
                    onClick={() => setActiveLesson(lesson)}
                    className="group bg-white rounded-[3rem] border border-slate-200 overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:-translate-y-3 transition-all cursor-pointer"
                  >
                    <div className="h-56 overflow-hidden relative">
                      <img src={lesson.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={lesson.title} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-8">
                        <span className="text-white font-black text-sm flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg">
                            <i className="fa-solid fa-play"></i>
                          </div>
                          ENTER LESSON
                        </span>
                      </div>
                      <div className="absolute top-6 left-6">
                        <span className={`text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border backdrop-blur-md shadow-sm ${GENRE_COLORS[lesson.genre]}`}>
                          {lesson.genre}
                        </span>
                      </div>
                    </div>
                    <div className="p-8">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest">{lesson.difficulty}</span>
                        <div className="flex items-center gap-1.5 text-amber-500 font-black text-xs">
                          <i className="fa-solid fa-star"></i>
                          <span>{lesson.xpValue} XP</span>
                        </div>
                      </div>
                      <h4 className="font-bold text-2xl mb-4 group-hover:text-indigo-600 transition-colors leading-tight">{lesson.title}</h4>
                      <p className="text-slate-500 text-sm mb-8 line-clamp-2 leading-relaxed font-medium">{lesson.description}</p>
                      <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter group-hover:text-indigo-300 transition-colors">Maestro AI Curriculum</span>
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-45 transition-all duration-500">
                          <i className="fa-solid fa-arrow-right"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
};

export default Academy;
