
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'Mon', xp: 400 },
  { name: 'Tue', xp: 300 },
  { name: 'Wed', xp: 600 },
  { name: 'Thu', xp: 800 },
  { name: 'Fri', xp: 500 },
  { name: 'Sat', xp: 900 },
  { name: 'Sun', xp: 200 },
];

const COLORS = ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#6366f1', '#4f46e5', '#4338ca'];

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState([
    { id: 1, label: 'Identify 5 Dominant 7th Chords', icon: 'fa-check', status: 'done' },
    { id: 2, label: 'Mix a Bass Stem with EQ', icon: 'fa-circle', status: 'pending' },
    { id: 3, label: 'Write a 4-bar Blues Turnaround', icon: 'fa-circle', status: 'pending' },
  ]);

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, status: t.status === 'done' ? 'pending' : 'done' } : t
    ));
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      <div className="relative overflow-hidden bg-slate-900 rounded-[3rem] p-10 text-white">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M0,50 Q25,0 50,50 T100,50" fill="none" stroke="currentColor" strokeWidth="2" />
             <path d="M0,60 Q25,10 50,60 T100,60" fill="none" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-4xl font-serif font-bold mb-4">Welcome back, Maestro.</h2>
            <p className="text-slate-400 text-lg max-w-xl">Your creative output is up 24% this week. Keep the momentum going with today's harmony session.</p>
            <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-4">
               <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-900/40">
                 Continue Path
               </button>
               <button className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-2xl font-bold transition-all border border-slate-700">
                 Review Feedback
               </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-widest block mb-2">XP Level</span>
              <span className="text-3xl font-bold">14,250</span>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-widest block mb-2">Rank</span>
              <span className="text-3xl font-bold">#42</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold flex items-center gap-3">
              <i className="fa-solid fa-chart-line text-indigo-500"></i>
              Composing Consistency
            </h3>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Last 7 Days</span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="xp" radius={[8, 8, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-8 rounded-[2.5rem] text-white shadow-xl shadow-amber-100 flex flex-col justify-between h-full min-h-[300px]">
            <div>
              <p className="text-sm font-black opacity-70 mb-2 uppercase tracking-widest">Mastery Tip</p>
              <h4 className="text-2xl font-bold leading-tight">Don't be afraid of silence.</h4>
              <p className="mt-4 opacity-90 leading-relaxed text-sm">Space is as important as the notes you play. Try leaving 2 beats of rest between your next melodic phrase.</p>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">+50 WISDOM</span>
              <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center">
                <i className="fa-solid fa-lightbulb"></i>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h4 className="font-bold text-lg mb-6 flex items-center justify-between">
              Daily Drills
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">3 REMAINING</span>
            </h4>
            <div className="space-y-4">
              {tasks.map((task) => (
                <div 
                  key={task.id} 
                  onClick={() => toggleTask(task.id)}
                  className={`flex items-center gap-4 group cursor-pointer p-3 rounded-2xl transition-all ${task.status === 'done' ? 'bg-slate-50 opacity-60' : 'hover:bg-indigo-50'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-colors ${task.status === 'done' ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-200 group-hover:text-indigo-600'}`}>
                    <i className={`fa-solid ${task.status === 'done' ? 'fa-check' : 'fa-play'}`}></i>
                  </div>
                  <span className={`text-sm font-semibold transition-all ${task.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{task.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-indigo-600 rounded-[3rem] p-12 text-white flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
        <div className="absolute -bottom-10 -right-10 opacity-10">
           <i className="fa-solid fa-music text-[20rem] rotate-12"></i>
        </div>
        <div className="flex-1 relative z-10 text-center md:text-left">
          <span className="inline-block bg-white/20 text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full mb-4">New Feature</span>
          <h3 className="text-4xl font-serif font-bold mb-4">Infinite Practice Loop</h3>
          <p className="text-indigo-100 text-lg mb-8 max-w-lg">Master functional harmony and melodic development with a never-ending stream of personalized exercises.</p>
          <button className="bg-white text-indigo-600 px-10 py-4 rounded-2xl font-bold shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 mx-auto md:mx-0">
            <i className="fa-solid fa-bolt"></i>
            ENTER THE LOOP
          </button>
        </div>
        <div className="w-64 h-64 bg-white/10 rounded-full flex items-center justify-center animate-pulse border-8 border-white/5 relative z-10">
          <i className="fa-solid fa-infinity text-8xl text-white/50"></i>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
