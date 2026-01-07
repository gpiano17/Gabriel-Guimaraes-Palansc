
import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Academy from './components/Academy';
import AIStudio from './components/AIStudio';
import Coach from './components/Coach';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'academy': return <Academy />;
      case 'studio': return <AIStudio />;
      case 'coach': return <Coach />;
      case 'practice': return (
        <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-4xl">
            <i className="fa-solid fa-rotate animate-spin-slow"></i>
          </div>
          <h2 className="text-2xl font-bold">Infinite Practice Loop</h2>
          <p className="text-slate-500 max-w-md">Gemini is curating 500+ personalized drills for your session. Get ready to master functional harmony.</p>
          <button className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold">START DRILL #1</button>
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
