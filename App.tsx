
import React, { useState } from 'react';
import Layout from './components/Layout.tsx';
import Dashboard from './components/Dashboard.tsx';
import Academy from './components/Academy.tsx';
import AIStudio from './components/AIStudio.tsx';
import Coach from './components/Coach.tsx';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'academy': return <Academy />;
      case 'studio': return <AIStudio />;
      case 'coach': return <Coach />;
      case 'practice': return (
        <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-6 px-6">
          <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-4xl shadow-xl shadow-indigo-100">
            <i className="fa-solid fa-rotate animate-spin-slow"></i>
          </div>
          <h2 className="text-3xl font-serif font-bold">Infinite Practice Loop</h2>
          <p className="text-slate-500 max-w-md text-lg">Maestro AI is analyzing your progress and generating real-time exercises for functional harmony, melodic dictation, and rhythmic sight-reading.</p>
          <div className="flex gap-4">
            <button className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold shadow-xl hover:scale-105 active:scale-95 transition-all">
              START DRILL #1
            </button>
            <button className="bg-white border border-slate-200 text-slate-600 px-10 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all">
              CUSTOMIZE LOOP
            </button>
          </div>
        </div>
      );
      default: return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;
